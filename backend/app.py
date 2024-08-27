from flask import Flask, request, jsonify
import pandas as pd
import boto3
import pyodbc
from flask_cors import CORS

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

    return jsonify({
        'buckets': bucket_names
    })

@app.route('/sqlextract', methods=['POST'])
def sql_extract():
    # Get SQL Server credentials and connection details from the request
    server = request.form['server']
    database = request.form['database']
    username = request.form['username']
    password = request.form['password']

    # Connection string for SQL Server
    connection_string = f'DRIVER={{SQL Server}};SERVER={server};DATABASE={database};UID={username};PWD={password}'

    try:
        # Connect to SQL Server
        connection = pyodbc.connect(connection_string)
        cursor = connection.cursor()

        # Example query to fetch table names
        cursor.execute("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'")
        tables = [row[0] for row in cursor.fetchall()]

        return jsonify({
            'tables': tables
        })

    except Exception as e:
        return jsonify({
            'error': str(e)
        })

if __name__ == '__main__':
    app.run(debug=True)
