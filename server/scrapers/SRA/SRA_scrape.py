# -*- encoding: utf-8 -*-

#test adding runs to db
import sys
sys.path.append('../..')
sys.path.append('..')
from app import db
from pymysql import err
from sqlalchemy import exc
from SRA_scrape_fns import *
from models import *
from shared import *
from sklearn.externals import joblib

metaseek_fields = ['db_source_uid',
'db_source',
'expt_link',
'expt_id',
'expt_title',
'expt_design_description',
'library_name',
'library_strategy',
'library_source',
'library_screening_strategy',
'library_construction_method',
'library_construction_protocol',
'sequencing_method',
'instrument_model',
'submission_id',
'organization_name',
'organization_address',
'organization_contacts',
'study_id',
'bioproject_id',
'study_title',
'study_type',
'study_type_other',
'study_abstract',
'study_links',
'study_attributes',
'sample_id',
'biosample_id',
'sample_title',
'ncbi_taxon_id',
'taxon_scientific_name',
'taxon_common_name',
'sample_description',
'num_runs_in_accession',
'run_ids_maxrun',
'library_reads_sequenced_maxrun',
'total_num_bases_maxrun',
'download_size_maxrun',
'avg_read_length_maxrun',
'baseA_count_maxrun',
'baseC_count_maxrun',
'baseG_count_maxrun',
'baseT_count_maxrun',
'baseN_count_maxrun',
'gc_percent_maxrun',
'run_quality_counts_maxrun',
'biosample_uid',
'biosample_link',
'metadata_publication_date',
'biosample_package',
'biosample_models',
'sample_attributes',
'investigation_type',
'env_package',
'project_name',
'lat_lon',
'latitude',
'longitude',
'meta_latitude',
'meta_longitude',
'geo_loc_name',
'collection_date',
'collection_time',
'env_biome',
'env_feature',
'env_material',
'depth',
'elevation',
'altitude',
'target_gene',
'target_subfragment',
'ploidy',
'num_replicons',
'estimated_size',
'ref_biomaterial',
'propagation',
'assembly',
'finishing_strategy',
'isol_growth_condt',
'experimental_factor',
'specific_host',
'subspecific_genetic_lineage',
'tissue',
'sex',
'sample_type',
'age',
'dev_stage',
'biomaterial_provider',
'host_disease',
'date_scraped',
'metaseek_investigation_type',
'metaseek_investigation_type_P',
'metaseek_mixs_specification',
'metaseek_mixs_specification_P',
'metaseek_env_package',
'metaseek_sequencing_method']

run_fields = ['dataset_id',
'run_id',
'library_reads_sequenced',
'total_num_bases',
'download_size',
'avg_read_length',
'baseA_count',
'baseC_count',
'baseG_count',
'baseT_count',
'baseN_count',
'gc_percent',
'run_quality_counts']

pubmed_fields = ['pubmed_uid',
'pubmed_link',
'pub_publication_date',
'pub_authors',
'pub_title',
'pub_volume',
'pub_issue',
'pub_pages',
'pub_journal',
'pub_doi',
'datasets']

if __name__ == "__main__":
    #make list of all publicly available UIDs in SRA
    retstart_list = get_retstart_list(url='https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=sra&term=public&field=ACS&rettype=count&tool=metaseq&email=metaseekcloud%40gmail.com')
    uid_list = get_uid_list(ret_list=retstart_list)

    #remove SRA IDs that have already been ingested into MetaSeek DB; db_source_uids for which 'source_db' is 'SRA'
    print "Removing uids already in MetaSeek..."
    result = db.session.query(Dataset.db_source_uid).filter(Dataset.db_source=='SRA').distinct()
    existing_uids = [r.db_source_uid for r in result]

    #subtract any uids already in db from uid_list
    uids_to_scrape = list(set(uid_list)-set(existing_uids))
    print "...REMAINING NUMBER OF UIDS TO SCRAPE: %s" % (len(uids_to_scrape))

    #split UIDs to scrape into batches of 500 (max number of UIDs can call with eutilities api at one time)
    batches = get_batches(uids_to_scrape, batch_size=200)
    #for each batch of 500 UIDs, scrape metadata
    for batch_ix,batch in enumerate(batches):
        print "PROCESSING BATCH %s OUT OF %s......" % (batch_ix+1,len(batches))
        batch_uid_list = map(int,uids_to_scrape[batch[0]:batch[1]])
        print "-%s UIDs to scrape in this batch...... %s..." % (len(batch_uid_list),batch_uid_list[0:10])
        #scrape sra metadata, return as dictionary of dictionaries; each sdict key is the SRA UID, value is a dictionary of srx metadata key/value pairs; rdict is for individual runs with key run_id
        print "-scraping SRX metadata..."
        try:
            sdict, rdict = get_srx_metadata(batch_uid_list=batch_uid_list)
        except (EutilitiesConnectionError,EfetchError) as msg:
            print msg,"; skipping this batch"
            continue

        #get link uids for any links to biosample or pubmed databases so can go scrape those too
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

        #merge sdict with scraped biosample/pubmed metadata
        print "-merging scrapes"
        sdict = merge_scrapes(sdict=sdict,bdict=bdict,pdict=pdict)

        #extract and merge MIxS fields from 'sample_attributes' field in each dict in sdict (if exists)
        print "-extracting and merging MIxS fields"
        sdict = extract_and_merge_mixs_fields(sdict=sdict,fieldname="sample_attributes",rules_json="rules.json")

        #load in rules and model for extracting metaseek_power fields
        with open("CVparse_rules.json") as json_file:
            manual_rules = json.load(json_file)
        json_file.close()
        with open("CVparse_manualtree_rules.json") as tree_file:
            tree_rules = json.load(tree_file)
        tree_file.close()

        investigation_model = joblib.load("investigation_type_logreg_model.pkl")
        with open("model_features.json") as json_file:
            model_features = json.load(json_file)
        json_file.close()

        print "-extracting metaseek_power fields and changing sample_attributes to str field"
        for srx in sdict.keys():
            #extract metaseek_power fields for this srx
            extract_metaseek_power_fields(sdict, srx, manual_rules=manual_rules, tree_rules=tree_rules, investigation_model=investigation_model, model_features=model_features)
            #coerce sample attributes field to str for db insertion
            if 'sample_attributes' in sdict[srx].keys():
                sdict[srx]['sample_attributes'] = json.dumps(sdict[srx]['sample_attributes'])

        #clean up sdict so that any nan or na values (or values that should be na) are None
        na_values = ['NA','','Missing','missing','unspecified','not available','not given','Not available',None,[],{},'[]','{}','not applicable','Not applicable','Not Applicable','N/A','n/a','not provided','Not Provided','Not provided','unidentified']
        for srx in sdict.keys():
            sdict[srx] = {k:sdict[srx][k] for k in sdict[srx].keys() if sdict[srx][k] not in na_values}

            #add parsed metaseek lat/lon values if possible
            if 'lat_lon' in sdict[srx]:
                meta_latitude, meta_longitude = parseLatLon(sdict[srx]['lat_lon'])
                sdict[srx]['meta_latitude'] = meta_latitude
                sdict[srx]['meta_longitude'] = meta_longitude
            if 'latitude' in sdict[srx] and 'longitude' in sdict[srx]:
                sdict[srx]['meta_latitude'] = parseLatitude(sdict[srx]['latitude'])
                sdict[srx]['meta_longitude'] = parseLongitude(sdict[srx]['longitude'])

        ##TODO: check whether if biosample_uids exists, and no biosample attribs added; log to scrapeerrors if so; same for pubmeds

        print "-writing data to database..."
        for srx in sdict.keys():
            #add date scraped field as right now!
            sdict[srx]['date_scraped'] = datetime.now()

            #get row in correct order keys
            row_to_write = [sdict[srx][x] if x in sdict[srx].keys() else None for x in metaseek_fields]
            newDataset = Dataset(*row_to_write)
            #add newdataset and commit to get new id
            db.session.add(newDataset)
            try:
                db.session.commit()
            except (exc.DataError, err.DataError) as e:
                db.session.rollback()
                #if one of the columns was too long, log error and skip this srx
                errorToWrite = ScrapeError(uid=str(srx),error_msg="DataError: "+str(e),function="writing Dataset to db",date_scraped=datetime.now())
                db.session.add(errorToWrite)
                db.session.commit()
                continue

            if 'pubmed_uids' in sdict[srx].keys():
                for pub in sdict[srx]["pubmed_uids"]:
                    if pub is not None:
                        pub = str(pub)
                        if pub in pdict.keys():
                            pub_data = [pdict[pub][x] if x in pdict[pub].keys() else None for x in pubmed_fields]
                            newPub = Publication(*pub_data)
                            newPub.datasets.append(newDataset)
                            db.session.add(newPub)
                            try:
                                db.session.commit()
                            except (exc.IntegrityError, err.IntegrityError) as e: #if pubmed already exists
                                db.session.rollback()
                                existing_pub = db.session.query(Publication).filter(Publication.pubmed_uid==pub).first()
                                existing_pub.datasets.append(newDataset)
                                db.session.commit()


            if "run_ids" in sdict[srx].keys():
                for run in sdict[srx]["run_ids"]:
                    if run is not None:
                        run_data = [rdict[run][x] if x in rdict[run].keys() else None for x in run_fields]
                        newRun = Run(*run_data)
                        newDataset.runs.append(newRun)
                        db.session.add(newRun)

            #commit all those new runs
            db.session.commit()

        ##TODO: log date and time of update, num accessions added, etc. Separate db table?
        print "BATCH %s COMPLETE!" % (batch_ix+1)
