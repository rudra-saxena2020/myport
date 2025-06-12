"""
URL configuration for emailapi project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
"""
from django.conf import settings
from django.conf.urls.static import static

from django.contrib import admin
from django.urls import path, include
# from api.views import collect_user_info  # Your custom view

urlpatterns = [
    path('admin/', admin.site.urls),  # Admin panel
    # path('api/submit/', collect_user_info),  # Custom API view
    path('api/', include('api.urls')),  # Additional API routes from api/urls.py
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)