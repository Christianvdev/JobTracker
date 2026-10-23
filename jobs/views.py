import json
import os

from groq import Groq
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import JobApplication
from .serializers import JobSerializer


class JobListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = JobSerializer

    def get_queryset(self):
        return JobApplication.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class JobDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = JobSerializer

    def get_queryset(self):
        return JobApplication.objects.filter(user=self.request.user)


class ParseJobDescriptionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        raw_text = request.data.get("text")
        if not isinstance(raw_text, str) or not raw_text.strip():
            return Response(
                {"detail": "Provide a non-empty job description."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if len(raw_text) > 20000:
            return Response(
                {"detail": "Job description must be 20,000 characters or fewer."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        api_key = os.environ.get("GROQ_API_KEY")
        if not api_key:
            return Response(
                {"detail": "AI parsing is not configured."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        try:
            client = Groq(api_key=api_key)
            response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[{
                    "role": "user",
                    "content": (
                        "Extract the following fields from this job posting as JSON only, "
                        "no other text, no markdown, no backticks: "
                        "company, role, salary_range, location, requirements (as a list). "
                        "If a field isn't found, use null.\n\nJob posting:\n"
                        + raw_text
                    ),
                }],
            )
            raw_response = response.choices[0].message.content
            if not isinstance(raw_response, str):
                raise ValueError("Empty AI response")
            clean = raw_response.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
            parsed = json.loads(clean)
            if not isinstance(parsed, dict):
                raise ValueError("Expected an object")
            fields = ("company", "role", "salary_range", "location")
            if any(parsed.get(field) is not None and not isinstance(parsed.get(field), str) for field in fields):
                raise ValueError("Unexpected field type")
            requirements = parsed.get("requirements")
            if requirements is not None and (
                not isinstance(requirements, list)
                or any(not isinstance(item, str) for item in requirements)
            ):
                raise ValueError("Invalid requirements")
        except (ValueError, KeyError, IndexError, TypeError, AttributeError):
            return Response(
                {"detail": "AI returned an invalid job description. Please enter details manually."},
                status=status.HTTP_502_BAD_GATEWAY,
            )
        except Exception:
            # Avoid leaking provider credentials or internal exception details.
            return Response(
                {"detail": "AI parsing is temporarily unavailable. Please try again later."},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        return Response({
            "company": parsed.get("company"),
            "role": parsed.get("role"),
            "salary_range": parsed.get("salary_range"),
            "location": parsed.get("location"),
            "requirements": requirements or [],
        })
