from django.db import models

# Create your models here.
class UserInfo(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    created_at = models.DateTimeField(auto_now_add=True)  # optional

    def __str__(self):
        return f"{self.name} ({self.email})"
