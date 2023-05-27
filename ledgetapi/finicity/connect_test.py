import unittest
from pprint import pprint

import openapi_client
from openapi_client.apis.tags import connect_api
from openapi_client.model.connect_parameters import ConnectParameters


class TestConnect(unittest.TestCase):

    def test_generate_connect_url(self):
        configuration = openapi_client.Configuration(
            host="https://api.finicity.com"
        )
        configuration.api_key['FinicityAppToken'] = 'gpHlJ7peNf57s2wCKFBy'
        configuration.api_key['FinicityAppKey'] = \
            'a090dd74eedcd5df7329054ea7ea4835'

        with openapi_client.ApiClient(configuration) as api_client:
            api_instance = connect_api.ConnectApi(api_client)
            body = ConnectParameters(
                partnerId="2445584190171",
                customerId="6025241761"
            )
            # Generate Connect URL
            api_response = api_instance.generate_connect_url(
                body=body,
            )
            pprint(api_response)


if __name__ == '__main__':
    unittest.main()
