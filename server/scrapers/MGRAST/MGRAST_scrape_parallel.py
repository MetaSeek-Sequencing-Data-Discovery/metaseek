#import packages
import urllib, pandas as pd
import json
import traceback
from datetime import datetime
import multiprocessing

#find out total count of metagenomes to scrape metadata for - on 02/06/17 this is 27882
g = urllib.urlopen('http://api.metagenomics.anl.gov/metagenome?limit=10')
find_count = json.loads(g.read())
g.close()
total_count = find_count['total_count']

print 'number of metagenomes in MGRAST: %s' % total_count
num_queries = 1+int(total_count)/1000 #number of queries to do, with shifting offset (b/c max query is 1000 ids)
offset_list = [i*1000 for i in range(num_queries)]
print 'offsets to use: %s' % offset_list

#get list of all the mgms in MGRAST to scrape metadata for
mgm_list = []
for offset in offset_list:
    f = urllib.urlopen('http://api.metagenomics.anl.gov/metagenome?limit=1000&offset='+str(offset))
    mgm_json = json.loads(f.read())
    f.close()
    mgms = [i['id'] for i in mgm_json['data']]
    print "appending %s accessions" % len(mgms)
    #add mgms to list of accessions
    for id in mgms:
        mgm_list.append(id)

print "length of mgm_list: %s" % len(mgm_list)


######## define function to get general metadata #######
def get_metadata(mgm):
    metadata_url = 'http://api.metagenomics.anl.gov/metadata/export/'+str(mgm)

    m = urllib.urlopen(metadata_url)
    metadata_json = json.loads(m.read())
    m.close()

    metadata_dict = {}
    metadata_dict['mgrast_metagenome_url'] = 'http://metagenomics.anl.gov/mgmain.html?mgpage=overview&metagenome='+str(mgm)

    #for each metadata_json, there are 'parent' categories for which to scrape data: sample, env_package, project, mixs, and library; but sometimes fewer
    parents = metadata_json.keys()
    for parent in parents:
        if parent == 'library':
            metadata_dict['mgrast_library_type'] = metadata_json[parent]['type']

        if parent != 'mixs':
            pid = metadata_json[parent]['id']
            metadata_dict['mgrast_'+str(parent)+'_id'] = pid
            for key in metadata_json[parent]['data'].keys():
                new_key = 'mgrast_'+str(key)
                value = metadata_json[parent]['data'][key]
                metadata_dict[new_key] = value
            if parent != 'env_package':
                metadata_dict['mgrast_'+str(parent)+'_url'] = 'http://metagenomics.anl.gov/mgmain.html?mgpage='+str(parent)+'&'+str(parent)+'='+str(pid)

        if parent == 'mixs':
            for key in metadata_json[parent].keys():
                new_key = 'mgrast_'+str(key)
                value = metadata_json[parent][key]
                metadata_dict[new_key] = value

    return metadata_dict


######## define function to get download metadata ######
def get_download_metadata(mgm):
    download_url = 'http://api.metagenomics.anl.gov/download/'+str(mgm)+'?stage=upload'

    d = urllib.urlopen(download_url)
    download_json = json.loads(d.read())
    d.close()

    download_dict = {}
    download_dict['mgrast_download_link'] = 'http://metagenomics.anl.gov/mgmain.html?mgpage=download&metagenome='+str(mgm)

    #I only really care about a few things; scrape those
    download_dict['mgrast_file_size'] = download_json['data'][0]['file_size']
    download_dict['mgrast_avg_gc_content'] = download_json['data'][0]['statistics']['average_gc_content']
    download_dict['mgrast_bp_count'] = download_json['data'][0]['statistics']['bp_count']
    download_dict['mgrast_read_count'] = download_json['data'][0]['statistics']['sequence_count']
    download_dict['mgrast_avg_read_length'] = download_json['data'][0]['statistics']['average_length']

    return download_dict

def get_all_the_metadata(mgm):  #,meta_dict,err_dict
    try:
        print "currently processing metagenome %s " % mgm

        dict_metadata = {}

        dict_metadata['mgrast_mgm_id'] = mgm
        #scrape general metadata
        metadata_result = get_metadata(mgm)
        dict_metadata.update(metadata_result)
        #scrape download metadata
        download_result = get_download_metadata(mgm)
        dict_metadata.update(download_result)

        #return dict_metadata and empty error
        error_fine={}
        return dict_metadata,error_fine

    #if there's any kind of error, log it to errors dataframe to deal with later
    except Exception, e:
        print "--there was an error in %s, saving to error log" % mgm
        error = {}
        error['mgm'] = mgm
        error['error_message'] = e
        error['trace'] = traceback.format_exc()

        #return empty dict_metadata and error dict
        none_dict={}
        return none_dict,error


metadata_df = pd.DataFrame()
errors_df = pd.DataFrame()

starttime = datetime.now()
num_cores = 12 #this is the number of cores on a killdevil machine
print "running script on %s cores" % num_cores
pool = multiprocessing.Pool(num_cores)

for result in pool.imap(get_all_the_metadata, mgm_list):
    metadata_rows = result[0]
    error_rows = result[1]

    if len(metadata_rows)>0:
        metadata_df = metadata_df.append(metadata_rows,ignore_index=True)
    if len(error_rows)>0:
        errors_df = errors_df.append(error_rows,ignore_index=True)

print "parallel script took this long to run: %s" % (datetime.now()-starttime)

print "saving metadata to disk... METADATA_MGRAST_parallel.csv"
metadata_df.to_csv("METADATA_MGRAST_parallel.csv",encoding='utf-8')

print "saving error log... ERRORLOG_MGRAST_parallel.csv"
errors_df.to_csv("ERRORLOG_MGRAST_parallel.csv",encoding='utf-8')
