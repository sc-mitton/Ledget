def lambda_handler(event, context):
    request = event['Records'][0]['cf']['request']
    uri = request['uri']
    host = request['headers']['host'][0]['value']
    origin = request['origin']

    accounts_host = 'accounts.ledget.app'
    main_host = 'ledget.app'

    default_origin = 'ledget-landing'
    accounts_app_origin = 'accounts.ledget.app'
    main_app_origin = 'app.ledget'

    if host == accounts_host:
        # Route to the accounts bucket
        origin['s3']['domainName'] = \
            origin['s3']['domainName'].replace(default_origin, accounts_app_origin)
    elif host == main_host and uri:
        pass
    else:
        # Route to the app bucket
        origin['s3']['domainName'] = \
            origin['s3']['domainName'].replace(default_origin, main_app_origin)

    request['origin'] = origin
    return request
