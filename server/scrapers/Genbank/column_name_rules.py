#column rules
##for nonredundant merges, might need to apply fn;
#or just for all (but ones prefer misrep?), if target already nonempty, *just delete misrep*, or just replace, whichever better

##metaseek
columns = {'X1':'biosample_uid',
##MIxS
#env_package
'air environmental package':'env_package',
'env package':'env_package',
'enviornmental package':'env_package',
'environmental package':'env_package',
'host-associated environmental package':'env_package',
'humam oral environmental package':'env_package',
'human gut environmental package':'env_package',
'human vaginal environmental package':'env_package',
'human-associated environmental package':'env_package',
'microbial mat/biofilm environmental package':'env_package',
'migs env package':'env_package',
'migs env_package':'env_package',
'miscellaneous environmental package':'env_package',
'plant-associated environmental package':'env_package',
'sediment environmental package':'env_package',
'soil environmental package':'env_package',
'wastewater/sludge environmental package':'env_package',
'water environmental package':'env_package',
#investigation_type
'investigation type':'investigation_type',
#env_biome
'biome':'env_biome',
'env biome':'env_biome',
'environment (biome)':'env_biome',
'environment biome':'env_biome',
#env_feature
'env feature':'env_feature',
'environment (feature)':'env_feature',
'environment (featurel)':'env_feature',
'environment feature':'env_feature',
'environment_feature':'env_feature',
'feature':'env_feature',
#env_material
'env material':'env_material',
'environment (material)':'env_material',
'environment material':'env_material',
'environment_material':'env_material',
'material':'env_material',
#geo_loc_name
'geo loc name':'geo_loc_name',
'geo-loc-name':'geo_loc_name',
'geo_loc_name2':'geo_loc_name',
'geographic location':'geo_loc_name',
'geographic location (country and/or sea':'geo_loc_name',
'geographic location (country and/or sea)':'geo_loc_name',
'geographic location (country and/or sea,region)':'geo_loc_name',
'geographic location (country)':'geo_loc_name',
'geographic location (country:region,area)':'geo_loc_name',
'geographic_location':'geo_loc_name',
'geographical location (country:region, location)':'geo_loc_name',
'geogrphic location (country and/or sea, region)':'geo_loc_name',

#lat_lon
'latitude and longtitude':'lat_lon',
'geographic location (latitude and longitude)':'lat_lon',
'geographic location (latitude, longitude)':'lat_lon',
'geographical location (lat lon)':'lat_lon',
'lat lon':'lat_lon',
'latitude and longitude':'lat_lon',
'latitude_and_longitude':'lat_lon',
#longitude_metaseek
'geographic location (longitude)':'longitude_metaseek',
'vv long':'longitude_metaseek',
'longitude (raw)':'longitude_metaseek',
'longitude':'longitude_metaseek',
#latitude_metaseek
'vv lat':'latitude_metaseek',
'geographic location (latitude)':'latitude_metaseek',
'latitude (raw)':'latitude_metaseek',
'latitude':'latitude_metaseek',
#collection_date
'colection date':'collection_date',
'collection date':'collection_date',
'collection-date':'collection_date',
#project_name
'ncbi_project_name':'project_name',
'project name':'project_name',
'sra_center_project_name':'project_name',
#seq_method
'seq meth':'seq_method',
'seq_method_detail1':'seq_method',
'seq_method_detail2':'seq_method',
'seq_methods':'seq_method',
'seq_meth':'seq_method',
'sequencing method':'seq_method',
'sequencing_meth':'seq_method',
'sequencing_method':'seq_method',
'sequencing_platform':'seq_method',
'sequencing_run_type':'seq_method',
'platform':'seq_method',
'number of replicons':'num_replicons',
'number_of_replicons':'num_replicons',
#estimated_size
'estimated size':'estimated_size',
#ref_biomaterial
'reference for biomaterial':'ref_biomaterial',
'reference_for_biomaterial':'ref_biomaterial',
#assembly
'assembly_name':'assembly',
'assembler':'assembly',
#finishing_strategy
'finishing strategy (depth of coverage)':'finishing_strategy',
'current finishing status':'finishing_strategy',
#isol_growth_condt
'isol_growth_condt.1':'isol_growth_condt',
'isolation and growth condition':'isol_growth_condt',
'isolation_and_growth_condition':'isol_growth_condt',
#target_gene
'gene':'target_gene',
'target gene':'target_gene',
'target genes':'target_gene',
'target_molecule':'target_gene',
'rrna_fragment':'target_gene',
#target_subfragment
'target subfragment':'target_subfragment',
#alt
'alt_elev':'alt',
'altitude':'alt',
'geographic location (altitude)':'alt',
'geographic location (altitude/elevation)':'alt',
#depth
'geographic location (depth)':'depth',
'geographical location (depth)':'depth',
##biosample
#title=biosample_title
'title':'sample_title',
'sample_title2':'sample_title',
'sampletitle':'sample_title',
#organism
'target organism':'organism',
#sample_name
'biosample_sample_name':'sample_name',
'sample':'sample_name',
'samplename':'sample_name',
'sample_name description':'sample_name',
'sample_name2':'sample_name',
'sample_information':'sample_name',
'study_sampleid':'sample_name',
#sample_id
'sample id':'sample_id',
'sample_identifier':'sample_id',
#sra_project_id
'sra_study_id':'sra_project_id',
#sra_sample_id
'sample name':'sra_sample_id',
#study_type
'sra_study_type':'study_type',
#gold_stamp_id_link
'gold project id':'gold_stamp_id_link',
'gold stamp id':'gold_stamp_id_link',
'gold_id':'gold_stamp_id_link',
#seq_quality_check
'seq_qual_check':'seq_quality_check',
'sequence quality check':'seq_quality_check'
}
