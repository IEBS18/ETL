from flask import Flask, request, jsonify, send_file
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
import tempfile
import uuid
import json
import xml.etree.ElementTree as ET
# from flask_sqlalchemy import SQLAlchemy
# from flask_bcrypt import Bcrypt
# from flask_jwt_extended import JWTManager, create_access_token, jwt_required

load_dotenv()
app = Flask(__name__)
# app.config['SQLALCHEMY_DATABASE_URI'] = os
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# app.config['SECRET_KEY'] = 'your_secret_key'
# app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key'

# db = SQLAlchemy(app)
# bcrypt = Bcrypt(app)
# jwt = JWTManager(app)



CORS(app)


# class User(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     username = db.Column(db.String(150), unique=True, nullable=False)
#     email = db.Column(db.String(150), unique=True, nullable=False)
#     password = db.Column(db.String(256), nullable=False)

#     def __repr__(self):
#         return f"<User {self.username}>"
    
    
# Create the database tables
# with app.app_context():
#     db.create_all()
    
    
    
# @app.route('/signup', methods=['POST'])
# def signup():
#     data = request.get_json()

#     if User.query.filter_by(email=data['email']).first():
#         return jsonify({"message": "Email already registered"}), 400

#     hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
#     new_user = User(username=data['name'], email=data['email'], password=hashed_password)

#     db.session.add(new_user)
#     db.session.commit()

#     return jsonify({"message": "User created successfully"}), 201


# @app.route('/login', methods=['POST'])
# def login():
#     data = request.get_json()

#     user = User.query.filter_by(email=data['email']).first()
#     if user and bcrypt.check_password_hash(user.password, data['password']):
#         access_token = create_access_token(identity=user.id)
#         return jsonify(access_token=access_token), 200

#     return jsonify({"message": "Invalid email or password"}), 401


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

@app.route('/localextractsheet', methods=['POST'])
def local_extract_sheet_to_s3():
    try:
        # Get file and optional sheet name
        file = request.files.get('file')
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
                s3_url = f"s3://{bucket_name}/{s3_key}"

                return jsonify({'s3_path': s3_url}), 200

            except Exception as e:
                return jsonify({'error': f"Failed to process XLSX file: {str(e)}"}), 500

        # Handle CSV files
        elif file.filename.endswith('.csv'):
            try:
                output = BytesIO()
                file.save(output)
                output.seek(0)

                # Save CSV content to S3
                s3_key = f"DataAnalysis/Input/{file.filename}"
                s3.upload_fileobj(output, bucket_name, s3_key)
                s3_url = f"s3://{bucket_name}/{s3_key}"

                return jsonify({'s3_path': s3_url}), 200

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
                output = BytesIO()
                df.to_csv(output, index=False)
                output.seek(0)

                # Upload to S3
                s3_key = f"DataAnalysis/Input/{file.filename.replace('.json', '.csv')}"
                s3.upload_fileobj(output, bucket_name, s3_key)
                s3_url = f"s3://{bucket_name}/{s3_key}"

                return jsonify({'s3_path': s3_url}), 200

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
                output = BytesIO()
                df.to_csv(output, index=False)
                output.seek(0)

                # Upload to S3
                s3_key = f"DataAnalysis/Input/{file.filename.replace('.xml', '.csv')}"
                s3.upload_fileobj(output, bucket_name, s3_key)
                s3_url = f"s3://{bucket_name}/{s3_key}"

                return jsonify({'s3_path': s3_url}), 200

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
        s3_file_paths = request.json.get('input_paths')  # Expect multiple input paths
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
            file_name = key.split('/')[-1].split('.')[0]  # Extract the file name (without extension)
            
            # Prepend a valid SQL identifier prefix
            valid_table_name = f"table_{file_name}"

            file_obj = s3.get_object(Bucket=bucket_name, Key=key)
            file_data = file_obj['Body'].read()

            # Load CSV or XLSX into pandas DataFrame
            if key.endswith('.xlsx'):
                xls = pd.ExcelFile(BytesIO(file_data))
                df = pd.read_excel(xls, xls.sheet_names[0])
            else:
                df = pd.read_csv(StringIO(file_data.decode('utf-8')))

            # Assign DataFrame to the dict with the valid SQL table name
            dataframes[valid_table_name] = df

        # Print loaded DataFrames to ensure they are correct
        print(f"Loaded DataFrames: {dataframes.keys()}")  # This will show you the table names (prefixed with table_)

        # Update locals to include the DataFrames
        locals().update(dataframes)

        # Update the SQL query by replacing file names with valid table names
        for file_name in dataframes.keys():
            sql_query = sql_query.replace(file_name.lstrip("table_"), file_name)

        print(f"Modified SQL query: {sql_query}")

        # Run the SQL query using pandasql
        query_result = psql.sqldf(sql_query, locals())
        # print(query_result)

        # Generate output and upload to S3
        with tempfile.NamedTemporaryFile(delete=False) as temp_file:
            query_result.to_csv(temp_file.name, index=False)
            temp_file_path = temp_file.name

        output_key = f'DataAnalysis/Output/{uuid.uuid4()}.csv'
        with open(temp_file_path, 'rb') as data:
            s3.upload_fileobj(data, output_bucket, output_key)

        os.remove(temp_file_path)

        output_s3_path = f's3://{output_bucket}/{output_key}'
        return jsonify({'output_path': output_s3_path}), 200

    except Exception as e:
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500


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




