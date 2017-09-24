import time
import mysql.connector
from sqlalchemy import case

# prod
# cnx = mysql.connector.connect(user='nick', password='REDACTED',host='ec2-52-33-134-115.us-west-2.compute.amazonaws.com',database='metaseek')

# local
#cnx = mysql.connector.connect(user='root',host='127.0.0.1',database='metaseek')

cursor = cnx.cursor()

def testQuery(query):
    start = time.time()
    print 'started at ' + str(start)
    cursor.execute(query)
    print '============ RESULTS ============== '
    for row in cursor.fetchall():
        print row
    finish = time.time()
    print 'finished at ' + str(finish)
    print 'time to run ' + str(finish-start)

subqueries = [
    "WHERE download_size_maxrun IS NOT NULL and library_source = 'genomic'",
    "WHERE library_source = 'transcriptomic'",
    "WHERE library_source = 'metagenomic'",
    "WHERE investigation_type = 'metagenome'",
    "WHERE study_type = 'Other'"
	]

for subquery in subqueries:
	print 'Running ' + subquery
	query = ("""SELECT t.maxrun_range, count(*)
	AS count
	FROM (
		SELECT CASE
			WHEN download_size_maxrun BETWEEN 0 AND 33 THEN '0-33'
			WHEN download_size_maxrun between 33 and 333 then '33-333'
			WHEN download_size_maxrun BETWEEN 333 AND 3333 THEN '333-3333'
			WHEN download_size_maxrun between 3333 and 33333 then '3333-33333'
			WHEN download_size_maxrun BETWEEN 33333 AND 333333 THEN '33333-333333'
			WHEN download_size_maxrun between 333333 and 3333333 then '333333-3333333'
			WHEN download_size_maxrun between 3333333 and 33333333 then '3333333-33333333'
			WHEN download_size_maxrun between 33333333 and 333333333 then '33333333-333333333'
			WHEN download_size_maxrun between 333333333 and 3333333333 then '333333333-3333333333'
			else '>3333333333'
		END as maxrun_range
	FROM dataset """ + subquery + """ AND RAND() < 0.001) t
	GROUP BY t.maxrun_range""")
	testQuery(query)
	print query
	print "============ END =============="

cursor.close()
cnx.close()
