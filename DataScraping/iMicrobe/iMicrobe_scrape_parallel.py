import urllib, pandas as pd
import json
import traceback
from datetime import datetime
import multiprocessing
import time

#sample names are integers, 1 to 5171 on 02/11/17; find out the largest sample no. and make list samples to get metadata for
g = urllib.urlopen('http://data.imicrobe.us/sample/list.json')
find_count = json.loads(g.read())
g.close()

sample_list = range(1,int(find_count[-1]['sample_id'])+1)

#only one page to scrape metadata for for iMicrobe.
def get_imicrobe_metadata(sample):
    try:
        print "currently processing iMicrobe ID %s - " % sample
        sample_url = 'http://data.imicrobe.us/sample/view/'+str(sample)+'.json'
        s = urllib.urlopen(sample_url)
        sample_json = json.loads(s.read())
        s.close()
        #each url has two categories want to scrape info from: attributes, and sample
        sample_dict = {}
        sample_dict['iMicrobe_url'] = sample_url
        #get the attributes
        print sample_json.keys()
        print sample_json
        for item in sample_json['attributes']:
            sample_dict['iMicrobe_'+item['type']] = item['value']
        #get the sample
        for key in sample_json['sample'].keys():
            new_key = 'iMicrobe_'+key
            value = sample_json['sample'][key]
            sample_dict[new_key] = value

        error_fine = {}

        return sample_dict, error_fine

    except Exception, e:
        print "--there was an error in %s, saving to error log" % sample
        error = {}
        error['imicrobe_sample_id'] = sample
        error['error_message'] = e
        error['trace'] = traceback.format_exc()
        #return empty dict_metadata and error dict
        none_dict={}
        return none_dict,error


metadata_df = pd.DataFrame()
errors_df = pd.DataFrame()

starttime = datetime.now()
num_cores = 4 #this is the number of cores on a killdevil machine
print "running script on %s cores" % num_cores
pool = multiprocessing.Pool(num_cores)

for result in pool.imap(get_imicrobe_metadata, sample_list[0:1000]):
    metadata_rows = result[0]
    error_rows = result[1]

    if len(metadata_rows)>0:
        metadata_df = metadata_df.append(metadata_rows,ignore_index=True)
    if len(error_rows)>0:
        errors_df = errors_df.append(error_rows,ignore_index=True)

    time.sleep(0.5)

print "parallel script took this long to run: %s" % (datetime.now()-starttime)

print "saving metadata to disk... METADATA_iMicrobe_parallel.csv"
metadata_df.to_csv("METADATA_iMicrobe_parallel.csv",encoding='utf-8')

print "saving error log... ERRORLOG_iMicrobe_parallel.csv"
errors_df.to_csv("ERRORLOG_iMicrobe_parallel.csv",encoding='utf-8')
