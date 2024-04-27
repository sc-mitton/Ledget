from django.db import models

class BaseSharedModel(models.Model):

    class PrivacyChoices(models.TextChoices):
        PRIVATE = 'private'
        SHARED = 'shared'
        HIDDEN = 'hidden'

    privacy = models.CharField(
        max_length=10,
        choices=PrivacyChoices.choices,
        default=PrivacyChoices.SHARED
    )

    class Meta:
        abstract = True


class BasePrivateModel(models.Model):

    class PrivacyChoices(models.TextChoices):
        PRIVATE = 'private'
        SHARED = 'shared'
        HIDDEN = 'hidden'

    privacy = models.CharField(
        max_length=10,
        choices=PrivacyChoices.choices,
        default=PrivacyChoices.PRIVATE
    )

    class Meta:
        abstract = True
