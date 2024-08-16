from unittest.mock import patch, Mock

from django.urls import reverse
from django.conf import settings

from restapi.tests.mixins import ViewTestsMixin, session_payloads, encode_jwt


class TestSessionViews(ViewTestsMixin):

    @patch('core.views.user.IdentityApi')
    def test_extend_user_session(self, identity_api_mock):
        identity_api_mock.return_value = Mock()

        session_payload = session_payloads[1]
        session_payload['session']['authentication_methods'][0]['method'] = 'oidc'

        self.client.defaults[settings.OATHKEEPER_JWT_HEADER] = '{} {}'.format(
            settings.OATHKEEPER_JWT_AUTH_SCHEME, encode_jwt(session_payload))

        response = self.client.patch(reverse('session-extend'))
        self.assertEqual(response.status_code, 200)

    @patch('core.views.user.IdentityApi')
    def test_disable_user_session(self, identity_api_mock):
        identity_api_mock.return_value = Mock()

        response = self.client.delete(reverse('disable-session'))
        self.assertEqual(response.status_code, 204)

        # Make sure mock was called with session id
        identity_api_mock.return_value.disable_session.assert_called_once_with(
            id=self.aal1_payload['session']['id'])

    @patch('core.views.user.IdentityApi')
    def test_disable_all_user_sessions(self, identity_api_mock):
        identity_api_mock.return_value = Mock()

        response = self.client.delete(reverse('disable-all-sessions'))
        self.assertEqual(response.status_code, 204)

        # Make sure mock was called with user id
        identity_api_mock.return_value.disable_session.assert_called_once_with(
            id=self.user.id)
