CREATE TABLE dataset (
  id  integer not null  distkey,
  biosample_link  varchar(65535),
  sample_title  varchar(65535),
  investigation_type  varchar(80),
  library_source  varchar(50),
  env_package varchar(100),
  collection_date varchar(65535),
  latitude  varchar(65535),
  longitude varchar(65535),
  age varchar(65535),
  altitude  varchar(65535),
  assembly  varchar(65535),
  avg_read_length_maxrun  float,
  baseA_count_maxrun  bigint,
  baseC_count_maxrun  bigint,
  baseG_count_maxrun  bigint,
  baseN_count_maxrun  bigint,
  baseT_count_maxrun  bigint,
  biomaterial_provider  varchar(65535),
  bioproject_id varchar(40),
  biosample_id  varchar(40),
  biosample_models  varchar(65535),
  biosample_package varchar(65535),
  biosample_uid varchar(30),
  collection_time varchar(65535),
  db_source varchar(20),
  db_source_uid varchar(50) 	not null,
  depth varchar(65535),
  dev_stage varchar(65535),
  download_size_maxrun  bigint,
  elevation varchar(65535),
  env_biome varchar(300),
  env_feature varchar(200),
  env_material  varchar(200),
  estimated_size  varchar(65535),
  experimental_factor varchar(65535),
  expt_design_description varchar(65535),
  expt_id varchar(30),
  expt_link varchar(65535),
  expt_title  varchar(65535),
  finishing_strategy  varchar(65535),
  gc_percent_maxrun float,
  geo_loc_name  varchar(300),
  host_disease  varchar(65535),
  instrument_model  varchar(50),
  isol_growth_condt varchar(65535),
  lat_lon varchar(65535),
  library_construction_method varchar(20),
  library_construction_protocol varchar(65535),
  library_name  varchar(65535),
  library_reads_sequenced_maxrun  bigint,
  library_screening_strategy  varchar(80),
  library_strategy  varchar(50),
  metadata_publication_date datetime,
  ncbi_taxon_id varchar(50),
  num_replicons varchar(65535),
  num_runs_in_accession integer,
  organization_address  varchar(65535),
  organization_contacts varchar(65535),
  organization_name varchar(65535),
  ploidy  varchar(65535),
  project_name  varchar(65535),
  propagation varchar(65535),
  ref_biomaterial varchar(65535),
  run_ids_maxrun  varchar(30),
  run_quality_counts_maxrun varchar(65535),
  sample_attributes varchar(65535),
  sample_description  varchar(65535),
  sample_id varchar(30),
  sample_type varchar(65535),
  sequencing_method varchar(65535),
  sex varchar(65535),
  specific_host varchar(65535),
  study_abstract  varchar(65535),
  study_attributes  varchar(65535),
  study_id  varchar(30),
  study_links varchar(65535),
  study_title varchar(65535),
  study_type  varchar(50),
  study_type_other  varchar(65535),
  submission_id varchar(30),
  subspecific_genetic_lineage varchar(65535),
  target_gene varchar(65535),
  target_subfragment  varchar(65535),
  taxon_common_name varchar(65535),
  taxon_scientific_name varchar(65535),
  tissue  varchar(65535),
  total_num_bases_maxrun  bigint,
  date_scraped  datetime,
  meta_latitude float,
  meta_longitude  float,
  metaseek_env_package  varchar(50),
  metaseek_investigation_type varchar(50) sortkey,
  metaseek_investigation_type_P float,
  metaseek_mixs_specification varchar(20),
  metaseek_mixs_specification_P float,
  metaseek_sequencing_method  varchar(50)
);

CREATE TABLE discovery (
  id  integer not null,
  filter_params varchar(65535),
  date_created datetime sortkey,
  owner_id  integer distkey,
  discovery_title varchar(65535),
  discovery_description varchar(65535),
  num_datasets  integer
);

CREATE TABLE run (
  id  integer not null,
  run_id  varchar(30),
  library_reads_sequenced bigint,
  total_num_bases bigint,
  download_size bigint,
  avg_read_length float,
  baseA_count bigint,
  baseC_count bigint,
  baseG_count bigint,
  baseT_count bigint,
  baseN_count bigint,
  gc_percent  float,
  run_quality_counts  varchar(65535),
  dataset_id  integer sortkey distkey
);

CREATE TABLE account (
  id  integer not null sortkey distkey,
  firebase_id varchar(28),
  admin integer,
  firebase_name varchar(50)
);

CREATE TABLE publication (
  id  integer not null  sortkey distkey,
  pubmed_uid  varchar(30),
  pubmed_link varchar(65535),
  pub_publication_date  datetime,
  pub_authors varchar(65535),
  pub_title varchar(65535),
  pub_volume  varchar(20),
  pub_issue varchar(20),
  pub_pages varchar(30),
  pub_journal varchar(65535),
  pub_doi varchar(65535)
);

CREATE TABLE dataset_to_publication (
  dataset_id  integer,
  publication_id  integer
)
diststyle even;

CREATE TABLE filter (
  id  integer not null,
  filter_params varchar(65535),
  date_searched datetime  sortkey)
diststyle even;

CREATE TABLE scrape_error (
  id  integer not null,
  uid varchar(30),
  error_msg varchar(65535),
  function  varchar(50),
  date_scraped  datetime  sortkey)
diststyle even;

CREATE TABLE alembic_version (
  version_num varchar(65535)
);
