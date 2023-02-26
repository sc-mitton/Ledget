from django.shortcuts import redirect, render
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate, login
from django.contrib import messages
from django.views import View
from django.views.generic import TemplateView
from core.forms import LoginForm


class HomeView(TemplateView):
    template_name = 'home.html'


class LoginView(View):
    template_name = 'login.html'
    form_class = LoginForm
    User = get_user_model()

    def post(self, request, *args, **kwargs):
        form = self.form_class(request.POST)
        if form.is_valid():
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']
            user = authenticate(email=email, password=password)
            if user is not None:
                login(request, user)
                return redirect('home')
        messages.error(request,
                       "The username or password you entered is incorrect.")
        return render(request, self.template_name)

    def get(self, request, *args, **kwargs):
        return render(request, self.template_name)
