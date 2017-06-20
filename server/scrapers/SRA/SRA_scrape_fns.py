import urllib
from lxml import etree
import json
from datetime import datetime
import time

class EfetchError(Exception):
    pass

class EutilitiesConnectionError(Exception):
    pass

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

#fn to try to get request from eutilities (as part e.g. get_links fn); if connection error for some reason raise efetch error
def geturl_with_retry(MaxRetry,url):
        while(MaxRetry >= 0):
            try:
                base = urllib.urlopen(url)
                base_tree = etree.parse(base)
                base.close()
                base_xml = base_tree.getroot()
                return base_xml
            except Exception:
                print "Internet connectivity Error Retrying in 5 seconds"
                time.sleep(5)
                MaxRetry=MaxRetry - 1
        raise EutilitiesConnectionError("eutilities connection error")


def get_srx_metadata(batch_uid_list):
    print "--Querying API and parsing XML..."
    s_parse_time = datetime.now()
    srx_url = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=sra&tool=metaseq&email=metaseekcloud%40gmail.com'
    for key in batch_uid_list:
        #this makes url with end &id=###&id=###&id=### - returns a set of links in order of sra uids
        srx_url = srx_url+'&id='+str(key)
    #srx_url = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=sra&tool=metaseq&email=metaseekcloud%40gmail.com&id='+str(batch_uid_list)[1:-1]
    sra_xml = geturl_with_retry(MaxRetry=5,url=srx_url)

    try: #sometimes the url is parsed with lxml but is an error xml output from eutilities; this step fails in that case
        sra_samples = sra_xml.findall("EXPERIMENT_PACKAGE")
    except Exception:
        raise EutilitiesConnectionError('eutilities connection error')

    print "--...parsing done for %s srxs in %s" % (len(batch_uid_list),(datetime.now()-s_parse_time))
    print "--getting srx metadata..."
    s_scrape_time = datetime.now()
    sdict = {}

    #if the length of sra_samples != length of batch_uid_list, then one or more of the uids did not return an efetch (maybe it's not public even though it shows up in esearch);
    #if this is the case, raise EfetchError which will skip this batch of 500
    if len(sra_samples)!=len(batch_uid_list):
        raise EfetchError('length srx batch does not equal length returned efetches! skipping this batch')

    for which,sra_sample in enumerate(sra_samples): #the order of experiment_packages ARE in order of sra ids given - that's good
        srx_dict = {}
        srx_uid = str(batch_uid_list[which])
        #print "--scraping srx metadata for sample uid %s, %s out of %s" % (srx_uid, which+1,len(sra_samples))

        srx_dict['db_source_uid'] = srx_uid
        srx_dict['db_source'] = 'SRA'
        srx_dict['expt_link'] = "https://www.ncbi.nlm.nih.gov/sra/"+str(srx_uid)

        #There are 7 top tag groups. Have to scrape data a little different for each: ['EXPERIMENT','SUBMISSION','Organization','STUDY','SAMPLE','Pool','RUN_SET']

        ###EXPERIMENT -
        try:
            if sra_sample.find("EXPERIMENT").find("IDENTIFIERS").findtext("PRIMARY_ID") is not None:
                srx_dict['expt_id'] = sra_sample.find("EXPERIMENT").find("IDENTIFIERS").findtext("PRIMARY_ID")
        except AttributeError:
            pass
        try:
            if sra_sample.find("EXPERIMENT").findtext("TITLE") is not None:
                srx_dict['expt_title'] = sra_sample.find("EXPERIMENT").findtext("TITLE")
        except AttributeError:
            pass
        try:
            if sra_sample.find("EXPERIMENT").find("STUDY_REF").find("IDENTIFIERS") is not None:
                if sra_sample.find("EXPERIMENT").find("STUDY_REF").find("IDENTIFIERS").findtext("PRIMARY_ID") is not None:
                    srx_dict["study_id"] = sra_sample.find("EXPERIMENT").find("STUDY_REF").find("IDENTIFIERS").findtext("PRIMARY_ID")
        except AttributeError:
            pass
        try:
            if sra_sample.find("EXPERIMENT").find("DESIGN").findtext("DESIGN_DESCRIPTION") is not None:
                srx_dict['expt_design_description'] = sra_sample.find("EXPERIMENT").find("DESIGN").findtext("DESIGN_DESCRIPTION")
        except AttributeError:
            pass
        try:
            srx_dict['sample_id'] = sra_sample.find("EXPERIMENT").find("DESIGN").find("SAMPLE_DESCRIPTOR").get("accession")
        except AttributeError:
            pass
        try:
            if sra_sample.find("EXPERIMENT").find("DESIGN").find("LIBRARY_DESCRIPTOR").findtext("LIBRARY_NAME") is not None:
                srx_dict['library_name'] = sra_sample.find("EXPERIMENT").find("DESIGN").find("LIBRARY_DESCRIPTOR").findtext("LIBRARY_NAME")
        except AttributeError:
            pass
        try:
            if sra_sample.find("EXPERIMENT").find("DESIGN").find("LIBRARY_DESCRIPTOR").findtext("LIBRARY_STRATEGY") is not None:
                srx_dict['library_strategy'] = sra_sample.find("EXPERIMENT").find("DESIGN").find("LIBRARY_DESCRIPTOR").findtext("LIBRARY_STRATEGY")
        except AttributeError:
            pass
        try:
            if sra_sample.find("EXPERIMENT").find("DESIGN").find("LIBRARY_DESCRIPTOR").findtext("LIBRARY_SOURCE").lower() is not None:
                srx_dict['library_source'] = sra_sample.find("EXPERIMENT").find("DESIGN").find("LIBRARY_DESCRIPTOR").findtext("LIBRARY_SOURCE").lower()
        except AttributeError:
            pass
        try:
            ###change library_selection to MIxS field library_screening_strategy (cv for SRA, not for MIxS)
            if sra_sample.find("EXPERIMENT").find("DESIGN").find("LIBRARY_DESCRIPTOR").findtext("LIBRARY_SELECTION") is not None:
                srx_dict['library_screening_strategy'] = sra_sample.find("EXPERIMENT").find("DESIGN").find("LIBRARY_DESCRIPTOR").findtext("LIBRARY_SELECTION")
        except AttributeError:
            pass
        try:
            ###change library_layout to MIxS field library_construction_method - cv single | paired
            if sra_sample.find("EXPERIMENT").find("DESIGN").find("LIBRARY_DESCRIPTOR").findtext("LIBRARY_LAYOUT") is not None:
                srx_dict['library_construction_method'] = sra_sample.find("EXPERIMENT").find("DESIGN").find("LIBRARY_DESCRIPTOR").find("LIBRARY_LAYOUT").getchildren()[0].tag.lower()
        except AttributeError:
            pass
        try:
            if sra_sample.find("EXPERIMENT").find("DESIGN").find("LIBRARY_DESCRIPTOR").findtext("LIBRARY_CONSTRUCTION_PROTOCOL") is not None:
                srx_dict['library_construction_protocol'] = sra_sample.find("EXPERIMENT").find("DESIGN").find("LIBRARY_DESCRIPTOR").findtext("LIBRARY_CONSTRUCTION_PROTOCOL")
        except AttributeError:
            pass
        try:
            ###change platform to MIxS field sequencing_method - cv in SRA (not in MIxS)
            if sra_sample.find("EXPERIMENT").find("PLATFORM").getchildren() is not None:
                if len(sra_sample.find("EXPERIMENT").find("PLATFORM").getchildren())>1:
                    #find the one that's actually a tag
                    for platform in sra_sample.find("EXPERIMENT").find("PLATFORM").getchildren():
                        if type(platform.tag) is str:
                            srx_dict['sequencing_method'] = platform.tag.lower()
                else:
                    srx_dict['sequencing_method'] = sra_sample.find("EXPERIMENT").find("PLATFORM").getchildren()[0].tag.lower()
            try:
                if sra_sample.find("EXPERIMENT").find("PLATFORM").getchildren()[0].findtext("INSTRUMENT_MODEL") is not None:
                    srx_dict['instrument_model'] = sra_sample.find("EXPERIMENT").find("PLATFORM").getchildren()[0].findtext("INSTRUMENT_MODEL")
            except AttributeError:
                pass
        except AttributeError:
            pass

        ###SUBMISSION - just need the submission id
        try:
            if sra_sample.find("SUBMISSION").find("IDENTIFIERS").findtext("PRIMARY_ID") is not None:
                srx_dict['submission_id'] = sra_sample.find("SUBMISSION").find("IDENTIFIERS").findtext("PRIMARY_ID")
        except AttributeError:
            pass

        ###Organization - name, address, and contact
        if sra_sample.find("Organization") is not None:
            try:
                if sra_sample.find("Organization").findtext("Name") is not None:
                    srx_dict['organization_name'] = sra_sample.find("Organization").findtext("Name")
            except AttributeError:
                pass
            try:
                if sra_sample.find("Organization").find("Address") is not None:
                    address = ''
                    for line in sra_sample.find("Organization").find("Address").iterchildren():
                        address = address+line.text+', '
                    address = address[:-2]
                    srx_dict['organization_address'] = address
            except AttributeError:
                pass
            try:
                if len(sra_sample.find("Organization").findall("Contact"))>0:
                    contacts = []
                    for contact in sra_sample.find("Organization").findall("Contact"):
                        try:
                            name = contact.find("Name").find("First").text+' '+contact.find("Name").find("Last").text
                        except AttributeError:
                            name=''
                        email = contact.get('email')
                        contacts.append(name+', '+email)
                    srx_dict['organization_contacts'] = contacts
            except AttributeError:
                pass

        ###STUDY -
        try:
            if sra_sample.find("STUDY").find("IDENTIFIERS").findtext("PRIMARY_ID") is not None:
                srx_dict['study_id'] = sra_sample.find("STUDY").find("IDENTIFIERS").findtext("PRIMARY_ID")
        except AttributeError:
            pass
        try:
            if len(sra_sample.find("STUDY").find("IDENTIFIERS").findall("EXTERNAL_ID"))>0:
                for external in sra_sample.find("STUDY").find("IDENTIFIERS").iterchildren("EXTERNAL_ID"):
                    if external.get("namespace")=='BioProject':
                        srx_dict['bioproject_id'] = external.text
        except AttributeError:
            pass
        try:
            if sra_sample.find("STUDY").find("DESCRIPTOR").findtext("STUDY_TITLE") is not None:
                srx_dict['study_title'] = sra_sample.find("STUDY").find("DESCRIPTOR").findtext("STUDY_TITLE")
        except AttributeError:
            pass
        try:
        ###rename existing_study_type to study_type
            if sra_sample.find("STUDY").find("DESCRIPTOR").find("STUDY_TYPE") is not None:
                if sra_sample.find("STUDY").find("DESCRIPTOR").find("STUDY_TYPE").get("existing_study_type")=="Other":
                    srx_dict['study_type'] = 'Other'
                    if sra_sample.find("STUDY").find("DESCRIPTOR").find("STUDY_TYPE").get("add_study_type") is not None:
                        srx_dict['study_type_other'] = sra_sample.find("STUDY").find("DESCRIPTOR").find("STUDY_TYPE").get("add_study_type")
                else:
                    srx_dict['study_type'] = sra_sample.find("STUDY").find("DESCRIPTOR").find("STUDY_TYPE").get("existing_study_type")
        except AttributeError:
            pass
        try:
            if sra_sample.find("STUDY").find("DESCRIPTOR").findtext("STUDY_ABSTRACT"):
                srx_dict['study_abstract'] = sra_sample.find("STUDY").find("DESCRIPTOR").findtext("STUDY_ABSTRACT")
        except AttributeError:
            pass
        try:
            if sra_sample.find("STUDY").find("STUDY_LINKS") is not None:
                study_links = {}
                for study_link in sra_sample.find("STUDY").find("STUDY_LINKS").iterchildren():
                    if study_link.find("XREF_LINK") is not None:
                        study_links[study_link.find("XREF_LINK").findtext("DB")] = study_link.find("XREF_LINK").findtext("ID")
                    if study_link.find("URL_LINK") is not None:
                        study_links[study_link.find("URL_LINK").findtext("LABEL")] = study_link.find("URL_LINK").findtext("URL")
                srx_dict['study_links'] = study_links
        except AttributeError:
            pass
        try:
            if sra_sample.find("STUDY").find("STUDY_ATTRIBUTES") is not None:
                study_attributes = {}
                for attr in sra_sample.find("STUDY").find("STUDY_ATTRIBUTES").iterchildren():
                    study_attributes[attr.findtext("TAG")] = attr.findtext("VALUE")
                srx_dict['study_attributes'] = study_attributes
        except AttributeError:
            pass

        ###SAMPLE - get some BioSample stuff that's in easier format here: sample id, biosample id (if exists; it should but sometimes doesn't); also title, sample name stuff, and description; rest get from biosample scraping
        try:
            if sra_sample.find("SAMPLE").find("IDENTIFIERS").findtext("PRIMARY_ID") is not None:
                srx_dict['sample_id'] = sra_sample.find("SAMPLE").find("IDENTIFIERS").findtext("PRIMARY_ID")
        except AttributeError:
            pass
        try:
            if len(sra_sample.find("SAMPLE").find("IDENTIFIERS").findall("EXTERNAL_ID"))>0:
                for external in sra_sample.find("SAMPLE").find("IDENTIFIERS").iterchildren("EXTERNAL_ID"):
                    if external.get("namespace")=='BioSample':
                        srx_dict['biosample_id'] = external.text
        except AttributeError:
            pass
        try:
            if sra_sample.find("SAMPLE").findtext("TITLE") is not None:
                srx_dict['sample_title'] = sra_sample.find("SAMPLE").findtext("TITLE")
        except AttributeError:
            pass
        try:
            if sra_sample.find("SAMPLE").find("SAMPLE_NAME") is not None:
                if sra_sample.find("SAMPLE").find("SAMPLE_NAME").findtext("TAXON_ID") is not None:
                    srx_dict['ncbi_taxon_id'] = sra_sample.find("SAMPLE").find("SAMPLE_NAME").findtext("TAXON_ID")
        except AttributeError:
            pass
        try:
                if sra_sample.find("SAMPLE").find("SAMPLE_NAME").findtext("SCIENTIFIC_NAME") is not None:
                    srx_dict['taxon_scientific_name'] = sra_sample.find("SAMPLE").find("SAMPLE_NAME").findtext("SCIENTIFIC_NAME")
        except AttributeError:
            pass
        try:
                if sra_sample.find("SAMPLE").find("SAMPLE_NAME").findtext("COMMON_NAME") is not None:
                    srx_dict['taxon_common_name'] = sra_sample.find("SAMPLE").find("SAMPLE_NAME").findtext("COMMON_NAME")
        except AttributeError:
            pass
        try:
            if sra_sample.find("SAMPLE").findtext("DESCRIPTION") is not None:
                srx_dict['sample_description'] = sra_sample.find("SAMPLE").findtext("DESCRIPTION")
        except AttributeError:
            pass

        ###Pool - skip, redundant

        ###RUN_SET - record stats for each run as list, for best run (maxrun, run for which total_num_reads is largest) as single value
        if sra_sample.find("RUN_SET") is not None:
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
                    try:
                        run_ids.append(run.get("accession"))
                    except AttributeError:
                        run_ids.append(None)
                    try:
                        total_num_reads.append(int(run.get("total_spots")))
                    except AttributeError:
                        total_num_reads.append(None)
                    try:
                        total_num_bases.append(int(run.get("total_bases")))
                    except AttributeError:
                        total_num_bases.append(None)
                    try:
                        download_size.append(int(run.get("size"))
                    except (AttributeError, ValueError) as e:
                        download_size.append(None)
                    try:
                        if len(run.find("Bases").findall("Base"))>0:
                            for base in run.find("Bases").findall("Base"):
                                try:
                                    if base.get("value")=="A":
                                        baseA_count.append(int(base.get("count")))
                                        countA = int(base.get("count"))
                                except (AttributeError, ValueError) as e:
                                    baseA_count.append(None)
                                    countA=None
                                try:
                                    if base.get("value")=="C":
                                        baseC_count.append(int(base.get("count")))
                                        countC = int(base.get("count"))
                                except (AttributeError, ValueError) as e:
                                    baseC_count.append(None)
                                    countC=None
                                try:
                                    if base.get("value")=="G":
                                        baseG_count.append(int(base.get("count")))
                                        countG = int(base.get("count"))
                                except (AttributeError, ValueError) as e:
                                    baseG_count.append(None)
                                    countG=None
                                try:
                                    if base.get("value")=="T":
                                        baseT_count.append(int(base.get("count")))
                                        countT = int(base.get("count"))
                                except (AttributeError, ValueError) as e:
                                    baseT_count.append(None)
                                    countT=None
                                try:
                                    if base.get("value")=="N":
                                        baseN_count.append(int(base.get("count")))
                                        countN = int(base.get("count"))
                                except (AttributeError, ValueError) as e:
                                    baseN_count.append(None)
                            try:
                                gc_percent.append(float(countG+countC)/float(countC+countG+countA+countT))
                            except TypeError:
                                gc_percent.append(None)
                    except AttributeError:
                        baseA_count.append(None)
                        baseC_count.append(None)
                        baseG_count.append(None)
                        baseT_count.append(None)
                        baseN_count.append(None)
                        gc_percent.append(None)
                    #need calculate avg read length; can come from "Run" or "Statistics" heading
                    if run.find("Run") is not None:
                        try:
                            #have to account for whether it's paired or single to calculate avg read length (bases/reads will be double the actual avg read count if it's paired)
                            avg_read_length.append(float(run.get("total_bases"))/(float(run.find("Run").get("spot_count"))+float(run.find("Run").get("spot_count_mates"))))
                        except TypeError: #if one of these values doesn't exist, try getting it from "Statistics" heading; otherwise just add as None
                            if run.find("Statistics") is not None:
                                try:
                                    avg_read_length.append(float(run.get("total_bases"))/(float(run.find("Statistics").get("nreads"))*float(run.find("Statistics").get("nspots"))))
                                except TypeError:
                                    avg_read_length.append(None)
                            else:
                                avg_read_length.append(None)
                        try:
                            qual_count = {}
                            if len(run.find("Run").find("QualityCount").findall("Quality"))>0:
                                for qual in run.find("Run").find("QualityCount").findall("Quality"):
                                    try:
                                        qual_count[qual.get("value")] = int(qual.get("count"))
                                    except (AttributeError,ValueError) as e:
                                        pass
                            read_quality_counts.append(qual_count)
                        except AttributeError:
                            read_quality_counts.append(None)
                    elif run.find("Statistics") is not None: #if Run doesn't exist, try get avg_read_length from Statistics heading if it exists
                        try:
                            #have to account for whether it's paired or single to calculate avg read length (bases/reads will be double the actual avg read count if it's paired)
                            avg_read_length.append(float(run.get("total_bases"))/(float(run.find("Statistics").get("nreads"))*float(run.find("Statistics").get("nspots"))))
                        except TypeError:
                            avg_read_length.append(None)
                    else: #if both Run and Statistics missing, just add None
                        avg_read_length.append(None)
                        read_quality_counts.append(None)


                max_index = total_num_reads.index(max(total_num_reads))

                srx_dict['run_ids'] = run_ids
                srx_dict['run_ids_maxrun'] = run_ids[max_index]
                srx_dict['library_reads_sequenced'] = total_num_reads
                srx_dict['library_reads_sequenced_maxrun'] = total_num_reads[max_index]
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
                srx_dict['run_quality_counts'] = read_quality_counts
                srx_dict['run_quality_counts_maxrun'] = read_quality_counts[max_index]


        sdict[srx_uid] = srx_dict

    print "--done getting srx metadata in %s" % (datetime.now()-s_scrape_time)

    return sdict


#takes list of SRX UIDs to query (batch_uid_list), and sdict into which to insert link uids;
#return sdict with 'biosample_uid', 'pubmed_uids', and/or 'nuccore_uids' inserted; and link dict with lists of biosample_uids, pubmed_uids, and nuccore_uids to scrape
#takes list of SRX UIDs to query (batch_uid_list), and sdict into which to insert link uids;
#return sdict with 'biosample_uid', 'pubmed_uids', and/or 'nuccore_uids' inserted; and link dict with lists of biosample_uids, pubmed_uids, and nuccore_uids to scrape
def get_links(batch_uid_list, sdict):
    elink_url = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=sra&db=biosample,pubmed,nuccore&tool=metaseq&email=metaseekcloud%40gmail.com'
    for key in batch_uid_list:
        #this makes url with end &id=###&id=###&id=### - returns a set of links in order of sra uids
        elink_url = elink_url+'&id='+str(key)
    #run api request and parse xml
    print "--sending elink request and parsing XML..."
    e_parse_time = datetime.now()
    link_xml = geturl_with_retry(MaxRetry=5,url=elink_url)

    try: #sometimes the url is parsed with lxml but is an error xml output from eutilities; this step fails in that case
        linksets = link_xml.findall("LinkSet")
    except Exception:
        raise EutilitiesConnectionError('eutilities connection error')

    print "--...parsing done in %s" % (datetime.now()-e_parse_time)

    print "--scraping links..."
    e_scrape_time = datetime.now()
    #scrape elink info
    #note if there's no biosample link, <LinkSetDb> with <DbTo>=='biosample' just won't exist
    biosample_uids = []
    pubmed_uids = []
    nuccore_uids = []

    for linkset in linksets:
        srx_uid = linkset.find("IdList").findtext("Id")
        #links from each target db will be in a tab called "LinkSetDb"
        if len(linkset.findall("LinkSetDb"))>0:
            for link in linkset.findall("LinkSetDb"):
                id_set = []
                if link.findtext("DbTo")=='biosample':
                    #for all Links, get Ids
                    for uid in link.findall("Link"):
                        id_set.append(int(uid.findtext("Id")))
                    biosample_uids.extend(id_set)
                    sdict[srx_uid]['biosample_uid'] = id_set
                elif link.findtext("DbTo")=='pubmed':
                    for uid in link.findall("Link"):
                        id_set.append(int(uid.findtext("Id")))
                    pubmed_uids.extend(id_set)
                    sdict[srx_uid]['pubmed_uids'] = id_set
                elif link.findtext("DbTo")=='nuccore':
                    for uid in link.findall("Link"):
                        id_set.append(int(uid.findtext("Id")))
                    nuccore_uids.extend(id_set)
                    sdict[srx_uid]['nuccore_uids'] = id_set

    biosample_uids = list(set(biosample_uids))
    pubmed_uids = list(set(pubmed_uids))
    nuccore_uids = list(set(nuccore_uids))
    print "--done scraping links in %s" % (datetime.now()-e_scrape_time)

    linkdict = {'biosample_uids':biosample_uids,'pubmed_uids':pubmed_uids,'nuccore_uids':nuccore_uids}
    print "---number of biosamples to scrape: %s" % len(linkdict['biosample_uids'])
    print "---number of pubmeds to scrape: %s" % len(linkdict['pubmed_uids'])
    print "---number of nuccores to scrape: %s" % len(linkdict['nuccore_uids'])

    return sdict,linkdict

def get_biosample_metadata(batch_uid_list,bdict):
    #some stuff already captured with SRA - just get publication_date, Models, Package, and Attributes
    print "--Querying API and parsing XML..."
    b_parse_time = datetime.now()
    biosample_url = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=biosample&tool=metaseq&email=metaseekcloud%40gmail.com&id='+str(batch_uid_list)[1:-1]
    bio_xml = geturl_with_retry(MaxRetry=5,url=biosample_url)
    try:
        biosamples = bio_xml.findall("BioSample")
    except Exception:
        raise EutilitiesConnectionError('eutilities connection error')

    print "...parsing done for %s biosamples in %s" % (len(batch_uid_list),(datetime.now()-b_parse_time))
    print "--getting biosample metadata..."
    b_scrape_time = datetime.now()

    for which,biosample in enumerate(biosamples):
        bio_dict = {}
        try: #if biosample doesn't record biosample uid, not going to be able to merge with sdict; so skip
            if biosample.get("id") is not None:
                bio_id = biosample.get("id")
            else:
                raise AttributeError('no uid attribute in biosample')
        except AttributeError:
            continue
        bio_dict['biosample_uid'] = bio_id
        bio_dict['biosample_link'] = "https://www.ncbi.nlm.nih.gov/biosample/"+str(bio_id)
        #publication date
        try:
            if biosample.get('publication_date') is not None:
                bio_dict['metadata_publication_date'] = datetime.strptime(biosample.get('publication_date'), '%Y-%m-%dT%H:%M:%S.%f')
        except ValueError: #if can't parse datetime, wrong format or something
            pass
        #if Package exists, probably don't need Models (but get them anyway); from package/models will parse investigation_type and env_package
        if biosample.findtext("Package") is not None:
            bio_dict['biosample_package'] = biosample.findtext("Package")
        try:
            models = []
            for model in biosample.find("Models").findall("Model"):
                models.append(model.text)
            bio_dict['biosample_models'] = models
        except AttributeError:
            pass

        #Attributes - loop through attributes; save all as dict in single column (parse later)
        if biosample.find("Attributes") is not None:
            attr = {}
            for attribute in biosample.find("Attributes").findall("Attribute"):
                try:
                    attr_value = attribute.text
                    if attribute.get("harmonized_name") is not None:
                        attr[attribute.get("harmonized_name")] = attr_value
                    elif attribute.get("attribute_name") is not None:
                        attr[attribute.get("attribute_name")] = attr_value
                except AttributeError:
                    pass
            bio_dict['sample_attributes'] = attr

        bdict[bio_id] = bio_dict

    print "--done getting biosample metadata in %s" % (datetime.now()-b_scrape_time)
    return bdict


def get_pubmed_metadata(batch_uid_list,pdict):
    print "--Querying API and parsing XML..."
    p_parse_time = datetime.now()
    pub_url = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&tool=metaseq&email=metaseekcloud%40gmail.com&id='+str(pubmed_batch_uids)[1:-1]
    pub_xml = geturl_with_retry(MaxRetry=5,url=pub_url)

    try:
        pubmeds = pub_xml.findall("DocSum")
    except Exception:
        raise EutilitiesConnectionError('eutilities connection error')

    print "--...parsing done for %s pubmeds in %s" % (len(pubmed_batch_uids),(datetime.now()-p_parse_time))
    print "--scraping pubmed metadata..."
    p_scrape_time = datetime.now()

    for which,pubmed in enumerate(pubmeds):
        pub_dict = {}
        try: #if pubmed doesn't pubmed uid (it should), not going to be able to merge with sdict; so skip
            if pubmed.findtext("Id") is not None:
                pub_id = pubmed.findtext("Id")
            else:
                raise AttributeError('no uid attribute in pubmed')
        except AttributeError:
            continue

        pub_dict['pubmed_uid'] = pub_id
        pub_dict['pubmed_link'] = "https://www.ncbi.nlm.nih.gov/pubmed/"+str(pub_id)

        try:
            if pubmed.find("Item[@Name='PubDate']").text is not None:
                try:
                    pub_dict['pub_publication_date'] = datetime.strptime(pubmed.find("Item[@Name='PubDate']").text,"%Y %b %d")
                except ValueError:
                    try:
                        pub_dict['pub_publication_date'] = datetime.strptime(pubmed.find("Item[@Name='PubDate']").text,"%Y %b")
                    except ValueError:
                        pass
        except AttributeError:
            pass

        try:
            if pubmed.find("Item[@Name='AuthorList']") is not None:
                authors = []
                for author in pubmed.find("Item[@Name='AuthorList']").findall("Item[@Name='Author']"):
                    authors.append(author.text)
                pub_dict['pub_authors'] = authors
        except AttributeError:
            pass

        if pubmed.findtext("Item[@Name='Title']") is not None:
            pub_dict['pub_title'] = pubmed.findtext("Item[@Name='Title']")
        if pubmed.findtext("Item[@Name='Volume']") is not None:
            pub_dict['pub_volume'] = pubmed.findtext("Item[@Name='Volume']")
        if pubmed.findtext("Item[@Name='Issue']") is not None:
            pub_dict['pub_issue'] = pubmed.findtext("Item[@Name='Issue']")
        if pubmed.findtext("Item[@Name='Pages']") is not None:
            pub_dict['pub_pages'] = pubmed.findtext("Item[@Name='Pages']")
        if pubmed.findtext("Item[@Name='Source']") is not None:
            pub_dict['pub_journal'] = pubmed.findtext("Item[@Name='Source']")
        if pubmed.findtext("Item[@Name='DOI']") is not None:
            pub_dict['pub_doi'] = pubmed.findtext("Item[@Name='DOI']")

        pdict[pub_id] = pub_dict

    print "--done scraping pubmed metadata in %s" % (datetime.now()-p_scrape_time)

    return pdict


def get_nuccore_metadata(batch_uid_list,ndict):
    print "--scraping nuccore metadata..."
    n_scrape_time = datetime.now()

    for which,nuccore in enumerate(batch_uid_list):
        nuc_dict = {}

        nuc_id = str(nuccore)
        nuc_dict['nuccore_uid'] = nuc_id
        nuc_dict['nuccore_link'] = 'https://www.ncbi.nlm.nih.gov/nuccore/'+nuc_id

        ndict[nuc_id] = nuc_dict

    print "--done scraping nuccore metadata in %s" % (datetime.now()-n_scrape_time)

    return ndict


def merge_scrapes(sdict,bdict,pdict,ndict):
    for srx in sdict.keys():
        if 'biosample_uid' in sdict[srx].keys():
            #add biosample metadata fields and values to sdict[srx]

            ##TODO: log an error if len(sdict[srx]['biosample_uid'])>1; otherwise, merge biosample scrapes
            if len(sdict[srx]['biosample_uid'])==1:
                #for bio in sdict[srx]['biosample_uid']:
                    #bio = str(bio)
                    #TAB EVERYTHING OUT ONE, use if else list append approach like below:
                    #if 'biosample_link' in bdict[bio].keys():
                    #    if 'biosample_link' in sdict[srx].keys(): #biosample_link
                    #        sdict[srx]['biosample_link'].append(bdict[bio]['biosample_link'])
                    #    else:
                    #        sdict[srx]['biosample_link'] = [bdict[bio]['biosample_link']]

                bio = str(sdict[srx]['biosample_uid'][0])
                if bio in bdict.keys():
                    #fields from biosample scrape need to add; don't need biosample_uid since already there
                    biosample_fields = ['biosample_link','metadata_publication_date','biosample_package','biosample_models','sample_attributes']
                    for biosample_field in biosample_fields:
                        if biosample_field in bdict[bio].keys():
                            sdict[srx][biosample_field] = bdict[bio][biosample_field]

        if 'pubmed_uids' in sdict[srx].keys():
            #append pubmed metadata values to list metadata values for that field in sdict[srx] (if multiple pubmeds, e.g., for each field have list value for all pubmeds, like with run stuff)
            for pub in sdict[srx]['pubmed_uids']:
                pub = str(pub)
                if pub in pdict.keys():
                    #don't need pubmed_uid since already there
                    pubmed_fields = ['pubmed_link','pub_publication_date','pub_authors','pub_title','pub_volume','pub_issue','pub_pages','pub_journal','pub_doi']
                    for pubmed_field in pubmed_fields:
                        if pubmed_field in pdict[pub].keys():
                            if pubmed_field in sdict[srx].keys(): #if field already in sdict[srx], append new value to existing list
                                sdict[srx][pubmed_field].append(pdict[pub][pubmed_field])
                            else: #otherwise add new field with list value (length of one)
                                sdict[srx][pubmed_field] = [pdict[pub][pubmed_field]]

        if 'nuccore_uids' in sdict[srx].keys():
            #append nuccore metadata values to list metadata values for that field in sdict[srx]
            for nuc in sdict[srx]['nuccore_uids']:
                nuc = str(nuc)
                if nuc in ndict.keys():
                    #don't need nuccore_uid since already there - just add nuccore_link
                    if 'nuccore_link' in ndict[nuc].keys():
                        if 'nuccore_link' in sdict[srx].keys():
                            sdict[srx]['nuccore_link'].append(ndict[nuc]['nuccore_link'])
                        else:
                            sdict[srx]['nuccore_link'] = [ndict[nuc]['nuccore_link']]
    return sdict

def extract_and_merge_mixs_fields(sdict, field, rules_json):
    #field e.g. 'sample_attributes'; sdict should be dict of dicts
    #read in rules from json
    with open(rules_json) as json_rules:
        rules = json.load(json_rules)
        json_rules.close()

    for srx in sdict.keys():
        if field in sdict[srx].keys():
            for rule_set in rules.keys():
                #find which redundant fields in rule set exist in sample_attributes
                matches = [x for x in rules[rule_set] if x in sdict[srx][field].keys()]
                if len(matches)>0:
                    #pick replacement as lowest index (highest priority) field ##**MAKE SURE YOU ENTER YOUR RULE SET LIST IN ORDER OF PRIORITY IN THE JSON FILE**##
                    replacement = rules[rule_set][min([rules[rule_set].index(j) for j in matches])]

                    #add column (key:value field) to bio_dict with appropriate MIxS key field
                    sdict[srx][rule_set] = sdict[srx][field][replacement]

                    #not going to remove the replacement field in the dict, for e.g. where units are in the old field name ('age_in_years'); you'll be able to see it in the sample_attributes of the dataset details
                    #del sdict[srx][field][replacement]

                    #choosing to leave any additional lower-priority matches in sample_attributes
                    ##TODO: ERROR FLAG IF THERE ARE >1 MATCHES?

    return sdict
