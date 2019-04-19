- [Using the MetaSeek API](#using-the-metaseek-api)
- [MetaSeek API Calls](#metaseek-api-calls)
    + [**MetadataFromIds**](#--metadatafromids--)
    + [**SearchDatasetIds**](#--searchdatasetids--)
    + [**SearchDatasetMetadata**](#--searchdatasetmetadata--)
- [How to use filter parameters in your MetaSeek post request](#how-to-use-filter-parameters-in-your-metaseek-post-request)
- [Examples using the API](#examples-using-the-api)
  * [Using the API in Python](#using-the-api-in-python)
    + [SearchDatasetIds: find the MetaSeek IDs of datasets matching a set of filter parameters](#searchdatasetids--find-the-metaseek-ids-of-datasets-matching-a-set-of-filter-parameters)
    + [SearchDatasetMetadata: find the full MetaSeek metadata of datasets matching a set of filter parameters](#searchdatasetmetadata--find-the-full-metaseek-metadata-of-datasets-matching-a-set-of-filter-parameters)
    + [MetadataFromIds: find the MetaSeek metadata for a list of MetaSeek IDs](#metadatafromids--find-the-metaseek-metadata-for-a-list-of-metaseek-ids)
  * [Using the API in R](#using-the-api-in-r)
  * [So you want to get a lot of metadata](#so-you-want-to-get-a-lot-of-metadata)
  * [More metadata examples](#more-metadata-examples)

# Using the MetaSeek API

To incorporate MetaSeek queries into automated pipelines, do a complex query, or access metadata for many datasets, use the MetaSeek API.

The MetaSeek API allows users to query any field in the MetaSeek database, by any of 10 rule types.

See the [Glossary](https://www.metaseek.cloud/glossary) for definitions of each MetaSeek field, and the possible controlled vocabulary values for that field where applicable.


# MetaSeek API Calls

The MetaSeek API has the base URL `https://api.metaseek.cloud/`. For each of the API Calls below, append the path to this base URL. For example, to call SearchDatasetIds, you would use the full path `https://api.metaseek.cloud/datasets/search/ids`.

MetaSeek can be queried by submitting a post request to the following calls:

### **MetadataFromIds**
from a list of MetaSeek IDs, return the dataset metadata for each ID. Use path `/datasets/metadatafromids`

### **SearchDatasetIds**
from a set of filter parameters, returns a list of matching dataset IDs. Use path `/datasets/search/ids`

### **SearchDatasetMetadata**
from a set of filter parameters, returns the full metadata for matching IDs. Use path `/datasets/search/metadata`


# How to use filter parameters in your MetaSeek post request

MetaSeek allows you to filter any field in the MetaSeek database in any of 10 ways, called rule types.

To the post request, use the key value 'filter_params' with a value that looks like the examples given below. A dictionary with the key "rules", with the value a list of dictionaries with the desired filter rules. Each filter rule should have the values 'field', 'type', and 'value' - the MetaSeek field to be filtered, the rule type to use, and the value to filter on.

(note that in many languages, this dictionary should be provided as a string that can be parsed in json; see example API calls below)

The 10 rule types are:

| rule type key |          filter type          |            description                  |      example filter_params  
|:------|----------|----------|-------------|
| 1 | is less than | find datasets with an 'avg_read_length_maxrun' below 300bp | {"rules": [{"field":"avg_read_length_maxrun", "type":1, "value":300} ]}|
| 2 |is greater than| find datasets from 'metaseek_latitude' above 60 degrees N | {"rules": [{"field":"metaseek_latitude","type":2, "value":60} ]}
| 3 | is less than or equal to | find datasets with 'metaseek_longitude' of 20 degrees W or less | {"rules": [{"field":"metaseek_longitude","type":3, "value":-20} ]}|
| 4 | is greater than or equal to  | find datasets from 'metaseek_latitude' of 27 degrees S or greater | {"rules": [{"field":"metaseek_latitude","type":4, "value":-27} ]}
| 5 | is equal to | find datasets with the 'library_source' value 'genomic' | {"rules": [{"field":"library_source","type":5, "value":"genomic"} ]}
| 6 | is not equal to | find datasets from 'investigation_type' that are not 'eukaryote' | {"rules": [{"field":"investigation_type","type":5, "value":"eukaryote"} ]}
| 7 | contains the text | find datasets that contain the partial phrase 'illumina' or 'pyrosequencing' in 'sequencing_method' (matches e.g. 'illumina HiSeq' as well as 'illumina') | {"rules": [{"field":"sequencing_method", "type":7, "value":["illumina","pyrosequencing"]} ]}
| 8 | is equal to the keyword/s | find datasets that are equal to  'WGS' or 'RNA-Seq' in 'library_strategy' | {"rules": [{"field":"library_strategy","type":5, "value":["WGS", "RNA-Seq"]} ]}|
| 9 | is not equal to the keyword/s | find datasets not equal to 'PCR' or 'RT-PCR' in 'library_screening_strategy' | {"rules": [{"field":"library_screening_strategy","type":9, "value":["PCR", "RT-PCR"]} ]}|
| 10 | is not null | find datasets that are not empty in 'env_package' | {"rules": [{"field":"env_package","type":10, "value":""} ]}


If you want to use multiple filters, list these filter statements within the list of rules. This will find datasets that meet all of the filter rules - this is the SQL equivalent of multiple WHERE statements connected by an AND.
For example:
```
{"rules":[ {"field":"library_strategy","type":5, "value":["WGS", "RNA-Seq"]}, {"field":"library_source","type":5, "value":"genomic"} ]}
```


# Examples using the API

## Using the API in Python

### SearchDatasetIds: find the MetaSeek IDs of datasets matching a set of filter parameters

Post a request to the url `https://api.metaseek.cloud/datasets/search/ids`.

Provide the filter parameters value (as described above) with the key 'filter_params' to the post request.

```
import requests, json
post_data ={'filter_params' : '{"rules":[{"field":"investigation_type","type":5,"value":"bacteria_archaea"},{"field":"library_screening_strategy","type":8,"value":["PCR","RT-PCR"]}]}'}
post = requests.post('https://api.metaseek.cloud/datasets/search/ids', data=post_data)
result = json.loads(post.text) #the parsed result returned from the API.

#this result will be a dictionary with a list of the matching dataset MetaSeek UIDs, a count of the number of matching datasets, and the filter parameters that were used
print(result.keys())
matching_datasets = result['matching_dataset_ids']
```

### SearchDatasetMetadata: find the full MetaSeek metadata of datasets matching a set of filter parameters

Post a request to the url `https://api.metaseek.cloud/datasets/search/metadata`.

Provide the filter parameters value (as described above) with the key 'filter_params' to the post request.

```
import requests, json
post_data ={'filter_params' : '{"rules":[{"field":"investigation_type","type":5,"value":"bacteria_archaea"},{"field":"library_screening_strategy","type":8,"value":["PCR","RT-PCR"]}]}'}
post = requests.post('https://api.metaseek.cloud/search/metadata', data=post_data)
result = json.loads(post.text) #the parsed result returned from the API.

#this result will be a dictionary with a count of the number of matching datasets ('count_matching_datasets'), the filter parameters that were used ('filter_params'), and a list of dataset metadata summaries ('datasets')
import pandas as pd
df = pd.DataFrame(result['datasets'])
df.head()
```

### MetadataFromIds: find the MetaSeek metadata for a list of MetaSeek IDs

Post a request to the url `https://api.metaseek.cloud/datasets/metadatafromids`.

Provide the filter parameters value (as described above) with the key 'filter_params' to the post request.


Provide a list of metaseek ids with the key 'metaseek_ids' in your post request.

```
import requests, json
post_data = {'metaseek_ids': '[690, 691, 1041, 1108, 1586, 1910, 2345, 2635, 3096, 3674]'}
post = requests.post('https://api.metaseek.cloud/datasets/metadatafromids', data=post_data)
result = json.loads(post.text) #the parsed result returned from the API.
```

## Using the API in R

coming soon!


## So you want to get a lot of metadata

You can only use the API to return 1000 or fewer metadata records at a time. If you'd like to get metadata for a filter that matches >1000 datasets, use the SearchDatasetIds call to get a list of matching dataset ids, and call MetadataFromIds in a for loop using batches of 1000 ids.

An example in python:

```
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
```

## More metadata examples

### Filtering on a MetaSeek-predicted field and its confidence prediction

By default, if you filter on a MetaSeek-predicted field it will return predictions that have a P value of 0.9 or higher. This value can be adjusted explicitly, however. Below, we are searching for metaseek_investigation_type equal to 'metagenome', and uses a stricter P value cutoff, searching for datasets with a P value >= 0.95:

```
import requests, json
post_data = {'filter_params': '{"rules":[{"field":"metaseek_investigation_type","type":5,"value":"metagenome"},{"field":"metaseek_investigation_type_P","type":4,"value":0.95}]}'}
post_ids = requests.post('https://api.metaseek.cloud/datasets/search/ids', data=post_data)
result = json.loads(post_ids.text) #the parsed result returned from the API.
matching_ids = result['matching_dataset_ids'] #a list of metaseek ids that match the filter parameters
print(len(matching_ids), " matching ids")

```

### Free text search on the study title and abstract

Often, you may be looking for a type of dataset that is not well described by existing metadata fields, or that is best described by a metadata field that is rarely provided by submitters. In this case, it may be easiest to do a keyword search on the study abstract or study title, which are both free text provided by the submitter to describe the study.

If you filter on multiple fields at once in a MetaSeek API call, it will return datasets that meet BOTH of those filters (equivalent to a SQL AND operator). If you want to find datasets that match either of two filters, we suggest doing two API calls - one for each filter - and unifying to find the nonredundant matching IDs:

```
import requests, json
post_data = {'filter_params': '{"rules":[{"field":"study_abstract","type":7,"value":["hot spring","geothermal spring"]}]}'}
post_ids = requests.post('https://api.metaseek.cloud/datasets/search/ids', data=post_data)
result_abstract = json.loads(post_ids.text) #the parsed result returned from the API.
matching_ids = result_abstract['matching_dataset_ids'] #a list of metaseek ids that match the filter parameters
print(len(matching_ids), "matching ids in the study abstract")

post_data_ = {'filter_params': '{"rules":[{"field":"study_title","type":7,"value":["hot spring","geothermal spring"]}]}'}
post_ids = requests.post('https://api.metaseek.cloud/datasets/search/ids', data=post_data)
result_title = json.loads(post_ids.text) #the parsed result returned from the API.
matching_ids = result_title['matching_dataset_ids'] #a list of metaseek ids that match the filter parameters
print(len(matching_ids), "matching ids in the study title")

all_ids = result_abstract['matching_dataset_ids']+result_title['matching_dataset_ids']
merged_ids = list(set(all_ids))
print(len(merged_ids), "nonredundant ids")
```

### Filter on the author/institution fields

This example finds all the SRA datasets submitted by an organization name containing "JGI" or "Joint Genome Institute"

```
import requests, json
post_data = {'filter_params': '{"rules":[{"field":"organization_name","type":7,"value":["Joint Genome Institute","JGI"]}]}'}
post_ids = requests.post('https://api.metaseek.cloud/datasets/search/ids', data=post_data)
result = json.loads(post_ids.text) #the parsed result returned from the API.
matching_ids = result['matching_dataset_ids'] #a list of metaseek ids that match the filter parameters
print(len(matching_ids), "matching ids")
```
