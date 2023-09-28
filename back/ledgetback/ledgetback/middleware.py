from django.middleware.csrf import CsrfViewMiddleware


class CustomCsrfMiddleware(CsrfViewMiddleware):

    def process_response(self, request, response):
        print(request.META)
        return super().process_response(request, response)
