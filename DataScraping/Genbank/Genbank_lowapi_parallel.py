import urllib, pandas as pd
from bs4 import BeautifulSoup
import traceback
import multiprocessing
from datetime import datetime


def get_retstart_list(url):
    #find out count of UIDs going to scrape
    g = urllib.urlopen(url)
    count_xml = BeautifulSoup(g,'xml')
    g.close()

    num_uids = count_xml.eSearchResult.Count.text
    print 'number of miXs-compliant UIDs in biosample: %s' % num_uids
    num_queries = 1+int(num_uids)/100000  #number of queries to do, with shifting retstart
    retstart_list = [i*100000 for i in range(num_queries)]
    print 'retstarts to use: %s' % retstart_list

    #destroy count_xml, we're done with it
    count_xml.decompose()
    return retstart_list

def get_uid_list(ret_list):
    #scrape UIDs into list
    uid_list = []
    for retstart in ret_list:
        f = urllib.urlopen('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=biosample&term=mims+OR+migs+OR+mimarks&tool=metaseq&email=adriennelhoarfrost%40gmail.com&retmax=100000&retstart='+str(retstart))
        uid_xml = BeautifulSoup(f,'xml')
        f.close()
        print "appending %s accessions" % len(uid_xml.findAll('Id'))
        #add uids to list of accessions
        for id in uid_xml.findAll('Id'):
            value = id.get_text()
            uid_list.append(value)

    #destroy uid tree b/c we're done with it
    uid_xml.decompose()
    print "length uid_list:",len(uid_list)

    return uid_list

def get_biosample_metadata(batch):
    url='https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=biosample&tool=metaseq&email=adriennelhoarfrost%40gmail.com&id='+str(batch)[1:-1]
    b = urllib.urlopen(url)
    biosample_xml = BeautifulSoup(b,'xml')
    b.close()

    biosamples = biosample_xml.find_all('BioSample')
    bdict = {}
    edict = {}

    for biosample in biosamples:
        bdict_id = biosample['id']
        biosample_dict = {}
        error_dict = {}
        try:
            biosample_link = "https://www.ncbi.nlm.nih.gov/biosample/"+str(bdict_id)
            biosample_dict['biosample_link'] = biosample_link
            biosample_dict['biosample_uid'] = bdict_id

            #There are 8 top tag groups. Have to scrape data a little different for each
            tag_list = ['Ids',
                        'Description',
                        'Owner',
                        'Models',
                        'Package',
                        'Attributes',
                        'Links',
                        'Status']
            ###Ids group - all the entries are 'Id' tag. Should be no recursivity###
            ids = biosample.Ids.find_all('Id')
            for ids_entry in ids:
                #insert all the db id entries
                if ids_entry.get('db') is not None:
                    biosample_dict[ids_entry.get('db').lower()+'_id'] = ids_entry.get_text()
                if ids_entry.get('db_label') is not None:
                    biosample_dict['biosample_'+ids_entry.get('db_label').replace(" ","_").lower()] = ids_entry.get_text()
            #doublecheck getting all the Id tags was sufficient. If not, print a warning
            if len(ids)==len(biosample.Ids.find_all(True,recursive=True)) is False:
                print "Ids group might have something other than all Id tags at same hierarchy. Check it out."

            ###Description group - contains up to Title, Organism, and Comment tags, sometimes with some descendants. get all the text recursively from each of these
            description = biosample.Description
            if description is not None:
                #find all the tags e.g. title, organism, etc.
                description_tags = description.find_all(True,recursive=False)
                dtag_names = [tag.name for tag in description_tags]
                for dtag in dtag_names:
                    biosample_dict[description.find(dtag,recursive=True).name.lower()] = description.find(dtag,recursive=True).get_text()

            ###Owner group - same as description group, contains some main tags, maybe with descendants###
            owner = biosample.Owner
            if owner is not None:
                owner_tags = owner.find_all(True,recursive=False)
                otag_names = [tag.name for tag in owner_tags]
                for otag in otag_names:
                    biosample_dict[owner.find(otag,recursive=True).name.lower()] = owner.find(otag,recursive=True).get_text()

            ###Models group -
            #this is pretty redundant with the Package group, can skip

            ###Package group - single level###
            package = biosample.Package
            if package is not None:
                biosample_dict[package.name.lower()] = package.get_text()

            ###Attributes group - a bunch of attributes all at same level
            attributes = biosample.Attributes
            if attributes is not None:
                for attribute in attributes.find_all('Attribute'):
                    biosample_dict[attribute['attribute_name'].lower()] = attribute.get_text()

            ###Links -
            links = biosample.Links
            if links is not None:
                for link in links.find_all('Link'):
                    try:
                        biosample_dict[link['target'].lower()+'_id'] = link['label']
                    except KeyError:
                        try:
                            if 'Gold Stamp ID' in link['label']:
                                biosample_dict['gold_stamp_id_link'] = link.get_text()
                            elif 'goldstamp id' in link['label']:
                                biosample_dict['gold_stamp_id_link'] = link.get_text()
                            else:
                                biosample_dict[link['label'].lower()] = link.get_text()
                        except KeyError:
                            pass    #if neither of the above works, it's probably a pubmed id which is encoded weirdly; just skip as it will get captured by the pubmed elink call

            ###Status - time submission went live
            status = biosample.Status
            if status is not None:
                biosample_dict["biosample_pubdate"] = status['when']

            bdict[bdict_id] = biosample_dict
            edict[bdict_id] = error_dict
        except Exception, e:
            print "--there was an error, saving to error log"
            bdict[bdict_id] = {}
            error_dict['biosample_id'] = bdict_id
            error_dict['error_message'] = e
            error_dict['trace'] = traceback.format_exc()
            print error_dict
            edict[bdict_id] = error_dict

    #destroy biosample_xml, we're done with it
    biosample_xml.decompose()

    #print "errors in biosample: %s" % edict

    return bdict,edict


def get_links(elink_url):
    l = urllib.urlopen(elink_url)
    link_xml = BeautifulSoup(l,'xml')
    l.close()

    elink_list = []

    linksets = link_xml.find_all("LinkSet")
    for linkset in linksets:
        link_dict = {}
        links = linkset.find_all('LinkSetDb')
        if len(links)>0:
            link_dict['biosample_uid'] = linkset.IdList.Id.get_text()
            for link in links:
                link_ids = link.find_all('Id')
                for ix,link_id in enumerate(link_ids):
                    link_dict[link.DbTo.get_text().lower()+'_id_'+str(ix)] = link_id.get_text()

        if len(link_dict)>0:
            elink_list.append(link_dict)

    return elink_list


def get_srx_metadata(batch):
    srx_url = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=sra&tool=metaseq&email=adriennelhoarfrost%40gmail.com&id='+str(batch)[1:-1]
    s = urllib.urlopen(srx_url)
    sra_xml = BeautifulSoup(s,'xml')
    s.close()

    sra_samples = sra_xml.find_all('EXPERIMENT_PACKAGE')
    #print "length sra_samples %s, length batch %s" % (len(sra_samples),len(batch))
    #print "srx url %s" % srx_url
    sdict = {}
    edict = {}

    for which,sra_sample in enumerate(sra_samples): #the order of experiment_packages ARE in order of sra ids given - that's good
        sdict_id = str(batch[which])
        srx_dict = {}
        error_dict = {}

        try:
            sra_link = "https://www.ncbi.nlm.nih.gov/sra/"+str(sdict_id)
            srx_dict['sra_link'] = sra_link

            #There are 7 top tag groups. Have to scrape data a little different for each
            tag_list = ['EXPERIMENT','SUBMISSION','Organization','STUDY','SAMPLE','Pool','RUN_SET']

            ###EXPERIMENT -
            if sra_sample.EXPERIMENT.IDENTIFIERS.PRIMARY_ID is not None:
                srx_dict['sra_expt_id'] = sra_sample.EXPERIMENT.PRIMARY_ID.get_text()
            if sra_sample.EXPERIMENT.TITLE is not None:
                srx_dict['sra_title'] = sra_sample.EXPERIMENT.TITLE.get_text()
            if sra_sample.EXPERIMENT.STUDY_REF.IDENTIFIERS.PRIMARY_ID is not None:
                srx_dict['sra_project_id'] = sra_sample.EXPERIMENT.STUDY_REF.IDENTIFIERS.PRIMARY_ID.get_text()
            if sra_sample.EXPERIMENT.DESIGN.DESIGN_DESCRIPTION is not None:
                srx_dict['expt_design_description'] = sra_sample.EXPERIMENT.DESIGN.DESIGN_DESCRIPTION.get_text()
            if sra_sample.EXPERIMENT.DESIGN.SAMPLE_DESCRIPTOR.PRIMARY_ID is not None:
                srx_dict['sra_sample_id'] = sra_sample.EXPERIMENT.DESIGN.SAMPLE_DESCRIPTOR.PRIMARY_ID.get_text()
            if sra_sample.EXPERIMENT.DESIGN.LIBRARY_DESCRIPTOR.LIBRARY_SOURCE is not None:
                srx_dict['library_source'] = sra_sample.EXPERIMENT.DESIGN.LIBRARY_DESCRIPTOR.LIBRARY_SOURCE.get_text()
            if sra_sample.EXPERIMENT.DESIGN.LIBRARY_DESCRIPTOR.LIBRARY_STRATEGY is not None:
                srx_dict['library_strategy'] = sra_sample.EXPERIMENT.DESIGN.LIBRARY_DESCRIPTOR.LIBRARY_STRATEGY.get_text()
            if sra_sample.EXPERIMENT.DESIGN.LIBRARY_DESCRIPTOR.LIBRARY_SELECTION is not None:
                srx_dict['library_selection'] = sra_sample.EXPERIMENT.DESIGN.LIBRARY_DESCRIPTOR.LIBRARY_SELECTION.get_text()
            if sra_sample.EXPERIMENT.DESIGN.LIBRARY_DESCRIPTOR.LIBRARY_LAYOUT.find() is not None:
                srx_dict['library_layout'] = sra_sample.EXPERIMENT.DESIGN.LIBRARY_DESCRIPTOR.LIBRARY_LAYOUT.find().name
            if sra_sample.EXPERIMENT.PLATFORM.INSTRUMENT_MODEL is not None:
                srx_dict['instrument_model'] = sra_sample.EXPERIMENT.PLATFORM.INSTRUMENT_MODEL.get_text()
            if sra_sample.EXPERIMENT.PLATFORM.find() is not None:
                srx_dict['platform'] = sra_sample.EXPERIMENT.PLATFORM.find().name

            ###SUBMISSION - just need the submission id
            if sra_sample.SUBMISSION.PRIMARY_ID is not None:
                srx_dict['sra_submission_id'] = sra_sample.SUBMISSION.PRIMARY_ID.get_text()

            ###Organization -
            if len(sra_sample.Organization.find_all(True,recursive=False))>0:
                for tag in sra_sample.Organization.find_all(True,recursive=False):
                    srx_dict['organization_'+tag.name.lower()] = tag.get_text(separator=" ")

            ###STUDY -
            if sra_sample.STUDY.IDENTIFIERS.PRIMARY_ID is not None:
                srx_dict['sra_study_id'] = sra_sample.STUDY.IDENTIFIERS.PRIMARY_ID.get_text()
            if sra_sample.STUDY.DESCRIPTOR.STUDY_TYPE['existing_study_type'] is not None:
                srx_dict['study_type'] = sra_sample.STUDY.DESCRIPTOR.STUDY_TYPE['existing_study_type']
            if len(sra_sample.STUDY.DESCRIPTOR.find_all(True,recursive=False))>0:
                for tag in sra_sample.STUDY.DESCRIPTOR.find_all(True,recursive=False):
                    #maybe should have made it 'sra_study_'+tag.name.lower()
                    srx_dict['sra_'+tag.name.lower()] = tag.get_text()

            ###SAMPLE - just need sample id, rest in biosample metadata
            if sra_sample.SAMPLE is not None:
                if sra_sample.SAMPLE.IDENTIFIERS.PRIMARY_ID is not None:
                    srx_dict['sra_sample_id'] = sra_sample.SAMPLE.IDENTIFIERS.PRIMARY_ID.get_text()

            ###Pool - skip, redundant

            ###RUN_SET - record total num_runs, for each run basic stats
            try:
                if len(sra_sample.RUN_SET.find_all('RUN'))>0:
                    srx_dict['num_runs_per_sra'] = len(sra_sample.RUN_SET.find_all('RUN'))
                    for run_ix,run in enumerate(sra_sample.RUN_SET.find_all('RUN')):
                        srx_dict['sra_run'+str(run_ix)+'_id'] = run['accession']
                        try:
                            srx_dict['sra_run'+str(run_ix)+'_total_spots'] = run['total_spots']
                        except KeyError:
                            pass
                        try:
                            srx_dict['sra_run'+str(run_ix)+'_total_bases'] = run['total_bases']
                        except KeyError:
                            pass
                        try:
                            srx_dict['sra_run'+str(run_ix)+'_size'] = run['size']
                        except KeyError:
                            pass
                        try:
                            for base in run.Bases.find_all('Base'):
                                srx_dict['sra_run'+str(run_ix)+'_base'+base['value']+'_count'] = base['count']
                        except AttributeError:
                            pass
            except AttributeError:
                pass

            sdict[sdict_id] = srx_dict
            edict[sdict_id] = error_dict
        except Exception, e:
            print "--there was an error, saving to error log"
            sdict[sdict_id] = srx_dict
            error_dict['sdict_id'] = sdict_id
            error_dict['error_message'] = e
            error_dict['trace'] = traceback.format_exc()
            print error_dict
            edict[sdict_id] = error_dict

    #print "errors in sra: %s" % edict

    #destroy sra_xml, we're done with it
    sra_xml.decompose()
    return sdict,edict


def merge_dicts(*dicts):
    d = {}
    for dicty in dicts:
        for key in dicty:
            try:
                d[key].append(dicty[key])
            except KeyError:
                d[key] = [dicty[key]]
    return d

def get_pubmed_metadata(batch):
    pub_url = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&tool=metaseq&email=adriennelhoarfrost%40gmail.com&id='+str(batch)[1:-1]
    p = urllib.urlopen(pub_url)
    pubmed_xml = BeautifulSoup(p,'xml')
    p.close()

    pubmeds = pubmed_xml.find_all('DocSum')
    pdict = {}
    edict = {}

    for pubmed_sample in pubmeds:
        pdict_id = pubmed_sample.find('Id').get_text()
        pubmed_dict = {}
        error_dict = {}

        try:
            pubmed_link = "https://www.ncbi.nlm.nih.gov/pubmed/"+str(pdict_id)
            pubmed_dict['pubmed_link'] = pubmed_link

            if pubmed_sample.find(Name='AuthorList') is not None:
                authors = str()
                for author in pubmed_sample.find(Name='AuthorList').find_all(Name='Author'):
                    authors = authors+author.get_text()+','
                pubmed_dict['pubmed_authors'] = authors

            title = pubmed_sample.find(Name='Title')
            source = pubmed_sample.find(Name='Source')
            pubdate = pubmed_sample.find(Name='PubDate')
            vol = pubmed_sample.find(Name='Volume')
            issue = pubmed_sample.find(Name='Issue')
            pgs = pubmed_sample.find(Name='Pages')
            citation = str()
            if title is not None:
                citation = citation+title.get_text()
            if source is not None:
                citation = citation+" "+source.get_text()
            if pubdate is not None:
                citation = citation+". "+pubdate.get_text()
            if vol is not None:
                citation = citation+"; "+vol.get_text()
            if issue is not None:
                citation = citation+":"+issue.get_text()
            if pgs is not None:
                citation = citation+":"+pgs.get_text()
            pubmed_dict['pubmed_citation'] = citation

            pdict[pdict_id] = pubmed_dict
            edict[pdict_id] = error_dict
        except Exception, e:
            print "--there was an error, saving to error log"
            pdict[pdict_id] = {}
            error_dict['pdict_id'] = pdict_id
            error_dict['error_message'] = e
            error_dict['trace'] = traceback.format_exc()
            print error_dict
            edict[pdict_id] = error_dict

    #print "errors in pubmed: %s" % edict
    #destroy pubmed_xml, we're done with it
    pubmed_xml.decompose()
    return pdict,edict


def get_nuccore_metadata(batch):
    ndict = {}
    for nuccore_id in batch:
        nuccore_dict = {}
        nuccore_dict['ncbi_nucleotide_url'] = 'https://www.ncbi.nlm.nih.gov/nuccore/'+str(nuccore_id)
        ndict[str(nuccore_id)] = nuccore_dict

    return ndict


def get_all_the_metadata(batch):
    #for batch in chunk:
    print "processing batch containing uids %s" % batch[0:10]

    bdict_final,b_edict = get_biosample_metadata(batch=batch) #return dictionary of dictionaries
    edict_final = {}
    #print "b_edict: %s" % b_edict

    elink_url = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=biosample&db=sra,nucleotide,pubmed&tool=metaseq&email=adriennelhoarfrost%40gmail.com'
    for key in bdict_final.keys():
        elink_url = elink_url+'&id='+str(key)
    elinks = get_links(elink_url=elink_url) #return list of dictionaries

    print "--length of elinks: %s" % len(elinks)
    sra_ids = [] #make lists of all the sras and pubmeds  and nuccores in elinks
    pubmed_ids = []
    nuc_ids = []
    for L in elinks:
        for key,value in L.items():
            if 'sra_id' in key.lower():
                sra_ids.append(int(value))
            if 'pubmed_id' in key.lower():
                pubmed_ids.append(int(value))
            if 'nuccore_id' in key.lower():
                nuc_ids.append(int(value))

    print "--length of sra_ids, pubmed_ids, and nuc_ids: %s" % len(sra_ids),len(pubmed_ids),len(nuc_ids)

    #print "scraping sra..."
    sra_start = datetime.now()
    if len(sra_ids)>500:
        #split sra_ids into batches of 500, do calls in series
        start = range(0,len(sra_ids),500)
        end = range(500,len(sra_ids),500)
        end.append(len(sra_ids))
        sra_rets = [list(a) for a in zip(start, end)]
        #make list of lists, list is len(rets) each containing list of 500 uids from uid_list
        new_sra_ids = [sra_ids[sra_rets[k][0]:sra_rets[k][1]] for k,ret in enumerate(sra_rets)]
        sdict = {}
        s_edict = {}
        for sra_id_batch in new_sra_ids:
            one_sdict,one_s_edict = get_srx_metadata(batch=sra_id_batch) #return dict of dicts
            sdict.update(one_sdict)
            s_edict.update(one_s_edict)
    else:
        sdict,s_edict = get_srx_metadata(batch=sra_ids) #return dict of dicts
    print "%s sra accessions scraped after %s" % (len(sra_ids),(datetime.now()-sra_start))
    #print "scraping pubmed..."
    p_start = datetime.now()
    pdict,p_edict = get_pubmed_metadata(batch=pubmed_ids) #return dict of dicts
    print "%s pubmed accessions scraped after %s" % (len(pubmed_ids),(datetime.now()-p_start))
    ndict = get_nuccore_metadata(batch=nuc_ids) #return dict of dicts

    #print "s_edict: %s" % s_edict
    #print "p_edict: %s" % p_edict

    #merge sdict, pdict, and ndict with elinks
    #print "merging sdict,pdict,ndict with elinks..."
    merge_start = datetime.now()
    for L in elinks:
        #print "---merging sdict,pdict,ndict for biosample id: %s" % L['biosample_uid']
        produce_result_start = datetime.now()
        try:
            sra_result = [sdict[value] for key, value in L.items() if 'sra_id' in key.lower()]
            pubmed_result = [pdict[value] for key, value in L.items() if 'pubmed_id' in key.lower()]
            nuccore_result = [ndict[value] for key, value in L.items() if 'nuccore_id' in key.lower()]
            #print "--time to produce results: %s" % (datetime.now()-produce_result_start)
            merge_dict_start = datetime.now()
            new_sra_result = merge_dicts(*sra_result)
            new_pubmed_result = merge_dicts(*pubmed_result)
            new_nuccore_result = merge_dicts(*nuccore_result)
            #print "--time to merge dicts: %s" % (datetime.now()-merge_dict_start)
            merge_redundant_keys = datetime.now()
            for key in new_sra_result.keys():
                if all(x == new_sra_result[key][0] for x in new_sra_result[key]) is True:
                    new_sra_result[key] = new_sra_result[key][0]
            new_sra_result['num_srxs_in_biosample'] = len(sra_result)
            L.update(new_sra_result)

            for key in new_pubmed_result.keys():
                if all(x == new_pubmed_result[key][0] for x in new_pubmed_result[key]) is True:
                    new_pubmed_result[key] = new_pubmed_result[key][0]
            new_pubmed_result['num_pubmeds_in_biosample'] = len(pubmed_result)
            L.update(new_pubmed_result)

            for key in new_nuccore_result.keys():
                if all(x == new_nuccore_result[key][0] for x in new_nuccore_result[key]) is True:
                    new_nuccore_result[key] = new_nuccore_result[key][0]
            new_nuccore_result['num_nuccores_in_biosample'] = len(nuccore_result)
            L.update(new_nuccore_result)
        except KeyError, e:
            print "error while merging sdict/pdict/ndict with elinks for biosample %s" % L['biosample_uid']
            print "sra_ids: %s" % sra_ids
            print "sdict: %s" % sdict
            error_dict = {}
            error_dict['biosample_id'] = L['biosample_uid']
            error_dict['error_message'] = e
            error_dict['trace'] = traceback.format_exc()
            print error_dict
            edict_final['biosample_id'] = error_dict
        #print "--time to merge redundant keys: %s" % (datetime.now()-merge_redundant_keys)

        #merge this elink with correct dictionary in bdict_final
        bdict_final[L['biosample_uid']].update(L)

    print "done merging elinks of length %s after %s" % (len(elinks),(datetime.now()-merge_start))
    #append all the dicts within b_edict, s_edict, and p_edict into edict
    edict_final.update(b_edict)
    edict_final.update(s_edict)
    edict_final.update(p_edict)

    #result_queue.put(bdict_final)
    #error_queue.put(edict)
    return bdict_final,edict_final

########################################
#for each biosample efetch batch;
#scrape biosample for each biosample; do elink for each one; get all the sras and efetch, merge; get all the pubmeds and efetch, merge; merge elink with bio;
#return dictionary of dictionaries biosample_dict
#append each dict returned in biosample_dict to df

if __name__ == "__main__":
    from Genbank_lowapi_parallel import *

    retstart_list = get_retstart_list(url='https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=biosample&term=mims+OR+migs+OR+mimarks&rettype=count&tool=metaseq&email=adriennelhoarfrost%40gmail.com')
    uid_list = get_uid_list(ret_list=retstart_list)

    #save list of uids in case need compare to errors later
    import csv
    myfile = open('uidlist_'+datetime.now().strftime("%Y-%m-%d-%H:%M")+'.csv', 'wb')
    wr = csv.writer(myfile, quoting=csv.QUOTE_ALL)
    wr.writerow(uid_list)
    myfile.close()

    #efetch for batch of 500 biosamples; generate dictionary of dictionaries {'bio#':{},'bio##':{}...}
    starts = range(0,len(uid_list),500)
    ends = range(500,len(uid_list),500)
    ends.append(len(uid_list))
    rets = [list(a) for a in zip(starts, ends)]
    #make list of lists, list is len(rets) each containing list of 500 uids from uid_list
    new_uid_list = [uid_list[rets[k][0]:rets[k][1]] for k,ret in enumerate(rets)]

    start_time = datetime.now()

    #result_queue = multiprocessing.Queue()
    #error_queue = multiprocessing.Queue()

    metadata_df = pd.DataFrame()
    errors_df = pd.DataFrame()

    #record date and time got the uidlist
    date_scraped = datetime.now().strftime("%Y-%m-%d_%H:%M")

    num_processes = 70 #this is the number of cores on a killdevil machine
    print "running script with %s processes" % num_processes
    #chunksize = len(new_uid_list[24:28])/num_processes
    #make list of length num_processes, each process contains list of list uids
    #uid_list_chunks = [new_uid_list[x:x+chunksize] for x in xrange(0, len(new_uid_list[24:28]), chunksize)]
    pool = multiprocessing.Pool(num_processes)

    #for chunk in uid_list_chunks:
    #    p = multiprocessing.Process(target=get_all_the_metadata,args=(chunk,result_queue,error_queue,))
    #    p.Daemon = True
    #    p.start()
    #for chunk in uid_list_chunks:
    #    print "joining chunks..."
    #    p.join()
    #while True:
    #    print "getting results..."
    #    bdict_result = result_queue.get()
    #    edict_result = error_queue.get()

    #result = get_all_the_metadata(batch=new_uid_list[0])
    imap_result = pool.imap_unordered(get_all_the_metadata, new_uid_list)
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

    print "saving metadata to disk... METADATA_Genbank_lowapi_parallel.csv"
    metadata_df.to_csv("METADATA_Genbank_lowapi_parallel.csv",encoding='utf-8')

    print "saving error log to disk... ERRORLOG_Genbank_lowapi_parallel.csv"
    errors_df.to_csv("ERRORLOG_Genbank_lowapi_parallel.csv",encoding='utf-8')
