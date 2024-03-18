def lambda_handler(event, context):
    request = event['Records'][0]['cf']['request']
    uri = request['uri']
    origin = request['origin']

    default_origin = 'ledget-landing.s3.amazonaws.com'
    main_app_origin = 'app.ledget.s3.amazonaws.com'

    print('uri: ' + uri)
    print('request: ' + str(request))

    request['origin'] = origin
    return request
