from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserInfoSerializer
from django.core.mail import send_mail
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator


@method_decorator(csrf_exempt, name='dispatch')
class UserInfoCreateView(APIView):
    def post(self, request):
        serializer = UserInfoSerializer(data=request.data)
        if serializer.is_valid():
            instance = serializer.save()

            # Send email confirmation
            user_email = instance.email
            full_name = instance.full_name

            send_mail(
                subject='Thank you for applying to Editopia Studio!',
                message=(
                    f"Hi {full_name},\n\n"
                    "We’ve received your application. Our team will review it and contact you shortly.\n\n"
                    "Regards,\nEditopia Studio"
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user_email],
                fail_silently=True,
            )

            return Response({"message": "User info saved successfully"}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# This code defines a Django REST API view that handles the creation of user information.
# It validates the incoming data using a serializer, saves the user info,