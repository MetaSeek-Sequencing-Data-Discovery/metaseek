from app import db
import math
import numpy as np
import pandas as pd
from models import *
from datetime import datetime
from decimal import Decimal
from collections import Counter
from sqlalchemy import or_, func
import scipy.stats as sp
import time

#function to get color gradient from max to white
def getFillColor(count, maxCount, r,g,b):
    #e.g. [99, 105, 224] is #6369e0; compared to #FFFFFF is [255,255,255]
    #use rgb provided, make varying opacity from 25-225
    proportion = float(count)/float(maxCount)
    alpha = (200*proportion)+25
    #newr = r + ((255-r)*(1-proportion))
    #newg = g + ((255-g)*(1-proportion))
    #newb = b + ((255-b)*(1-proportion))
    rgb = [r, g, b, alpha]
    #if rgb==[255, 255, 255]:
    #    rgb.append(15)
    #else:
    #    rgb.append(175)
    return rgb
#function to get color from full opacity to transparent with a set number of bins spanning even percentiles of a range of values
def getMapBins(map_counts, num_bins): #e.g. latlon_map[0]
    #find upper limit of percentile for 0 count (for all data is something like 30th)
    bottom = sp.percentileofscore(map_counts.flatten(), 0.0, kind='weak')
    #define 10 percentile bins, evenly divide rest of bins above 0 count into nine chunks
    step = (100-bottom)/(num_bins-1)
    percentiles = [0]
    for ix in xrange(0,num_bins-1):
        percentiles.append(bottom+(ix*step))
    #find counts that bound each bin
    countRanges = []
    for bin in percentiles:
        countRanges.append(round(np.percentile(map_counts,bin),0))
    countRanges.append(round(np.amax(map_counts),0))
    #define fill colors for each of the bins
    fillColors = []
    for ix in xrange(0,num_bins):
        #the 255*0.8 is the max opacity
        fillColors.append([242, 111, 99, (255*0.8)*(ix/float(num_bins-1))])
    return percentiles, countRanges, fillColors


def filterQueryByRule(targetClass,queryObject,field,ruletype,value):
    fieldattr = getattr(targetClass,field)
    if ruletype == 0:
        queryObject = queryObject.filter(fieldattr == value)
    elif ruletype == 1:
        queryObject = queryObject.filter(fieldattr < value)
    elif ruletype == 2:
        queryObject = queryObject.filter(fieldattr > value)
    elif ruletype == 3:
        queryObject = queryObject.filter(fieldattr <= value)
    elif ruletype == 4:
        queryObject = queryObject.filter(fieldattr >= value)
    elif ruletype == 5:
        queryObject = queryObject.filter(fieldattr == value)
    elif ruletype == 6:
        queryObject = queryObject.filter(fieldattr != value)
    elif ruletype == 7:
        queryObject = queryObject.filter(or_(*[fieldattr.like('%' + name + '%') for name in value]))
        #queryObject = queryObject.filter(fieldattr.like('%' + value + '%'))
    elif ruletype == 8:
        queryObject = queryObject.filter(fieldattr.in_(value))
    elif ruletype == 9:
        queryObject = queryObject.filter(~fieldattr.in_(value))
    elif ruletype == 10:
        queryObject = queryObject.filter(fieldattr != None)

    return queryObject

def getSampledColumns(queryObject,columnNames,sampleRate=0.0001):
    columnQueryObject = queryObject.with_entities(*[getattr(Dataset,c) for c in columnNames])
    sampledColumns = columnQueryObject.filter(func.rand() < sampleRate)
    dataFrame = pd.read_sql(sampledColumns.statement,db.session.bind)
    return dataFrame

def summarizeColumn(dataFrame,columnName,linearBins=False,logBins=False, num_cats=None):
    dataColumn = dataFrame[columnName].dropna()
    uniqueCount = len(dataColumn.unique())
    if uniqueCount == 0:
        return {'NULL':len(dataFrame.index)}
    else:
        if logBins == False:
            if linearBins == False or uniqueCount == 1:
                groupedColumn = dataColumn.groupby(dataColumn)
                countedColumn = groupedColumn.size()
                countedColumnDict = dict(countedColumn)

                if num_cats: #get top n categories, sum rest as 'other categories'
                    countedColumn.sort_values(inplace=True)
                    top = dict(countedColumn[-num_cats:])
                    top['other categories'] = sum(countedColumn[:-num_cats])
                    countedColumnDict = top

                nodata_counts = len(dataFrame[columnName])-len(dataColumn)
                if nodata_counts>0:
                    countedColumnDict['no data'] = nodata_counts
                return countedColumnDict #categorical hist
            else: #linear bin hist
                minValue = np.amin(dataColumn)
                maxValue = np.amax(dataColumn)

                roundTo = int(round(np.log10(maxValue-minValue)) * -1) + 1
                binSize = 10**(-1 * roundTo)

                # protect against weird rounding issues by expanding range if needed
                rangeMin = round(math.floor(minValue),roundTo)
                if (minValue < rangeMin):
                    rangeMin = rangeMin - binSize

                rangeMax = round(math.ceil(maxValue),roundTo) + binSize
                if (maxValue > (rangeMax - binSize)):
                    rangeMax = rangeMax + binSize

                if binSize >= 1:
                    binSize = int(binSize)
                    rangeMin = int(rangeMin)
                    rangeMax = int(rangeMax)
                    bins = range(rangeMin,rangeMax,binSize)
                # need to use np.arange for floats, range for ints
                bins = np.arange(rangeMin,rangeMax,binSize)

                counts, binEdges = np.histogram(dataColumn,bins=bins)

                roundedCounts = {}
                for index, count in enumerate(counts):
                    # histogram labels should be ranges, not values
                    # or we need to store min / max bounds for each bin and pass that to the frontend somehow
                    histogramBinString = str(binEdges[index]) + ' - ' + str(binEdges[index + 1])
                    roundedCounts[histogramBinString] = count
                return roundedCounts
        else: #logbin hist
            dataColumn = dataColumn[dataColumn > 0]
            if len(dataColumn) == 0:
                return {}
            else:
                minValue = np.amin(dataColumn)
                minPowerFloor = math.floor(np.log10(minValue))
                maxValue = np.amax(dataColumn)
                maxPowerCeil = math.ceil(np.log10(maxValue))

                numBins = maxPowerCeil - minPowerFloor + 1
                if minPowerFloor == maxPowerCeil:
                    maxPowerCeil = maxPowerCeil + 1
                logBins = np.logspace(minPowerFloor,maxPowerCeil,num=numBins)

                counts, binEdges = np.histogram(dataColumn,bins=logBins)

                logBinnedCounts = {}
                for index, count in enumerate(counts):
                    # histogram labels should be ranges, not values
                    # or we need to store min / max bounds for each bin and pass that to the frontend somehow
                    histogramBinString = '10^' + str(int(index + minPowerFloor)) + ' - ' + '10^' + str(int(index + 1 + minPowerFloor))
                    # not sure whether I like the scientific notation strings more than this or not:
                    # histogramBinString = str(int(binEdges[index])) + '-' + str(int(binEdges[index + 1]))
                    logBinnedCounts[histogramBinString] = count
                return logBinnedCounts

def sumColumn(queryObject,columnName):
    columnQueryObject = queryObject.with_entities(
        getattr(Dataset,columnName)
    )
    dataFrame = pd.read_sql(columnQueryObject.statement,db.session.bind)
    total = sum(dataFrame[columnName].dropna())
    return total

def checkpoint(start, n, message=''):
    checkpoint = time.time()
    print 'checkpoint ' + str(n) + ' - ' + message + ':'
    print str(checkpoint - start) + ' since start'
    return n + 1

def summarizeDatasets(queryObject):
    # queryObject is a filtered (including all "where's") Dataset.query object
    start = time.time()
    print queryObject

    # this is the count of records that match all of the current where's
    # this is the first thing that will be returned to the front-end in the
    # POST to /datasets/search/summary
    total = queryObject.count()
    n = checkpoint(start,1,'have the total')

    # 3 categories of tasks: above fold, on screen, off screen - we are going to kick off
    # separate queries for each category, summarize them (ideally mostly inside SQL), then return
    # each item over the socket

    # Above the fold summary calculations -
    aboveFoldDataFrame = getSampledColumns(queryObject,['download_size_maxrun','env_package','investigation_type','download_size_maxrun'],sampleRate=0.001)
    total_download_size = sum(aboveFoldDataFrame['download_size_maxrun'].dropna())
    env_pkg_summary = summarizeColumn(aboveFoldDataFrame,'env_package', num_cats=15)
    investigation_summary = summarizeColumn(aboveFoldDataFrame,'investigation_type', num_cats=15)
    down_size_summary = summarizeColumn(aboveFoldDataFrame,'download_size_maxrun',logBins=True)
    n = checkpoint(start,n,'above the fold done')

    # On screen summary calculations -
    onScreenDataFrame = getSampledColumns(queryObject,['meta_latitude','meta_longitude','library_construction_method','library_strategy','env_biome','avg_read_length_maxrun'],sampleRate=0.001)
    lib_construction_method_summary = summarizeColumn(onScreenDataFrame,'library_construction_method')
    lib_strategy_summary = summarizeColumn(onScreenDataFrame,'library_strategy', num_cats=20)
    env_biome_summary = summarizeColumn(onScreenDataFrame,'env_biome',num_cats=20)
    avg_read_length_summary = summarizeColumn(onScreenDataFrame,'avg_read_length_maxrun',linearBins=True)
    n = checkpoint(start,n,'on screen, non-map done')
    latlon  = onScreenDataFrame[['meta_latitude','meta_longitude']]
    latlon = latlon[pd.notnull(latlon['meta_latitude'])]
    latlon = latlon[pd.notnull(latlon['meta_longitude'])]
    minLat = np.amin(latlon['meta_latitude'])
    maxLat = np.amax(latlon['meta_latitude'])
    minLon = np.amin(latlon['meta_longitude'])
    maxLon = np.amax(latlon['meta_longitude'])
    if len(latlon) > 1:
        latlon_map = np.histogram2d(x=latlon['meta_longitude'],y=latlon['meta_latitude'],bins=[36,18], range=[[minLon, maxLon], [minLat, maxLat]])
    else:
        latlon_map = np.histogram2d(x=[],y=[],bins=[36,18], range=[[-180, 180], [-90, 90]])
    #define latlon map color bin info
    percentiles, countRanges, fillColors = getMapBins(latlon_map[0], num_bins=10)
    # range should be flexible to rules in DatasetSearchSummary
    # latlon_map[0] is the lonxlat (XxY) array of counts; latlon_map[1] is the nx/lon bin starts; map[2] ny/lat bin starts
    lonstepsize = (latlon_map[1][1]-latlon_map[1][0])/2
    latstepsize = (latlon_map[2][1]-latlon_map[2][0])/2
    maxMapCount = np.amax(latlon_map[0])
    map_data = []
    for lon_ix,lonbin in enumerate(latlon_map[0]):
        for lat_ix,latbin in enumerate(lonbin):
            #[latlon_map[2][ix]+latstepsize for ix,latbin in enumerate(latlon_map[0][0])]
            lat = latlon_map[2][lat_ix]+latstepsize
            lon = latlon_map[1][lon_ix]+lonstepsize
            value = latbin
            buffer=0.0001
            #left-bottom, left-top, right-top, right-bottom, left-bottom
            polygon = [[lon-lonstepsize+buffer,lat-latstepsize+buffer], [lon-lonstepsize+buffer,lat+latstepsize-buffer], [lon+lonstepsize-buffer,lat+latstepsize-buffer], [lon+lonstepsize-buffer,lat-latstepsize+buffer], [lon-lonstepsize,lat-latstepsize]]
            bin_ix = np.amax(np.argwhere(np.array(percentiles)<=sp.percentileofscore(latlon_map[0].flatten(), value)))
            fillColor = fillColors[bin_ix]

            map_data.append({"lat":lat,"lon":lon,"count":value,"polygon":polygon, "fillColor":fillColor})
    map_legend_info = {"ranges":countRanges, "fills":fillColors}
    n = checkpoint(start,n,'map done')

    # Off screen summary calculations -
    offScreenDataFrame = getSampledColumns(queryObject,['library_source','library_screening_strategy','study_type','sequencing_method','instrument_model','geo_loc_name','env_feature','env_material','gc_percent_maxrun','library_reads_sequenced_maxrun','total_num_bases_maxrun'],sampleRate=0.001)
    lib_source_summary = summarizeColumn(offScreenDataFrame,'library_source')
    lib_screening_strategy_summary = summarizeColumn(offScreenDataFrame,'library_screening_strategy', num_cats=20)
    study_type_summary = summarizeColumn(offScreenDataFrame,'study_type')
    sequencing_method_summary = summarizeColumn(offScreenDataFrame,'sequencing_method', num_cats=10)
    instrument_model_summary = summarizeColumn(offScreenDataFrame,'instrument_model',num_cats=15)
    geo_loc_name_summary = summarizeColumn(offScreenDataFrame,'geo_loc_name',num_cats=20)
    env_feature_summary = summarizeColumn(offScreenDataFrame,'env_feature',num_cats=20)
    env_material_summary = summarizeColumn(offScreenDataFrame,'env_material',num_cats=20)
    gc_percent_summary = summarizeColumn(offScreenDataFrame,'gc_percent_maxrun',linearBins=True)
    library_reads_sequenced_summary = summarizeColumn(offScreenDataFrame,'library_reads_sequenced_maxrun',logBins=True)
    total_bases_summary = summarizeColumn(offScreenDataFrame,'total_num_bases_maxrun',logBins=True)
    n = checkpoint(start,n,'off screen done')

    return {
        "summary": {
            "avg_read_length_summary":avg_read_length_summary,
            "download_size_summary":down_size_summary,
            "env_biome_summary":env_biome_summary,
            "env_feature_summary":env_feature_summary,
            "env_material_summary":env_material_summary,
            "env_package_summary":env_pkg_summary,
            "gc_percent_summary":gc_percent_summary,
            "geo_loc_name_summary":geo_loc_name_summary,
            "investigation_type_summary":investigation_summary,
            "instrument_model_summary":instrument_model_summary,
            "latlon_map":map_data,
            "map_legend_info":map_legend_info,
            "library_construction_method_summary":lib_construction_method_summary,
            "library_reads_sequenced_summary":library_reads_sequenced_summary,
            "library_screening_strategy_summary":lib_screening_strategy_summary,
            "library_source_summary":lib_source_summary,
            "library_strategy_summary":lib_strategy_summary,
            "sequencing_method_summary":sequencing_method_summary,
            "study_type_summary":study_type_summary,
            "total_bases_summary":total_bases_summary,
            "total_datasets":int(total),
            "total_download_size":int(total_download_size)
            }
        }
