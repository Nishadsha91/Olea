from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone  
import random
import datetime

class BaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=10)
    ROLE_CHOICES = (('admin', 'Admin'), ('user', 'User'))
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='user')
    terms = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    otp = models.CharField(max_length=6, blank=True, null=True)
    otp_created_at = models.DateTimeField(null=True, blank=True)

    def generate_otp(self):
        self.otp = str(random.randint(100000, 999999))
        self.otp_created_at = timezone.now()
        self.save()
        return self.otp

    def is_otp_valid(self, otp):
        if self.otp != otp:
            return False
        if self.otp_created_at and timezone.now() > self.otp_created_at + datetime.timedelta(minutes=10):
            return False
        return True

    def __str__(self):
        return self.username  

class Product(BaseModel):
    CATEGORY_CHOICES = ( 
        ('boys', 'Boys'), 
        ('girls', 'Girls'), 
        ('toys', 'Toys'),
    )
    
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    name = models.CharField(max_length=200)
    image = models.ImageField(upload_to='products/')
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    status = models.CharField(
        max_length=20, 
        choices=[('active', 'Active'), ('inactive', 'Inactive')], 
        default='active'
    )

    def __str__(self):
        return self.name

class Cart(BaseModel):  # Fixed: Inherit from BaseModel
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f'{self.user.username} - {self.product.name}'
    
    class Meta:
        unique_together = ('user', 'product')


class Wishlist(BaseModel):  # Fixed: Inherit from BaseModel
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('user', 'product')  # prevent duplicates

    def __str__(self):
        return f"{self.user.username} - {self.product.name}"


class Order(BaseModel):
    PAYMENT_METHOD_CHOICES = (
        ('card', 'Card'),
        ('cash', 'Cash'),
        ('upi', 'UPI'),
    )
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    )
    PAYMENT_STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    )

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    order_id = models.CharField(max_length=20, unique=True)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    shipping = models.DecimalField(max_digits=10, decimal_places=2)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=10, choices=PAYMENT_METHOD_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')  # Fixed: Added status field
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')  # Fixed: Added choices
    razorpay_payment_id = models.CharField(max_length=100, blank=True, null=True)
    razorpay_order_id = models.CharField(max_length=100, blank=True, null=True)  # Added for Razorpay

    def __str__(self):
        return self.order_id

class OrderItem(BaseModel):  # Fixed: Inherit from BaseModel
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)  # Fixed: Removed null=True
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)  # Fixed: Added price field to store price at time of order

    def __str__(self):
        return f'{self.product.name} x {self.quantity}'

    def save(self, *args, **kwargs):
        # Auto-set price from product if not provided
        if not self.price and self.product:
            self.price = self.product.price
        super().save(*args, **kwargs)