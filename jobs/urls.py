from django.urls import path
from .views import JobListCreateView, JobDetailView

urlpatterns = [
    path("jobs/", JobListCreateView.as_view()),
    path("jobs/<int:pk>/",JobDetailView.as_view())
]