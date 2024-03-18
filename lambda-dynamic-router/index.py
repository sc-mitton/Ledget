import re


def lambda_handler(event, context):
    request = event['Records'][0]['cf']['request']
    uri = request['uri']
    origin = request['origin']

    default_origin = 'ledget-landing.s3.amazonaws.com'
    main_app_origin = 'app.ledget.s3.amazonaws.com'

    if origin['s3']['domainName'] == default_origin and re.match(r'\/[a-zA-Z]+', uri):
        origin['s3']['domainName'] = main_app_origin

    request['origin'] = origin
    return request
