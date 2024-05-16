from io import BytesIO
from base64 import b64encode

from rest_framework import serializers
from django.utils import timezone
import qrcode
from qrcode.image.styledpil import StyledPilImage
from qrcode.image.styles.moduledrawers.pil import CircleModuleDrawer
from qrcode.image.styles.colormasks import HorizontalGradiantColorMask

from core.models import User, Feedback
from .account import AccountSerializer


class NameSerializer(serializers.Serializer):
    first_name = serializers.CharField()
    last_name = serializers.CharField()


class CoOwnerSerializer(serializers.Serializer):
    email = serializers.EmailField()
    name = NameSerializer()


class UserSerializer(serializers.ModelSerializer):
    email = serializers.SerializerMethodField(read_only=True)
    name = serializers.SerializerMethodField(read_only=True)
    is_verified = serializers.SerializerMethodField(read_only=True)
    highest_aal = serializers.SerializerMethodField(read_only=True)
    password_last_changed = serializers.CharField(required=False)
    last_login = serializers.SerializerMethodField(read_only=True)
    session = serializers.SerializerMethodField(read_only=True)
    account = AccountSerializer(read_only=True)
    co_owner = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        exclude = ("is_active",)

    def update(self, instance, validated_data):
        password_last_changed = validated_data.pop("password_last_changed", None)
        if password_last_changed:
            instance.password_last_changed = timezone.now()
        return super().update(instance, validated_data)

    def validate_password_last_changed(self, value):
        return value == "now"

    def get_email(self, obj):
        return obj.traits.get("email", "")

    def get_is_customer(self, obj):
        return obj.account.has_customer

    def get_name(self, obj):
        return obj.traits.get("name", {})

    def get_is_verified(self, obj):
        return obj.is_verified

    def get_service_provisioned_until(self, obj):
        return obj.account.service_provisioned_until

    def get_co_owner(self, obj):
        return obj.co_owner.id

    def get_session(self, obj):
        auth_methods = self.context["request"].ory_session.auth_methods
        completed_at = auth_methods[0]['completed_at'] if auth_methods else None

        return {
            "aal": self.context["request"].ory_session.aal,
            "auth_methods": self.context["request"].ory_session.devices,
            "auth_completed_at": completed_at,
        }

    def get_highest_aal(self, obj):
        return obj.highest_aal

    def get_subscription_status(self, obj):
        return (
            obj.account.customer.subscription_status
            if obj.account.has_customer
            else None
        )

    def get_last_login(self, obj):
        if self.context["request"].device:
            return self.context["request"].device.last_login
        return None


class LinkUserSerializer(serializers.Serializer):
    email = serializers.EmailField()


class ActivationLinkQrSerializer(serializers.Serializer):
    recovery_link = serializers.CharField(read_only=True)
    expires_at = serializers.DateTimeField(read_only=True)

    def to_representation(self, instance):
        recovery_link = instance['recovery_link'] + f"?code={instance['recovery_code']}"

        qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_L)
        qr.add_data(recovery_link)
        mask = HorizontalGradiantColorMask(
            left_color=(39, 54, 104),
            right_color=(89, 113, 192)
        )
        img = qr.make_image(
            image_factory=StyledPilImage,
            module_drawer=CircleModuleDrawer(),
            color_mask=mask
        )

        buffer = BytesIO()
        img.save(buffer)
        encoded_img = b64encode(buffer.getvalue()).decode()
        data_uri = f"data:image/png;base64,{encoded_img}"

        return {
            'recovery_link_qr': data_uri,
            'recovery_link': recovery_link,
            'expires_at': instance['expires_at']
        }


class PaymentMethodSerializer(serializers.Serializer):
    payment_method_id = serializers.CharField(required=False)
    old_payment_method_id = serializers.CharField(required=False)


class SubscriptionItemsSerializer(serializers.Serializer):
    price = serializers.CharField()


class FeedbackSerializer(serializers.ModelSerializer):

    class Meta:
        model = Feedback
        exclude = ("user",)

    def create(self, validated_data):
        user = self.context["request"].user
        validated_data["user"] = user
        return super().create(validated_data)


class EmailSerializer(serializers.Serializer):
    text = serializers.CharField(required=False)
    detail = serializers.CharField(required=False)


class NewSubscriptionSerializer(serializers.Serializer):
    price_id = serializers.CharField()
    trial_period_days = serializers.IntegerField(required=False)

    def validate_trial_period_days(self, value):
        if value > 30:
            raise serializers.ValidationError(
                "Trial period cannot be longer than 30 days."
            )
        return value
