from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import JobApplication
from .serializers import JobSerializer
from groq import Groq
import json
import os

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

# Create your views here.

class JobListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = JobSerializer

    def get_queryset(self):
        return JobApplication.objects.filter(
            user=self.request.user
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
            user=self.request.user
        )


class ParseJobDescriptionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        raw_text = request.data.get("text")

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{
                "role": "user",
                "content": f"""Extract the following fields from this job posting as JSON only, no other text, no markdown, no backticks:
                company, role, salary_range, location, requirements (as a list).
                If a field isn't found, use null.

                Job posting:
                {raw_text}"""
            }]
        )

        raw_response = response.choices[0].message.content
        clean = raw_response.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
        parsed = json.loads(clean)
        return Response(parsed)