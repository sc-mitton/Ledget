import re

DEFAULT_ORIGIN = 'ledget-landing.s3.us-west-2.amazonaws.com'
MAIN_APP_ORIGIN = 'ledget.app.s3.us-west-2.amazonaws.com'
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
        origin['s3']['domainName'] == MAIN_APP_ORIGIN,
        re.match(r'^\/[a-zA-Z\/]+$', uri),
        all([route not in uri for route in LANDING_ROUTES])
    ]
    if all(should_redirect_checks):
        request['origin']['s3']['domainName'] = origin

    # For the landing page, automatically add index.html to the uri
    # if navigating to subfolder
    should_append_index_html = [
        origin['s3']['domainName'] == DEFAULT_ORIGIN,
        re.match(r'^\/[a-zA-Z\/]+$', uri),
        any([route in uri for route in LANDING_ROUTES])
    ]
    if all(should_append_index_html):
        request['uri'] = f'{uri}/index.html'

    return request
