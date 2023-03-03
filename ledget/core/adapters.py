"""
Adapter for all auth login so that if a user has account
with one social and they try to log in with another social
they are redirected to their original sign in method.
"""
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from django.shortcuts import redirect
from django.contrib import messages
from django.urls import reverse
from django.contrib.auth import get_user_model
from allauth.exceptions import ImmediateHttpResponse
from allauth.socialaccount.models import SocialAccount


class CustomSocialAdapter(DefaultSocialAccountAdapter):

    def pre_social_login(self, request, sociallogin):
        """If a user tries to sign up with a social account """
        email_address = sociallogin.account.extra_data['email']
        provider = sociallogin.account.provider
        User = get_user_model()
        try:
            user = User.objects.get(email=email_address)
        except User.DoesNotExist:
            pass
        else:
            social_account = SocialAccount.objects.get(user_id=user)
            if social_account.provider != provider:
                error_msg = (
                    "Looks like you have an account already, "
                    "please log in with your original sign in method."
                )
                messages.error(request, error_msg)
                login_url = reverse('login')
                raise ImmediateHttpResponse(redirect(login_url))

    def authentication_error(self, request, provider_id, error=None,
                             exception=None, extra_context=None):
        return redirect('login')
