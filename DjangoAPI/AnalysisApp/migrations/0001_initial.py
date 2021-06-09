# Generated by Django 3.2 on 2021-04-12 10:18

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Team',
            fields=[
                ('DepartmentId', models.AutoField(primary_key=True, serialize=False)),
                ('DepartmentName', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Users',
            fields=[
                ('UserId', models.AutoField(primary_key=True, serialize=False)),
                ('UserName', models.CharField(max_length=100)),
                ('UserSurname', models.CharField(max_length=100)),
                ('DateOfJoining', models.DateField()),
                ('PhotoFileName', models.CharField(max_length=100)),
                ('DepartmentId', models.IntegerField()),
            ],
        ),
    ]
