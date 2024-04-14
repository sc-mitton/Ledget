from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import GenericAPIView


@require_http_methods(['GET'])
def health(request):
    return JsonResponse({'status': 'ok'})


class ProtectedHealth(GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return JsonResponse({'status': 'ok'})
