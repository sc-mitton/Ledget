from django import forms


class LoginForm(forms.Form):
    email = forms.EmailField(max_length=50)
    password = forms.CharField(widget=forms.PasswordInput, max_length=50)
    remember = forms.BooleanField(required=False)


class RegisterForm(forms.Form):
    email = forms.EmailField(max_length=50)
    password = forms.CharField(widget=forms.PasswordInput, max_length=50)


class SubscribeForm(forms.Form):
    period = forms.ChoiceField(
        choices=[('monthly', 'Monthly'), ('yearly', 'Yearly')])
