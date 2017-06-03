import urllib
from lxml import etree


def get_retstart_list(url):
    #define retstarts need for get_uid_list eutilities requests - since can only get 100,000 at a time, need to make multiple queries to get total list
    #find out count of UIDs going to pull from SRA
    g = urllib.urlopen(url)
    count_tree = etree.parse(g)
    g.close()
    count_xml = count_tree.getroot()
    num_uids = count_xml.findtext("Count")
    print 'number of publicly available UIDs in SRA: %s' % num_uids
    num_queries = 1+int(num_uids)/100000  #number of queries to do, with shifting retstart
    retstart_list = [i*100000 for i in range(num_queries)]
    print 'retstarts to use: %s' % retstart_list
    return retstart_list

def get_uid_list(ret_list):
    #scrape UIDs into list
    uid_list = []
    for retstart in ret_list:
        f = urllib.urlopen('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=sra&term=public&field=ACS&tool=metaseq&email=metaseekcloud%40gmail.com&retmax=100000&retstart='+str(retstart))
        uid_tree = etree.parse(f)
        f.close()
        uid_xml = uid_tree.getroot()
        print "appending %s accessions" % len(uid_xml.find("IdList").findall("Id"))
        #add uids to list of accessions
        for id in uid_xml.find("IdList").iterchildren():
            value = id.text
            uid_list.append(value)
    return uid_list

def get_batches(uid_list):
    starts = range(0,len(uid_list),500)
    ends = range(500,len(uid_list),500)
    ends.append(len(uid_list))
    batches = [list(a) for a in zip(starts, ends)]
    return batches

def get_srx_metadata(batch_uid_list):
    srx_url = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=sra&tool=metaseq&email=metaseekcloud%40gmail.com&id='+str(batch_uid_list)[1:-1]
    s = urllib.urlopen(srx_url)
    sra_tree = etree.parse(s)
    s.close()
    sra_xml = sra_tree.getroot()

    sra_samples = sra_xml.findall("EXPERIMENT_PACKAGE")
    sdict = {}

    for which,sra_sample in enumerate(sra_samples): #the order of experiment_packages ARE in order of sra ids given - that's good
        srx_dict = {}

        sdict_id = str(batch_uid_list[which])
        srx_dict['db_source_uid'] = sdict_id
        srx_dict['db_source'] = 'SRA'
        srx_dict['expt_link'] = "https://www.ncbi.nlm.nih.gov/sra/"+str(sdict_id)

        #There are 7 top tag groups. Have to scrape data a little different for each: ['EXPERIMENT','SUBMISSION','Organization','STUDY','SAMPLE','Pool','RUN_SET']
        ###EXPERIMENT -
        if sra_sample.find("EXPERIMENT").find("IDENTIFIERS").findtext("PRIMARY_ID") is not None:
            srx_dict['expt_id'] = sra_sample.find("EXPERIMENT").find("IDENTIFIERS").findtext("PRIMARY_ID")
        if sra_sample.find("EXPERIMENT").findtext("TITLE") is not None:
            srx_dict['expt_title'] = sra_sample.find("EXPERIMENT").findtext("TITLE")
        if sra_sample.find("EXPERIMENT").find("STUDY_REF").find("IDENTIFIERS") is not None:
            if sra_sample.find("EXPERIMENT").find("STUDY_REF").find("IDENTIFIERS").findtext("PRIMARY_ID") is not None:
                srx_dict["project_id"] = sra_sample.find("EXPERIMENT").find("STUDY_REF").find("IDENTIFIERS").findtext("PRIMARY_ID")
        if sra_sample.find("EXPERIMENT").find("DESIGN").findtext("DESIGN_DESCRIPTION") is not None:
            srx_dict['expt_design_description'] = sra_sample.find("EXPERIMENT").find("DESIGN").findtext("DESIGN_DESCRIPTION")
        if sra_sample.find("EXPERIMENT").find("DESIGN").find("SAMPLE_DESCRIPTOR").find("IDENTIFIERS").findtext("PRIMARY_ID") is not None:
            srx_dict['sample_id'] = sra_sample.find("EXPERIMENT").find("DESIGN").find("SAMPLE_DESCRIPTOR").find("IDENTIFIERS").findtext("PRIMARY_ID")
        if sra_sample.find("EXPERIMENT").find("DESIGN").find("LIBRARY_DESCRIPTOR").findtext("LIBRARY_NAME") is not None:
            srx_dict['library_name'] = sra_sample.find("EXPERIMENT").find("DESIGN").find("LIBRARY_DESCRIPTOR").findtext("LIBRARY_NAME")
        if sra_sample.find("EXPERIMENT").find("DESIGN").find("LIBRARY_DESCRIPTOR").findtext("LIBRARY_STRATEGY") is not None:
            srx_dict['library_strategy'] = sra_sample.find("EXPERIMENT").find("DESIGN").find("LIBRARY_DESCRIPTOR").findtext("LIBRARY_STRATEGY")
        if sra_sample.find("EXPERIMENT").find("DESIGN").find("LIBRARY_DESCRIPTOR").findtext("LIBRARY_SOURCE").lower() is not None:
            srx_dict['library_source'] = sra_sample.find("EXPERIMENT").find("DESIGN").find("LIBRARY_DESCRIPTOR").findtext("LIBRARY_SOURCE").lower()
        ###change library_selection to MIxS field library_screening_strategy (cv for SRA, not for MIxS)
        if sra_sample.find("EXPERIMENT").find("DESIGN").find("LIBRARY_DESCRIPTOR").findtext("LIBRARY_SELECTION") is not None:
            srx_dict['library_screening_strategy'] = sra_sample.find("EXPERIMENT").find("DESIGN").find("LIBRARY_DESCRIPTOR").findtext("LIBRARY_SELECTION")
        ###change library_layout to MIxS field library_construction_method - cv single | paired
        if sra_sample.find("EXPERIMENT").find("DESIGN").find("LIBRARY_DESCRIPTOR").findtext("LIBRARY_LAYOUT") is not None:
            srx_dict['library_construction_method'] = sra_sample.find("EXPERIMENT").find("DESIGN").find("LIBRARY_DESCRIPTOR").find("LIBRARY_LAYOUT").getchildren()[0].tag.lower()
        if sra_sample.find("EXPERIMENT").find("DESIGN").find("LIBRARY_DESCRIPTOR").findtext("LIBRARY_CONSTRUCTION_PROTOCOL") is not None:
            srx_dict['library_construction_protocol'] = sra_sample.find("EXPERIMENT").find("DESIGN").find("LIBRARY_DESCRIPTOR").findtext("LIBRARY_CONSTRUCTION_PROTOCOL")
        ###change platform to MIxS field sequencing_method - cv in SRA (not in MIxS)
        if sra_sample.find("EXPERIMENT").find("PLATFORM").getchildren() is not None:
            srx_dict['sequencing_method'] = sra_sample.find("EXPERIMENT").find("PLATFORM").getchildren()[0].tag.lower()
            if sra_sample.find("EXPERIMENT").find("PLATFORM").getchildren()[0].findtext("INSTRUMENT_MODEL") is not None:
                srx_dict['instrument_model'] = sra_sample.find("EXPERIMENT").find("PLATFORM").getchildren()[0].findtext("INSTRUMENT_MODEL")

        ###SUBMISSION - just need the submission id
        if sra_sample.find("SUBMISSION").find("IDENTIFIERS").findtext("PRIMARY_ID") is not None:
            srx_dict['submission_id'] = sra_sample.find("SUBMISSION").find("IDENTIFIERS").findtext("PRIMARY_ID")

        ###Organization - name, address, and contact
        if sra_sample.find("Organization").findtext("Name") is not None:
            srx_dict['organization_name'] = sra_sample.find("Organization").findtext("Name")
        if sra_sample.find("Organization").find("Address") is not None:
            address = ''
            for line in sra_sample.find("Organization").find("Address").iterchildren():
                address = address+line.text+', '
            address = address[:-2]
            srx_dict['organization_address'] = address
        if len(sra_sample.find("Organization").findall("Contact"))>0:
            contacts = []
            for contact in sra_sample.find("Organization").findall("Contact"):
                name = contact.find("Name").find("First").text+' '+contact.find("Name").find("Last").text
                email = contact.get('email')
                contacts.append(name+', '+email)
            srx_dict['organization_contacts'] = contacts

        ###STUDY -
        if sra_sample.find("STUDY").find("IDENTIFIERS").findtext("PRIMARY_ID") is not None:
            srx_dict['study_id'] = sra_sample.find("STUDY").find("IDENTIFIERS").findtext("PRIMARY_ID")
        if sra_sample.find("STUDY").find("DESCRIPTOR").findtext("STUDY_TITLE") is not None:
            srx_dict['study_title'] = sra_sample.find("STUDY").find("DESCRIPTOR").findtext("STUDY_TITLE")
        ###rename existing_study_type to study_type
        if sra_sample.find("STUDY").find("DESCRIPTOR").find("STUDY_TYPE") is not None:
            if sra_sample.find("STUDY").find("DESCRIPTOR").find("STUDY_TYPE").get("existing_study_type")=="Other":
                srx_dict['study_type'] = 'Other'
                if sra_sample.find("STUDY").find("DESCRIPTOR").find("STUDY_TYPE").get("add_study_type") is not None:
                    srx_dict['study_type_other'] = sra_sample.find("STUDY").find("DESCRIPTOR").find("STUDY_TYPE").get("add_study_type")
            else:
                srx_dict['study_type'] = sra_sample.find("STUDY").find("DESCRIPTOR").find("STUDY_TYPE").get("existing_study_type")
        if sra_sample.find("STUDY").find("DESCRIPTOR").findtext("STUDY_ABSTRACT"):
            srx_dict['study_abstract'] = sra_sample.find("STUDY").find("DESCRIPTOR").findtext("STUDY_ABSTRACT")
        if len(sra_sample.find("STUDY").find("STUDY_LINKS").getchildren())>0:
            study_links = {}
            for study_link in sra_sample.find("STUDY").find("STUDY_LINKS").iterchildren():
                if study_link.find("XREF_LINK") is not None:
                    study_links[study_link.find("XREF_LINK").findtext("DB")] = study_link.find("XREF_LINK").findtext("ID")
                if study_link.find("URL_LINK") is not None:
                    study_links[study_link.find("URL_LINK").findtext("LABEL")] = study_link.find("URL_LINK").findtext("URL")
            srx_dict['study_links'] = study_links
        if len(sra_sample.find("STUDY").find("STUDY_ATTRIBUTES").getchildren())>0:
            study_attributes = {}
            for attr in sra_sample.find("STUDY").find("STUDY_ATTRIBUTES").iterchildren():
                study_attributes[attr.findtext("TAG")] = attr.findtext("VALUE")
            srx_dict['study_attributes'] = study_attributes

        ###SAMPLE - just need sample id
        if sra_sample.find("SAMPLE").find("IDENTIFIERS").findtext("PRIMARY_ID") is not None:
            srx_dict['sample_id'] = sra_sample.find("SAMPLE").find("IDENTIFIERS").findtext("PRIMARY_ID")

        ###Pool - skip, redundant

        ###RUN_SET - record stats for each run as list, for best run (maxrun, run for which total_num_reads is largest) as single value
        run_ids = []
        total_num_reads = []
        total_num_bases = []
        download_size = []
        avg_read_length = []
        baseA_count = []
        baseC_count = []
        baseG_count = []
        baseT_count = []
        baseN_count = []
        gc_percent = []
        read_quality_counts = []

        if len(sra_sample.find("RUN_SET").findall("RUN"))>0:
            srx_dict['num_runs_in_accession'] = len(sra_sample.find("RUN_SET").findall("RUN"))
            for run in sra_sample.find("RUN_SET").findall("RUN"):
                run_ids.append(run.get("accession"))
                total_num_reads.append(int(run.get("total_spots")))
                total_num_bases.append(int(run.get("total_bases")))
                download_size.append(int(run.get("size")))
                avg_read_length.append(float(run.get("total_bases"))/(float(run.find("Run").get("spot_count"))+float(run.find("Run").get("spot_count_mates"))))
                for base in run.find("Bases").findall("Base"):
                    if base.get("value")=="A":
                        baseA_count.append(int(base.get("count")))
                        countA = int(base.get("count"))
                    if base.get("value")=="C":
                        baseC_count.append(int(base.get("count")))
                        countC = int(base.get("count"))
                    if base.get("value")=="G":
                        baseG_count.append(int(base.get("count")))
                        countG = int(base.get("count"))
                    if base.get("value")=="T":
                        baseT_count.append(int(base.get("count")))
                        countT = int(base.get("count"))
                    if base.get("value")=="N":
                        baseN_count.append(int(base.get("count")))
                        countN = int(base.get("count"))
                gc_percent.append(float(countG+countC)/float(countC+countG+countA+countT))
                qual_count = {}
                if run.find("Run").find("QualityCount") is not None:
                    for qual in run.find("Run").find("QualityCount").findall("Quality"):
                        qual_count[qual.get("value")] = int(qual.get("count"))
                read_quality_counts.append(qual_count)


            max_index = total_num_reads.index(max(total_num_reads))

            srx_dict['run_ids'] = run_ids
            srx_dict['run_ids_maxrun'] = run_ids[max_index]
            srx_dict['total_num_reads'] = total_num_reads
            srx_dict['total_num_reads_maxrun'] = total_num_reads[max_index]
            srx_dict['total_num_bases'] = total_num_bases
            srx_dict['total_num_bases_maxrun'] = total_num_bases[max_index]
            srx_dict['download_size'] = download_size
            srx_dict['download_size_maxrun'] = download_size[max_index]
            srx_dict['avg_read_length'] = avg_read_length
            srx_dict['avg_read_length_maxrun'] = avg_read_length[max_index]
            srx_dict['baseA_count'] = baseA_count
            srx_dict['baseA_count_maxrun'] = baseA_count[max_index]
            srx_dict['baseC_count'] = baseC_count
            srx_dict['baseC_count_maxrun'] = baseC_count[max_index]
            srx_dict['baseG_count'] = baseG_count
            srx_dict['baseG_count_maxrun'] = baseG_count[max_index]
            srx_dict['baseT_count'] = baseT_count
            srx_dict['baseT_count_maxrun'] = baseT_count[max_index]
            srx_dict['baseN_count'] = baseN_count
            srx_dict['baseN_count_maxrun'] = baseN_count[max_index]
            srx_dict['gc_percent'] = gc_percent
            srx_dict['gc_percent_maxrun'] = gc_percent[max_index]
            srx_dict['read_quality_counts'] = read_quality_counts
            srx_dict['read_quality_counts_maxrun'] = read_quality_counts[max_index]


        sdict[sdict_id] = srx_dict

    return sdict


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
    for batch in batches:
        batch_uid_list = map(int,uid_list[batch[0]:batch[1]])
        #scrape sra metadata, return as dictionary of dictionaries; each sdict key is the SRA UID, value is a dictionary of srx metadata key/value pairs
        sdict = get_srx_metadata(batch_uid_list=batch_uid_list)


    #efetch for batch of 500 biosamples; generate dictionary of dictionaries {'bio#':{},'bio##':{}...}
