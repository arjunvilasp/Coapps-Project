# middleware.py

from django.http import JsonResponse
from .utils import decode_jwt_token

class JWTMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        token = request.headers.get('Authorization')
        if token:
            token = token.split(' ')[1]  # Extract token from Authorization header
            user = decode_jwt_token(token)
            if user:
                request.user = user
                return self.get_response(request)
        return JsonResponse({'error': 'Unauthorized'}, status=401)
