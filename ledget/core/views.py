from django.shortcuts import redirect, render
from django.contrib.auth import authenticate, login, get_user_model
from django.contrib import messages
from django.views import View
from django.views.generic import TemplateView
from core.forms import LoginForm, RegisterForm


class HomeView(TemplateView):
    template_name = 'home.html'


# TODO On client side, add js to check strength of password during signup
# TODO On client side add js to check if passwords match during signup
# TODO On client side add js to check if email is valid during signup

class UserGatewayView(View):
    """
    The user gateway view that is for logging in, registering new users,
    and resetting forgotten passwords.
    """
    template_name = 'user_gateway.html'
    form_classes = {
        'login': LoginForm,
        'register': RegisterForm,
        'forgot_password': '',
    }

    def dispatch(self, request, *args, **kwargs):
        self.page = kwargs.get('page', None)
        self.form_class = self.form_classes.get(self.page, None)
        return super().dispatch(request, *args, **kwargs)

    def get(self, request, *args, **kwargs):

        return render(request, self.template_name, context={'page': self.page})

    def post(self, request, *args, **kwargs):

        if self.page == 'login':
            return self.login(request, *args, **kwargs)
        if self.page == 'register':
            return self.register(request, *args, **kwargs)
        return render(request, self.template_name, context={'page': self.page})

    def login(self, request, *args, **kwargs):
        """Handle a post request from the sign in form."""
        form = self.form_class(request.POST)
        if form.is_valid():
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']
            user = authenticate(email=email, password=password)
            if user is not None:
                login(request, user,
                      backend='django.contrib.auth.backends.ModelBackend')
                return redirect('home')
            messages.error(
                request,
                "The username or password you entered was incorrect."
            )
        return render(request, self.template_name, context={'page': self.page})

    def register(self, request, *args, **kwargs):
        """Handle a post request from the sign up form."""
        form = self.form_class(request.POST)

        if form.is_valid():
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']

            if not get_user_model().objects.filter(email=email).exists():
                # Send password reset email
                pass

            user = self.create_user(email, password)
            login(
                request,
                user,
                backend='django.contrib.auth.backends.ModelBackend'
            )

        return redirect('home')

    def create_user(self, email, password):
        """Create a new user with the given email and password."""
        User = get_user_model()
        user = User.objects.create_user(email=email, password=password)
        user.is_active = False
        user.save()
        return user
