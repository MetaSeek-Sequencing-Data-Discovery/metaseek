from app import db
import sframe
from dateutil import parser as dateparser
from models import *

sample_data = sframe.SFrame('./bootstrapData')

for row in sample_data:
    print row
    try:
        datetimeguess = dateparser.parse(row['collection_date'])
    except ValueError:
        datetimeguess = None
    newDataset = Dataset(row['biosample_link'],row['sample_title'],row['investigation_type'],row['library_source'], row['env_package'],datetimeguess, row['latitude'], row['longitude'], row['avg_read_length'], row['total_num_reads'], row['total_num_bases'], row['download_size'],row['avg_percent_gc'])
    print newDataset
    db.session.add(newDataset)
    db.session.commit()
