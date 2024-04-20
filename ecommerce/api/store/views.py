from django.http import JsonResponse, HttpResponseBadRequest, HttpResponse
from .models import Product, User, CartItem
from django.shortcuts import get_object_or_404
import json
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST,  require_http_methods
from .utils import generate_jwt_token
from django.contrib.auth.hashers import make_password,check_password
import jwt
from django.conf import settings



@csrf_exempt
@require_POST
def register(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')
        location = request.POST.get('location')
        address = request.POST.get('address')
        pincode = request.POST.get('pincode')
  
        if not username or not email or not password or not location or not address or not pincode:
            return HttpResponseBadRequest('All fields are required.')

        if User.objects.filter(username=username).exists():
            return HttpResponseBadRequest('Username is already taken.')

        new_user = User.objects.create(
            username=username,
            email=email,
            password=password,
            location=location,
            address=address,
            pincode=pincode
        )

        return JsonResponse({'message': 'Registration successful'})
    else:
        return HttpResponseBadRequest('Invalid request method.')




@csrf_exempt
@require_POST
def login(request):
    data = json.loads(request.body)
    username = data.get('username')
    password = data.get('password')
    
    if username is None or password is None:
        return JsonResponse({'error': 'Please provide both username and password'}, status=400)

    try:
        user = User.objects.get(username=username)
        if check_password(password, user.password):
            token = generate_jwt_token(user.id)
            print(token)  
            return JsonResponse({'token': token})
        else:
            return JsonResponse({'error': 'Invalid credentials'}, status=400)
    except User.DoesNotExist:
        return JsonResponse({'error': 'Invalid credentials'}, status=400)



def get_products(request):
    products = Product.objects.all()
    data = [
        {
            'id': product.id,
            'name': product.name,
            'description': product.description,
            'price': float(product.price),
            'stock': product.stock,
            'category': product.category,
            'image': request.build_absolute_uri(product.image.url) if product.image else None,
            'created_at': product.created_at.isoformat(),
            'updated_at': product.updated_at.isoformat(),
        }
        for product in products
    ]
    return JsonResponse({'products': data})


def product_details(request, productId):
    product = get_object_or_404(Product, id=productId)
    product_data =  {
            'id': product.id,
            'name': product.name,
            'description': product.description,
            'price': float(product.price),
            'stock': product.stock,
            'category': product.category,
            'image': request.build_absolute_uri(product.image.url) if product.image else None,
            'created_at': product.created_at.isoformat(),
            'updated_at': product.updated_at.isoformat(),
        }
    return JsonResponse(product_data)

def products_by_category(request):
    category = request.GET.get('category')
    exclude_id = request.GET.get('exclude_id')

    if not category:
        return JsonResponse({'error': 'Category parameter is required'}, status=400)

    products = Product.objects.filter(category=category)
    
    if exclude_id:
        products = products.exclude(id=exclude_id)

    serialized_products = [
        {
            'id': product.id,
            'name': product.name,
            'description': product.description,
            'price': float(product.price),
            'stock': product.stock,
            'category': product.category,
            'image': request.build_absolute_uri(product.image.url) if product.image else None,
            'created_at': product.created_at.isoformat(),
            'updated_at': product.updated_at.isoformat(),
        }
        for product in products
    ]
    return JsonResponse(serialized_products, safe=False)


# def get_cart_items(request):
#     auth_header = request.headers.get('Authorization')
#     if not auth_header:
#         return JsonResponse({'error': 'Authorization header missing'}, status=401)

#     token = auth_header.split(' ')[1]

#     try:
#         decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
#         user_id = decoded_token['user_id']

#         cart_items = CartItem.objects.filter(user_id=user_id).values()  
#         serialized_cart_items = list(cart_items)

#         return JsonResponse({'cart_items': serialized_cart_items})
#     except jwt.ExpiredSignatureError:
#         return JsonResponse({'error': 'Token expired'}, status=401)
#     except jwt.InvalidTokenError:
#         return JsonResponse({'error': 'Invalid token'}, status=401)
    
def get_cart_items(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return JsonResponse({'error': 'Authorization header missing'}, status=401)

    token = auth_header.split(' ')[1]

    try:
        decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        user_id = decoded_token['user_id']

        # Fetch cart items with product details for the user
        cart_items = CartItem.objects.filter(user_id=user_id).select_related('product')
        serialized_cart_items = [{'id': item.id, 'product': {
            'id': item.product.id,
            'name': item.product.name,
            'price': item.product.price,
            'description': item.product.description,
            'image': item.product.image.url if item.product.image else None
        }, 'quantity': item.quantity} for item in cart_items]

        return JsonResponse({'cart_items': serialized_cart_items})
    except jwt.ExpiredSignatureError:
        return JsonResponse({'error': 'Token expired'}, status=401)
    except jwt.InvalidTokenError:
        return JsonResponse({'error': 'Invalid token'}, status=401)

@csrf_exempt  
def add_to_cart(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        product_id = data.get('product_id')
        # quantity = data.get('quantity')
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return JsonResponse({'error': 'Authorization header missing'}, status=401)

        token = auth_header.split(' ')[1]

        if not product_id or not token:
            return HttpResponseBadRequest('Product_id and token are required.')
        try:
           
            decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = decoded_token['user_id']
            
            user = User.objects.get(pk=user_id)

            product = Product.objects.get(pk=product_id)

            # Add the item to the cart
            cart_item, created = CartItem.objects.get_or_create(user=user, product=product)
            cart_item.save()

            return JsonResponse({'message': 'Item added to cart successfully'})
        except (User.DoesNotExist, KeyError):
            return HttpResponseBadRequest('Invalid user_id or token.')

    return HttpResponseBadRequest('Invalid request method.')

from django.http import JsonResponse
import jwt
from django.conf import settings
from .models import CartItem


@csrf_exempt
def profile(request):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return JsonResponse({'error': 'Authorization header missing'}, status=401)

        try:
            token = auth_header.split(' ')[1]
            decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = decoded_token['user_id']
            user = User.objects.get(id=user_id)

            profile_data = {
                'username': user.username,
                'email': user.email,
                'address':user.address,
                'location':user.location,
                'pincode':user.pincode
            }
            return JsonResponse(profile_data)
        except jwt.ExpiredSignatureError:
            return JsonResponse({'error': 'Token expired'}, status=401)
        except (jwt.InvalidTokenError, User.DoesNotExist) as e:
            return JsonResponse({'error': 'Invalid token'}, status=401)

@csrf_exempt
def remove_from_cart(request, item_id):
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return JsonResponse({'error': 'Authorization header missing'}, status=401)

        token = auth_header.split(' ')[1]
        decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        user_id = decoded_token['user_id']

        # Remove the item from the user's cart
        CartItem.objects.filter(user_id=user_id, id=item_id).delete()

        return JsonResponse({'message': 'Item removed from cart successfully'})
    except jwt.ExpiredSignatureError:
        return JsonResponse({'error': 'Token expired'}, status=401)
    except jwt.InvalidTokenError:
        return JsonResponse({'error': 'Invalid token'}, status=401)
    except KeyError:
        return JsonResponse({'error': 'Invalid token format'}, status=401)
    except CartItem.DoesNotExist:
        return JsonResponse({'error': 'Item not found in cart'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
# def update_cart_item(request, item_id):
#     try:
#         cart_item = CartItem.objects.get(id=item_id)
#     except CartItem.DoesNotExist:
#         return JsonResponse({'error': 'Cart item not found'}, status=404)

#     if request.method == 'PUT':
#         new_quantity = int(request.POST.get('quantity', 1))  # Assuming quantity is sent as form data
#         print(f'Updating quantity for cart item {item_id} to {new_quantity}')  # Debugging statement
#         cart_item.quantity = new_quantity
#         cart_item.save()
#         print('Quantity updated successfully')  # Debugging statement
#         return JsonResponse({'success': 'Cart item quantity updated successfully'})
#     else:
#         return JsonResponse({'error': 'Invalid request method'}, status=400)
@csrf_exempt
def update_cart_item(request, item_id):
    if request.method == 'PUT':
        try:
            # Retrieve the cart item from the database
            cart_item = CartItem.objects.get(id=item_id)
            new_quantity = int(json.loads(request.body)['quantity'])  # Assuming quantity is sent in the request body

            # Check if it's an increment or decrement operation
            if new_quantity != cart_item.quantity:
                cart_item.quantity = new_quantity
                cart_item.save()
                return JsonResponse({'message': 'Quantity updated successfully'}, status=200)
            else:
                return JsonResponse({'message': 'No change in quantity'}, status=200)
        except CartItem.DoesNotExist:
            return JsonResponse({'error': 'Cart item not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    
@csrf_exempt
def checkout(request):
    if request.method == 'POST':
        return JsonResponse({'success': True, 'message': 'Checkout successful.'})
    else:
        return JsonResponse({'error': 'Invalid request method.'})