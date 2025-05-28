import os
import boto3

aws_region = os.getenv("AWS_REGION")
s3_bucket = os.getenv("S3_BUCKET_NAME")

s3_client = boto3.client("s3", region_name=aws_region)
