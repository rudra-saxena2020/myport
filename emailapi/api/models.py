from django.db import models

class UserInfo(models.Model):
    full_name = models.CharField("Full Name", max_length=255)
    email = models.EmailField("Email Address")
    whatsapp_number = models.CharField("WhatsApp Number", max_length=20)
    location = models.CharField("Location", max_length=255)
    portfolio_link = models.URLField("Portfolio URL")
    years_of_experience = models.TextField("Experience Description")
    experience_level = models.CharField("Experience Level", max_length=50)
    software_tools_used = models.CharField("Primary Editing Software", max_length=255)
    best_video_type = models.CharField("Specialization", max_length=100)
    expected_price = models.CharField("Expected Price", max_length=50)
    weekly_availability = models.CharField("Availability", max_length=50)
    reason_to_join = models.TextField("Why do you want to join Editopia Studio?")
    resume = models.FileField("Resume / CV", upload_to='resumes/', max_length=255, null=True, blank=True)
    additional_info = models.TextField("Additional Information", null=True, blank=True)

    created_at = models.DateTimeField("Submitted At", auto_now_add=True)

    def __str__(self):
        return self.full_name
