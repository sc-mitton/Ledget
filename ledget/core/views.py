import json

from django.shortcuts import redirect, render
from django.contrib.auth import authenticate, login, get_user_model
from django.contrib import messages
from django.urls import resolve
from django.views import View
from django.views.generic import TemplateView
from django.contrib.auth.mixins import PermissionRequiredMixin
from django.contrib.auth.decorators import login_required
from core.forms import LoginForm, RegisterForm, SubscribeForm
import stripe

class LandingView(TemplateView):
    template_name = 'landing.html'


# TODO On client side, add js to check strength of password during signup
# TODO On client side add js to check if passwords match during signup
# TODO On client side add js to check if email is valid during signup


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
        if self.page == 'login':
            return self.login(request, *args, **kwargs)
        elif self.page == 'forgot-password':
            return self.forgot_password(request, *args, **kwargs)
        return redirect('login')

    def login(self, request, *args, **kwargs):
        """Handle a post request from the sign in form."""
        form = self.form_class(request.POST)
        if form.is_valid():
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']
            user = authenticate(email=email, password=password)
            if user is not None:
                login(
                    request,
                    user,
                    backend='django.contrib.auth.backends.ModelBackend'
                )
                login_redirect_url = self.get_login_redirect_url(user)
                return redirect(login_redirect_url)
            messages.error(
                request,
                "The username or password you entered was incorrect."
            )
        return redirect('login')

    def get_login_redirect_url(self, user):
        """Find the url to redirect to after a successful login."""
        login_redirect_url = 'landing'
        # if user.is_active and user.is_subscriber:
        #     login_redirect_url = 'app:home'
        # elif user.is_active and not user.is_subscriber:
        #     login_redirect_url = 'subscription'
        # elif not user.is_active:
        #     login_redirect_url = 'subscription' # TODO redirect to reactivation page
        return login_redirect_url


class RegisterView(View):
    """
    The user gateway view that is for logging in, registering new users,
    and resetting forgotten passwords.
    """
    template_name = 'register.html'
    form_classes = {
        'register': RegisterForm,
        'subscribe': SubscribeForm
    }

    def dispatch(self, request, *args, **kwargs):

        url_name = resolve(request.path_info).url_name
        if request.GET and 'page' in request.GET:
            self.page = request.GET['page']
        elif url_name in self.form_classes:
            self.page = url_name
        else:
            self.page = None

        self.form_class = self.form_classes.get(self.page, 'home')
        return super().dispatch(request, *args, **kwargs)

    def get(self, request, *args, **kwargs):
        """Return the template for the current page. If the user
        is not authenticated, redirect to the register page."""
        if self.page != 'register' and not request.user.is_authenticated:
            return redirect('register')
        return render(request, self.template_name, context={'page': self.page})

    def post(self, request, *args, **kwargs):
        if self.page == 'register':
            self.register(request, *args, **kwargs)
        elif self.page == 'subscribe':
            self.subscribe(request, *args, **kwargs)
        return render(request, self.template_name)

    def register(self, request, *args, **kwargs):
        """Handle a post request from the sign up form to create a new
        user."""
        form = self.form_class(request.POST)

        if form.is_valid():
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']

            user_exists = get_user_model().objects.filter(email=email).exists()
            if user_exists:
                # Send password reset email and redirect to
                messages.error(request, "Email is already taken")
            else:
                user = self.create_user(email, password)
                login(
                    request,
                    user,
                    backend='django.contrib.auth.backends.ModelBackend'
                )
                self.page = 'subscribe'

        context = {'page': self.page}
        return render(request, self.template_name, context=context)

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
