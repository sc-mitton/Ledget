from django.shortcuts import render
from django.views import View


class AppView(View):
    template_name = 'home.html'
