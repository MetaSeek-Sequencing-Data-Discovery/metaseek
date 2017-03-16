#this script takes a file of uid names,
#splits it up into batches of 500 (the max num of uids to query with the api at one time),
#and scrapes the metadata for each uid in the batch, in parallel.
#note I've run into some memory issues, may need to do not in parallel in future (should be okay for db updates since usually won't have >500 to scrape daily)
#saves scraping output to csv file. --change to write directly to db

import Genbank_lowapi_parallel as gp
from datetime import datetime
import pandas as pd
import multiprocessing

with open('uids_to_scrape.csv','rb') as f:
    line = f.readlines()
f.close()
uid_list = line[0].strip().split(',')
uid_list = [x[1:-1] for x in uid_list]

#add manual list from previous error log
addon = ['6129589','5577943','4103897','3391897','5446968','5762709','5446362','5446906','5415085','6323377','5198564','4995751','4613837','3494851','6308847','3576263','3019109']
uid_list.extend(addon)
print 'length of uid_list: %s' % len(uid_list)

starts = range(0,len(uid_list),500)
ends = range(500,len(uid_list),500)
ends.append(len(uid_list))
rets = [list(a) for a in zip(starts, ends)]
#make list of lists, each list is 500 uids
new_uid_list = [uid_list[rets[k][0]:rets[k][1]] for k,ret in enumerate(rets)]
print 'length uid list batches: %s' % len(new_uid_list)

start_time = datetime.now()

metadata_df = pd.DataFrame()
errors_df = pd.DataFrame()

#record date and time got the uidlist
date_scraped = datetime.now().strftime("%Y-%m-%d_%H:%M")

num_processes = 36 #this is the number of cores on a killdevil machine
print "running script with %s processes" % num_processes

pool = multiprocessing.Pool(num_processes)

imap_result = pool.imap_unordered(gp.get_all_the_metadata, new_uid_list)
for result in imap_result:
    print "processing results..."
    result_process = datetime.now()
    bdict_result = result[0]
    edict_result = result[1]
    #convert outputs to dataframes and save as csv
    metadata_df = metadata_df.append(pd.DataFrame.from_dict(bdict_result,orient='index'))
    errors_df = errors_df.append(pd.DataFrame.from_dict(edict_result,orient='index'))
    print "THIS RESULT PROCESSED in %s" % (datetime.now()-result_process)

print "script took this long to run (parallel): %s" % (datetime.now()-start_time)

#add metaseek_date_scraped column to all of metadata_df
metadata_df['metaseek_date_scraped'] = date_scraped

print "saving metadata to disk... METADATA_Genbank_update_"+datetime.now().strftime("%Y-%m-%d_%H:%M")+".csv"
metadata_df.to_csv("METADATA_Genbank_update_"+datetime.now().strftime("%Y-%m-%d_%H-%M")+".csv",encoding='utf-8')

print "saving error log to disk... ERRORLOG_Genbank_lowapi_parallel.csv"
errors_df.to_csv("ERRORLOG_Genbank_update"+datetime.now().strftime("%Y-%m-%d_%H-%M")+".csv",encoding='utf-8')
