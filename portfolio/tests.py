from django.test import TestCase
from rest_framework.test import APIClient

from .models import Project, ProjectEmbedding


class ApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        Project.objects.create(
            title="Vector Search Engine",
            description="Semantic search using pgvector embeddings",
            category="ai_ml", tech_stack=["Django", "pgvector"],
        )
        Project.objects.create(
            title="Redis Cache Layer",
            description="Caching to cut database latency",
            category="backend",
        )
        Project.objects.create(
            title="Hidden Draft", description="vector embeddings secret", is_published=False,
        )

    def test_embedding_created_on_save(self):
        self.assertEqual(ProjectEmbedding.objects.count(), 3)

    def test_list_hides_unpublished(self):
        data = self.client.get("/api/projects/").json()
        self.assertEqual(len(data), 2)

    def test_category_filter(self):
        data = self.client.get("/api/projects/", {"category": "backend"}).json()
        self.assertEqual([p["slug"] for p in data], ["redis-cache-layer"])

    def test_search_ranks_relevant_first_and_hides_unpublished(self):
        data = self.client.get("/api/projects/search/", {"q": "something built with vector embeddings"}).json()
        slugs = [r["slug"] for r in data["results"]]
        self.assertEqual(slugs[0], "vector-search-engine")
        self.assertNotIn("hidden-draft", slugs)

    def test_search_requires_query(self):
        self.assertEqual(self.client.get("/api/projects/search/").status_code, 400)