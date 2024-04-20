# utils/jwt.py

import jwt
from datetime import timedelta
from django.conf import settings
from django.utils import timezone  
from .models import User

def generate_jwt_token(user_id):
    payload = {
        'user_id': user_id,
        'exp': timezone.now() + timedelta(days=1), 
        'iat': timezone.now(),
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')

def decode_jwt_token(token):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        user_id = payload['user_id']
        user = User.objects.get(pk=user_id)
        return user
    except jwt.ExpiredSignatureError:
        return None  # Token expired
    except jwt.InvalidTokenError:
        return None  # Invalid token
    except User.DoesNotExist:
        return None  # User not found
