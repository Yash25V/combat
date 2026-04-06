from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    role = models.CharField(max_length=10, default='soldier')

class Soldier(models.Model):
    name = models.CharField(max_length=100)
    score = models.IntegerField()