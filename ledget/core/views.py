import json

from django.shortcuts import redirect, render
from django.contrib.auth import authenticate, login, get_user_model
from django.contrib import messages
from django.urls import resolve
from django.views import View
from django.views.generic import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import user_passes_test
from core.forms import LoginForm, RegisterForm, SubscribeForm
import stripe


class LandingView(TemplateView):
    template_name = 'landing.html'


# TODO On client side, add js to check strength of password during signup
# TODO On client side add js to check if passwords match during signup
# TODO On client side add js to check if email is valid during signup


def not_authenticated(user):
    """Return True if the user is not authenticated."""
    return not user.is_authenticated


@method_decorator(user_passes_test(not_authenticated, login_url='landing'),
                  name='dispatch')
class LoginView(View):
    template_name = 'login.html'
    form_classes = {
        'login': LoginForm,
        'forgot-password': '',
    }

    def dispatch(self, request, *args, **kwargs):
        url_name = resolve(request.path_info).url_name
        if url_name in self.form_classes:
            self.page = url_name
        else:
            self.page = None
        self.form_class = self.form_classes.get(self.page, 'home')
        return super().dispatch(request, *args, **kwargs)

    def get(self, request, *args, **kwargs):
        return render(request, self.template_name, context={'page': self.page})

    def post(self, request, *args, **kwargs):
        """Handle a post request from the register template. If
        the user has created an account successfully, they're redirected
        to the checkout page. Otherwise, they're redirected to the register."""

        if self.page == 'login':
            self.login(request, *args, **kwargs)
        elif self.page == 'forgot-password':
            self.forgot_password(request, *args, **kwargs)

        if messages.get_messages(request):
            context = {'page': self.page}
            return render(request, self.template_name, context)
        else:
            login_redirect_url = self.get_login_redirect_url(request.user)
            return redirect(login_redirect_url)

    def login(self, request, *args, **kwargs):
        """Handle a post request from the sign in form."""
        form = self.form_class(request.POST)
        if form.is_valid():
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']
            user = authenticate(email=email, password=password)
            if user is not None:
                backend = 'django.contrib.auth.backends.ModelBackend'
                login(request, user, backend=backend)
            else:
                msg = "The username or password you entered was incorrect."
                messages.error(request, msg)

    def get_login_redirect_url(self, user):
        """Find the url to redirect to after a successful login."""
        # TODO
        return 'landing'


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

        return render(request, self.template_name, context={'page': self.page})

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
                self.page = 'checkout'


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
