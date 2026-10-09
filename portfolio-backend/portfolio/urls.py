from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import ExperienceViewSet, ProjectViewSet, SiteSettingsView

router = DefaultRouter()
router.register("projects", ProjectViewSet, basename="project")
router.register("experiences", ExperienceViewSet, basename="experience")

urlpatterns = [
    path("site/", SiteSettingsView.as_view(), name="site-settings"),
] + router.urls