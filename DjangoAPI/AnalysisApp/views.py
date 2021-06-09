from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse

from AnalysisApp.models import Polen, PolenPercentage, PolenType, PolinicRanges
from django.contrib.auth.models import User
from AnalysisApp.serializers import PolenSerializer, PolinicRangesSerializer, PolenTypeSerializer

from django.core.files.storage import default_storage

from DjangoAPI.settings import SECRET_KEY

import AnalysisApp.AnalysisFunctions as af
from pathlib import Path

import numpy as np

from collections import OrderedDict

import jwt

# Create your views here.

def getUserDetails_fromJWT(request):
    jwt_token = request.META['HTTP_AUTHORIZATION'][4:]
    jwt_token_decoded = jwt.decode(str(jwt_token), SECRET_KEY, algorithms="HS256")    
    UserId = jwt_token_decoded['user_id']
    username = jwt_token_decoded['username']
    email = jwt_token_decoded['email']
    
    try:
        User.objects.get(id=UserId, username = username, email = email)
    except:
        return -1, 401 # Unauthorized

    return UserId, 200 # OK


@api_view(['GET', 'DELETE'])
@permission_classes([IsAuthenticated])
def polenApi(request, id=0):
    """
    This view is used by the frontend module to obtain 
    the sample analysis list or delete one analysis from the list.

    """    
    user, code = getUserDetails_fromJWT(request)
    if code == 401:
        return JsonResponse([], safe=False)

    if request.method=='GET':  
        polen = Polen.objects.filter(UserId=user)
        polen_serializer = PolenSerializer(polen, many=True)
        return JsonResponse(polen_serializer.data, safe=False)

    elif request.method=='DELETE':
        try:
            polen = Polen.objects.get(AnalysisId=id, UserId_id = user)
            polen.delete()
            return JsonResponse("Deleted Successfully!", safe= False)
        except:
            return JsonResponse("", safe= False)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def uploadVSI(request):
    """
    This view is used by the frontend module to send to the backend the file with the sample to analyse.

    """
    _, code = getUserDetails_fromJWT(request)
    if code == 401:
        return JsonResponse([], safe=False)

    file=request.FILES['uploadedFile']    
    file_name = default_storage.save(file.name, file)
    file_path = default_storage.path(file_name)

    unzip_path = 'images\\'+Path(file_name).stem
    af.unzipFile(file_path, unzip_path)   

    vsiFiles = af.listFiles(unzip_path, 'vsi')
    if(len(vsiFiles) == 0 or len(vsiFiles) > 1):
        return JsonResponse('Error uploading file. The VSI file cannot be found or there is more than one.', safe=False)

    responseList = []
    paths = OrderedDict()
    paths['unzip']    = unzip_path
    paths['filename'] = vsiFiles[0]
    responseList.append(paths)
    for image in af.getImageInfo(unzip_path+'\\'+vsiFiles[0]):
        images = OrderedDict()
        images['identifier'] = image[0]
        images['name'] = image[1]
        responseList.append(images)    
    return JsonResponse(responseList, safe=False)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def analyseSelectedImages(request):
    """
    This view is used by the frontend module to send to the backend how it has to analyse the image previously sent.

    """
    userId, code = getUserDetails_fromJWT(request)
    if code == 401:
        return JsonResponse("Analysis Failed", safe=False)

    reqStr  = JSONParser().parse(request)
    if reqStr['UserId'] != userId:        
        return JsonResponse("Analysis Failed", safe=False)
    
    parsed_route = reqStr['PhotoFilePath']+'\\parsed'
    af.parseImages(reqStr['SelectedRowsIds'], reqStr['PhotoFilePath']+'\\'+reqStr['PhotoFileName'], parsed_route)
    
    totalBlobsDetected = [0,0]   
    if (len(reqStr['SelectedRowsIds']) != 0):
        for image in af.listFiles(parsed_route, 'ome.tiff'):
            res = af.analyseImage(image, parsed_route, 0.5833)
            totalBlobsDetected = np.add(totalBlobsDetected, res )
    
    new_pollen = OrderedDict()
    new_pollen['AnalysisId'] = reqStr['AnalysisId']
    new_pollen['AnalysisName'] = reqStr['AnalysisName']
    new_pollen['SampleDate'] = reqStr['SampleDate']
    new_pollen['AnalysisDate'] = reqStr['AnalysisDate']
    new_pollen['PhotoFileName'] = reqStr['PhotoFileName']
    new_pollen['PhotoFilePath'] = reqStr['PhotoFilePath']
    new_pollen['UserId'] = reqStr['UserId']
    new_pollen['AnalysisResult']  = totalBlobsDetected[0]
    new_pollen['AnalysisResult2'] = totalBlobsDetected[1]

    polen_serializer = PolenSerializer(data= new_pollen)
    if polen_serializer.is_valid():
        polen_serializer.save()
        return JsonResponse("Analysis Okay", safe=False)
    return JsonResponse("Analysis Failed", safe=False)


####################################################################################

@api_view(['GET', 'POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def rangeApi(request, id=0):
    """
    This view is used by the frontend module to get the list of pollinic ranges,
    create a new one or delete an existing one

    """
    UserId, code = getUserDetails_fromJWT(request)
    if code == 401:
        return JsonResponse([], safe=False)

    if request.method=='GET':         
        polRanges = PolinicRanges.objects.filter(UserId=UserId)
        polRanges_serializer = PolinicRangesSerializer(polRanges, many=True)
        return JsonResponse(polRanges_serializer.data, safe=False)

    elif request.method=='POST':
        polRanges_data = JSONParser().parse(request)
        if polRanges_data['UserId'] == UserId:
            try:
                user = User.objects.get(id=polRanges_data['UserId'])
                pr = PolinicRanges(UserId= user, DateOfStart=polRanges_data['DateOfStart'], DateOfEnd=polRanges_data['DateOfEnd'])
                pr.save()
                for pt in polRanges_data['PolenTypeValues']:
                    polenType = PolenType.objects.get(PolenId=pt['PolenTypeId'])
                    polenPercentage = PolenPercentage(PolinicRangesId=pr, PolenTypeId=polenType, Percentage=pt['value'])
                    polenPercentage.save()

                return JsonResponse("Added Successfully", safe=False)
            except:
                return JsonResponse("Failed to Add.", safe=False)
        return JsonResponse("Failed to Add.", safe=False)

    elif request.method=='DELETE':
        try:
            polRanges = PolinicRanges.objects.get(RangeId=id, UserId_id = UserId)
            polRanges.delete()
            return JsonResponse("Deleted Successfully!", safe= False)
        except:
            return JsonResponse("", safe= False)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getRangeInformation(request):
    UserId, code = getUserDetails_fromJWT(request)
    if code == 401:
        return JsonResponse([], safe=False)
    if request.method=='GET':         
        RangeId  = request.GET['RangeId']

        getPolenValuesQuery =  ("SELECT 0 as RangeId, pt.Polen_Type_Name name, pp.Percentage value "
                                "from AnalysisApp_polinicranges pr, AnalysisApp_polentype pt, AnalysisApp_polenpercentage pp "
                                "where pr.RangeId == pp.PolinicRangesId_id and pp.PolenTypeId_id == pt.PolenId and "
                                "pr.RangeId == "+str(RangeId)+" and pt.UserId_id == "+str(UserId))

        percentageData = PolinicRanges.objects.raw(getPolenValuesQuery)
        
        rangeAux = PolinicRanges.objects.get(RangeId=RangeId, UserId= UserId)

        retList = [rangeAux.DateOfStart, rangeAux.DateOfEnd]

        for pr in percentageData:
            dataIter = OrderedDict()
            dataIter['name'] = pr.name
            dataIter['value'] = pr.value
            retList.append(dataIter)

    return JsonResponse(retList, safe=False)

####################################################################################

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getLast6MonthData_chart(request):   
    """
    This view is used by the frontend module to get 
    the necessary information to make "Last Sis Month Mean Data" bar plot.

    """ 
    UserId, code = getUserDetails_fromJWT(request)
    if code == 401:
        return JsonResponse([], safe=False)

    query = ("select 0 as AnalysisId, SUM(average) as sum, date from "
        "(select avg(AnalysisResult)*0.5833 as average, strftime('%Y-%m', SampleDate) as date "
        "from AnalysisApp_polen "
        "where sampleDate > date('now', 'start of month', '-5 month') "
        "AND sampleDate < date('now', 'start of month', '+5 month') "
        "AND UserId_id =='"+str(UserId)+"' "
        "group by strftime('%Y-%m', SampleDate) "
        "UNION ALL "
        "select avg(AnalysisResult2)*0.4167 as average, strftime('%Y-%m', date(SampleDate,'+1 day')) as date "
        "from AnalysisApp_polen "
        "where date(SampleDate,'+1 day') > date('now', 'start of month', '-5 month') "
        "AND date(SampleDate,'+1 day') < date('now', 'start of month', '+5 month') "
        "AND UserId_id =='"+str(UserId)+"' "
        "group by strftime('%Y-%m', date(SampleDate,'+1 day')) "
        "order by date) group by date;"
    )

    data = Polen.objects.raw(query)
    retList = []
    for queryRes in data:
        dataIter = OrderedDict()
        dataIter['name'] = queryRes.date
        dataIter['value'] = queryRes.sum
        retList.append(dataIter)
        
    return JsonResponse(retList, safe=False)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getDistrValues(request):
    """
    This view is used by the frontend module to get the necessary information
    to make "Approximate Daily Types of Pollen" pie plot.

    """    
    UserId, code = getUserDetails_fromJWT(request)
    if code == 401:
        return JsonResponse([], safe=False)
    
    dateToCheck  = request.GET['dateToCheck']
    getDayDataQuery =  ("select 0 as AnalysisId, sum(mean) as sum from( "
                        "select avg(AnalysisResult) as mean  "
                        "from AnalysisApp_polen "
                        "where sampleDate=='"+dateToCheck+"' "
                        "and UserId_id =='"+str(UserId)+"' "
                        "group by sampleDate "
                        "UNION ALL "
                        "select avg(AnalysisResult2)  "
                        "from AnalysisApp_polen "
                        "where sampleDate==date('"+dateToCheck+"','-1 day') "
                        "and UserId_id =='"+str(UserId)+"' "
                        "group by sampleDate)"
    )
    dateData = Polen.objects.raw(getDayDataQuery)[0].sum
    if dateData is None:
        return JsonResponse("Failed: No data for that day", safe=False)
        
    getRangeQuery = ("SELECT RangeId from AnalysisApp_polinicranges "
                     "WHERE '"+dateToCheck+"' between DateOfStart and DateOfEnd "
                     "and UserId_id =='"+str(UserId)+"' "
                     "order by RangeId")

    percentageId = PolinicRanges.objects.raw(getRangeQuery)
    if len(percentageId) < 1:
        return JsonResponse("Failed: No percentages found for this data and date", safe=False)
    retList = []
    
    getPolenValuesQuery =  ("SELECT 0 as RangeId, pt.Polen_Type_Name name, pp.Percentage value "
                            "from AnalysisApp_polinicranges pr, AnalysisApp_polentype pt, AnalysisApp_polenpercentage pp "
                            "where pr.RangeId == pp.PolinicRangesId_id and pp.PolenTypeId_id == pt.PolenId and pr.RangeId == "+str(percentageId[0].RangeId))

    percentageData = PolinicRanges.objects.raw(getPolenValuesQuery)

    for pr in percentageData:
        dataIter = OrderedDict()
        dataIter['name'] = pr.name
        dataIter['value'] = dateData * pr.value / 100
        retList.append(dataIter)

    return JsonResponse(retList, safe=False)
    
################################################

@api_view(['GET', 'POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def polenTypeApi(request, id=0):
    """
    This view is used by the frontend module to obtain 
    the sample analysis list or delete one analysis from the list.

    """    
    UserId, code = getUserDetails_fromJWT(request)
    if code == 401:
        return JsonResponse([], safe=False)

    if request.method=='GET':  
        pType = PolenType.objects.filter(UserId=UserId)
        pType_serializer = PolenTypeSerializer(pType, many=True)
        return JsonResponse(pType_serializer.data, safe=False)

    elif request.method=='POST':
        pType_data = JSONParser().parse(request)
        pType_serializer = PolenTypeSerializer(data= pType_data)
        if pType_serializer.is_valid() and pType_data['UserId'] == UserId:
            pType_serializer.save()
            return JsonResponse("Added Successfully", safe=False)
        return JsonResponse("Failed to Add.", safe=False)

    elif request.method=='DELETE':
        try:
            pType = PolenType.objects.get(PolenId=id, UserId_id = UserId)

            getRangeIdQuery = ("SELECT RangeId from AnalysisApp_polinicranges pr, AnalysisApp_polenpercentage pp "
                               "where pr.RangeId == pp.PolinicRangesId_id and pp.PolenTypeId_id == "+str(id)+
                               " and pr.UserId_id == "+str(UserId))
                               
            affectedRangesId = PolinicRanges.objects.raw(getRangeIdQuery)

            for range in affectedRangesId:
                rangeItem = PolinicRanges.objects.get(RangeId=range.RangeId)
                rangeItem.delete()
            pType.delete()

            return JsonResponse("Deleted Successfully!", safe= False)
        except:
            return JsonResponse("", safe= False)
