from django.db import models
from django.contrib.auth.models import User
from datetime import date

# Create your models here.
class JobApplication(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    company_name = models.CharField(max_length=255, default="")
    role_title = models.CharField(max_length=255, default="")
    job_link = models.TextField(blank=True, null=True, )
    status = models.CharField(max_length=50, default="applied")
    date_applied = models.DateField(auto_now_add=True)
    notes = models.TextField(blank=True, null=True, default="")




