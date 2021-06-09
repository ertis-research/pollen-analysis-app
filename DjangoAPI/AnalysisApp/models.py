from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Polen(models.Model):
    AnalysisId = models.AutoField(primary_key=True)
    UserId = models.ForeignKey(User, on_delete=models.CASCADE)    
    AnalysisName = models.CharField(max_length=100)
    AnalysisDate = models.DateField()
    SampleDate = models.DateField()
    PhotoFileName = models.CharField(max_length=200)
    PhotoFilePath = models.CharField(max_length=200)
    AnalysisResult = models.IntegerField()
    AnalysisResult2 = models.IntegerField(default=0)

class PolinicRanges(models.Model):
    RangeId       = models.AutoField(primary_key=True)
    UserId        = models.ForeignKey(User, on_delete=models.CASCADE)
    DateOfStart   = models.DateField()
    DateOfEnd     = models.DateField()

class PolenType(models.Model):
    PolenId = models.AutoField(primary_key=True)
    Polen_Type_Name = models.CharField(max_length=100)
    Biological_Name = models.CharField(max_length=200)
    UserId = models.ForeignKey(User, on_delete=models.CASCADE) 

class PolenPercentage(models.Model):
    PolinicRangesId = models.ForeignKey(PolinicRanges, on_delete=models.CASCADE)
    PolenTypeId     = models.ForeignKey(PolenType, on_delete=models.CASCADE)
    Percentage      = models.IntegerField(default=0)
