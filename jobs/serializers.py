from rest_framework import serializers
from .models import JobApplication

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobApplication
        fields = "__all__"
        read_only_fields = ['user']