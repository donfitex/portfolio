from django.core.management.base import BaseCommand

from portfolio.embeddings import embed_text, project_text
from portfolio.models import Project, ProjectEmbedding


class Command(BaseCommand):
    help = "Regenerate embeddings for all projects"

    def handle(self, *args, **options):
        count = 0
        for project in Project.objects.all():
            ProjectEmbedding.objects.filter(project=project).delete()
            vec = embed_text(project_text(project))
            if vec:
                ProjectEmbedding.objects.create(project=project, embedding=vec)
                count += 1
        self.stdout.write(self.style.SUCCESS(f"Generated {count} embeddings"))