SELECT * FROM metaseek.user
INTO OUTFILE '/var/lib/mysql-files/user_tbl.csv'
FIELDS TERMINATED BY '|'
LINES TERMINATED BY '\n';

SELECT * FROM metaseek.discovery
INTO OUTFILE '/var/lib/mysql-files/discovery_tbl.csv'
FIELDS TERMINATED BY '|'
LINES TERMINATED BY '\n';

SELECT * FROM metaseek.publication
INTO OUTFILE '/var/lib/mysql-files/publication_tbl.csv'
FIELDS TERMINATED BY '\t'
LINES TERMINATED BY '\n';

SELECT * FROM metaseek.dataset_to_publication
INTO OUTFILE '/var/lib/mysql-files/dataset_to_publication_tbl.csv'
FIELDS TERMINATED BY '|'
LINES TERMINATED BY '\n';

SELECT * FROM metaseek.filter
INTO OUTFILE '/var/lib/mysql-files/filter_tbl.csv'
FIELDS TERMINATED BY '|'
LINES TERMINATED BY '\n';

SELECT * FROM metaseek.scrape_error
INTO OUTFILE '/var/lib/mysql-files/scrape_error_tbl.csv'
FIELDS TERMINATED BY '|'
LINES TERMINATED BY '\n';

SELECT * FROM metaseek.alembic_version
INTO OUTFILE '/var/lib/mysql-files/alembic_version_tbl.csv'
FIELDS TERMINATED BY '|'
LINES TERMINATED BY '\n';

SELECT * FROM metaseek.run
INTO OUTFILE '/var/lib/mysql-files/run_tbl.csv'
FIELDS TERMINATED BY '|'
LINES TERMINATED BY '\n';

#note I had to remove tabs from a few datasets to make this work; there was no ascii character that did not appear in at least some of the datasets... but tab was rarest
#ran these queries to remove tabs from columns where the culprits seemed to be:
#UPDATE dataset SET organization_contacts = REPLACE(organization_contacts, char(9), '')
#UPDATE dataset SET organization_address = REPLACE(organization_address, char(9), '')
#UPDATE dataset SET  organization_address = replace(organization_address, '\n', '')
#UPDATE dataset SET organization_name = REPLACE(organization_name, char(9), '')
SELECT * FROM metaseek.dataset
INTO OUTFILE '/var/lib/mysql-files/dataset_tbl.csv'
FIELDS TERMINATED BY '\t'
LINES TERMINATED BY '\n';
