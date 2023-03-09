import json

from django.shortcuts import redirect, render
from django.contrib.auth import login, get_user_model
from django.contrib import messages
from django.urls import resolve
from django.views import View
from django.contrib.auth.mixins import LoginRequiredMixin
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.http.response import JsonResponse, HttpResponse
import stripe

from core.models import Customer
from core.forms import RegisterForm, SubscribeForm

# TODO On client side, add js to check strength of password during signup
# TODO On client side add js to check if passwords match during signup
# TODO On client side add js to check if email is valid during signup


class RegisterView(View):
    """
    The user gateway view that is for logging in, registering new users,
    and resetting forgotten passwords.
    """
    template_name = 'register.html'
    form_class = RegisterForm

    def dispatch(self, request, *args, **kwargs):

        self.page = resolve(request.path_info).url_name
        return super().dispatch(request, *args, **kwargs)

    def get(self, request, *args, **kwargs):
        """Return the template for the current page. If the user
        is not authenticated, redirect to the register page."""
        return render(request, self.template_name, context={'page': self.page})

    def post(self, request, *args, **kwargs):
        if self.page == 'register':
            self.register(request, *args, **kwargs)

        if messages.get_messages(request):
            return redirect('register')
        return redirect('checkout')

    def register(self, request, *args, **kwargs):
        """Handle a post request from the sign up form to create a new
        user."""
        form = self.form_class(request.POST)
        User = get_user_model()

        if form.is_valid():
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']

            user_exists = User.objects.filter(email=email).exists()
            if user_exists:
                # Send password reset email and redirect to
                messages.error(request, "Email is already taken")
            else:
                user = User.objects.create(email=email, password=password)
                user.save()
                login(
                    request,
                    user,
                    backend='django.contrib.auth.backends.ModelBackend'
                )


class CheckoutView(LoginRequiredMixin, View):
    template_name = 'register.html'
    form_class = SubscribeForm

    def dispatch(self, request, *args, **kwargs):
        self.page = resolve(request.path_info).url_name
        return super().dispatch(request, *args, **kwargs)

    def get(self, request, *args, **kwargs):
        """Return the template for the current page. If the user
        is not authenticated, redirect to the register page."""
        return render(request, self.template_name, context={'page': self.page})

    def post(self, request, *args, **kwargs):
        if self.page == 'subscribe':
            self.register(request, *args, **kwargs)
        return render(request, self.template_name)

    def subscribe(self, request, *args, **kwargs):
        """Handle a post request from the subscription form to create a new
        customer."""

        form = self.form_class(request.POST)
        if form.is_valid():
            first_name = form.cleaned_data['first_name']
            last_name = form.cleaned_data['last_name']
            user = request.user
            user.first_name = first_name
            user.last_name = last_name
            user.save()

    def create_customer(self, request, *args, **kwargs):
        """Create a new customer with the given email and password."""
        pass

    def create_subscription(self, request, *args, **kwargs):
        """Create a new subscription for the given customer."""
        pass

    def create_user(self, email, password):
        """Create a new user with the given email and password."""
        User = get_user_model()
        user = User.objects.create_user(email=email, password=password)
        user.is_active = False
        user.save()
        return user

    def webhook_received(self, request, *args, **kwargs):
        """Handle a webhook from Stripe."""
        pass


@csrf_exempt
def stripe_config(request):
    if request.method == 'GET':
        stripe_config = {'publicKey': settings.STRIPE_PK}
        return JsonResponse(stripe_config, safe=False)


@csrf_exempt
def create_checkout_session(request):
    if request.method == 'GET':
        domain_url = settings.DOMAIN_URL
        stripe.api_key = settings.STRIPE_SECRET_KEY
        try:
            checkout_session = stripe.checkout.Session.create(
                client_reference_id=request.user.id if request.user.is_authenticated else None,
                success_url=domain_url + 'success?session_id={CHECKOUT_SESSION_ID}',
                cancel_url=domain_url + 'cancel/',
                payment_method_types=['card'],
                mode='subscription',
                line_items=[
                    {
                        'price': settings.STRIPE_PRICE_ID,
                        'quantity': 1,
                    }
                ]
            )
            return JsonResponse({'sessionId': checkout_session['id']})
        except Exception as e:
            return JsonResponse({'error': str(e)})


class StripeWebhook(View):
    """Handle a webhook from Stripe."""

    @csrf_exempt
    def post(self, request, *args, **kwargs):
        stripe.api_key = settings.STRIPE_SECRET_KEY
        webhook_secret = settings.STRIPE_WEBHOOK_SECRET
        request_data = json.loads(request.data)

        if webhook_secret:
            # Retrieve the event by verifying the signature using the raw
            # body and secret if webhook signing is configured.
            try:
                event = stripe.Webhook.construct_event(
                    payload=request.data,
                    sig_header=request.META['HTTP_STRIPE_SIGNATURE'],
                    secret=webhook_secret
                )
                data = event['data']
            except Exception as e:
                return e
            # Get the type of webhook event sent - used to check the status
            event_type = event['type']
        else:
            data = request_data['data']
            event_type = request_data['type']
        data_object = data['object']

        if event_type == 'checkout.session.completed':
            # Payment is successful and the subscription is created.
            # Provision subscription and save the relevant details
            pass
        elif event_type == 'invoice.paid':
            # Continue to provision the subscription as payments continue to be made.
            # Store the status in the db
            pass
        elif event_type == 'invoice.payment_failed':
            # The payment failed or the customer does not have a valid payment method.
            # Notify customer and send them to the customer portal to update their payment information
            pass

        return JsonResponse({'status': 'success'})
