from SRA_scrape_fns import *

if __name__ == "__main__":
    #check if error log file exists; if it doesn't, create one
    ##TODO: make table in db instead of file?
    import os
    if not os.path.isfile('ScrapeErrors.csv'):
        f = open('ScrapeErrors.csv','a')
        f.write("uid_url,msg,fn_from\n")
        f.close()


    #make list of all publicly available UIDs in SRA
    retstart_list = get_retstart_list(url='https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=sra&term=public&field=ACS&rettype=count&tool=metaseq&email=metaseekcloud%40gmail.com')
    uid_list = get_uid_list(ret_list=retstart_list)

    #remove SRA IDs that have already been ingested into MetaSeek DB
    #source_db_uid for which 'source_db' field = 'SRA'
    ##TODO: figure out how to open db session in here?

    #split UIDs to scrape into batches of 500 (max number of UIDs can call with eutilities api at one time)
    batches = get_batches(uid_list)
    #for each batch of 500 UIDs, scrape metadata
    for batch_ix,batch in enumerate(batches):
        print "PROCESSING BATCH %s OUT OF %s......" % (batch_ix+1,len(batches))
        batch_uid_list = map(int,uid_list[batch[0]:batch[1]])
        print "-%s UIDs to scrape in this batch...... %s..." % (len(batch_uid_list),batch_uid_list[0:10])
        #scrape sra metadata, return as dictionary of dictionaries; each sdict key is the SRA UID, value is a dictionary of srx metadata key/value pairs
        print "-scraping SRX metadata..."
        try:
            sdict = get_srx_metadata(batch_uid_list=batch_uid_list)
        except (EutilitiesConnectionError,EfetchError) as msg:
            print msg
            continue

        #get link uids for any links to biosample, pubmed, and nuccore databases so can go scrape those too
        print "-getting elinks..."
        try:
            sdict, linkdict = get_links(batch_uid_list=batch_uid_list,sdict=sdict)
        except EutilitiesConnectionError as msg: #if can't get links for srx, skip entire batch and don't write data
            print msg,"; skipping this batch"
            continue

        #efetch for batch/es of biosamples; generate bdict dictionary of dictionaries {'bio#':{},'bio##':{}...}
        biosample_batches = get_batches(uid_list=linkdict['biosample_uids']) #split biosamples into batches of 500 (if there's less than 500 there will only be one batch)
        bdict = {}
        for b_batch_ix,b_batch in enumerate(biosample_batches): #scrape biosample data for all the biosamples, in batches of 500
            print "--processing biosample batch %s out of %s......" % (b_batch_ix+1,len(biosample_batches))
            biosample_batch_uids = map(int,linkdict['biosample_uids'][b_batch[0]:b_batch[1]])
            try:
                bdict = get_biosample_metadata(batch_uid_list=biosample_batch_uids,bdict=bdict)
            except EutilitiesConnectionError, msg:
                print msg, "; skipping this biosample batch"
                continue
        #efetch for batch/es of pubmeds; generate pdict dictionary of dictionaries {'pub#':{},'pub#':{},...}
        pubmed_batches = get_batches(uid_list=linkdict['pubmed_uids'])
        pdict = {}
        for p_batch_ix,p_batch in enumerate(pubmed_batches):
            print "--processing pubmed batch %s out of %s......" % (p_batch_ix+1,len(pubmed_batches))
            pubmed_batch_uids = map(int,linkdict['pubmed_uids'][p_batch[0]:p_batch[1]])
            try:
                pdict = get_pubmed_metadata(batch_uid_list=pubmed_batch_uids,pdict=pdict)
            except EutilitiesConnectionError as msg:
                print msg, "; skipping this pubmed batch"
                continue
        #efetch for batch/es of nuccores;
        nuccore_batches = get_batches(uid_list=linkdict['nuccore_uids'])
        ndict = {}
        for n_batch_ix,n_batch in enumerate(nuccore_batches):
            print "--processing nuccore batch %s out of %s......" % (n_batch_ix+1,len(nuccore_batches))
            nuccore_batch_uids = map(int,linkdict['nuccore_uids'][n_batch[0]:n_batch[1]])
            ndict = get_nuccore_metadata(batch_uid_list=nuccore_batch_uids,ndict=ndict)

        #merge sdict with scraped biosample/pubmed/nuccore metadata - add metadata from bdict/pdict/ndict where appropriate for each srx in sdict.
        sdict = merge_scrapes(sdict=sdict,bdict=bdict,pdict=pdict,ndict=ndict)

        #extract and merge MIxS fields from 'sample_attributes' field in each dict in sdict (if exists)
        sdict = extract_and_merge_mixs_fields(sdict=sdict,fieldname="sample_attributes",rules_json="rules.json")
        #coerce sample attributes field to str for db insertion
        for srx in sdict.keys():
            sdict[srx]['sample_attributes'] = str(sdict[srx]['sample_attributes'])

        ##TODO: cv parsing

        #clean up sdict so that any nan or na values (or values that should be na) are None
        na_values = ['NA','','Missing','missing','unspecified','not available','not given','Not available',None,[],{},'not applicable','Not applicable','Not Applicable','N/A','n/a','not provided','Not Provided','Not provided']
        for srx in sdict.keys():
            sdict[srx] = {k:sdict[srx][k] for k in sdict[srx].keys() if sdict[srx][k] not in na_values}

        ##TODO: check whether if biosample_uids exists, and no biosample attribs added; log to scrapeerrors if so; same for pubmeds

        ##TODO: write metadata row by row to db

        ##TODO: log date and time of update, num accessions added, etc. Separate db table?
