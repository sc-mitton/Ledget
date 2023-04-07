from rest_framework.permissions import IsAuthenticated


class OwnsResource(IsAuthenticated):

    def has_object_permission(self, request, view, obj):
        pk = view.kwargs.get('pk')
        has_permission = super().has_object_permission(request, view, obj)

        return pk == str(request.user.pk) and has_permission
