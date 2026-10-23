from unittest.mock import Mock, patch

from django.contrib.auth.models import User
from django.test import override_settings
from rest_framework.test import APITestCase

from .models import JobApplication


class JobApplicationTests(APITestCase):
    def setUp(self):
        self.owner = User.objects.create_user(username="owner", password="test-password")
        self.other = User.objects.create_user(username="other", password="test-password")
        self.job = JobApplication.objects.create(
            user=self.owner, company_name="Example", role_title="Developer"
        )

    def test_anonymous_user_cannot_list_jobs(self):
        response = self.client.get("/api/jobs/")
        self.assertIn(response.status_code, (401, 403))

    def test_users_only_see_their_own_jobs(self):
        self.client.force_authenticate(self.other)
        response = self.client.get("/api/jobs/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, [])

    def test_users_cannot_access_other_users_job(self):
        self.client.force_authenticate(self.other)
        url = f"/api/jobs/{self.job.pk}/"
        self.assertEqual(self.client.get(url).status_code, 404)
        self.assertEqual(self.client.patch(url, {"role_title": "Changed"}).status_code, 404)
        self.assertEqual(self.client.delete(url).status_code, 404)

    def test_create_job_assigns_authenticated_user(self):
        self.client.force_authenticate(self.other)
        response = self.client.post(
            "/api/jobs/",
            {
                "company_name": "Another Company",
                "role_title": "Support Engineer",
                "status": 1,
                "user": self.owner.pk,
            },
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(
            JobApplication.objects.get(pk=response.data["id"]).user_id,
            self.other.pk,
        )


class ParseJobDescriptionTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="parser", password="test-password")
        self.client.force_authenticate(self.user)

    def test_empty_input_returns_400(self):
        response = self.client.post("/api/parse-job/", {"text": "  "})
        self.assertEqual(response.status_code, 400)

    def test_non_string_input_returns_400(self):
        response = self.client.post("/api/parse-job/", {"text": ["not", "text"]}, format="json")
        self.assertEqual(response.status_code, 400)

    def test_large_input_returns_400(self):
        response = self.client.post("/api/parse-job/", {"text": "x" * 20001})
        self.assertEqual(response.status_code, 400)

    @patch.dict("os.environ", {"GROQ_API_KEY": ""})
    def test_missing_api_key_returns_503(self):
        response = self.client.post("/api/parse-job/", {"text": "Developer at Example"})
        self.assertEqual(response.status_code, 503)

    @patch.dict("os.environ", {"GROQ_API_KEY": "test-key"})
    @patch("jobs.views.Groq")
    def test_malformed_ai_response_returns_502(self, groq_class):
        groq_class.return_value.chat.completions.create.return_value = Mock(
            choices=[Mock(message=Mock(content="not json"))]
        )
        response = self.client.post("/api/parse-job/", {"text": "Developer at Example"})
        self.assertEqual(response.status_code, 502)

    @patch.dict("os.environ", {"GROQ_API_KEY": "test-key"})
    @patch("jobs.views.Groq")
    def test_valid_ai_response(self, groq_class):
        groq_class.return_value.chat.completions.create.return_value = Mock(
            choices=[Mock(message=Mock(content=(
                '{"company":"Example","role":"Developer","salary_range":null,'
                '"location":null,"requirements":["Python"]}'
            )))]
        )
        response = self.client.post("/api/parse-job/", {"text": "Developer at Example"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["company"], "Example")
        self.assertEqual(response.data["requirements"], ["Python"])
