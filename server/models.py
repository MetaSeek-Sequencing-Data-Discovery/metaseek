from app import db
from datetime import datetime
from sqlalchemy.orm import validates

# Declare Models - Dataset, Account, Discovery
# each class becomes a table
class Dataset(db.Model):
    # each attribute on a "Model" inherited class becomes a Column
    id = db.Column(db.Integer, primary_key=True)

    db_source_uid = db.Column(db.String(50),unique=True,index=True)
    db_source = db.Column(db.String(20))
    expt_link = db.Column(db.Text)
    expt_id = db.Column(db.String(30))
    expt_title = db.Column(db.Text)
    expt_design_description = db.Column(db.Text)
    library_name = db.Column(db.Text)
    library_strategy = db.Column(db.String(50),index=True)
    library_source = db.Column(db.String(50),index=True)
    library_screening_strategy = db.Column(db.String(80),index=True)
    library_construction_method = db.Column(db.String(20),index=True)
    library_construction_protocol = db.Column(db.Text)
    sequencing_method = db.Column(db.String(50),index=True)
    instrument_model = db.Column(db.String(50),index=True)
    submission_id = db.Column(db.String(30))
    organization_name = db.Column(db.Text)
    organization_address = db.Column(db.Text)
    organization_contacts = db.Column(db.Text)
    study_id = db.Column(db.String(30))
    bioproject_id = db.Column(db.String(40))
    study_title = db.Column(db.Text)
    study_type = db.Column(db.String(50),index=True)
    study_type_other = db.Column(db.Text)
    study_abstract = db.Column(db.Text)
    study_links = db.Column(db.Text)
    study_attributes = db.Column(db.Text)
    sample_id = db.Column(db.String(30))
    biosample_id = db.Column(db.String(40))
    sample_title = db.Column(db.Text)
    ncbi_taxon_id = db.Column(db.String(50))
    taxon_scientific_name = db.Column(db.Text)
    taxon_common_name = db.Column(db.Text)
    sample_description = db.Column(db.Text)
    num_runs_in_accession = db.Column(db.Integer)
    run_ids_maxrun = db.Column(db.String(30))
    library_reads_sequenced_maxrun = db.Column(db.BIGINT,index=True)
    total_num_bases_maxrun = db.Column(db.BIGINT,index=True)
    download_size_maxrun = db.Column(db.BIGINT,index=True)
    avg_read_length_maxrun = db.Column(db.Float,index=True)
    baseA_count_maxrun = db.Column(db.BIGINT)
    baseC_count_maxrun = db.Column(db.BIGINT)
    baseG_count_maxrun = db.Column(db.BIGINT)
    baseT_count_maxrun = db.Column(db.BIGINT)
    baseN_count_maxrun = db.Column(db.BIGINT)
    gc_percent_maxrun = db.Column(db.Float,index=True)
    run_quality_counts_maxrun = db.Column(db.Text)
    biosample_uid = db.Column(db.String(30))
    biosample_link = db.Column(db.Text)
    metadata_publication_date = db.Column(db.DateTime)
    biosample_package = db.Column(db.Text)
    biosample_models = db.Column(db.Text)
    sample_attributes = db.Column(db.Text)
    investigation_type = db.Column(db.String(80),index=True)
    env_package = db.Column(db.String(100),index=True)
    project_name = db.Column(db.Text)
    lat_lon = db.Column(db.Text)
    latitude = db.Column(db.Text)
    longitude = db.Column(db.Text)
    meta_latitude = db.Column(db.Float,index=True)
    meta_longitude = db.Column(db.Float,index=True)
    geo_loc_name = db.Column(db.String(100),index=True)
    collection_date = db.Column(db.Text)
    collection_time = db.Column(db.Text)
    env_biome = db.Column(db.String(100),index=True)
    env_feature = db.Column(db.String(200),index=True)
    env_material = db.Column(db.String(150),index=True)
    depth = db.Column(db.Text)
    elevation = db.Column(db.Text)
    altitude = db.Column(db.Text)
    target_gene = db.Column(db.Text)
    target_subfragment = db.Column(db.Text)
    ploidy = db.Column(db.Text)
    num_replicons = db.Column(db.Text)
    estimated_size = db.Column(db.Text)
    ref_biomaterial = db.Column(db.Text)
    propagation = db.Column(db.Text)
    assembly = db.Column(db.Text)
    finishing_strategy = db.Column(db.Text)
    isol_growth_condt = db.Column(db.Text)
    experimental_factor = db.Column(db.Text)
    specific_host = db.Column(db.Text)
    subspecific_genetic_lineage = db.Column(db.Text)
    tissue = db.Column(db.Text)
    sex = db.Column(db.Text)
    sample_type = db.Column(db.Text)
    age = db.Column(db.Text)
    dev_stage = db.Column(db.Text)
    biomaterial_provider = db.Column(db.Text)
    host_disease = db.Column(db.Text)
    date_scraped = db.Column(db.DateTime)
    metaseek_investigation_type = db.Column(db.String(50), index=True)
    metaseek_investigation_type_P = db.Column(db.Float)
    metaseek_mixs_specification = db.Column(db.String(20))
    metaseek_mixs_specification_P = db.Column(db.Float)
    metaseek_env_package = db.Column(db.String(50))
    metaseek_sequencing_method = db.Column(db.String(50))

    runs = db.relationship('Run', backref='dataset', lazy='dynamic')

    #if any of these fields are larger than the max allowable, will truncate to max length
    @validates('expt_design_description', 'library_construction_protocol', 'study_abstract', 'sample_description')
    def validate_code(self, key, value):
        max_len = getattr(self.__class__, key).prop.columns[0].type.length
        if value and len(value) > max_len:
            return value[:max_len]
        return value

    # Each class must have an init function
    def __init__(self, db_source_uid=None,db_source=None,expt_link=None,expt_id=None,expt_title=None,expt_design_description=None,library_name=None,library_strategy=None,library_source=None,library_screening_strategy=None,library_construction_method=None,library_construction_protocol=None,sequencing_method=None,instrument_model=None,
    submission_id=None,organization_name=None,organization_address=None,organization_contacts=None,
    study_id=None,bioproject_id=None,study_title=None,study_type=None,study_type_other=None,study_abstract=None,study_links=None,study_attributes=None,
    sample_id=None,biosample_id=None,sample_title=None,ncbi_taxon_id=None,taxon_scientific_name=None,taxon_common_name=None,sample_description=None,
    num_runs_in_accession=None,run_ids_maxrun=None,library_reads_sequenced_maxrun=None,total_num_bases_maxrun=None,download_size_maxrun=None,avg_read_length_maxrun=None,
    baseA_count_maxrun=None,baseC_count_maxrun=None,baseG_count_maxrun=None,baseT_count_maxrun=None,baseN_count_maxrun=None,gc_percent_maxrun=None,run_quality_counts_maxrun=None,
    biosample_uid=None,biosample_link=None,metadata_publication_date=None,biosample_package=None,biosample_models=None,sample_attributes=None,
    investigation_type=None,env_package=None,project_name=None,lat_lon=None,latitude=None,longitude=None,meta_latitude=None,meta_longitude=None,geo_loc_name=None,collection_date=None,collection_time=None,env_biome=None,env_feature=None,env_material=None,depth=None,elevation=None,altitude=None,target_gene=None,target_subfragment=None,
    ploidy=None,num_replicons=None,estimated_size=None,ref_biomaterial=None,propagation=None,assembly=None,finishing_strategy=None,isol_growth_condt=None,experimental_factor=None,specific_host=None,subspecific_genetic_lineage=None,tissue=None,sex=None,sample_type=None,age=None,dev_stage=None,biomaterial_provider=None,host_disease=None,
    date_scraped=None,metaseek_investigation_type=None,metaseek_investigation_type_P=None,metaseek_mixs_specification=None,metaseek_mixs_specification_P=None,metaseek_env_package=None,metaseek_sequencing_method=None):

        self.db_source_uid = db_source_uid
        self.db_source = db_source
        self.expt_link = expt_link
        self.expt_id = expt_id
        self.expt_title = expt_title
        self.expt_design_description = expt_design_description
        self.library_name = library_name
        self.library_strategy = library_strategy
        self.library_source = library_source
        self.library_screening_strategy = library_screening_strategy
        self.library_construction_method = library_construction_method
        self.library_construction_protocol = library_construction_protocol
        self.sequencing_method = sequencing_method
        self.instrument_model = instrument_model
        self.submission_id = submission_id
        self.organization_name = organization_name
        self.organization_address = organization_address
        self.organization_contacts = organization_contacts
        self.study_id = study_id
        self.bioproject_id = bioproject_id
        self.study_title = study_title
        self.study_type = study_type
        self.study_type_other = study_type_other
        self.study_abstract = study_abstract
        self.study_links = study_links
        self.study_attributes = study_attributes
        self.sample_id = sample_id
        self.biosample_id = biosample_id
        self.sample_title = sample_title
        self.ncbi_taxon_id = ncbi_taxon_id
        self.taxon_scientific_name = taxon_scientific_name
        self.taxon_common_name = taxon_common_name
        self.sample_description = sample_description
        self.num_runs_in_accession = num_runs_in_accession
        self.run_ids_maxrun = run_ids_maxrun
        self.library_reads_sequenced_maxrun = library_reads_sequenced_maxrun
        self.total_num_bases_maxrun = total_num_bases_maxrun
        self.download_size_maxrun = download_size_maxrun
        self.avg_read_length_maxrun = avg_read_length_maxrun
        self.baseA_count_maxrun = baseA_count_maxrun
        self.baseC_count_maxrun = baseC_count_maxrun
        self.baseG_count_maxrun = baseG_count_maxrun
        self.baseT_count_maxrun = baseT_count_maxrun
        self.baseN_count_maxrun = baseN_count_maxrun
        self.gc_percent_maxrun = gc_percent_maxrun
        self.run_quality_counts_maxrun = run_quality_counts_maxrun
        self.biosample_uid = biosample_uid
        self.biosample_link = biosample_link
        self.metadata_publication_date = metadata_publication_date
        self.biosample_package = biosample_package
        self.biosample_models = biosample_models
        self.sample_attributes = sample_attributes
        self.investigation_type = investigation_type
        self.env_package = env_package
        self.project_name = project_name
        self.lat_lon = lat_lon
        self.latitude = latitude
        self.longitude = longitude
        self.meta_latitude = meta_latitude
        self.meta_longitude = meta_longitude
        self.geo_loc_name = geo_loc_name
        self.collection_date = collection_date
        self.collection_time = collection_time
        self.env_biome = env_biome
        self.env_feature = env_feature
        self.env_material = env_material
        self.depth = depth
        self.elevation = elevation
        self.altitude = altitude
        self.target_gene = target_gene
        self.target_subfragment = target_subfragment
        self.ploidy = ploidy
        self.num_replicons = num_replicons
        self.estimated_size = estimated_size
        self.ref_biomaterial = ref_biomaterial
        self.propagation = propagation
        self.assembly = assembly
        self.finishing_strategy = finishing_strategy
        self.isol_growth_condt = isol_growth_condt
        self.experimental_factor = experimental_factor
        self.specific_host = specific_host
        self.subspecific_genetic_lineage = subspecific_genetic_lineage
        self.tissue = tissue
        self.sex = sex
        self.sample_type = sample_type
        self.age = age
        self.dev_stage = dev_stage
        self.biomaterial_provider = biomaterial_provider
        self.host_disease = host_disease
        self.date_scraped = date_scraped
        self.metaseek_investigation_type = metaseek_investigation_type
        self.metaseek_investigation_type_P = metaseek_investigation_type_P
        self.metaseek_mixs_specification = metaseek_mixs_specification
        self.metaseek_mixs_specification_P = metaseek_mixs_specification_P
        self.metaseek_env_package = metaseek_env_package
        self.metaseek_sequencing_method = metaseek_sequencing_method

    # Friendly string representation
    def __repr__(self):
        return '<Dataset %r>' % self.expt_id

# For a many to many database relationship, use a mapping table (no class definition directly)
# Eg. each publication may have many datasets, and each dataset may belong to many publications
# Each row in this table is one "dataset in publication" membership
dataset_to_publication = db.Table('dataset_to_publication',
    db.Column('dataset_id', db.Integer, db.ForeignKey('dataset.id')),
    db.Column('publication_id', db.Integer, db.ForeignKey('publication.id'))
)

class Discovery(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filter_params = db.Column(db.Text)
    date_created = db.Column(db.DateTime)
    discovery_title = db.Column(db.Text)
    num_datasets = db.Column(db.Integer)
    discovery_description = db.Column(db.Text)
    owner_id = db.Column(db.Integer, db.ForeignKey('account.id'))
    owner = db.relationship('Account',backref=db.backref('myDiscoveries',lazy='dynamic'))

    def __init__(self, owner_id, filter_params, discovery_title, num_datasets, discovery_description=None, date_created=None, ):
        self.owner_id = owner_id
        self.filter_params = filter_params
        self.discovery_title = discovery_title
        self.num_datasets = num_datasets
        self.discovery_description = discovery_description
        if date_created is None:
            date_created = datetime.utcnow()
        self.date_created = date_created

    def __repr__(self):
        return '<Discovery %r>' % self.discovery_title

class Account(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    firebase_id = db.Column(db.String(28), unique=True)
    firebase_name = db.Column(db.String(50))
    admin = db.Column(db.Integer)
    discoveries = db.relationship('Discovery', backref='account', lazy='dynamic')

    def __init__(self, firebase_id, firebase_name=None, admin=False):
        self.firebase_id = firebase_id
        self.firebase_name = firebase_name
        self.admin = admin

    def __repr__(self):
        return '<User Account %r>' % self.firebase_id

class Run(db.Model):
    id = db.Column(db.Integer,primary_key=True)
    run_id = db.Column(db.String(30),unique=True)
    library_reads_sequenced = db.Column(db.BIGINT)
    total_num_bases = db.Column(db.BIGINT)
    download_size = db.Column(db.BIGINT)
    avg_read_length = db.Column(db.Float)
    baseA_count = db.Column(db.BIGINT)
    baseC_count = db.Column(db.BIGINT)
    baseG_count = db.Column(db.BIGINT)
    baseT_count = db.Column(db.BIGINT)
    baseN_count = db.Column(db.BIGINT)
    gc_percent = db.Column(db.Float)
    run_quality_counts = db.Column(db.Text)
    dataset_id = db.Column(db.Integer, db.ForeignKey('dataset.id'))

    def __init__(self, dataset_id=None, run_id=None, library_reads_sequenced=None, total_num_bases=None, download_size=None, avg_read_length=None, baseA_count=None, baseC_count=None, baseG_count=None, baseT_count=None, baseN_count=None, gc_percent=None, run_quality_counts=None):
        self.dataset_id = dataset_id
        self.run_id = run_id
        self.library_reads_sequenced = library_reads_sequenced
        self.total_num_bases = total_num_bases
        self.download_size = download_size
        self.avg_read_length = avg_read_length
        self.baseA_count = baseA_count
        self.baseC_count = baseC_count
        self.baseG_count = baseG_count
        self.baseT_count = baseT_count
        self.baseN_count = baseN_count
        self.gc_percent = gc_percent
        self.run_quality_counts = run_quality_counts

    def __repr__(self):
        return '<Run %r>' % self.run_id

class Publication(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    pubmed_uid = db.Column(db.String(30),unique=True,index=True)
    pubmed_link = db.Column(db.Text)
    pub_publication_date = db.Column(db.DateTime)
    pub_authors = db.Column(db.Text)
    pub_title = db.Column(db.Text)
    pub_volume = db.Column(db.String(20))
    pub_issue = db.Column(db.String(20))
    pub_pages = db.Column(db.String(30))
    pub_journal = db.Column(db.Text)
    pub_doi = db.Column(db.Text)

    datasets = db.relationship('Dataset', secondary=dataset_to_publication, backref=db.backref('publications', lazy='dynamic'))

    def __init__(self, pubmed_uid=None, pubmed_link=None, pub_publication_date=None, pub_authors=None, pub_title=None, pub_volume=None, pub_issue=None, pub_pages=None, pub_journal=None, pub_doi=None, datasets=None):
        self.pubmed_uid = pubmed_uid
        self.pubmed_link = pubmed_link
        self.pub_publication_date = pub_publication_date
        self.pub_authors = pub_authors
        self.pub_title = pub_title
        self.pub_volume = pub_volume
        self.pub_issue = pub_issue
        self.pub_pages = pub_pages
        self.pub_journal = pub_journal
        self.pub_doi = pub_doi

    def __repr__(self):
        return '<Publication %r>' % self.pubmed_uid

class ScrapeError(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    uid = db.Column(db.String(30),index=True)
    error_msg = db.Column(db.Text)
    function = db.Column(db.String(50))
    date_scraped = db.Column(db.DateTime)

    def __init__(self, uid=None,error_msg=None,function=None,date_scraped=None):
        self.uid = uid
        self.error_msg = error_msg
        self.function = function
        self.date_scraped = date_scraped

    def __repr__(self):
        return '<ScrapeError %r>' % self.error_msg

class Filter(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filter_params = db.Column(db.Text)
    date_searched = db.Column(db.DateTime)

    def __init__(self, filter_params, date_searched=None):
        self.filter_params = filter_params
        self.date_searched = datetime.utcnow()

    def __repr__(self):
        return '<Filter %r>' % self.filter_params
