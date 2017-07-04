from flask_restful import fields

# This marshal is used when returning brief information about a list of datasets
# in the context of a search or a summary:
# GetAllDatasets, SearchDatasets, GetDiscovery, GetAllDiscoveries,
summarizedDatasetFields = {
    # fields that are summarized in summarizeColumn
    'investigation_type':fields.String,
    'library_source':fields.String,
    'env_package':fields.String,
    'library_strategy':fields.String,
    'library_screening_strategy':fields.String,
    'library_construction_method':fields.String,
    'study_type':fields.String,
    'sequencing_method':fields.String,
    'instrument_model':fields.String,
    'geo_loc_name':fields.String,
    'env_biome':fields.String,
    'env_feature':fields.String,
    'env_material':fields.String,
    'avg_read_length_maxrun':fields.Float,
    'gc_percent_maxrun':fields.Float,
    'meta_latitude':fields.Float,
    'meta_longitude':fields.Float,
    'library_reads_sequenced_maxrun':fields.Integer,
    'total_num_bases_maxrun':fields.Integer,
    'download_size_maxrun':fields.Integer,
    # additional important dataset-specific fields
    'id':fields.Integer,
    'db_source_uid':fields.String,
    'db_source':fields.String,
    'sample_title':fields.String,
    'biosample_link':fields.String,
    'uri': fields.Url('getdataset')
}
