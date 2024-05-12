import logging
from secrets import compare_digest
import hashlib
import hmac
import time
import json

import jwt
import jwt.algorithms
from rest_framework.permissions import BasePermission
from django.conf import settings
from django.core.cache import cache
from plaid.model.webhook_verification_key_get_request import (
    WebhookVerificationKeyGetRequest
)
import plaid

from core.clients import create_plaid_client

plaid_client = create_plaid_client()


ORY_HOOK_API_KEY = settings.ORY_HOOK_API_KEY
ORY_HEADER = settings.ORY_AUTH_HEADER
ORY_SCHEME = settings.ORY_AUTH_SCHEME.lower()

logger = logging.getLogger('ledget')


class CameFromOry(BasePermission):

    def has_permission(self, request, view):
        auth_header = request.META.get(ORY_HEADER, '').split(' ')
        auth_scheme = auth_header[0].lower()
        key = auth_header[-1]

        if auth_scheme.lower() == ORY_SCHEME \
           and compare_digest(key, ORY_HOOK_API_KEY):
            return True
        else:
            return False


def _fetch_plaid_verification_key(key_id):
    request = WebhookVerificationKeyGetRequest(key_id=key_id)
    r = plaid_client.webhook_verification_key_get(request)
    return r['key']


def _get_plaid_verification_key(kid):

    cached_kids = cache.get('plaid_kids')

    if not cached_kids:
        verification_key = _fetch_plaid_verification_key(kid)
        cached_kids = {kid: verification_key}
    elif kid not in cached_kids:
        keys_ids_to_update = [key_id for key_id, key in cached_kids.items()
                              if key['expired_at'] is None]
        keys_ids_to_update.append(kid)

        for key_id in keys_ids_to_update:
            key = _fetch_plaid_verification_key(key_id)
            if key is not None:
                cached_kids[key_id] = key

    cache.set('plaid_kids', cached_kids, timeout=60 * 60 * 24)  # 24 hours
    return cached_kids[kid]


def _verify_request(request, verification_key):

    header = request.META['HTTP_PLAID_VERIFICATION']
    public_key = jwt.algorithms.ECAlgorithm.from_jwk(verification_key)
    claims = jwt.decode(header, public_key, algorithms=['ES256'])

    if claims['iat'] < time.time() - 5 * 60:  # 5 minutes
        return False

    json_body = json.dumps(request.data, indent=2).encode('utf-8')
    hash = hashlib.sha256()
    hash.update(json_body)
    hash = hash.hexdigest()
    return hmac.compare_digest(hash, claims['request_body_sha256'])


class CameFromPlaid(BasePermission):
    message = 'Invalid Plaid webhook signature'

    def has_permission(self, request, view):
        signed_jwt = request.META['HTTP_PLAID_VERIFICATION']
        kid = jwt.get_unverified_header(signed_jwt)['kid']

        try:
            verification_key = _get_plaid_verification_key(kid)
        except plaid.ApiException as e:
            logger.error(e)
            return False

        try:
            return _verify_request(request, verification_key)
        except Exception as e:  # pragma: no cover
            logger.error(e)
            return False
