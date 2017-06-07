from SRA_scrape_fns import *

if __name__ == "__main__":
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
        print "processing batch %s out of %s......" % (batch_ix+1,len(batches))
        batch_uid_list = map(int,uid_list[batch[0]:batch[1]])
        print "%s UIDs to scrape...... %s..." % (len(batch_uid_list),batch_uid_list[0:10])
        #scrape sra metadata, return as dictionary of dictionaries; each sdict key is the SRA UID, value is a dictionary of srx metadata key/value pairs
        print "scraping SRX metadata..."
        sdict = get_srx_metadata(batch_uid_list=batch_uid_list)
        #get link uids for any links to biosample, pubmed, and nuccore databases so can go scrape those too
        print "getting elinks..."
        sdict, linkdict = get_links(batch_uid_list=batch_uid_list,sdict=sdict)

        #efetch for batch/es of biosamples; generate bdict dictionary of dictionaries {'bio#':{},'bio##':{}...}
        biosample_batches = get_batches(uid_list=linkdict['biosample_uids']) #split biosamples into batches of 500 (if there's less than 500 there will only be one batch)
        bdict = {}
        for b_batch_ix,b_batch in enumerate(biosample_batches): #scrape biosample data for all the biosamples, in batches of 500
            print "processing biosample batch %s out of %s......" % (b_batch_ix+1,len(biosample_batches))
            biosample_batch_uids = map(int,linkdict['biosample_uids'][b_batch[0]:b_batch[1]])
            bdict = get_biosample_metadata(batch_uid_list=biosample_batch_uids,bdict=bdict)
            bdict = get_biosample_metadata(batch_uid_list=biosample_batch_uids,bdict=bdict)
        #efetch for batch/es of pubmeds; generate pdict dictionary of dictionaries {'pub#':{},'pub#':{},...}
