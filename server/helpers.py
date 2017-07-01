from app import db
import math
import numpy as np
import pandas as pd
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

def summarizeColumn(dataFrame,columnName,roundTo=None,log=False):
    time_start = datetime.now()
    dataColumn = dataFrame[columnName].dropna()
    if len(dataColumn.unique()) == 0:
        return {'NULL':len(dataFrame.index)}
        print 'time to summarize empty column: %s' % (datetime.now()-time_start)
    else:
        groupedColumn = dataColumn.groupby(dataColumn)
        countedColumn = groupedColumn.size()
        countedColumnDict = dict(countedColumn)
        if log == False:
            if roundTo == None:
                print 'time to summarize simple column: %s' % (datetime.now()-time_start)
                return countedColumnDict
            else:
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
                print 'time to summarize hist bins: %s' % (datetime.now()-time_start)
                return roundedCounts
        else:
            minPower = round(math.log(np.amin(dataColumn),10))
            if minPower < 2:
                minPower = -1
            maxPower = round(math.log(np.amax(dataColumn),10)) + 1

            logBins = np.logspace(minPower,maxPower,num=11,endpoint=True)

            counts, binEdges = np.histogram(dataColumn,bins=logBins)

            logBinnedCounts = {}
            for index, count in enumerate(counts):
                # histogram labels should be ranges, not values
                # or we need to store min / max bounds for each bin and pass that to the frontend somehow
                histogramBinString = '%.2E' % Decimal(binEdges[index]) + '-' + '%.2E' % Decimal(binEdges[index + 1])
                # not sure whether I like the scientific notation strings more than this or not:
                # histogramBinString = str(binEdges[index]) + '-' + str(binEdges[index + 1])
                logBinnedCounts[histogramBinString] = count
            print 'time to summarize log bins: %s' % (datetime.now()-time_start)
            return logBinnedCounts


def get_hist_bins(queryObject,table_field):
    time_start = datetime.now()
    cat = np.array(queryObject.filter(table_field.isnot(None)).with_entities(table_field).all())
    hist, edges = np.histogram(cat,density=False)

    power = round(np.log10(edges[1]-edges[0]),0)*-1
    labels = [] #do you want center point or bounding values? if bounding, can skip this bit and return edges
    for x in range(0,len(edges)-1):
        lower_bound = round(edges[x],int(power)+1)
        step = round((edges[1]-edges[0])/2.0,int(power)+1)
        labels.append(lower_bound + step)

    print 'time to get hist bins: %s' % (datetime.now()-time_start)

    return hist, labels

def get_hist_log_bins(queryObject,table_field):
    time_start = datetime.now()
    cat = np.array(queryObject.filter(table_field.isnot(None)).with_entities(table_field).all())
    #adding one to the min in case there are zeros b/c log(0)=inf (shouldn't be generally, if there are will be counted in lowest bin)
    log_bins = np.logspace(round(np.log10(round(min(cat),0)+1),0), round(np.log10(max(cat)),0), (round(np.log10(round(max(cat),0)),0)-round(np.log10(round(min(cat),0)+1),0)+1))
    hist, edges = np.histogram(cat,bins=log_bins,density=False)
    print 'time to get hist bins: %s' % (datetime.now()-time_start)
    return hist, edges

def get_top_cat(queryObject, table_field, n, return_none_count=True): #maybe just do as cat and show top ten in browser?
    time_start = datetime.now()

    cat = np.array(queryObject.filter(table_field.isnot(None)).with_entities(table_field).all()) #doing .filter(table_field.isnot(None)) speeds up a lot if there are a lot of missing values, even if do return_none_count=True
    unique, counts = np.unique(cat, return_counts=True)
    cats = dict(zip(unique[counts.argsort()[-n:]],counts[counts.argsort()[-n:]]))
    cats['other_categories'] = sum(counts[counts.argsort()[0:-n]])
    if return_none_count:
        nones = queryObject.filter(table_field==None).count()
        cats['not_provided'] = nones
    print 'time to get top categories: %s' % (datetime.now()-time_start)
    return cats

def get_category_counts(queryObject, table_field, return_none_count=True):
    time_start = datetime.now()
    cat = np.array(queryObject.filter(table_field.isnot(None)).with_entities(table_field).all())
    unique, counts = np.unique(cat, return_counts=True)
    cat_dict = dict(zip(unique, counts))
    if return_none_count:
        nones = queryObject.filter(table_field==None).count()
        cat_dict['not_provided'] = nones
    print 'time to get categories: %s' % (datetime.now()-time_start)
    return cat_dict

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

        # Rounded binned histogram responses
        avg_read_length_maxrun_bins = summarizeColumn(queryResultDataframe,'avg_read_length_maxrun',roundTo=-2)
        gc_percent_maxrun_bins = summarizeColumn(queryResultDataframe,'gc_percent_maxrun',roundTo=2)
        # add more here . . .

        # Log binned histogram responses
        library_reads_sequenced_maxrun_bins = summarizeColumn(queryResultDataframe,'library_reads_sequenced_maxrun',log=True)
        total_bases_bins = summarizeColumn(queryResultDataframe,'total_num_bases_maxrun',log=True)
        down_size_bins = summarizeColumn(queryResultDataframe,'download_size_maxrun',log=True)
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
