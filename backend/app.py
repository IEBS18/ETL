from flask import Flask, request, jsonify
import pandas as pd
import boto3
import pyodbc
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error

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
    # buckets = s3_client.list_buckets()
    # bucket_names = [bucket['Name'] for bucket in buckets['Buckets']]
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
