#replace the aws-access-key and secret-access-key with your actual keys from AWS

copy account from 's3://metaseek-redshift-migration/user_tbl.csv'
credentials 'aws_access_key_id=<aws-access-key>;aws_secret_access_key=<secret-access-key>'
delimiter '|'
region 'us-west-2';

copy discovery from 's3://metaseek-redshift-migration/discovery_tbl.csv'
credentials 'aws_access_key_id=<aws-access-key>;aws_secret_access_key=<secret-access-key>'
delimiter '|'
escape
region 'us-west-2';

copy publication from 's3://metaseek-redshift-migration/publication_tbl.csv'
credentials 'aws_access_key_id=<aws-access-key>;aws_secret_access_key=<secret-access-key>'
delimiter '\t'
region 'us-west-2';

copy dataset_to_publication from 's3://metaseek-redshift-migration/dataset_to_publication_tbl.csv'
credentials 'aws_access_key_id=<aws-access-key>;aws_secret_access_key=<secret-access-key>'
delimiter '|'
region 'us-west-2';

copy filter from 's3://metaseek-redshift-migration/filter_tbl.csv'
credentials 'aws_access_key_id=<aws-access-key>;aws_secret_access_key=<secret-access-key>'
delimiter '|'
region 'us-west-2';

copy scrape_error from 's3://metaseek-redshift-migration/scrape_error_tbl.csv'
credentials 'aws_access_key_id=<aws-access-key>;aws_secret_access_key=<secret-access-key>'
delimiter '|'
region 'us-west-2';

copy alembic_version from 's3://metaseek-redshift-migration/alembic_version_tbl.csv'
credentials 'aws_access_key_id=<aws-access-key>;aws_secret_access_key=<secret-access-key>'
delimiter '|'
region 'us-west-2';

copy run from 's3://metaseek-redshift-migration/run_tbl.csv'
credentials 'aws_access_key_id=<aws-access-key>;aws_secret_access_key=<secret-access-key>'
delimiter '|'
region 'us-west-2';

copy dataset from 's3://metaseek-redshift-migration/dataset_tbl.csv'
credentials 'aws_access_key_id=<aws-access-key>;aws_secret_access_key=<secret-access-key>'
delimiter '\t'
region 'us-west-2';
