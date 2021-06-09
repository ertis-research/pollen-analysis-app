from django.conf.urls import url
from AnalysisApp import views

from django.conf.urls.static import static
from django.conf import settings

urlpatterns=[    
    url(r'^polen/$', views.polenApi),
    url(r'^polen/([0-9]+)$', views.polenApi),
    url(r'^uploadVSI/$', views.uploadVSI),
    url(r'^analyse/$', views.analyseSelectedImages),

    ######################################    

    url(r'^getSixMonthData/$', views.getLast6MonthData_chart),
    url(r'^getDistrValues/$', views.getDistrValues),

    ######################################

    url(r'^range/$', views.rangeApi),
    url(r'^range/([0-9]+)$', views.rangeApi),
    url(r'^getRangeInformation/$', views.getRangeInformation),

    ######################################    
    
    url(r'^polenTypes/$', views.polenTypeApi),
    url(r'^polenTypes/([0-9]+)$', views.polenTypeApi)

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)