import json

from django.db import models
from django.utils.text import slugify
from pgvector.django import VectorField

EMBEDDING_DIMENSIONS = 1536


class EmbeddingField(VectorField):
    """pgvector column on PostgreSQL; JSON text on SQLite so local dev still works."""

    def db_type(self, connection):
        if connection.vendor != "postgresql":
            return "text"
        return super().db_type(connection)

    def from_db_value(self, value, expression, connection):
        if connection.vendor != "postgresql":
            return json.loads(value) if value else None
        return super().from_db_value(value, expression, connection)

    def get_db_prep_value(self, value, connection, prepared=False):
        if connection.vendor != "postgresql":
            return None if value is None else json.dumps([float(x) for x in value])
        return super().get_db_prep_value(value, connection, prepared)


class Project(models.Model):
    class Category(models.TextChoices):
        AI_ML = "ai_ml", "AI / ML"
        BACKEND = "backend", "Backend"
        FRONTEND = "frontend", "Frontend"
        FULLSTACK = "fullstack", "Full-Stack"
        DATA = "data", "Data Engineering"
        OTHER = "other", "Other"

    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=Category.choices, default=Category.FULLSTACK)
    tech_stack = models.JSONField(default=list, blank=True, help_text='e.g. ["Django", "PostgreSQL", "pgvector"]')
    github_url = models.URLField(blank=True)
    live_url = models.URLField(blank=True)
    image_url = models.URLField(blank=True)
    metrics = models.JSONField(
        default=dict, blank=True,
        help_text='e.g. {"cache_hit_rate": "94%", "p95_latency_ms": 120}',
    )
    # Case study content (editable from admin; used by the expandable cards)
    problem_statement = models.TextField(blank=True)
    solution = models.TextField(blank=True)
    featured = models.BooleanField(default=False)
    is_published = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0, help_text="Lower numbers appear first")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order", "-created_at"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class ProjectEmbedding(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="embeddings")
    embedding = EmbeddingField(dimensions=EMBEDDING_DIMENSIONS)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Embedding for {self.project.title}"


class Experience(models.Model):
    company = models.CharField(max_length=200)
    role = models.CharField(max_length=200)
    location = models.CharField(max_length=200, blank=True)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    current = models.BooleanField(default=False)
    bullet_points = models.JSONField(default=list, blank=True, help_text='List of strings, e.g. ["Cut query time by 60%"]')

    class Meta:
        ordering = ["-start_date"]

    def save(self, *args, **kwargs):
        if self.current:
            self.end_date = None
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.role} @ {self.company}"


class SiteSettings(models.Model):
    """Single row that controls homepage text, so you can update the site from admin."""

    name = models.CharField(max_length=100, default="Your Name")
    hero_tagline = models.CharField(
        max_length=250,
        default="Scalable Django + PostgreSQL architectures meeting production AI UI/UX.",
    )
    hero_subtext = models.TextField(blank=True)
    github_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)
    email = models.EmailField(blank=True)

    class Meta:
        verbose_name_plural = "Site settings"

    def save(self, *args, **kwargs):
        self.pk = 1  # enforce singleton
        super().save(*args, **kwargs)

    def __str__(self):
        return "Site settings"