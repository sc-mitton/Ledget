from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User


class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ("email", "is_staff", "last_login",)
    list_filter = ("email", "is_staff",)
    fieldsets = (
        ("User", {
            "fields": ("email", "last_login")
        }),
        ("Permissions", {
            "fields": ("is_staff", "groups", "user_permissions")
        }),
    )
    add_fieldsets = (
        ("User", {
                "classes": ("wide",),
                "fields": (
                    "email", "password1", "password2"
                )
            }),
        ("Permissions", {
            "classes": ("wide",),
            "fields": (
                "is_staff", "groups", "user_permissions"
            )
        }),
    )
    search_fields = ("email",)
    ordering = ("email",)


admin.site.register(User, CustomUserAdmin)
