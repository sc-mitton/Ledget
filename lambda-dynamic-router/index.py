import logging


def lambda_handler(event, context):
    request = event['Records'][0]['cf']['request']
    uri = request['uri']
    origin = request['origin']

    VERSION = 'v1'
    accounts_app_domain = f'accounts.ledget.app.{VERSION}'
    app_domain = f'app.ledget.{VERSION}'
    landing_domain = f'landing.{VERSION}'

    if uri.endswith('accounts.ledget.app'):
        # Route to the accounts bucket
        origin['s3']['domainName'] = f'{accounts_app_domain}.s3.amazonaws.com'
    elif uri.endswith('ledget.app'):
        # Route to the landing page bucket
        origin['s3']['domainName'] = f'{landing_domain}.s3.amazonaws.com'
    else:
        # Route to the app bucket
        origin['s3']['domainName'] = f'{app_domain}.s3.amazonaws.com'

    request['origin'] = origin
    logging.info(f'Origin: {origin}')
    logging.info(f'Request: {request}')
    return request
