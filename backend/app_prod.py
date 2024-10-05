import io
from flask import Flask, request, jsonify, send_file, make_response
import pandas as pd
import boto3
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv
import os
from io import BytesIO
from io import StringIO
import xlsxwriter
import pandasql as psql
import requests
import tempfile
import uuid
import json
import xml.etree.ElementTree as ET
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.ext.mutable import MutableList
from sqlalchemy import JSON
# from flask_sqlalchemy import SQLAlchemy
# from flask_bcrypt import Bcrypt
# from flask_jwt_extended import JWTManager, create_access_token, jwt_required

from flask_sqlalchemy import SQLAlchemy

import re

load_dotenv()
app = Flask(__name__)
# app.config['SQLALCHEMY_DATABASE_URI'] = os
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# app.config['SECRET_KEY'] = 'your_secret_key'
# app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key'

# db = SQLAlchemy(app)
# bcrypt = Bcrypt(app)
# jwt = JWTManager(app)



CORS(app, supports_credentials=True, origins=["http://localhost:5173", "http://54.196.201.194:3000/"])


USERS_FILE = 'users.json'

def load_users():
    try:
        with open('users.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return {}

# Save users to a file
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('database_url')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# User Model for Authentication
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Text, unique=True, nullable=False)  # UUID for user identification
    first_name = db.Column(db.Text, nullable=False)
    last_name = db.Column(db.Text, nullable=False)
    email = db.Column(db.Text, unique=True, nullable=False)
    password = db.Column(db.Text, nullable=False)
    extracted_files = db.Column(MutableList.as_mutable(db.ARRAY(db.Text)), default=list)  # Store extracted files
    transformed_files = db.Column(MutableList.as_mutable(db.ARRAY(JSON)), default=list)  # Store dicts of file_url and query
    download_files = db.Column(MutableList.as_mutable(db.ARRAY(db.Text)), default=list)  # Store download file names
    # extracted_data = db.relationship('ExtractedData', backref='user', lazy=True)

# ExtractedData Model for storing extracted data associated with a user
class ExtractedData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    node_id = db.Column(db.String(50), nullable=False)
    file_name = db.Column(db.String(100), nullable=False)
    schema = db.Column(db.JSON, nullable=False)  # Store schema as JSON
    data = db.Column(db.JSON, nullable=False)    # Store extracted data as JSON
    user_id = db.Column(db.Text, db.ForeignKey('user.user_id'), nullable=False)

# Initialize the database and create the table(s)
with app.app_context():
    db.create_all()

# Sign up route
from flask import request, jsonify, make_response
from werkzeug.security import generate_password_hash, check_password_hash
import uuid

# Signup route
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    first_name = data.get('firstName')
    last_name = data.get('lastName')

    # Check if all required fields are provided
    if not all([email, password, first_name, last_name]):
        return jsonify({'error': 'All fields are required'}), 400

    # Check if user already exists
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'User already exists'}), 400

    # Generate a unique user_id and hash the password
    user_id = str(uuid.uuid4())
    hashed_password = generate_password_hash(password)

    # Create new user and store in the database
    new_user = User(user_id=user_id, first_name=first_name, last_name=last_name, email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        'message': 'User created successfully',
        'user_minex_id': user_id,
        'first_name': first_name
    }), 201

# Login route
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Check if all required fields are provided
    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    # Retrieve user from the database
    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({'error': 'User does not exist'}), 401

    # Check if the password matches the hashed password in the database
    if not check_password_hash(user.password, password):
        return jsonify({'error': 'Invalid credentials'}), 401

    # Create a response object
    response = make_response(jsonify({
        'message': 'Login successful',
        'user_minex_id': user.user_id,
        'first_name': user.first_name
    }))
    
    # Set HttpOnly cookie (optional)
    response.set_cookie('user_id', user.user_id, httponly=True, secure=False, samesite='Lax', max_age=60*60*24*7)


  # 7 days expiration

    return response

# Route to save extracted data to the database
@app.route('/save-data', methods=['POST'])
def save_data():
    data = request.get_json()
    node_id = data['node_id']
    file_name = data['file_name']
    extracted_data = data['extracted_data']
    schema = data['schema']
    user_id = data['user_id']

    # Store the data in the database
    new_entry = ExtractedData(node_id=node_id, file_name=file_name, schema=schema, data=extracted_data, user_id=user_id)
    db.session.add(new_entry)
    db.session.commit()

    return jsonify({'message': 'Data saved successfully'}), 201

# Route to remove extracted data from the database
@app.route('/remove-data', methods=['DELETE'])
def remove_data():
    data = request.get_json()
    node_id = data['node_id']
    user_id = data['user_id']

    # Find and remove the data entry from the database
    entry = ExtractedData.query.filter_by(node_id=node_id, user_id=user_id).first()
    if entry:
        db.session.delete(entry)
        db.session.commit()
        return jsonify({'message': 'Data removed successfully'}), 200
    else:
        return jsonify({'message': 'Data not found'}), 404

# Route to retrieve all extracted data for a user
@app.route('/get-data', methods=['GET'])
def get_data():
    user_id = request.args.get('user_id')
    data_entries = ExtractedData.query.filter_by(user_id=user_id).all()

    # Convert the database entries into a dictionary
    data = {entry.node_id: {
        'file_name': entry.file_name,
        'extracted_data': entry.data,
        'schema': entry.schema
    } for entry in data_entries}

    return jsonify(data), 200

# Route to retrieve all filenames for a user
@app.route('/get-filenames', methods=['GET'])
def get_filenames():
    user_id = request.args.get('user_id')
    data_entries = ExtractedData.query.filter_by(user_id=user_id).all()

    filenames = {entry.file_name for entry in data_entries}
    print(filenames)
    return jsonify({'filenames': list(filenames)}), 200


@app.route('/localextract', methods=['POST'])
def local_extract():
    file = request.files['file']
    
    if file.filename.endswith('.xlsx'):
        # Handle Excel files
        workbook = pd.ExcelFile(file)
        sheet_names = workbook.sheet_names

        return jsonify({
            'file_type': 'xlsx',
            'sheet_names': sheet_names
        })
    
    elif file.filename.endswith('.csv'):
        # Handle CSV files
        return jsonify({
            'file_type': 'csv'
        })
    
    elif file.filename.endswith('.json'):
        # Handle JSON files
        return jsonify({
            'file_type': 'json'
        })
    
    elif file.filename.endswith('.xml'):
        # Handle XML files
        return jsonify({
            'file_type': 'xml'
        })
    
    else:
        return jsonify({
            'error': 'Unsupported file type. Please upload a .csv, .xlsx, .json, or .xml file.'
        }), 400

@app.route('/localextractsheet', methods=['POST', 'OPTIONS'])
def local_extract_sheet_to_s3():
    if request.method == 'OPTIONS':
        return '', 204 
    try:
        # Get file and optional sheet name
        file = request.files.get('file')
        user_id = request.cookies.get('user_id')
        print(f"Cookies received: {request.cookies}")
        print(f"Retrieved user_id: {user_id}")
        print(user_id)
        sheet_name = request.form.get('sheetName')  # Optional, for XLSX files

        if not file:
            return jsonify({'error': 'No file provided'}), 400

        bucket_name = os.environ['bucket_name']

        # Initialize S3 client
        s3 = boto3.client(
            's3',
            region_name=os.environ['region_name'],
            aws_access_key_id=os.environ['aws_access_key_id'],
            aws_secret_access_key=os.environ['aws_secret_access_key']
        )

        def create_response(df, s3_key, user_id):
            # Replace NaN values with an empty string
            df = df.fillna('')

            # Get column names, first 5 rows, and schema
            columns = df.columns.tolist()
            first_five_rows = df.to_dict(orient='records') 
            schema = df.dtypes.astype(str).to_dict()

            # Return S3 path, columns, first 5 rows, and schema
            s3_url = f"s3://{bucket_name}/{s3_key}"
            user = User.query.filter_by(user_id=user_id).first()
            print(user)
            if user:
                user.extracted_files.append(s3_url)
                db.session.commit()
            print(s3_url)
            return jsonify({
                's3_path': s3_url,
                'columns': columns,
                'first_five_rows': first_five_rows,
                'schema': schema
            }), 200

        # Handle XLSX files with sheet selection
        if file.filename.endswith('.xlsx') and sheet_name:
            try:
                workbook = pd.ExcelFile(file)
                df = pd.read_excel(workbook, sheet_name=sheet_name)

                # Convert DataFrame to CSV in memory
                output = BytesIO()
                df.to_csv(output, index=False)
                output.seek(0)

                # Upload to S3
                s3_key = f"DataAnalysis/Input/{file.filename.replace('.xlsx', f'_{sheet_name}.csv')}"
                s3.upload_fileobj(output, bucket_name, s3_key)

                return create_response(df, s3_key, user_id)

            except Exception as e:
                return jsonify({'error': f"Failed to process XLSX file: {str(e)}"}), 500

        # Handle CSV files
        elif file.filename.endswith('.csv'):
            try:
                df = pd.read_csv(file)

                # Convert DataFrame to CSV in memory
                output = BytesIO()
                df.to_csv(output, index=False)
                output.seek(0)

                # Save CSV content to S3
                s3_key = f"DataAnalysis/Input/{file.filename}"
                s3.upload_fileobj(output, bucket_name, s3_key)

                return create_response(df, s3_key, user_id)

            except Exception as e:
                return jsonify({'error': f"Failed to process CSV file: {str(e)}"}), 500

        # Handle JSON files
        elif file.filename.endswith('.json'):
            try:
                file_content = file.read().decode('utf-8')
                if file_content.strip().startswith('['):
                    data = json.loads(file_content)
                else:
                    data = [json.loads(line) for line in file_content.strip().splitlines()]

                # Convert JSON to DataFrame
                df = pd.json_normalize(data)

                # Convert DataFrame to CSV in memory
                output = BytesIO()
                df.to_csv(output, index=False)
                output.seek(0)

                # Upload to S3
                s3_key = f"DataAnalysis/Input/{file.filename.replace('.json', '.csv')}"
                s3.upload_fileobj(output, bucket_name, s3_key)

                return create_response(df, s3_key, user_id)

            except json.JSONDecodeError as e:
                return jsonify({'error': f"Invalid JSON format: {str(e)}"}), 400
            except Exception as e:
                return jsonify({'error': f"Failed to process JSON file: {str(e)}"}), 500

        # Handle XML files
        elif file.filename.endswith('.xml'):
            try:
                tree = ET.parse(file)
                root = tree.getroot()
                data = [{elem.tag: elem.text for elem in child} for child in root]

                # Convert XML data to DataFrame
                df = pd.DataFrame(data)

                # Convert DataFrame to CSV in memory
                output = BytesIO()
                df.to_csv(output, index=False)
                output.seek(0)

                # Upload to S3
                s3_key = f"DataAnalysis/Input/{file.filename.replace('.xml', '.csv')}"
                s3.upload_fileobj(output, bucket_name, s3_key)

                return create_response(df, s3_key, user_id)

            except ET.ParseError as e:
                return jsonify({'error': f"Invalid XML format: {str(e)}"}), 400
            except Exception as e:
                return jsonify({'error': f"Failed to process XML file: {str(e)}"}), 500

        else:
            return jsonify({'error': 'Unsupported file type.'}), 400

    except Exception as e:
        # Log the exception and return a JSON error response
        return jsonify({'error': f"Unexpected error: {str(e)}"}), 500


@app.route('/run_sql_on_s3_csv', methods=['POST'])
def run_sql_on_s3_csv():
    try:
        s3_file_paths = request.json.get('input_paths') 
        print(s3_file_paths)
        user_id = request.cookies.get('user_id')
        print('user_id: ', user_id)
        sql_query = request.json.get('sql_query')
        output_bucket = 'my-internal-bucket'
        if not s3_file_paths or not sql_query:
            return jsonify({'error': 'Missing required parameters'}), 400

        s3 = boto3.client(
            's3',
            region_name=os.environ["region_name"],
            aws_access_key_id=os.environ["aws_access_key_id"],
            aws_secret_access_key=os.environ["aws_secret_access_key"]
        )

        # Sanitize the SQL query by replacing non-breaking spaces with regular spaces
        sql_query = sql_query.replace(u'\u00a0', ' ')

        dataframes = {}

        for s3_file_path in s3_file_paths:
            bucket_name, key = s3_file_path.replace('s3://', '').split('/', 1)
            file_name = key.split('/')[-1].split('.')[0]
            print(file_name)# Extract the file name (without extension)
            
            # Prepend a valid SQL identifier prefix
            if key.endswith('.xlsx'):
                file_obj = s3.get_object(Bucket=bucket_name, Key=key)
                file_data = file_obj['Body'].read()
                xls = pd.ExcelFile(BytesIO(file_data))
                for sheet_name in xls.sheet_names:
                    df = pd.read_excel(xls, sheet_name=sheet_name)
                    valid_table_name = f"table_{file_name}_{sheet_name}"  # Combine file and sheet name
                    dataframes[valid_table_name] = df
            else:
                file_obj = s3.get_object(Bucket=bucket_name, Key=key)
                file_data = file_obj['Body'].read()
                valid_table_name = f"table_{file_name}"
                df = pd.read_csv(StringIO(file_data.decode('utf-8')))
                print(df)
                dataframes[valid_table_name] = df

        # Print loaded DataFrames to ensure they are correct
        print(f"Loaded DataFrames: {dataframes.keys()}")

        # Update locals to include the DataFrames
        locals().update(dataframes)

        # Update the SQL query by replacing file names with valid table names
        for original_table_name in dataframes.keys():
            base_name = original_table_name.split('_', 1)[-1]  # Strip "table_" prefix
            modified_sql_query = sql_query.replace(base_name, original_table_name)

        print(f"Modified SQL query: {modified_sql_query}")

        # Run the SQL query using pandasql
        query_result = psql.sqldf(modified_sql_query, locals())
        print(query_result)

        # Generate output and upload to S3
        with tempfile.NamedTemporaryFile(delete=False) as temp_file:
            query_result.to_csv(temp_file.name, index=False)
            temp_file_path = temp_file.name

        output_key = f'DataAnalysis/Output/{uuid.uuid4()}/{file_name}.csv'
        with open(temp_file_path, 'rb') as data:
            s3.upload_fileobj(data, output_bucket, output_key)

        os.remove(temp_file_path)

        output_s3_path = f's3://{output_bucket}/{output_key}'
        user = User.query.filter_by(user_id=user_id).first()
        if user:
            transformed_data = {
                's3_path': output_s3_path,
                'query': sql_query
            }
            user.transformed_files.append(transformed_data)
            db.session.commit()
        print(output_s3_path)
        return jsonify({'output_path': output_s3_path}), 200

    except Exception as e:
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

@app.route('/run_openai_on_s3', methods=['POST'])
def run_openai_on_s3():
    try:
        s3_file_paths = request.json.get('input_paths')  # Expect multiple input paths
        openai_query = request.json.get('openai_query')
        user_id = request.cookies.get('user_id')
        output_bucket = 'my-internal-bucket'

        if not s3_file_paths or not openai_query:
            return jsonify({'error': 'Missing required parameters'}), 400

        s3 = boto3.client(
            's3',
            region_name=os.environ["region_name"],
            aws_access_key_id=os.environ["aws_access_key_id"],
            aws_secret_access_key=os.environ["aws_secret_access_key"]
        )

        dataframes = {}

        for s3_file_path in s3_file_paths:
            bucket_name, key = s3_file_path.replace('s3://', '').split('/', 1)
            file_name = key.split('/')[-1].split('.')[0]  # Extract the file name (without extension)
            
            # Prepend a valid identifier prefix
            valid_table_name = f"{file_name}"

            file_obj = s3.get_object(Bucket=bucket_name, Key=key)
            file_data = file_obj['Body'].read()

            # Load CSV or XLSX into pandas DataFrame
            if key.endswith('.xlsx'):
                xls = pd.ExcelFile(BytesIO(file_data))
                df = pd.read_excel(xls, xls.sheet_names[0])
            else:
                df = pd.read_csv(StringIO(file_data.decode('utf-8')))

            # Assign DataFrame to the dict with the valid table name
            dataframes[valid_table_name] = df
            
            
        print(f"Loaded DataFrames: {dataframes.keys()}")
        # Create a schema for each DataFrame (table name, columns)
        schemas = {table_name: df.columns.tolist() for table_name, df in dataframes.items()}
        locals().update(dataframes)
        # Create OpenAI embedding request headers
        openai_api_key = os.environ.get('OPENAI_API_KEY')
        headers = {
            'Authorization': f'Bearer {openai_api_key}',
            'Content-Type': 'application/json'
        }

        # Prepare prompt including the schema of the data
        schema_description = "\n".join(
            [f"Table {name}: {columns}" for name, columns in schemas.items()]
        )

        # Send schema and query to OpenAI
        openai_payload = {
            'model': 'gpt-4o-mini',  # Adjust model as needed
            'messages': [
                {'role': 'system', 'content': 'You are an SQL expert skilled in SQLite, never use function "strftime" or any in built function. Only return the raw SQL query as plain text, without code blocks or any formatting.'},
                {'role': 'user', 'content': f"Schema: {schema_description}"},
                {'role': 'user', 'content': f"Query: {openai_query}"}
            ]
        }

        openai_response = requests.post(
            'https://api.openai.com/v1/chat/completions',
            headers=headers,
            json=openai_payload
        )

        openai_data = openai_response.json()

        # Handle response from OpenAI and extract the SQL query
        if openai_response.status_code == 200:
            sql_query = openai_data['choices'][0]['message']['content']
            print(f"Generated SQL Query: {sql_query}")
        else:
            raise Exception(f"OpenAI API failed: {openai_data}")

        # Execute SQL query on the loaded DataFrames
        # Using pandasql to run the query against the in-memory DataFrames
        try:
            query_result = psql.sqldf(sql_query, locals())
        except Exception as e:
            raise Exception(f"SQL execution failed: {str(e)}")

        # Store the SQL query result to a file and upload to S3
        with tempfile.NamedTemporaryFile(delete=False) as temp_file:
            query_result.to_csv(temp_file, index=False)
            temp_file_path = temp_file.name

        output_key = f'DataAnalysis/Output/{uuid.uuid4()}/{file_name}.csv'
        with open(temp_file_path, 'rb') as data:
            s3.upload_fileobj(data, output_bucket, output_key)

        os.remove(temp_file_path)

        output_s3_path = f's3://{output_bucket}/{output_key}'
        user = User.query.filter_by(user_id=user_id).first()
        
        if user:
            transformed_data = {
                's3_path': output_s3_path,
                'query': (openai_query, sql_query)
            }
            user.transformed_files.append(transformed_data)
            db.session.commit()
        print(output_s3_path)
        return jsonify({'output_path': output_s3_path, 'sql_query': sql_query}), 200

    except Exception as e:
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

@app.route('/getransformedfiles', methods=['GET'])
def get_transformed_files():
    try:
        user_id = request.cookies.get('user_id')
        print(user_id)
        if not user_id:
            return jsonify({'error': 'User not logged in'}), 401

        user = User.query.filter_by(user_id=user_id).first()
        print(user)
        if not user:
            return jsonify({'error': 'User not found'}), 404

        # Extract filenames from extracted_files
        extracted_files = [file_path for file_path in user.extracted_files]

        # Extract filenames from transformed_files
        transformed_files = [tf['s3_path'] for tf in user.transformed_files]
        print(transformed_files)

        # Combine both lists
        filenames = list(set( transformed_files + extracted_files))  # Remove duplicates
        print(filenames)

        return jsonify({'filenames': filenames}), 200

    except Exception as e:
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500
@app.route('/getallfiles', methods=['GET'])
def get_all_files():
    try:
        user_id = request.cookies.get('user_id')
        print(user_id)
        if not user_id:
            return jsonify({'error': 'User not logged in'}), 401

        user = User.query.filter_by(user_id=user_id).first()
        print(user)
        if not user:
            return jsonify({'error': 'User not found'}), 404

        # Extract filenames from extracted_files
        extracted_files = [file_path for file_path in user.extracted_files]
        
        extractedfiles= list(set(extracted_files))

        # Extract filenames and SQL queries from transformed_files
        transformed_files = [
            {
                's3_path': tf['s3_path'],
                'sql_query': tf['query']
            }
            for tf in user.transformed_files
        ]
        print(transformed_files)

        return jsonify({
            'extracted_files': (extractedfiles),
            'transformed_files': transformed_files
        }), 200

    except Exception as e:
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500
@app.route('/deletefile', methods=['DELETE'])
def delete_file():
    try:
        # Get user ID from cookies
        user_id = request.cookies.get('user_id')
        data = request.get_json()
        print(data)
        file_path = request.json.get('filePath')
        print(file_path)
        file_type = request.json.get('type')
        print(file_type)
        print(user_id)
        if not user_id:
            return jsonify({'error': 'User not logged in'}), 401

        # Find the user in the database
        user = User.query.filter_by(user_id=user_id).first()
        print(user)
        if not user:
            return jsonify({'error': 'User not found'}), 404

        # Get file path and type from the request body
        

        if not file_path or not file_type:
            return jsonify({'error': 'Invalid data'}), 400

        # Delete from extracted_files or transformed_files based on type
        if file_type == 'extracted':
            if file_path in user.extracted_files:
                user.extracted_files.remove(file_path)
            else:
                return jsonify({'error': 'File not found in extracted files'}), 404

        elif file_type == 'transformed':
            transformed_file = next((f for f in user.transformed_files if f['s3_path'] == file_path), None)
            if transformed_file:
                user.transformed_files.remove(transformed_file)
            else:
                return jsonify({'error': 'File not found in transformed files'}), 404

        else:
            return jsonify({'error': 'Invalid file type'}), 400

        # Commit the changes to the database
        db.session.commit()

        return jsonify({'message': 'File deleted successfully'}), 200

    except Exception as e:
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

import re

@app.route('/create-chart', methods=['POST'])
def create_chart():
    user_id = request.cookies.get('user_id')
    openai_query = request.json.get('prompt')
    s3_path = request.json.get('filename')
    print(user_id, openai_query, s3_path)

    output_bucket = 'my-internal-bucket'
    s3 = boto3.client(
        's3',
        region_name=os.environ["region_name"],
        aws_access_key_id=os.environ["aws_access_key_id"],
        aws_secret_access_key=os.environ["aws_secret_access_key"]
    )
    
    dataframes = {}
    bucket_name, key = s3_path.replace('s3://', '').split('/', 1)
    file_name = key.split('/')[-1].split('.')[0]  # Extract the file name (without extension)

    valid_table_name = f"{file_name}"

    file_obj = s3.get_object(Bucket=bucket_name, Key=key)
    file_data = file_obj['Body'].read()

    df = pd.read_csv(StringIO(file_data.decode('utf-8')))
    dataframes[valid_table_name] = df

    print(f"Loaded DataFrames: {dataframes.keys()}")
    
    # Create a schema for each DataFrame (table name, columns)
    schemas = {table_name: df.columns.tolist() for table_name, df in dataframes.items()}
    locals().update(dataframes)

    schema = df.dtypes.astype(str).to_dict()
    sample_data = df.head(2).to_dict(orient='records')
    print(sample_data)

    schema_description = "\n".join(
        [f"Table {name}: {columns}" for name, columns in schemas.items()]
    )

    openai_api_key = os.environ.get('OPENAI_API_KEY')
    headers = {
        'Authorization': f'Bearer {openai_api_key}',
        'Content-Type': 'application/json'
    }

    openai_payload = {
        'model': 'gpt-4o-mini',
        'messages': [
            {'role': 'system', 
             'content': 'You are an SQL expert skilled in SQLite, never use function "strftime" or any built-in function. Study the format of the provided schema and sample data carefully. Ensure you respect the data types and structure when crafting the query, and never assume the DATES to be in ideal date format; take them as d-m-y only. Only return the raw SQL query to create at least three columns so one can make two line graphs as comparison, as plain text, without any code blocks, comments, or additional text.'},
            {'role': 'user', 
             'content': f"Schema: {schema_description}\n\nSample Data: {sample_data}\n"},
            {'role': 'user', 
             'content': f"Based on the provided schema and data format, write a query for: {openai_query}"}
        ]
    }

    openai_response = requests.post(
        'https://api.openai.com/v1/chat/completions',
        headers=headers,
        json=openai_payload
    )

    openai_data = openai_response.json()

    # Handle response from OpenAI and extract the SQL query
    if openai_response.status_code == 200:
        sql_query = openai_data['choices'][0]['message']['content']
        print(f"Generated SQL Query: {sql_query}")
    else:
        raise Exception(f"OpenAI API failed: {openai_data}")

    # Execute SQL query on the loaded DataFrames
    try:
        query_result = psql.sqldf(sql_query, locals())
        print(query_result)
    except Exception as e:
        raise Exception(f"SQL execution failed: {str(e)}")

    columns = query_result.columns.tolist()
    print(columns)
    rows = query_result.to_dict(orient='records')
    print(rows)

    query_result_summary = "\n".join([f"{row}" for row in rows]) if len(rows) < 50 else "\n".join([f"{row}" for row in rows[:50]])  # Sending 50 rows for analysis

    summary_stats = query_result.describe().to_dict()
    insights_payload = {
        'model': 'gpt-4o-mini',
        'messages': [
            {'role': 'system', 'content': 'You are a data analyst. Analyze the following data and provide very detailed insights in 2000 words and a short summary of the insights. Return your answer strictly in the format, donot use any markdown in summary : insights: , summary: '},
            {'role': 'user', 'content': f"Summary Statistics: {summary_stats}\nSample Data: {query_result_summary}"}
        ]
    }
    
    insights_response = requests.post(
        'https://api.openai.com/v1/chat/completions',
        headers=headers,
        json=insights_payload
    )

    insights_data = insights_response.json()

    if insights_response.status_code == 200:
        insights = insights_data['choices'][0]['message']['content']
        print(f"Generated Insights: {insights}")

        # Use regular expressions to extract insights and summary
        insights_part = ""
        summary_part = ""

        summary_pattern = r'summary:\s*(.*?)\s*(?=insights:|$)'
        match = re.search(summary_pattern, insights, re.IGNORECASE)

        if match:
            insights_part = insights.split(match.group(0))[0].strip()  # Take everything before the match as insights
            summary_part = match.group(1).strip()  # Extract the matched summary
        else:
            insights_part = insights.strip()  # If summary is not present, take the whole content

        # Check for multiple lines in summary
        if summary_part:
            summary_part = summary_part.splitlines()[0].strip()  # Only take the first line of the summary if it's multi-line

    else:
        raise Exception(f"OpenAI API for insights failed: {insights_data}")

    return jsonify({
        "columns": columns,
        "rows": rows,
        "insights": {
            "insights": insights_part,  # Updated to use insights_part
            "summary": summary_part      # Updated to use summary_part
        },
        "query": sql_query
    }), 200
  
        

@app.route('/downloadfroms3', methods=['POST'])
def download_from_s3():
    s3_path = request.json.get('output_path')
    print(s3_path)# e.g., s3://bucket-name/file.csv
    if not s3_path:
        return jsonify({"error": "No path provided"}), 400
    
    # Parse S3 path
    bucket_name, key = s3_path.replace('s3://', '').split('/', 1)
    
    print(bucket_name, key)
    
    s3_client = boto3.client(
        's3',
        region_name=os.environ["region_name"],
        aws_access_key_id=os.environ["aws_access_key_id"],
        aws_secret_access_key=os.environ["aws_secret_access_key"]
    )
    
    # Download file from S3
    s3_object = s3_client.get_object(Bucket=bucket_name, Key=key)
    file_content = s3_object['Body'].read()
    
    # Create an in-memory file-like object
    file_like_object = BytesIO(file_content)
    
    # Serve file as download
    return send_file(file_like_object, download_name='output', as_attachment=True)

@app.route('/viewdata', methods=['POST'])
def view_data():
    s3_path = request.json.get('output_path')
    print(s3_path)
    if not s3_path:
        return jsonify({"error": "No path provided"}), 400

    # Parse S3 path
    bucket_name, key = s3_path.replace('s3://', '').split('/', 1)
    print(bucket_name, key)

    # Initialize S3 client
    s3_client = boto3.client(
        's3',
        region_name=os.environ["region_name"],
        aws_access_key_id=os.environ["aws_access_key_id"],
        aws_secret_access_key=os.environ["aws_secret_access_key"]
    )

    try:
        # Fetch the file from S3
        s3_response = s3_client.get_object(Bucket=bucket_name, Key=key)
        file_data = s3_response['Body'].read()

        df = pd.read_csv(StringIO(file_data.decode('utf-8')))
        print(df)
        
        # Get the first 50 rows
        first_50_rows = df.head(50)
        
        df = df.fillna('')

        # Get column names, first 50 rows, and schema
        columns = df.columns.tolist()
        first_fifty_rows = df.head(50).to_dict(orient='records')  # Adjust to return 50 rows
        schema = df.dtypes.astype(str).to_dict()
        
        print(first_50_rows.to_dict(orient='records'))
        
        # Convert the rows to JSON and return
        return jsonify({
                'columns': columns,
                'first_fifty_rows': first_fifty_rows,
                'schema': schema
            }), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

  
@app.route('/awsextract', methods=['POST'])
def aws_extract():

    region_name = request.form['region']
    access_key_id = request.form['accessKeyId']
    secret_access_key = request.form['secretAccessKey']
    bucket_name = request.form['bucketName']

    #AWS S3 connection
    s3_client = boto3.client(
        's3',
        region_name=region_name,
        aws_access_key_id=access_key_id,
        aws_secret_access_key=secret_access_key
    )

    return return_bucket(s3_client,bucket_name)

def return_bucket(s3_client,bucket_name):
    buckets = s3_client.list_buckets()
    bucket_names = [bucket['Name'] for bucket in buckets['Buckets']]
    objects = s3_client.list_objects_v2(Bucket=bucket_name)
    print(objects)
    object_names = [obj['Key'] for obj in objects.get('Contents', [])]
    print(object_names)

    return jsonify({
        'bucket': bucket_name,
        'objects': object_names
    })

@app.route('/upload-to-s3', methods=['POST'])
def upload_to_s3():
    s3_server = boto3.client(
        's3',
        region_name=os.environ["region_name"],
        aws_access_key_id=os.environ["aws_access_key_id"],
        aws_secret_access_key=os.environ["aws_secret_access_key"]
    )
    
    try:
        data = request.get_json()
        region_name = data.get('region')
        access_key_id = data.get('accessKeyId')
        secret_access_key = data.get('secretAccessKey')
        bucket_name = data.get('bucketName')
        file_path = data.get('filePath')

        # AWS S3 connection
        s3_client = boto3.client(
            's3',
            region_name=region_name,
            aws_access_key_id=access_key_id,
            aws_secret_access_key=secret_access_key
        )

        if not file_path:
            return jsonify({'error': 'File path is required'}), 400

        # Fetch the file from the original S3 bucket
        file_obj = s3_client.get_object(Bucket=bucket_name, Key=file_path)
        file_content = file_obj['Body'].read()
        file_name = os.path.basename(file_path)

        # Check if the file is an .xlsx file
        if file_name.endswith('.xlsx'):
            # Convert the Excel file to a CSV file
            workbook = pd.ExcelFile(BytesIO(file_content))
            sheet_name = workbook.sheet_names[0]  # Select the first sheet or customize as needed
            df = pd.read_excel(workbook, sheet_name=sheet_name)

            # Convert DataFrame to CSV in memory
            output = BytesIO()
            df.to_csv(output, index=False)
            output.seek(0)

            # Update the file path and content for uploading the CSV
            file_name = f"{os.path.splitext(file_name)[0]}.csv"
            file_content = output
        else:
            # If it's a CSV, just use the original content
            file_content = BytesIO(file_content)

        destination_bucket = 'my-internal-bucket'
        target_path = f"DataAnalysis/Input/{file_name}"

        # Upload the file (either original CSV or converted CSV) to your server's S3 bucket
        s3_server.upload_fileobj(file_content, destination_bucket, target_path)

        return jsonify({'message': 'File uploaded successfully!', 'filePath': f"s3://{destination_bucket}/{target_path}"}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/sqlextract', methods=['POST'])
def sql_extract():
    # Get MySQL credentials and connection details from the request
    host = request.form['host']
    database = request.form['database']
    username = request.form['username']
    password = request.form['password']

    try:
        # Connect to MySQL Server
        connection = mysql.connector.connect(
            host=host,
            database=database,
            user=username,
            password=password
        )

        if connection.is_connected():
            cursor = connection.cursor()
            # Query to fetch table names
            cursor.execute("SHOW TABLES")
            tables = [row[0] for row in cursor.fetchall()]

            return jsonify({
                'tables': tables
            })

    except Error as e:
        return jsonify({
            'error': str(e)
        })

    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

if __name__ == '__main__':
    app.run(debug=True)

