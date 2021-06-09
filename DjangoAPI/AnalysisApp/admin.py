from django.contrib import admin
from .models import PolenType
from django.contrib.admin import ModelAdmin
# Register your models here.

@admin.register(PolenType)
class PolenTypeConfig(ModelAdmin):
    model = PolenType
    search_fields = ('Polen_Type_Name', 'Biological_Name',)
    ordering = ('-Polen_Type_Name',)
    list_display = ('Polen_Type_Name', 'Biological_Name')
