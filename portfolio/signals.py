from django.db.models.signals import post_save
from django.dispatch import receiver

from .embeddings import embed_text, project_text
from .models import Project, ProjectEmbedding


@receiver(post_save, sender=Project)
def refresh_project_embedding(sender, instance, **kwargs):
    ProjectEmbedding.objects.filter(project=instance).delete()
    vec = embed_text(project_text(instance))
    if vec:
        ProjectEmbedding.objects.create(project=instance, embedding=vec)