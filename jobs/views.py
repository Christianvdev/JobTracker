from rest_framework import generics
from .models import JobApplication
from .serializers import JobSerializer
from rest_framework.permissions import IsAuthenticated
# Create your views here.

class JobListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = JobSerializer


    def get_queryset(self):
        return JobApplication.objects.filter(
            user = self.request.user
        )
    
    def perform_create(self, serializer):
        serializer.save(
            user=self.request.user
        )

class JobDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = JobSerializer

    def get_queryset(self):
        return JobApplication.objects.filter(
            user = self.request.user
        )