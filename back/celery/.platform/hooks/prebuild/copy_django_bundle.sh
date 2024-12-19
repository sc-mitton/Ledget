#!/bin/bash

# Copy the source bundle for the rest api to the celery environment instances

# Variables
BUCKET_NAME="elasticbeanstalk-us-west-2-905418323334"
BUCKET_PATH="restapi"
LOCAL_DIR="/var/app/staging"
TEMP_DIR="/tmp/latest_deploy"
AWS_CLI=$(which aws)

# Ensure aws CLI is installed
if [ -z "$AWS_CLI" ]; then
  echo "Error: AWS CLI is not installed. Please install it and try again."
  exit 1
fi

# Create a temporary directory for the download
mkdir -p "$TEMP_DIR"
mkdir -p "$LOCAL_DIR"

echo "Fetching the latest zip file from S3 bucket..."

# Get the latest file in the S3 bucket
LATEST_FILE=$($AWS_CLI s3 ls "s3://$BUCKET_NAME/$BUCKET_PATH/" --recursive | sort | tail -n 1 | awk '{print $4}')

if [ -z "$LATEST_FILE" ]; then
  echo "Error: No files found in s3://$BUCKET_NAME/$BUCKET_PATH/"
  exit 1
fi

echo "Latest file detected: $LATEST_FILE"

# Download the latest file to the temporary directory
echo "Downloading the latest file..."
$AWS_CLI s3 cp "s3://$BUCKET_NAME/$LATEST_FILE" "$TEMP_DIR/latest.zip"

if [ $? -ne 0 ]; then
  echo "Error: Failed to download the latest file."
  exit 1
fi

# Unzip the downloaded file into the temp directory
echo "Extracting the contents..."
unzip -o "$TEMP_DIR/latest.zip" -d "$TEMP_DIR"

if [ $? -ne 0 ]; then
  echo "Error: Failed to extract the latest zip file."
  exit 1
fi

# Copy only new files to the staging directory
echo "Copying files to $LOCAL_DIR without overwriting existing files..."
rsync -av --ignore-existing "$TEMP_DIR/" "$LOCAL_DIR/"

if [ $? -ne 0 ]; then
  echo "Error: Failed to copy files to $LOCAL_DIR."
  exit 1
fi

# Clean up temporary files
echo "Cleaning up temporary files..."
rm -rf "$TEMP_DIR"

echo "Deployment completed successfully!"
