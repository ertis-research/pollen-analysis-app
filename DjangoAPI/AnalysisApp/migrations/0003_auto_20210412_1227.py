# Generated by Django 3.2 on 2021-04-12 10:27

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('AnalysisApp', '0002_alter_users_departmentid'),
    ]

    operations = [
        migrations.RenameField(
            model_name='team',
            old_name='DepartmentId',
            new_name='TeamId',
        ),
        migrations.RenameField(
            model_name='team',
            old_name='DepartmentName',
            new_name='TeamName',
        ),
        migrations.RenameField(
            model_name='users',
            old_name='DepartmentId',
            new_name='TeamId',
        ),
    ]
