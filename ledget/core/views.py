from django.shortcuts import redirect, render
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import user_passes_test
from django.utils.decorators import method_decorator
from django.contrib import messages
from django.urls import resolve
from django.views import View
from django.views.generic import TemplateView

from core.forms import LoginForm


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
