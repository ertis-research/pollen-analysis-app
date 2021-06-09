from rest_framework import serializers
from AnalysisApp.models import Polen, PolinicRanges, PolenType

class PolenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Polen
        fields = ('AnalysisId',
                  'UserId',
                  'AnalysisName',
                  'AnalysisDate',
                  'SampleDate',
                  'PhotoFileName',
                  'PhotoFilePath',
                  'AnalysisResult',
                  'AnalysisResult2')

class PolenTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PolenType
        fields = ('PolenId',
                  'Polen_Type_Name',
                  'Biological_Name',
                  'UserId')

class PolinicRangesSerializer(serializers.ModelSerializer):
    class Meta:
        model = PolinicRanges
        fields = ('RangeId',
                  'UserId',
                  'DateOfStart',
                  'DateOfEnd')