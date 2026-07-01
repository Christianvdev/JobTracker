from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _
from datetime import date

# Create your models here.
class JobApplication(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    class Status(models.IntegerChoices):
        Applied = 1, _('Applied')
        Interviewing = 2, _('Interviewing')
        Offer_received = 3, _('Offer received')
        Hired = 4, _('Hired')
        Not_selected_by_employer = 5, _('Not selected by employer')
        No_longer_interested = 6, _('No longer interested')

    company_name = models.CharField(max_length=255, default="")
    role_title = models.CharField(max_length=255, default="")
    job_link = models.TextField(blank=True, null=True, )
    date_applied = models.DateField(auto_now_add=True)
    notes = models.TextField(blank=True, null=True, default="")

    status = models.IntegerField(
        choices=Status,
        default=Status.Applied
    )




