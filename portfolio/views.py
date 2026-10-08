from django.db import connection
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from rest_framework.views import APIView

from pgvector.django import CosineDistance

from .embeddings import embed_text
from .models import Experience, Project, ProjectEmbedding, SiteSettings
from .serializers import ExperienceSerializer, ProjectSerializer, SiteSettingsSerializer


class ProjectViewSet(viewsets.ReadOnlyModelViewSet):
    """Public read-only API. Create/edit/delete happens in /admin/."""

    serializer_class = ProjectSerializer
    lookup_field = "slug"

    def get_queryset(self):
        qs = Project.objects.filter(is_published=True)
        params = self.request.query_params
        category = params.get("category")
        if category:
            qs = qs.filter(category=category)
        if params.get("featured") in ("1", "true", "True"):
            qs = qs.filter(featured=True)
        return qs

    @action(detail=False, methods=["get"], url_path="search", throttle_classes=[AnonRateThrottle])
    def search(self, request):
        """GET /api/projects/search/?q=vector embeddings&limit=5"""
        query = request.query_params.get("q", "").strip()
        if not query:
            return Response({"detail": "Query parameter 'q' is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            limit = max(1, min(int(request.query_params.get("limit", 5)), 20))
        except ValueError:
            limit = 5

        qvec = embed_text(query[:500])
        if qvec is None:
            return Response({"query": query, "count": 0, "results": []})

        base = ProjectEmbedding.objects.select_related("project").filter(project__is_published=True)

        if connection.vendor == "postgresql":
            # pgvector cosine distance (<=>), computed inside PostgreSQL
            rows = base.annotate(distance=CosineDistance("embedding", qvec)).order_by("distance")[:limit]
            scored = [(r.project, 1 - r.distance) for r in rows]
        else:
            # SQLite fallback for local dev: vectors are unit length, so dot product = cosine similarity
            scored = sorted(
                ((r.project, sum(a * b for a, b in zip(qvec, r.embedding))) for r in base),
                key=lambda pair: pair[1],
                reverse=True,
            )[:limit]

        results = [
            {"relevance": round(float(score), 4), **ProjectSerializer(project).data}
            for project, score in scored
            if score > 0
        ]
        return Response({"query": query, "count": len(results), "results": results})


class ExperienceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Experience.objects.all()
    serializer_class = ExperienceSerializer


class SiteSettingsView(APIView):
    def get(self, request):
        obj, _ = SiteSettings.objects.get_or_create(pk=1)
        return Response(SiteSettingsSerializer(obj).data)