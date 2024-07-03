import re

DEFAULT_ORIGIN = 'ledget-landing.s3.amazonaws.com'
MAIN_APP_ORIGIN = 'app.ledget.s3.amazonaws.com'
LANDING_ROUTES = [
    '/privacy',
    '/terms'
]


def lambda_handler(event, context):
    request = event['Records'][0]['cf']['request']
    uri = request['uri']
    origin = request['origin']

    # Check if should be redirected to main app
    should_redirect_checks = [
        origin['s3']['domainName'] == DEFAULT_ORIGIN,
        re.match(r'^\/[a-zA-Z\/]+$', uri),
        all([route not in uri for route in LANDING_ROUTES])
    ]
    if all(should_redirect_checks):
        origin['s3']['domainName'] = MAIN_APP_ORIGIN
        request['origin'] = origin

    # For the landing page, automatically add index.html to the uri
    # if navigating to subfolder
    should_append_index_html = [
        request['origin'] == DEFAULT_ORIGIN,
        re.match(r'^\/[a-zA-Z\/]+$', uri),
        any([route in uri for route in LANDING_ROUTES])
    ]
    if all(should_append_index_html):
        request['uri'] = f'{uri}/index.html'

    print('request', request)

    return request
