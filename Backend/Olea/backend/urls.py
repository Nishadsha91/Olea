from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import CartView, UserView, OrderView, ProductView, OrderItemView, WishlistView, RegisterView, Checkout, CustomLoginView, ForgotPasswordView, ResetPasswordView, create_razorpay_order, verify_razorpay_payment
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register(r'cart', CartView, basename='cart')
router.register(r'users', UserView, basename='users')
router.register(r'order-items', OrderItemView, basename='order-items')
router.register(r'orders', OrderView, basename='orders')
router.register(r'products', ProductView, basename='products')
router.register(r'wishlist', WishlistView, basename='wishlist')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot-password'),
    path('reset-password/', ResetPasswordView.as_view(), name='reset-password'),
    path('login/', CustomLoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('cart/checkout/', Checkout, name='checkout'),
    path('create-razorpay-order/', create_razorpay_order, name='create-razorpay-order'),  # Changed
    path('verify-razorpay-payment/', verify_razorpay_payment, name='verify-razorpay-payment'),  # Changed

    path('', include(router.urls)),
]