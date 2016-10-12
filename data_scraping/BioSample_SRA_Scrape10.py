
# coding: utf-8

# In[1]:

import urllib, pandas as pd, re
from bs4 import BeautifulSoup


# # Get a list of Biosample UIDs to scrape data for
#
# ### For now, only going to look for MIMS environmental metagenomes that correspond to sediment, soil, or water (prokaryotic only)
#
# see [this link](https://submit.ncbi.nlm.nih.gov/biosample/template/) for other biosample types and attributes
#
# note -- at experiment accession page, can see results in xml form and there's a lot more info in it. maybe revisit later
# e.g. see https://www.ncbi.nlm.nih.gov/sra/SRX2177857[accn]?report=FullXML

# In[42]:

#remember to change retmax to 100,000
f = urllib.urlopen('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=biosample&term=MIMS+AND+sediment+OR+MIMS+AND+soil+OR+MIMS+AND+sediment&retmax=100000')
biosample_id_html = BeautifulSoup(f, 'html.parser')
f.close()

ids = biosample_id_html.find_all('id')
id_list = []
for item in ids:
    id_list.append(item.string)
print id_list[0:10]
print "number of biosamples found: %s" % len(id_list)
if len(id_list)>10e5:
    print "there may be more UIDs to retrieve; adjust retstart and retmax"

id_list_10 = id_list[300:310]+id_list[100:104]
print id_list_10


# # Extract metadata
#
# ## Start with biosample data
#
# But first, check whether there is an experimental sra accession corresponding with it - if there isn't, skip this uid; if there's more than one, loop through each one and gather srx and biosample metadata for each; if there's exactly one, go ahead and gather srx and biosample metadata for it
#
# if data in a certain field doesn't exist, field should be left blank

# ### first define some functions:
#    * get_biosample_metadata scrapes metadata from the biosample page
#    * get_srx_metadata scrapes metadata from the srx accession page

# In[4]:

#define function to scrape biosample metadata, given biosample id from html list and dict to insert results into

def get_biosample_metadata(url,dict):
    b = urllib.urlopen(url)
    biosample_page = BeautifulSoup(b,'html.parser')
    b.close()

    uid = biosample_page.find('dl',{'class':'rprtid'})
    biosample_uid = uid.dd.string
    dict["biosample_uid"] = biosample_uid

    biosample_link = "https://www.ncbi.nlm.nih.gov/biosample/"+id
    dict["biosample_link"] = biosample_link

    biosample_title = biosample_page.find_all('h2',{'class':'title'})[0].string
    dict["biosample_title"] = biosample_title

    identifiers = biosample_page.find(text=re.compile('Sample name:')).split(';')
    sample_name = [s for s in identifiers if "Sample name" in s][0].split(':')[1]
    dict["sample_name"] = sample_name

    docsum = biosample_page.find('div',{'class':'docsum'})
    organism = docsum.find('dt',text="Organism").next_sibling.a.get_text()
    environmental_package = docsum.find('dt',text="Package").next_sibling.a.get_text()
    dict["organism"] = organism
    dict["environmental_package"] = environmental_package

    attribute_table = docsum.find('dt',text='Attributes').next_sibling.find_all('tr')
    for row in range(0,len(attribute_table)):
        key = attribute_table[row].th.string
        value = attribute_table[row].td.string
        dict[key] = value

    description = docsum.find('dt',text="Description").next_sibling.get_text()
    dict["description"] = description

    bioproject = docsum.find('dt',text="BioProject").next_sibling.a
    bioproject_link = list(["https://www.ncbi.nlm.nih.gov"+bioproject.get('href')])
    bioproject_id = list([bioproject.string])
    dict["bioproject_link"] = bioproject_link
    dict["bioproject_id"] = bioproject_id

    submission = docsum.find('dt',text="Submission").next_sibling.string
    dict["submission"] = submission


# In[5]:

def get_srx_metadata(url,dict):
    x = urllib.urlopen(url)
    srx_page_new = BeautifulSoup(x,'html.parser')
    x.close()

    #add experiment accession id and url info
    srx_id = srx_page_new.find('b').a.get_text()
    dict["experiment_id"] = srx_id

    srx_link = "https://www.ncbi.nlm.nih.gov"+srx_page_new.find('b').a.get('href')+"?report=Full"
    dict["experiment_link"] = srx_link

    #add experimental design info
    descriptor = srx_page_new.find_all('div',{'class':"sra-full-data"})
    for text in range(0,len(descriptor)):
        if "Design" in descriptor[text].get_text():
            key = descriptor[text].get_text().split(':')[0]
            value = descriptor[text].get_text().split(':')[1]
            dict[key] = value

    #add library info (details about sequencing technology, approach, etc)
    library_table = srx_page_new.find('div',{'class':'expand showed sra-full-data'}).find('div',{'class':'expand-body'})

    for field in range(0,len(library_table.find_all('div'))):
        key = "experiment_"+library_table.find_all('div')[field].get_text().split(":")[0].lower()
        value = library_table.find_all('div')[field].get_text().split(":")[1].lower()
        dict[key] = value

    #add sequence stats info from run table
    run_table = srx_page_new.find('table')
    #https://trace.ncbi.nlm.nih.gov/Traces/sra/?run=
    table_head = run_table.find('thead').find_all('th')
    table_rows = run_table.find('tbody').find_all('tr')

    for column in range(0,len(table_head)):
        key = table_head[column].get_text()
        values = []
        for row in range(0,len(table_rows)):
            table_body = table_rows[row].find_all('td')
            value = table_body[column].get_text()
            values.append(value)
        dict[key] = values

    #rename some dictionary keys to be more descriptive
    dict["run_id"] = dict.pop("Run")
    dict["no_of_runs"] = dict.pop("# of Spots")
    dict["no_of_bases"] = dict.pop("# of Bases")
    dict["date_sequences_published"] = dict.pop("Published")



# ### For each id in our id list, scrape biosample and SRX accession metadata and insert into dictionary as key:value pair for that id.
#
# #### Then append dictionary for that uid to metadata dataframe

# In[27]:

metadata = pd.DataFrame()

for id in id_list_10:
    print "currently processing biosample UID: %s" % id.string

    dict_metadata = {}

    #determine url to use to scrape biosample metadata
    biosample_search_term = "https://www.ncbi.nlm.nih.gov/biosample/?term="+id.string+"[uid]"

    ##check for srx accession corresponding to biosample uid
    sra_search_term = "https://www.ncbi.nlm.nih.gov/sra?LinkName=biosample_sra&from_uid="+id.string
    s = urllib.urlopen(sra_search_term)
    srx_page = BeautifulSoup(s,'html.parser')
    s.close()

    accessions = srx_page.find_all('dl',{'class':'rprtid'})

    if len(accessions)==0:     #srx accession doesn't exist, skip this biosample uid
        continue
    elif len(accessions)>1:    #if more than one item, means got to multiple accessions page; find each srx accession no and loop through each
        for accession in range(0,len(accessions)):
            #define url to srx accession to scrape metadata from
            srx_url = "https://www.ncbi.nlm.nih.gov/sra/"+accessions[accession].dd.string+"[accn]?report=Full"
            #scrape biosample metadata into dict
            get_biosample_metadata(url=biosample_search_term,dict=dict_metadata)
            #scrape srx additional metadata
            get_srx_metadata(url=srx_url,dict=dict_metadata)
            #write dict_metadata with metadata fields to pandas dataframe, with each row being a diff id
            dict_df = pd.DataFrame.from_dict(dict_metadata)
            metadata = metadata.append(dict_df,ignore_index=True)

    elif len(accessions)==1:
        #define url where srx accession is
        srx_url = "https://www.ncbi.nlm.nih.gov"+srx_page.find_all('b')[0].a.get('href')+"?report=Full"
        #scrape biosample metadata into dict
        get_biosample_metadata(url=biosample_search_term,dict=dict_metadata)
        #scrape srx additional metadata
        get_srx_metadata(url=srx_url,dict=dict_metadata)
        #write dict_metadata with metadata fields to pandas dataframe, with each row being a diff id
        dict_df = pd.DataFrame.from_dict(dict_metadata)
        metadata = metadata.append(dict_df,ignore_index=True)


# In[33]:

print metadata.head()


# In[34]:

#save metadata df to csv
metadata.to_csv("metadata_SRA10.csv")


# In[ ]:
