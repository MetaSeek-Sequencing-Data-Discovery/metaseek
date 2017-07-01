from app import db
import math
import numpy as np
import pandas as pd
from models import *
from datetime import datetime
from decimal import Decimal
from collections import Counter

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
        queryObject = queryObject.filter(fieldattr.like('%' + value + '%'))
    elif ruletype == 8:
        queryObject = queryObject.filter(fieldattr.in_(value))
    elif ruletype == 9:
        queryObject = queryObject.filter(~fieldattr.in_(value))
    elif ruletype == 10:
        queryObject = queryObject.filter(fieldattr != None)

    return queryObject

def summarizeColumn(dataFrame,columnName,linearBins=False,logBins=False):
    dataColumn = dataFrame[columnName].dropna()
    if len(dataColumn.unique()) == 0:
        return {'NULL':len(dataFrame.index)}
    else:
        groupedColumn = dataColumn.groupby(dataColumn)
        countedColumn = groupedColumn.size()
        countedColumnDict = dict(countedColumn)
        if logBins == False:
            if linearBins == False:
                return countedColumnDict
            else:
                minValue = np.amin(dataColumn)
                maxValue = np.amax(dataColumn)
                roundTo = int(round(np.log10(maxValue-minValue)) * -1) + 1

                binSize = 10**(-1 * roundTo)
                rangeMin = round(np.amin(dataColumn),roundTo)
                rangeMax = round(np.amax(dataColumn),roundTo) + binSize * 2

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
                    histogramBinString = str(binEdges[index]) + '-' + str(binEdges[index + 1])
                    roundedCounts[histogramBinString] = count
                return roundedCounts
        else:
            minValue = np.amin(dataColumn)
            minPowerFloor = math.floor(np.log10(minValue))
            maxValue = np.amax(dataColumn)
            maxPowerCeil = math.ceil(np.log10(maxValue))

            numBins = maxPowerCeil - minPowerFloor + 1
            logBins = np.logspace(minPowerFloor,maxPowerCeil,num=numBins)

            counts, binEdges = np.histogram(dataColumn,bins=logBins)

            logBinnedCounts = {}
            for index, count in enumerate(counts):
                # histogram labels should be ranges, not values
                # or we need to store min / max bounds for each bin and pass that to the frontend somehow
                histogramBinString = '10^' + str(int(index + minPowerFloor)) + '-' + '10^' + str(int(index + 1 + minPowerFloor))
                # not sure whether I like the scientific notation strings more than this or not:
                # histogramBinString = str(int(binEdges[index])) + '-' + str(int(binEdges[index + 1]))
                logBinnedCounts[histogramBinString] = count
            return logBinnedCounts

def summarizeDatasets(queryObject):
    queryResultDataframe = pd.read_sql(queryObject.statement,db.session.bind)
    total = len(queryResultDataframe.index)
    if total > 0:
        # Simple aggregate responses
        total_download_size = sum(queryResultDataframe['download_size_maxrun'].dropna())
        # add more here . . .

        # Simple count histogram responses
        investigation_summary = summarizeColumn(queryResultDataframe,'investigation_type')
        lib_source_summary = summarizeColumn(queryResultDataframe,'library_source')
        env_pkg_summary = summarizeColumn(queryResultDataframe,'env_package')
        # add more here . . .

        # Linear binned histogram responses
        avg_read_length_maxrun_bins = summarizeColumn(queryResultDataframe,'avg_read_length_maxrun',linearBins=True)
        gc_percent_maxrun_bins = summarizeColumn(queryResultDataframe,'gc_percent_maxrun',linearBins=True)
        # add more here . . .

        # Log binned histogram responses
        library_reads_sequenced_maxrun_bins = summarizeColumn(queryResultDataframe,'library_reads_sequenced_maxrun',logBins=True)
        total_bases_bins = summarizeColumn(queryResultDataframe,'total_num_bases_maxrun',logBins=True)
        down_size_bins = summarizeColumn(queryResultDataframe,'download_size_maxrun',logBins=True)
        # add more here . . .

        # Complex / one-off responses

        # Collection date summarizing is broken because column is no longer a datettime

        # collection_date - keep just year for summary for now (might want month for e.g. season searches later on, but default date is 03-13 00:00:00 and need to deal with that)
        # Would really like to fill in empty values here, histogram of years without empty years is a bit odd
        # yearFrame = queryResultDataframe['collection_date'].dt.to_period("A")
        # year_summary = queryResultDataframe.groupby(yearFrame).size()
        # year_summary.index = year_summary.index.to_series().astype(str)
        # year_summary = dict(year_summary)

        # Lat summary is broken because lat is now a string

        # lat_summary = dict(queryResultDataframe.groupby('latitude').size())
        # lat_bins = Counter()
        # for k,v in lat_summary.items(): #is there a way to do this that doesn't loop through each returned value?
        #     if not k:
        #         next
        #     else:
        #         lat_bins[round(k,0)] += v

        # Lon summary is broken because lon is now a string

        # lon_summary = dict(queryResultDataframe.groupby('longitude').size())
        # lon_bins = Counter()
        # for k,v in lon_summary.items(): #is there a way to do this that doesn't loop through each returned value?
        #     if not k:
        #         next
        #     else:
        #         lon_bins[round(k,0)] += v

        # Map summary is broken because lat / lon are both strings

        #latlon  = queryResultDataframe[['latitude','longitude']]
        #latlon = latlon[pd.notnull(latlon['latitude'])]
        #latlon = latlon[pd.notnull(latlon['longitude'])]
        #latlon_map = np.histogram2d(x=latlon['longitude'],y=latlon['latitude'],bins=[36,18], range=[[-180, 180], [-90, 90]]) #range should be flexible to rules in DatasetSearchSummary
        #latlon_map[0] is the lonxlat (XxY) array of counts; latlon_map[1] is the nx/lon bin starts; map[2] ny/lat bin starts
        #lonstepsize = (latlon_map[1][1]-latlon_map[1][0])/2
        #latstepsize = (latlon_map[2][1]-latlon_map[2][0])/2
        #map_data = []
        #for lon_ix,lonbin in enumerate(latlon_map[0]):
        #    for lat_ix,latbin in enumerate(lonbin):
        #        #[latlon_map[2][ix]+latstepsize for ix,latbin in enumerate(latlon_map[0][0])]
        #        lat = latlon_map[2][lat_ix]+latstepsize
        #        lon = latlon_map[1][lon_ix]+lonstepsize
        #        value = latbin
        #        map_data.append({"lat":lat,"lon":lon,"count":value})

        return {
            "summary":{ # to do change key names, to align with new field names (eg. total_reads vs. library_reads_sequenced)
                "totalDatasets":int(total),
                "totalDownloadSize":int(total_download_size),
                "investigation_type_summary":investigation_summary,
                "library_source_summary":lib_source_summary,
                "env_package_summary":env_pkg_summary,
                "avg_read_length_summary":avg_read_length_maxrun_bins,
                "total_reads_summary":library_reads_sequenced_maxrun_bins,
                "total_bases_summary":total_bases_bins,
                "download_size_summary":down_size_bins,
                "avg_percent_gc_summary":gc_percent_maxrun_bins,
                #"year_collected_summary":year_summary,
                #"latitude_summary":lat_bins,
                #"longitude_summary":lon_bins,
                #"latlon_map":map_data
                }
            }
    else:
        return {
            "summary":{
                "totalDatasets":0,
                "totalDownloadSize":0,
                "investigation_type_summary":{},
                "library_source_summary":{},
                "env_package_summary":{},
                "year_collected_summary":{},
                "latitude_summary":{},
                "longitude_summary":{},
                "avg_read_length_summary":{},
                "total_reads_summary":{},
                "total_bases_summary":{},
                "download_size_summary":{},
                "avg_percent_gc_summary":{},
                "latlon_map":{},
                "empty":1
                }
            }
