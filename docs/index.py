import re

def lambda_handler(event, context):
    request = event['Records'][0]['cf']['request']
    uri = request['uri']

    # Make sure sub folders get routed to index.html
    if re.match(r'\/[^\/\.]+$', uri):
        request['uri'] = uri + '/index.html'

    return request
