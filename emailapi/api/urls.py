from django.urls import path
from .views import UserInfoCreateView

urlpatterns = [
    path('userinfo/', UserInfoCreateView.as_view(), name='userinfo-create'),
]
