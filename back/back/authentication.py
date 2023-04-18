
from rest_framework_simplejwt.authentication import JWTAuthentication


class CustomJWTAuthentication(JWTAuthentication):
    """Custom authentication class since we're using HTTP only cookies.
    The authentication class is a mechanism of associating an incoming request
    with a set of identifying credentials."""

    def authenticate(self, request):
        access_token = request.COOKIES.get('access')
        if access_token is None:
            return None

        validated_token = self.get_validated_token(access_token)
        user = self.get_user(validated_token)
        return user, validated_token
