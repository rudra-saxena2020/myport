from django.db import models

class UserInfo(models.Model):
    full_name = models.CharField(max_length=255)
    email = models.EmailField()
    whatsapp_number = models.CharField(max_length=20)
    location = models.CharField(max_length=255)
    portfolio_link = models.URLField()
    years_of_experience = models.PositiveIntegerField()
    experience_level = models.CharField(max_length=50)
    software_tools_used = models.CharField(max_length=255)
    best_video_type = models.CharField(max_length=100)
    expected_price = models.CharField(max_length=50)
    weekly_availability = models.CharField(max_length=50)
    reason_to_join = models.TextField()
    resume = models.FileField(upload_to='resumes/', null=True, blank=True)  # ADD THIS
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return self.full_name
