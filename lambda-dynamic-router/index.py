import re

DEFAULT_ORIGIN = 'ledget-landing.s3.amazonaws.com'
MAIN_APP_ORIGIN = 'app.ledget.s3.amazonaws.com'


def lambda_handler(event, context):
    request = event['Records'][0]['cf']['request']
    uri = request['uri']
    origin = request['origin']

    # Check if should be redirected to main app
    should_redirect_checks = [
        origin['s3']['domainName'] == DEFAULT_ORIGIN,
        re.match(r'\/[a-zA-Z\/]+', uri),
        'privacy' not in uri,
        'terms' not in uri,
    ]
    if all(should_redirect_checks):
        origin['s3']['domainName'] = MAIN_APP_ORIGIN
        request['origin'] = origin

    # For the landing page, automatically add index.html to the uri
    # if navigating to subfolder
    if origin['s3']['domainName'] == DEFAULT_ORIGIN and re.match(r'\/[a-zA-Z\/]+', uri):
        request['uri'] = f'{uri}/index.html'

    return request
