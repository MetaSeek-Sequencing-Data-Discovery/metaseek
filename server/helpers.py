from app import db
import numpy as np
import pandas as pd
from collections import Counter

# Utility functions
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
    if total == 0:
        return {
            "summary":{
                "totalDatasets":0,
                "totalDownloadSize":0,
                "library_strategy_summary":{},

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
    else:
        total_download_size = sum(queryResultDataframe["download_size"])

        investigation_summary = dict(queryResultDataframe.groupby('investigation_type').size())
        if '' in investigation_summary.keys():
            del investigation_summary['']

        lib_source_summary = dict(queryResultDataframe.groupby('library_source').size())
        if '' in lib_source_summary.keys():
            del lib_source_summary['']

        env_pkg_summary = dict(queryResultDataframe.groupby('env_package').size())
        if '' in env_pkg_summary.keys():
            del env_pkg_summary['']

        # collection_date - keep just year for summary for now (might want month for e.g. season searches later on, but default date is 03-13 00:00:00 and need to deal with that)
        # Would really like to fill in empty values here, histogram of years without empty years is a bit odd
        yearFrame = queryResultDataframe['collection_date'].dt.to_period("A")
        year_summary = queryResultDataframe.groupby(yearFrame).size()
        year_summary.index = year_summary.index.to_series().astype(str)
        year_summary = dict(year_summary)

        lat_summary = dict(queryResultDataframe.groupby('latitude').size())
        lat_bins = Counter()
        for k,v in lat_summary.items(): #is there a way to do this that doesn't loop through each returned value?
            if not k:
                next
            else:
                lat_bins[round(k,0)] += v

        lon_summary = dict(queryResultDataframe.groupby('longitude').size())
        lon_bins = Counter()
        for k,v in lon_summary.items(): #is there a way to do this that doesn't loop through each returned value?
            if not k:
                next
            else:
                lon_bins[round(k,0)] += v

        read_length_summary = dict(queryResultDataframe.groupby('avg_read_length').size())
        rd_lgth_bins = Counter()
        for k,v in read_length_summary.items(): #is there a way to do this that doesn't loop through each returned value?
            if not k:
                next
            else:
                rd_lgth_bins[round(k,-2)] += v

        total_rds_summary = dict(queryResultDataframe.groupby('total_num_reads').size())
        total_rds_bins = Counter()
        for k,v in total_rds_summary.items():
            if int(k)==0:
                total_rds_bins['0'] += v #lotsa zeros
            elif int(k)<1000: #if lower than 1000, count by hundreds
                total_rds_bins[round(k,-2)] += v
            elif int(k)<10000: #if lower than 10000, count by thousands
                total_rds_bins[round(k,-3)] += v
            elif int(k)<100000: #if between 10000-100,000, count by 10,000
                total_rds_bins[round(k,-4)] += v
            elif int(k)<1000000: #if between 100,000-1,000,000, count by 100,000
                total_rds_bins[round(k,-5)] += v
            elif int(k)<10000000: #if between 1,000,000-10,000,000, count by 1,000,000
                total_rds_bins[round(k,-6)] += v
            else:
                total_rds_bins[round(k,-7)] += v #above 10,000,000, count by 10M

        total_bases_summary = dict(queryResultDataframe.groupby('total_num_bases').size())
        total_bases_bins = Counter()
        for k,v in total_bases_summary.items():
            if int(k)==0:
                total_bases_bins['0'] += v
            elif int(k)<1000: #if lower than 1000, count by hundreds
                total_bases_bins[round(k,-2)] += v
            elif int(k)<10000: #if lower than 10000, count by thousands
                total_bases_bins[round(k,-3)] += v
            elif int(k)<100000: #if between 10000-100,000, count by 10,000
                total_bases_bins[round(k,-4)] += v
            elif int(k)<1000000: #if between 100,000-1,000,000, count by 100,000
                total_bases_bins[round(k,-5)] += v
            elif int(k)<10000000: #if between 1,000,000-10,000,000, count by 1,000,000
                total_bases_bins[round(k,-6)] += v
            elif int(k)<100000000: #if between 10,000,000-100,000,000, count by 10,000,000
                total_bases_bins[round(k,-7)] += v
            else:
                total_bases_bins[round(k,-8)] += v #above 100,000,000, count by 100M

        down_size_summary = dict(queryResultDataframe.groupby('download_size').size())
        down_size_bins = Counter()
        for k,v in down_size_summary.items():
            if int(k)==0:
                down_size_bins['0'] += v #lotsa zeros
            elif int(k)<1000000:
                down_size_bins['0.1'] += v #many are skewed, can create long tail bin
            elif int(k)<10000000:
                down_size_bins['1000000'] += v
            else:
                down_size_bins[round(k,-7)] += v #round every 10MB

        avg_gc_summary = dict(queryResultDataframe.groupby('avg_percent_gc').size())
        avg_gc_bins = Counter()
        for k,v in avg_gc_summary.items(): #is there a way to do this that doesn't loop through each returned value?
            if not k:
                next
            else:
                avg_gc_bins[round(k,2)] += v

        latlon  = queryResultDataframe[['latitude','longitude']]
        latlon = latlon[pd.notnull(latlon['latitude'])]
        latlon = latlon[pd.notnull(latlon['longitude'])]
        latlon_map = np.histogram2d(x=latlon['longitude'],y=latlon['latitude'],bins=[36,18], range=[[-180, 180], [-90, 90]]) #range should be flexible to rules in DatasetSearchSummary
        #latlon_map[0] is the lonxlat (XxY) array of counts; latlon_map[1] is the nx/lon bin starts; map[2] ny/lat bin starts
        lonstepsize = (latlon_map[1][1]-latlon_map[1][0])/2
        latstepsize = (latlon_map[2][1]-latlon_map[2][0])/2
        map_data = []
        for lon_ix,lonbin in enumerate(latlon_map[0]):
            for lat_ix,latbin in enumerate(lonbin):
                #[latlon_map[2][ix]+latstepsize for ix,latbin in enumerate(latlon_map[0][0])]
                lat = latlon_map[2][lat_ix]+latstepsize
                lon = latlon_map[1][lon_ix]+lonstepsize
                value = latbin
                map_data.append({"lat":lat,"lon":lon,"count":value})

        return {
            "summary":{
                "totalDatasets":int(total),
                "totalDownloadSize":int(total_download_size),
                "investigation_type_summary":investigation_summary,
                "library_source_summary":lib_source_summary,
                "env_package_summary":env_pkg_summary,
                "year_collected_summary":year_summary,
                "latitude_summary":lat_bins,
                "longitude_summary":lon_bins,
                "avg_read_length_summary":rd_lgth_bins,
                "total_reads_summary":total_rds_bins,
                "total_bases_summary":total_bases_bins,
                "download_size_summary":down_size_bins,
                "avg_percent_gc_summary":avg_gc_bins,
                "latlon_map":map_data
                }
            }
