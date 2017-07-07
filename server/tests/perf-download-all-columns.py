import sys
sys.path.append('..')
from app import *
from datetime import datetime
import pandas as pd

columns = [
    Dataset.investigation_type,
    Dataset.library_source,
    Dataset.env_package,
    Dataset.library_strategy,
    Dataset.library_screening_strategy,
    Dataset.library_construction_method,
    Dataset.study_type,
    Dataset.sequencing_method,
    Dataset.instrument_model,
    Dataset.geo_loc_name,
    Dataset.env_biome,
    Dataset.env_feature,
    Dataset.env_material,
    Dataset.avg_read_length_maxrun,
    Dataset.gc_percent_maxrun,
    Dataset.meta_latitude,
    Dataset.meta_longitude,
    Dataset.library_reads_sequenced_maxrun,
    Dataset.total_num_bases_maxrun,
    Dataset.download_size_maxrun
]

# There seems to be a penalty for the first query run in a session (small, ~50ms)
# Run a query to eat up that penalty
first = Dataset.query.first()

startTotal = datetime.now()
print '\nsingle column single record load with Dataset.query.with_entities(column).first()\n'
print 'time\tvalue\tcolumn'
for column in columns:
    start = datetime.now()
    result = Dataset.query.with_entities(column).first()
    finish = datetime.now()
    print str(1000 * (finish - start).total_seconds()) + ' ms\t' + str(result) + '\t' + str(column)
finishTotal = datetime.now()
print str(1000 * (finishTotal - startTotal).total_seconds()) + ' ms for all tests'

startTotal = datetime.now()
print '\nsingle column single record load with pd.read_sql(Dataset.query.with_entities(column).limit(1).statement,db.session.bind)\n'
print 'time\tvalue\tcolumn'
for column in columns:
    start = datetime.now()
    statement = Dataset.query.with_entities(column).limit(1).statement
    result = pd.read_sql(statement,db.session.bind)
    finish = datetime.now()
    print str(1000 * (finish - start).total_seconds()) + ' ms\t' + str(result[[column.key]].values[0]) + '\t' + str(column)
finishTotal = datetime.now()
print str(1000 * (finishTotal - startTotal).total_seconds()) + ' ms for all tests'

startTotal = datetime.now()
print '\nfull single column load with Dataset.query.with_entities(column).all()\n'
print 'time\t# of records\tcolumn'
for column in columns:
    start = datetime.now()
    results = Dataset.query.with_entities(column).all()
    count = len(results)
    finish = datetime.now()
    print str(1000 * (finish - start).total_seconds()) + ' ms\t' + str(count) + ' records' + '\t' + str(column)
finishTotal = datetime.now()
print str(1000 * (finishTotal - startTotal).total_seconds()) + ' ms for all tests'

startTotal = datetime.now()
print '\nfull single column load with pd.read_sql(Dataset.query.with_entities(column).statement,db.session.bind)\n'
print 'time\t# of records\tcolumn'
for column in columns:
    start = datetime.now()
    statement = Dataset.query.with_entities(column).statement
    results = pd.read_sql(statement,db.session.bind)
    count = len(results)
    finish = datetime.now()
    print str(1000 * (finish - start).total_seconds()) + ' ms\t' + str(count) + ' records' + '\t' + str(column)
finishTotal = datetime.now()
print str(1000 * (finishTotal - startTotal).total_seconds()) + ' ms for all tests'

startTotal = datetime.now()
print '\n19 column single record load with Dataset.query.with_entities(columns).first()\n'
result = Dataset.query.with_entities(Dataset.download_size_maxrun,
        Dataset.investigation_type,
        Dataset.library_source,
        Dataset.env_package,
        Dataset.library_strategy,
        Dataset.library_screening_strategy,
        Dataset.library_construction_method,
        Dataset.study_type,
        Dataset.sequencing_method,
        Dataset.instrument_model,
        Dataset.geo_loc_name,
        Dataset.env_biome,
        Dataset.env_feature,
        Dataset.env_material,
        Dataset.avg_read_length_maxrun,
        Dataset.gc_percent_maxrun,
        Dataset.meta_latitude,
        Dataset.meta_longitude,
        Dataset.library_reads_sequenced_maxrun,
        Dataset.total_num_bases_maxrun).first()
finishTotal = datetime.now()
print str(1000 * (finishTotal - startTotal).total_seconds()) + ' ms for bulk test'

startTotal = datetime.now()
print '\n19 column single record load with pd.read_sql(Dataset.query.with_entities(columns).limit(1).statement,db.session.bind)\n'
statement = Dataset.query.with_entities(Dataset.download_size_maxrun,
        Dataset.investigation_type,
        Dataset.library_source,
        Dataset.env_package,
        Dataset.library_strategy,
        Dataset.library_screening_strategy,
        Dataset.library_construction_method,
        Dataset.study_type,
        Dataset.sequencing_method,
        Dataset.instrument_model,
        Dataset.geo_loc_name,
        Dataset.env_biome,
        Dataset.env_feature,
        Dataset.env_material,
        Dataset.avg_read_length_maxrun,
        Dataset.gc_percent_maxrun,
        Dataset.meta_latitude,
        Dataset.meta_longitude,
        Dataset.library_reads_sequenced_maxrun,
        Dataset.total_num_bases_maxrun).limit(1).statement
result = pd.read_sql(statement,db.session.bind)
finishTotal = datetime.now()
print str(1000 * (finishTotal - startTotal).total_seconds()) + ' ms for bulk test'

startTotal = datetime.now()
print '\nfull 19 column load with Dataset.query.with_entities(columns).all()\n'
results = Dataset.query.with_entities(Dataset.download_size_maxrun,
        Dataset.investigation_type,
        Dataset.library_source,
        Dataset.env_package,
        Dataset.library_strategy,
        Dataset.library_screening_strategy,
        Dataset.library_construction_method,
        Dataset.study_type,
        Dataset.sequencing_method,
        Dataset.instrument_model,
        Dataset.geo_loc_name,
        Dataset.env_biome,
        Dataset.env_feature,
        Dataset.env_material,
        Dataset.avg_read_length_maxrun,
        Dataset.gc_percent_maxrun,
        Dataset.meta_latitude,
        Dataset.meta_longitude,
        Dataset.library_reads_sequenced_maxrun,
        Dataset.total_num_bases_maxrun).all()
count = len(results)
finishTotal = datetime.now()
print str(1000 * (finishTotal - startTotal).total_seconds()) + ' ms for bulk test'
print 'loaded ' + str(count) + ' records'

startTotal = datetime.now()
print '\nfull 19 column load with pd.read_sql(Dataset.query.with_entities(columns).statement,db.session.bind)\n'
statement = Dataset.query.with_entities(Dataset.download_size_maxrun,
        Dataset.investigation_type,
        Dataset.library_source,
        Dataset.env_package,
        Dataset.library_strategy,
        Dataset.library_screening_strategy,
        Dataset.library_construction_method,
        Dataset.study_type,
        Dataset.sequencing_method,
        Dataset.instrument_model,
        Dataset.geo_loc_name,
        Dataset.env_biome,
        Dataset.env_feature,
        Dataset.env_material,
        Dataset.avg_read_length_maxrun,
        Dataset.gc_percent_maxrun,
        Dataset.meta_latitude,
        Dataset.meta_longitude,
        Dataset.library_reads_sequenced_maxrun,
        Dataset.total_num_bases_maxrun).statement
results = pd.read_sql(statement,db.session.bind)
count = len(results)
finishTotal = datetime.now()
print str(1000 * (finishTotal - startTotal).total_seconds()) + ' ms for bulk test'
print 'loaded ' + str(count) + ' records'
