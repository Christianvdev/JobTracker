from rest_framework import generics
from .models import JobApplication
from .serializers import JobSerializer
from rest_framework.permissions import IsAuthenticated

from rest_framework.views import APIView
from rest_framework.response import Response
import google.generativeai as genai
import os
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
    
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))
class ParseJobDescriptionView(APIView):
    def post(self, request):
        raw_text = request.data.get("text")

        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(f"""
            Extract the following fields from this job posting as JSON only, no other text:
            company, role, salary_range, location, requirements (as a list).
            If a field isn't found, use null.
            
            Job posting:
            {raw_text}
        """)

        import json
        parsed = json.loads(response.text)
        return Response(parsed)