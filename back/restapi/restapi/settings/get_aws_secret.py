import boto3

session = boto3.session.Session()
region = session.region_name or 'us-west-2'
client = session.client(
    service_name='secretsmanager',
    region_name=region
)

def get_secret(secret_name):
    try:
        return client.get_secret_value(SecretId=secret_name)['SecretString']
    except client.exceptions.ResourceNotFoundException:
        return ''
