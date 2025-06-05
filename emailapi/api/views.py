from django.shortcuts import render

# Create your views here.
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
from .models import UserInfo
from django.core.mail import send_mail
from django.conf import settings

@csrf_exempt
def collect_user_info(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            name = data['name']
            email = data['email']

            user = UserInfo.objects.create(name=name, email=email)

            send_mail(
                subject='Welcome!',
                message=f"Hi {name}, thank you for signing up!",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
            )

            return JsonResponse({'status': 'success', 'message': 'User info saved and email sent.'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

    return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserInfoSerializer

class UserInfoCreateView(APIView):
    def post(self, request):
        serializer = UserInfoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User info saved successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
