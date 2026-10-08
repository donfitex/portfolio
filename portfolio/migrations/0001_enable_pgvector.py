from django.db import migrations


def enable_pgvector(apps, schema_editor):
    if schema_editor.connection.vendor == "postgresql":
        schema_editor.execute("CREATE EXTENSION IF NOT EXISTS vector;")


class Migration(migrations.Migration):
    dependencies = []
    operations = [migrations.RunPython(enable_pgvector, migrations.RunPython.noop)]