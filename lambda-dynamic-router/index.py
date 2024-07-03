import re


def lambda_handler(event, context):
    request = event['Records'][0]['cf']['request']
    uri = request['uri']
    origin = request['origin']

    default_origin = 'ledget-landing.s3.amazonaws.com'
    main_app_origin = 'app.ledget.s3.amazonaws.com'

    should_redirect_checks = [
        origin['s3']['domainName'] == default_origin,
        re.match(r'\/[a-zA-Z]+', uri),
        'privacy' not in uri,
        'terms' not in uri,
    ]
    if all(should_redirect_checks):
        origin['s3']['domainName'] = main_app_origin

    request['origin'] = origin
    print('request: ', request)
    return request
