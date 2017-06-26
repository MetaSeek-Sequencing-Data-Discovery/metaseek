#test datasets migrations
from SRA_scrape_fns import *
from app import db
from models import *

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
'nuccore_uids',
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
'date_scraped']

test_uids = ['3245354', '860572', '3909854', '2855075', '1739476', '32094',
       '3322867', '641016', '440947', '3877402', '2126384', '150993',
       '620027', '1366134', '3326326', '1918038', '699978', '2423157',
       '4217400', '1370357', '3345539', '2241709', '2390279', '176692',
       '2536281', '2644659', '1462382', '173943', '1838436', '2664336',
       '1061324', '1012687', '3803262', '2368559', '577340', '3244734',
       '1691685', '3564949', '3048990', '1939375', '3673747', '2690263',
       '3529958', '3199723', '2267017', '3812897', '1004017', '3724561',
       '1221112', '2492794', '432602', '2718442', '1601666', '916774',
       '2826576', '974804', '1139539', '3829869', '2663580', '4124211',
       '2770923', '900049', '1461119', '3988391', '3712274', '327389',
       '2984531', '2071747', '874278', '395503', '285851', '3229400',
       '112503', '2037458', '1226628', '2110507', '2213031', '2004377',
       '409643', '755823', '649500', '1966497', '622435', '2239204',
       '4020924', '1211580', '951275', '3322287', '2070272', '752056',
       '2314698', '2638053', '925008', '986112', '2010288', '3298771',
       '2449510', '46969', '2749163', '1859499', '3383261', '358718',
       '449158', '1008277', '3726386', '3646712', '1438220', '1364902',
       '2453020', '519859', '3325248', '3776958', '2118153', '72578',
       '2521264', '2690456', '1103249', '2793537', '2345115', '2173633',
       '1667426', '2456952', '2088144', '1159147', '4120215', '1115052',
       '1595906', '1360525', '3041351', '2310651', '2394009', '2775891',
       '1680624', '3638775', '909667', '2289327', '2000745', '1663719',
       '220960', '423907', '2099511', '4115810', '2979327', '3803836',
       '2405889', '378133', '1768498', '2390841', '3433198', '290424',
       '360139', '1249510', '2514096', '1517149', '3157136', '4064199',
       '2647946', '3026205', '3440403', '2452265', '1394237', '3904814',
       '682008', '1869016', '2015083', '1118152', '181102', '742425',
       '1493537', '1218799', '2050633', '2114990', '176487', '2429353',
       '3461987', '3040141', '2925154', '3611888', '744638', '2455188',
       '486337', '3045565', '1791440', '3812483', '2010723', '3698965',
       '3775295', '3377349', '3519794', '4018247', '3728520', '1503258',
       '2557030', '2325178', '3743258', '2121438', '3001904', '889777',
       '455184', '4172674', '2776405', '1137515', '434746', '8800',
       '36314', '46581', '4004990', '1641782', '2735861', '3001090',
       '3775152', '2732888', '3749436', '410211', '3441544', '1404847',
       '8912', '1615966', '3600342', '2807071', '3993820', '3570634',
       '2038436', '3465559', '3774676', '742565', '3879815', '1352057',
       '394449', '1541960', '3674507', '492689', '3629069', '2878296',
       '386692', '3031338', '1565741', '4144487', '997951', '2388153',
       '1571199', '3809330', '1236001', '3164589', '2086578', '39320',
       '1661529', '3413362', '997400', '1015305', '1641980', '1118796',
       '740327', '3216847', '4064057', '2012567', '2020946', '2017729',
       '1556298', '2426650', '3858843', '1276094', '1915177', '536981',
       '3537061', '2272430', '767732', '1797909', '516979', '1414448',
       '761812', '2962850', '3585289', '3947788', '8898', '3626044',
       '1225422', '1032291', '2582577', '2541682', '696949', '666576',
       '435891', '349156', '952464', '3686168', '951406', '3597791',
       '4110146', '4007153', '32042', '1427248', '666030', '1115420',
       '406046', '2175996', '3603984', '442401', '2335109', '3906477',
       '2385446', '2337346', '3328012', '1940397', '1618701', '1576309',
       '1647535', '1688156', '3476021', '2998913', '2901986', '2240502',
       '1384148', '1105405', '982198', '2558227', '305238', '3572685',
       '2502895', '3410636', '3457597', '4121268', '709703', '1003320',
       '3963729', '531711', '976584', '747155', '3808423', '565342',
       '1026455', '1303165', '2423810', '3755469', '1872326', '598425',
       '3425084', '3547385', '105698', '2838067', '3448682', '257526',
       '1130569', '3850402', '1285984', '3611340', '1747016', '692927',
       '3289791', '3208688', '2434427', '3606210', '3169200', '1371570',
       '1624565', '1655012', '37393', '2979345', '3325020', '843346',
       '981488', '799118', '2843273', '4057330', '2172542', '252857',
       '3422229', '799058', '559154', '2622115', '218652', '1063973',
       '346812', '1417187', '704601', '3842581', '149075', '3244846',
       '3942066', '2522761', '3437795', '682983', '2841145', '2635194',
       '2568216', '2637047', '187244', '2296914', '1175798', '285667',
       '1709278', '1463632', '1370585', '3650058', '1303257', '1116310',
       '2668058', '2920047', '3284597', '972326', '2507536', '2993857',
       '1258982', '1000794', '1646010', '2281758', '2975095', '3982697',
       '3631012', '2940947', '2000588', '3468534', '461780', '3712843',
       '636743', '4075613', '2175305', '461149', '625891', '547470',
       '1434379', '1607033', '3310145', '1038999', '741510', '1045468',
       '1259285', '140623', '3248152', '2279009', '2477873', '3529660',
       '118857', '766062', '4201501', '1612057', '4064772', '4084188',
       '2195234', '2101224', '1594403', '257787', '1484416', '1126112',
       '3898935', '1208867', '3721176', '4070345', '493004', '2212254',
       '1625700', '4123417', '3031180', '1016499', '2330163', '1227154',
       '933497', '2923644', '2924573', '3680', '2056003', '3541571',
       '1664682', '652773', '4198821', '3615715', '2724481', '474324',
       '3335475', '2115497', '2240420', '1625937', '976323', '2323130',
       '1369839', '1458736', '2193015', '2955903', '554084', '2425188',
       '3989730', '441580', '1251614', '2462275', '1252053', '3046234',
       '730745', '3810672', '1542283', '3570758', '91209', '468365',
       '1397582', '448107', '523721', '1572985', '2088893', '1649462',
       '3584424', '3647261', '3612231', '2028406', '795398', '3534052',
       '1198267', '3883794', '2698929', '681962', '97414', '869524',
       '162252', '3242765', '461741', '3309435', '3160366', '481163',
       '277885', '974610', '3843636', '433274', '1152181', '2326411',
       '460606', '300230', '723670', '3638091', '532642', '3131480',
       '2285357', '3776309', '2282122', '4066177', '3240313', '1657549',
       '2981211', '3473833', '261353', '3880364', '3736085', '1224129',
       '980131', '4006628', '2911052', '2591638', '2954985', '1546260',
       '268018', '1595888', '163512', '3520709', '72485', '1467207',
       '2880262', '274288', '1556753', '542421', '1405973', '937443',
       '338198', '3186396', '2434997', '3650513', '342843', '3612536',
       '1419675', '3375985', '1140043', '68943', '1052348', '244760',
       '380687', '3902586', '1848852', '2276850', '3686599', '1124027',
       '2266247', '837805', '2308062', '647787', '1014510', '1518651',
       '573307', '1529437', '2971357', '1880645', '1081376', '1579742',
       '2170657', '3406306', '880265', '1469547', '1172630', '3465471',
       '2368284', '1664440', '2899927', '1569175', '3164006', '2607068',
       '654661', '3019060', '1611891', '2093268', '722747', '2406355',
       '216815', '2911102', '630177', '1173720', '3712721', '1406792',
       '196322', '1154723', '2241203', '1403402', '2632959', '3972799',
       '3516848', '4189518', '3569340', '2880111', '2021669', '1249992',
       '4033105', '387377', '3650995', '1646424', '1120282', '3156866',
       '905456', '427718', '1268712', '3380351', '2254906', '3464116',
       '1216631', '1544050', '512482', '2194690', '3964461', '2743292',
       '448952', '167298', '2476673', '3892531', '2633880', '1395806',
       '1651794', '2515616', '2405083', '2080726', '3475215', '344193',
       '2293295', '2021761', '2933596', '2749348', '2023858', '2471659',
       '3210579', '3880846', '4015834', '2251824', '1847817', '1697061',
       '1789275', '259853', '382539', '3459785', '2590648', '140100',
       '717054', '2864546', '2903018', '1023634', '519398', '789713',
       '1247974', '2649878', '549356', '727061', '2975069', '2383912',
       '3432513', '1034685', '1379615', '2509217', '24708', '2448003',
       '2038179', '2933791', '2569920', '3724159', '1467762', '4114711',
       '369356', '2543284', '1847526', '1234274', '2509052', '876507',
       '2875177', '1015219', '1567075', '148976', '2002305', '3245800',
       '1196676', '620060', '354068', '330626', '447826', '2959162',
       '1528590', '987477', '2703763', '3743110', '3426623', '1220339',
       '2790068', '143359', '3449402', '1111167', '2477963', '1121195',
       '449603', '270553', '251943', '3992756', '659256', '4127537',
       '3048120', '4164502', '566922', '3607649', '3913913', '1645333',
       '127412', '2446179', '2022622', '1284807', '2170848', '3063414',
       '3277276', '2854301', '2415295', '499853', '1250682', '4015171',
       '3967701', '760505', '103921', '2823583', '1869120', '385822',
       '3673839', '55743', '2989944', '1543093', '1748829', '3684936',
       '258255', '2180305', '378597', '3689095', '2565021', '3219395',
       '1203483', '3995800', '706104', '3490659', '2404925', '1082260',
       '481601', '738762', '3555661', '3415259', '819600', '275965',
       '725179', '1377688', '2883433', '2656353', '1225039', '3670345',
       '2294820', '3310992', '2239431', '674654', '3942862', '3740069',
       '3206690', '2069345', '3107230', '3408371', '431820', '4078818',
       '3902769', '1999246', '1501766', '252609', '266187', '3685907',
       '920976', '739446', '164576', '3435061', '3760581', '3291872',
       '2254665', '3031237', '1535535', '384264', '541549', '3065846',
       '1446443', '610652', '1518712', '669890', '1536462', '277052',
       '494325', '2659633', '716390', '4021677', '926832', '2764325',
       '2282509', '3937709', '1513901', '740008', '233431', '2640403',
       '419108', '2825303', '2549795', '3581446', '3002607', '3699155',
       '3492312', '1510031', '1608586', '1122411', '2420345', '3944559',
       '1273373', '1143499', '269217', '3378992', '2698397', '2045698',
       '4216104', '2314864', '2654835', '566149', '3219721', '2917572',
       '1449959', '1386293', '1689245', '2315187', '2906552', '2524120',
       '2184935', '1971317', '3900615', '3468830', '3648373', '437341',
       '1386259', '384274', '475405', '2600559', '1161752', '726744',
       '1518386', '3199056', '1026008', '3260338', '2161461', '2945585',
       '217656', '2306202', '272463', '967473', '1976532', '3695924',
       '3752748', '1097232', '2977222', '4058388', '3474959', '766287',
       '291662', '1167117', '877204', '2742603', '2553964', '119804',
       '276741', '2520452', '346194', '3414498', '987551', '4150008',
       '2432842', '3340413', '1661592', '3272891', '3727314', '832427',
       '1271805', '1062448', '1208211', '1666105', '2455047', '556515',
       '1115403', '341081', '3957956', '766672', '3637795', '96434',
       '1010139', '480593', '885412', '1203896', '4118362', '410034',
       '1689378', '1198049', '3684806', '1173627', '92905', '1350214',
       '2760774', '1504982', '1027344', '1518513', '3196137', '692792',
       '2670579', '3735109', '96336', '3942733', '1158511', '2709280',
       '485120', '21178', '2411722', '1386403', '2536137', '3956182',
       '1451488', '1185171', '1568922', '2511539', '2593465', '1437434',
       '2805684', '1194588', '4069665', '2567867', '2721302', '2338482',
       '1505983', '3943270', '1000044', '3624865', '1197532', '3208308',
       '3310984', '2619807', '1078152', '3957275', '1139522', '2505692',
       '2867271', '834796', '912563', '946161', '3202078', '1465940',
       '919021', '2314129', '1649436', '2736333', '3224869', '1049655',
       '764378', '1476519', '2790787', '727685', '4022764', '432118',
       '3410481', '3001490', '579328', '3140696']

if __name__ == "__main__":
    from datetime import datetime
    #check if error log file exists; if it doesn't, create one
    ##TODO: make table in db instead of file?
    import os
    if not os.path.isfile('ScrapeErrors.csv'):
        f = open('ScrapeErrors.csv','a')
        f.write("uid_url,msg,fn_from\n")
        f.close()

    uid_list = test_uids

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
        print "-merging scrapes"
        sdict = merge_scrapes(sdict=sdict,bdict=bdict,pdict=pdict,ndict=ndict)

        #extract and merge MIxS fields from 'sample_attributes' field in each dict in sdict (if exists)
        sdict = extract_and_merge_mixs_fields(sdict=sdict,fieldname="sample_attributes",rules_json="rules.json")
        #coerce sample attributes field to str for db insertion
        print "-changing sample_attributes to str field"
        for srx in sdict.keys():
            if 'sample_attributes' in sdict[srx].keys():
                sdict[srx]['sample_attributes'] = str(sdict[srx]['sample_attributes'])


        ##TODO: cv parsing

        #clean up sdict so that any nan or na values (or values that should be na) are None
        print "-parsing na values"
        na_values = ['NA','','Missing','missing','unspecified','not available','not given','Not available',None,[],{},'not applicable','Not applicable','Not Applicable','N/A','n/a','not provided','Not Provided','Not provided']
        for srx in sdict.keys():
            sdict[srx] = {k:sdict[srx][k] for k in sdict[srx].keys() if sdict[srx][k] not in na_values}

        ##TODO: check whether if biosample_uids exists, and no biosample attribs added; log to scrapeerrors if so; same for pubmeds

        ##TODO: write metadata row by row to db
        print "-writing data to database..."
        for srx in sdict.keys():
            #add date scraped field as right now!
            sdict[srx]['date_scraped'] = datetime.now()
            #get row in correct order keys
            row_to_write = [sdict[srx][x] if x in sdict[srx].keys() else None for x in metaseek_fields]

            newDataset = Dataset(*row_to_write)
            print newDataset

            db.session.add(newDataset)
            db.session.commit()
