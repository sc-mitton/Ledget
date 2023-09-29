import logging
from secrets import compare_digest
import hashlib
import hmac

import jwt
from rest_framework.permissions import BasePermission
from django.conf import settings
from django.core import cache
from plaid.model.webhook_verification_key_get_request import (
    WebhookVerificationKeyGetRequest
)
import plaid

from core.clients import plaid_client


ory_api_key = settings.ORY_API_KEY
logger = logging.getLogger('ledget')


class CameFromOry(BasePermission):

    def has_permission(self, request, view):
        auth_header = request.META.get('HTTP_AUTHORIZATION', '').split(' ')
        auth_scheme = auth_header[0].lower()
        key = auth_header[-1]

        if auth_scheme.lower() == 'api-key' \
           and compare_digest(key, ory_api_key):
            return True
        else:
            return False


def _get_plaid_verification_key(self, key_id):
    try:
        request = WebhookVerificationKeyGetRequest(key_id=key_id)
        r = plaid_client.webhook_verification_key_get(request)
        response = r.json()
    except plaid.ApiException as e:
        logger.error(e)
        return None

    return response.get('key', None)


def _hmac_is_good(msg, claims):

    # Compute the hash of the body (ensures it hasn't been tampered with)
    m = hashlib.sha256()
    m.update(msg.encode('utf-8'))
    body_hash = m.hexdigest()

    # Ensure that the hash of the body matches the claim.
    # Use constant time comparison to prevent timing attacks.
    return hmac.compare_digest(body_hash, claims['request_body_sha256'])


def _update_kid_cache(kid):
    '''Update the cache if the kid is not in the cache'''

    cached_kids = cache.get('plaid_kids')

    if kid not in cached_kids:
        kids_to_update = [key_id for key_id, key in cached_kids.items()
                          if key['expired_at'] is None]
        kids_to_update.append(kid)
    else:
        return

    for kid in kids_to_update:
        verification_key = _get_plaid_verification_key(kid)
        if verification_key:
            cached_kids[kid] = verification_key

    cache.set('plaid_kids', cached_kids)
    if kid not in cached_kids:
        raise Exception('Kid not in updated cache kids')


class CameFromPlaid(BasePermission):
    message = 'Invalid Plaid webhook signature'

    def has_permission(self, request, view):
        signed_jwt = request.META['HTTP_PLAID_VERIFICATION']
        current_kid = jwt.get_unverified_header(signed_jwt)['kid']

        # Step 1: Either get the kid from the cahce, or
        try:
            _update_kid_cache(current_kid)
        except Exception as e:
            logger.error(e)
            return False

        cached_kids = cache.get('plaid_kids')
        try:
            claims = jwt.decode(
                signed_jwt,
                cached_kids[current_kid],
                algorithms=['ES256'],
                options={'verify_exp': True}
            )
        except jwt.JWTError:
            return False
        else:
            return _hmac_is_good(request.data, claims)
