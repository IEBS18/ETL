from flask import Flask, request, jsonify
import pandas as pd
import boto3
import pyodbc
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv
import os
from io import BytesIO
import xlsxwriter

load_dotenv()
app = Flask(__name__)
CORS(app)

@app.route('/localextract', methods=['POST'])
def local_extract():

    file = request.files['file']
    # sheet_name = request.form['sheet_name']

    workbook = pd.ExcelFile(file)

    # Get sheet names
    sheet_names = workbook.sheet_names

    # df = pd.read_excel(workbook, sheet_name=sheet_name)
    # column_names = df.columns.tolist()

    return jsonify({
        'sheet_names': sheet_names,
        # 'columns': column_names
    })
@app.route('/localextractsheet', methods=['POST'])
def local_to_s3():
    # Get file and sheet name from request
    file = request.files['file']
    sheet_name = request.form['sheetName']
    bucket_name =os.environ['bucket_name']  # Get the S3 bucket name from the request

    # Read the sheet into a DataFrame
    workbook = pd.ExcelFile(file)
    df = pd.read_excel(workbook, sheet_name=sheet_name)
    
    # Convert the DataFrame back to an Excel file in memory
    output = BytesIO()
    with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
        df.to_excel(writer, sheet_name=sheet_name, index=False)
    output.seek(0)

    # Initialize the S3 client
    s3 = boto3.client(
        's3',
        region_name=os.environ["region_name"],
        aws_access_key_id=os.environ["aws_access_key_id"],
        aws_secret_access_key=os.environ["aws_secret_access_key"]
                      )

    # Upload the file to S3
    s3_key = f"{sheet_name}.xlsx"  # You can customize the S3 key (file name in S3)
    s3.upload_fileobj(output, bucket_name, 'DataAnalysis/Input/{}'.format(s3_key))
    print("upload started")

    # Generate the S3 file URL
    s3_url = f"s3://{bucket_name}/DataAnalysis/Input/{s3_key}"

    # Return the S3 path
    return jsonify({
        's3_path': s3_url
    })

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

    #bucketsnamereturnkrega
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
