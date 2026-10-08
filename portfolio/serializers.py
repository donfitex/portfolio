from rest_framework import serializers

from .models import Experience, Project, SiteSettings


class ProjectSerializer(serializers.ModelSerializer):
    category_label = serializers.CharField(source="get_category_display", read_only=True)

    class Meta:
        model = Project
        fields = [
            "id", "title", "slug", "description", "category", "category_label",
            "tech_stack", "github_url", "live_url", "image_url", "metrics",
            "problem_statement", "solution", "featured", "order",
            "created_at", "updated_at",
        ]


class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = [
            "id", "company", "role", "location", "start_date",
            "end_date", "current", "bullet_points",
        ]


class SiteSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSettings
        fields = ["name", "hero_tagline", "hero_subtext", "github_url", "linkedin_url", "email"]