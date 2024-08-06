from django.utils.deprecation import MiddlewareMixin
from django.conf import settings

from restapi.session import OrySession

OATHKEEPER_JWT_HEADER = settings.OATHKEEPER_JWT_HEADER
ORY_SESSION_TOKEN_HEADER = settings.ORY_SESSION_TOKEN_HEADER


class OrySessionMiddleware(MiddlewareMixin):

    def process_request(self, request):
        request.ory_session = self.get_ory_session(request)

    def get_ory_session(self, request):
        decoded_token = request.META.get(OATHKEEPER_JWT_HEADER, None)
        is_token_based = request.META.get(ORY_SESSION_TOKEN_HEADER, None)
        if not decoded_token or not isinstance(decoded_token, dict):
            return None

        ory_session = OrySession(
            id=decoded_token['session']['id'],
            aal=decoded_token['session']['authenticator_assurance_level'],
            auth_methods=decoded_token['session']['authentication_methods'],
            token_based=is_token_based
        )

        if request.path.endswith('devices'):
            ory_session.devices = decoded_token['session']['devices']

        return ory_session
