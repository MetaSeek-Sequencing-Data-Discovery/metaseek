# Using the MetaSeek Api


## How to use filter parameters in your MetaSeek post request
MetaSeek allows you to filter any field in the MetaSeek database in any of 11 ways, called rule types.

The 11 rule types are:
| rule type key |    filter type    |    example    
------------------------------------------------------------------------------------------------------------------
|       0       |    is equal to    | find datasets with the exact value 'genomic' in the field 'library_source'
------------------------------------------------------------------------------------------------------------------
|       1       |   is less than    | find datasets with an 'average_read_length' below 300bp
------------------------------------------------------------------------------------------------------------------
|       2       |  is greater than  | find datasets from 'metaseek_latitude' above 60 degrees N


## Getting matching IDs from a saved discovery
(DownloadDiscoveryIds) - note this saves a csv, doesn't return json

## Getting matching metadata from a saved discovery
(DownloadDiscovery) - note this saves a csv, doesn't return json

## Getting matching dataset IDs from filter parameters

## Examples using the API in Python

### find the MetaSeek IDs of datasets matching a set of filter parameters

provide the filter parameters value (as described above) with the key 'filter_params' to the post request

'''
import requests, json
post_data ={'filter_params' : '{"rules":[{"field":"investigation_type","type":5,"value":"bacteria_archaea"},{"field":"library_screening_strategy","type":8,"value":["PCR","RT-PCR"]}]}'}
post = requests.post('https://api.metaseek.cloud/datasets/search/ids', data=post_data)
result = json.loads(post.text) #the parsed result returned from the API.

#this result will be a dictionary with a list of the matching dataset MetaSeek UIDs, a count of the number of matching datasets, and the filter parameters that were used
print(result.keys())
matching_datasets = result['matching_dataset_ids']
'''

### find the full MetaSeek metadata of datasets matching a set of filter parameters

provide the filter parameters value (as described above) with the key 'filter_params' to the post request

'''
import requests, json
post_data ={'filter_params' : '{"rules":[{"field":"investigation_type","type":5,"value":"bacteria_archaea"},{"field":"library_screening_strategy","type":8,"value":["PCR","RT-PCR"]}]}'}
post = requests.post('https://api.metaseek.cloud/search/metadata', data=post_data)
result = json.loads(post.text) #the parsed result returned from the API.

#this result will be a dictionary with a count of the number of matching datasets ('count_matching_datasets'), the filter parameters that were used ('filter_params'), and a list of dataset metadata summaries ('datasets')
import pandas as pd
df = pd.DataFrame(result['datasets'])
df.head()
'''

### find the MetaSeek metadata for a list of MetaSeek IDs

You need to provide a list of metaseek ids with the key 'metaseek_ids' in your post request

'''
import requests, json
post_data = {'metaseek_ids': '[690, 691, 1041, 1108, 1586, 1910, 2345, 2635, 3096, 3674]'}
post = requests.post('https://api.metaseek.cloud/datasets/metadatafromids', data=post_data)
result = json.loads(post.text) #the parsed result returned from the API.
'''

## Examples using the API in R

coming soon!

## So you want to get a lot of metadata

You can only use the API to return 1000 or fewer metadata records at a time. If you'd like to get metadata for a filter that matches >1000 datasets, use the SearchDatasetIds call to get a list of matching dataset ids, and call MetadataFromIds in a for loop using batches of 1000 ids.

An example in python:

'''
#get a list of IDs that match our filter parameters
import requests, json
post_data = {'filter_params': '{"rules":[{"field":"library_source","type":5,"value":"metatranscriptomic"}]}'}
post_ids = requests.post('https://api.metaseek.cloud/datasets/search/ids', data=post_data)
result = json.loads(post_ids.text) #the parsed result returned from the API.
matching_ids = result['matching_dataset_ids'] #a list of metaseek ids that match the filter parameters
print(len(matching_ids), " matching ids")

#loop through batches of 1000 IDs and query for full metadata for each batch
def get_batches(uid_list, batch_size):
    starts = list(range(0,len(uid_list),batch_size))
    ends = list(range(batch_size,len(uid_list),batch_size))
    ends.append(len(uid_list))
    batches = [list(a) for a in zip(starts, ends)]
    return batches

batch_indexes = get_batches(matching_ids, batch_size=1000)

import pandas as pd
df = pd.DataFrame()
for batch in batch_indexes:
  batch_id_list = matching_ids[batch[0]:batch[1]]
  post_data = {'metaseek_ids':str(batch_id_list)}
  print('getting metadata for batch ', batch)
  post_metadata = requests.post('https://api.metaseek.cloud/datasets/metadatafromids', data=post_data)
  result = json.loads(post_metadata.text)
  df = df.append(result['datasets'], ignore_index=True)
df.head()
'''
