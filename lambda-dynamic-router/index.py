def lambda_handler(event, context):
    request = event['Records'][0]['cf']['request']
    uri = request['uri']
    origin = request['origin']

    VERSION = 'v1'
    default_origin = f'landing.{VERSION}.s3.amazonaws.com'
    accounts_app_origin = f'accounts.ledget.app.{VERSION}.s3.amazonaws.com'
    main_app_origin = f'app.ledget.{VERSION}.s3.amazonaws.com'

    if uri.endswith('accounts.ledget.app'):
        # Route to the accounts bucket
        origin['s3']['domainName'] = \
            origin['s3']['domainName'].replace(default_origin, accounts_app_origin)
    elif uri.endswith('ledget.app'):
        pass
    else:
        # Route to the app bucket
        origin['s3']['domainName'] = \
            origin['s3']['domainName'].replace(default_origin, main_app_origin)

    request['origin'] = origin
    return request
