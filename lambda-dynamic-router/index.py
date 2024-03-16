import logging


def lambda_handler(event, context):
    request = event['Records'][0]['cf']['request']
    uri = request['uri']
    origin = request['origin']

    VERSION = 'v1'
    default_domain = f'landing.{VERSION}'
    accounts_app_domain = f'accounts.ledget.app.{VERSION}'
    app_domain = f'app.ledget.{VERSION}'

    logging.info(f'original URI: {uri}')
    logging.info(f'original origin: {origin}')

    if uri.endswith('accounts.ledget.app'):
        # Route to the accounts bucket
        origin['s3']['domainName'] = \
            origin['s3']['domainName'].replace(default_domain, accounts_app_domain)
    elif uri.endswith('ledget.app'):
        pass
    else:
        # Route to the app bucket
        origin['s3']['domainName'] = \
            origin['s3']['domainName'].replace(default_domain, app_domain)

    request['origin'] = origin
    return request
