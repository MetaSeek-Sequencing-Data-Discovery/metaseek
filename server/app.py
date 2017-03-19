# Webapp framework
from flask import Flask, url_for
from flask_cors import CORS, cross_origin

# Database setup and ORM
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func

# Support for REST API in Flask
from flask_restful import Resource, Api, reqparse, fields, marshal_with

# Utilities
from datetime import datetime
from dateutil import parser as dateparser
import random
import json
from collections import Counter
import numpy as np
import pandas as pd

import os
dbPass = os.environ['METASEEK_DB']

# Config / initialize the app, database and api
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://metaseek:' + dbPass + '@ec2-35-166-20-248.us-west-2.compute.amazonaws.com/metaseek'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
api = Api(app)

# Declare Models - Dataset, User, Discovery
# each class becomes a table
class Dataset(db.Model):
    # each attribute on a "Model" inherited class becomes a Column
    id = db.Column(db.Integer, primary_key=True)

    biosample_link = db.Column(db.Text)
    sample_title = db.Column(db.Text)
    investigation_type = db.Column(db.Text)
    library_source = db.Column(db.Text)
    env_package = db.Column(db.Text)
    collection_date = db.Column(db.DateTime)
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)

    avg_read_length = db.Column(db.Float)
    total_num_reads = db.Column(db.Integer)
    total_num_bases = db.Column(db.Integer)
    download_size = db.Column(db.Integer)
    avg_percent_gc = db.Column(db.Float)

    #etc = db.Column(db.PickleType)

    # Each class must have an init function
    def __init__(self,biosample_link=None,sample_title=None,investigation_type=None,library_source=None,env_package=None,collection_date=None,latitude=None,longitude=None,avg_read_length=None,total_num_reads=None,total_num_bases=None,download_size=None,avg_percent_gc=None):
        self.latitude = latitude
        self.longitude = longitude
        self.investigation_type = investigation_type
        self.env_package = env_package
        self.library_source = library_source
        self.avg_read_length = avg_read_length
        self.collection_date = collection_date
        self.total_num_reads = total_num_reads
        self.total_num_bases = total_num_bases
        self.download_size = download_size
        self.avg_percent_gc = avg_percent_gc
        self.biosample_link = biosample_link
        self.sample_title = sample_title

    # Friendly string representation
    def __repr__(self):
        return '<Dataset %r>' % self.biosample_link

# For a many to many database relationship, use a mapping table (no class definition directly)
# Eg. each discovery will have many datasets, and each dataset may belong to many discoveries
# Each row in this table is one "dataset in discovery" membership
dataset_to_discovery = db.Table('dataset_to_discovery',
    db.Column('dataset_id', db.Integer, db.ForeignKey('dataset.id')),
    db.Column('discovery_id', db.Integer, db.ForeignKey('discovery.id'))
)

class Discovery(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filter_params = db.Column(db.Text)
    timestamp = db.Column(db.DateTime)
    datasets = db.relationship('Dataset', secondary=dataset_to_discovery, backref=db.backref('discoveries', lazy='dynamic'))
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    owner = db.relationship('User',backref=db.backref('myDiscoveries',lazy='dynamic'))

    def __init__(self, owner_id, filter_params, datasets, timestamp=None, ):
        self.owner_id = owner_id
        self.filter_params = filter_params
        self.datasets = datasets
        if timestamp is None:
            timestamp = datetime.utcnow()
        self.timestamp = timestamp

    def __repr__(self):
        return '<Discovery %r>' % self.filter_params

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    firebase_id = db.Column(db.String(28), unique=True)
    admin = db.Column(db.Boolean)
    discoveries = db.relationship('Discovery', backref='user', lazy='dynamic')

    def __init__(self, firebase_id, admin=False):
        self.firebase_id = firebase_id
        self.admin = admin

    def __repr__(self):
        return '<User %r>' % self.firebase_id

# TODO take this out into a 'bootstrap.py' file for kickstarting a new DB
db.create_all()

# End Model definitions and create any new tables in the DB

# Utility functions
def filterQueryByRule(targetClass,queryObject,field,ruletype,value):
    fieldattr = getattr(targetClass,field)
    if ruletype == 0:
        queryObject = queryObject.filter(fieldattr == value)
    elif ruletype == 1:
        queryObject = queryObject.filter(fieldattr < value)
    elif ruletype == 2:
        queryObject = queryObject.filter(fieldattr > value)
    elif ruletype == 3:
        queryObject = queryObject.filter(fieldattr <= value)
    elif ruletype == 4:
        queryObject = queryObject.filter(fieldattr >= value)
    elif ruletype == 5:
        queryObject = queryObject.filter(fieldattr == value)
    elif ruletype == 6:
        queryObject = queryObject.filter(fieldattr != value)
    elif ruletype == 7:
        queryObject = queryObject.filter(fieldattr.like('%' + value + '%'))
    elif ruletype == 8:
        queryObject = queryObject.filter(fieldattr.in_(value))
    elif ruletype == 9:
        queryObject = queryObject.filter(~fieldattr.in_(value))
    elif ruletype == 10:
        queryObject = queryObject.filter(fieldattr != None)

    return queryObject

# Declare route functions
# /user routes
class CreateUser(Resource):
    def post(self):
        try:
            parser = reqparse.RequestParser()
            parser.add_argument('firebase_id', type=str, help='Email address to create user')
            parser.add_argument('admin', type=int)
            args = parser.parse_args()

            existingUser = User.query.filter_by(firebase_id=args['firebase_id']).first()

            if (existingUser):
                return {'error':'User already exists!','uri':'http://127.0.0.1:5000/api/user/' + str(existingUser.id)}
            else:
                newUser = User(args['firebase_id'],args['admin'])
                db.session.add(newUser)
                db.session.commit()
                return {"user":{"uri":url_for('getuser',id=newUser.id,_external=True)}}

        except Exception as e:
            return {'error': str(e)}
    def get(self):
        return "hi!"

class GetUser(Resource):
    @marshal_with({
        'firebase_id':fields.String,
        'admin':fields.Integer,
        'uri':fields.Url('getuser', absolute=True)
    }, envelope='user')
    def get(self, id):
        return User.query.get(id)

class GetAllUsers(Resource):
    @marshal_with({
        'firebase_id':fields.String,
        'admin':fields.Integer,
        'uri':fields.Url('getuser', absolute=True)
    }, envelope='users')
    def get(self):
        return User.query.all()

class GetUserDiscoveries(Resource):
    @marshal_with({
        'filter_params':fields.String,
        'timestamp':fields.DateTime(dt_format='rfc822'),
        'uri': fields.Url('getdiscovery', absolute=True)
    }, envelope='discoveries')

    def get(self, id):
        return Discovery.query.filter_by(owner_id=id).all()

# /dataset routes
class CreateDataset(Resource):
    def post(self):
        try:
            parser = reqparse.RequestParser()
            parser.add_argument('latitude', type=float, help='Email address to create user')
            parser.add_argument('longitude', type=float)
            parser.add_argument('investigation_type',type=str)
            parser.add_argument('env_package',type=str)
            parser.add_argument('library_source',type=str)
            parser.add_argument('avg_read_length',type=float)
            parser.add_argument('total_num_reads',type=int)
            parser.add_argument('total_num_bases',type=int)
            parser.add_argument('download_size',type=int)
            parser.add_argument('avg_percent_gc',type=float)
            parser.add_argument('biosample_link',type=str)
            parser.add_argument('sample_title',type=str)
            parser.add_argument('collection_date',type=str)

            args = parser.parse_args()
            try:
                datetimeguess = dateparser.parse(args['collection_date'])
            except ValueError:
                datetimeguess = None

            newDataset = Dataset(args['biosample_link'],args['sample_title'],args['investigation_type'],args['library_source'], args['env_package'],datetimeguess, args['latitude'], args['longitude'], args['avg_read_length'], args['total_num_reads'], args['total_num_bases'], args['download_size'],args['avg_percent_gc'])
            db.session.add(newDataset)
            db.session.commit()
            return {"dataset":{"id":newDataset.id,"uri":url_for('getdataset',id=newDataset.id,_external=True)}}

        except Exception as e:
            return {'error': str(e)}

marshalledDatasetFields = {
    'latitude':fields.Float,
    'longitude':fields.Float,
    'investigation_type':fields.String,
    'env_package':fields.String,
    'library_source':fields.String,
    'avg_read_length':fields.Float,
    'total_num_reads':fields.Integer,
    'total_num_bases':fields.Integer,
    'download_size':fields.Integer,
    'avg_percent_gc':fields.Float,
    'biosample_link':fields.String,
    'collection_date':fields.DateTime,
    'sample_title':fields.String,
    'id':fields.Integer,
    #this should also return the etc field for e.g. dataset details
    'uri': fields.Url('getdataset', absolute=True)
}

class GetDataset(Resource):
    @marshal_with(marshalledDatasetFields, envelope='dataset')
    def get(self, id):
        return Dataset.query.get(id)

class GetAllDatasets(Resource):
    @marshal_with(marshalledDatasetFields, envelope='datasets')
    def get(self):
        return Dataset.query.all()

class GetDatasetSummary(Resource):
    def get(self):
        total = Dataset.query.count()
        total_download_size = db.session.query(func.sum(Dataset.download_size)).first()[0]

        #investigation_type
        investigation_summary = dict(db.session.query(Dataset.investigation_type, func.count(Dataset.investigation_type)).group_by(Dataset.investigation_type).all())
        if None in investigation_summary.keys():
            del investigation_summary[None]

        #counts of each category in library_source (for histograms)
        lib_source_summary = dict(db.session.query(Dataset.library_source, func.count(Dataset.library_source)).group_by(Dataset.library_source).all())
        if None in lib_source_summary.keys():
            del lib_source_summary[None]

        #env_package
        env_pkg_summary = dict(db.session.query(Dataset.env_package, func.count(Dataset.env_package)).group_by(Dataset.env_package).all())
        if None in env_pkg_summary.keys():
            del env_pkg_summary[None]

        #collection_date - keep just year for summary for now (might want month for e.g. season searches later on, but default date is 03-13 00:00:00 and need to deal with that)
        year_summary = dict(db.session.query(func.date_format(Dataset.collection_date, '%Y'),func.count(func.date_format(Dataset.collection_date, '%Y'))).group_by(func.date_format(Dataset.collection_date, '%Y')).all())
        if None in year_summary.keys():
            del year_summary[None]

        #latitude
        lat_summary = dict(db.session.query(Dataset.latitude, func.count(Dataset.latitude)).group_by(Dataset.latitude).all())
        lat_bins = Counter()
        for k,v in lat_summary.items(): #is there a way to do this that doesn't loop through each returned value?
            if not k:
                next
            else:
                lat_bins[round(k,0)] += v

        #longitude
        lon_summary = dict(db.session.query(Dataset.longitude, func.count(Dataset.longitude)).group_by(Dataset.longitude).all())
        lon_bins = Counter()
        for k,v in lon_summary.items(): #is there a way to do this that doesn't loop through each returned value?
            if not k:
                next
            else:
                lon_bins[round(k,0)] += v

        #avg_read_length
        read_length_summary = dict(db.session.query(Dataset.avg_read_length, func.count(Dataset.avg_read_length)).group_by(Dataset.avg_read_length).all())
        rd_lgth_bins = Counter()
        for k,v in read_length_summary.items(): #is there a way to do this that doesn't loop through each returned value?
            if not k:
                next
            else:
                rd_lgth_bins[round(k,-2)] += v

        #total_num_reads
        total_rds_summary = dict(db.session.query(Dataset.total_num_reads, func.count(Dataset.total_num_reads)).group_by(Dataset.total_num_reads).all())
        total_rds_bins = Counter()
        for k,v in total_rds_summary.items():
            if int(k)==0:
                total_rds_bins['0'] += v #lotsa zeros
            elif int(k)<1000: #if lower than 1000, count by hundreds
                total_rds_bins[round(k,-2)] += v
            elif int(k)<10000: #if lower than 10000, count by thousands
                total_rds_bins[round(k,-3)] += v
            elif int(k)<100000: #if between 10000-100,000, count by 10,000
                total_rds_bins[round(k,-4)] += v
            elif int(k)<1000000: #if between 100,000-1,000,000, count by 100,000
                total_rds_bins[round(k,-5)] += v
            elif int(k)<10000000: #if between 1,000,000-10,000,000, count by 1,000,000
                total_rds_bins[round(k,-6)] += v
            else:
                total_rds_bins[round(k,-7)] += v #above 10,000,000, count by 10M

        #total_num_bases
        total_bases_summary = dict(db.session.query(Dataset.total_num_bases, func.count(Dataset.total_num_bases)).group_by(Dataset.total_num_bases).all())
        total_bases_bins = Counter()
        for k,v in total_bases_summary.items():
            if int(k)==0:
                total_bases_bins['0'] += v
            elif int(k)<1000: #if lower than 1000, count by hundreds
                total_bases_bins[round(k,-2)] += v
            elif int(k)<10000: #if lower than 10000, count by thousands
                total_bases_bins[round(k,-3)] += v
            elif int(k)<100000: #if between 10000-100,000, count by 10,000
                total_bases_bins[round(k,-4)] += v
            elif int(k)<1000000: #if between 100,000-1,000,000, count by 100,000
                total_bases_bins[round(k,-5)] += v
            elif int(k)<10000000: #if between 1,000,000-10,000,000, count by 1,000,000
                total_bases_bins[round(k,-6)] += v
            elif int(k)<100000000: #if between 10,000,000-100,000,000, count by 10,000,000
                total_bases_bins[round(k,-7)] += v
            else:
                total_bases_bins[round(k,-8)] += v #above 100,000,000, count by 100M

        #download_size (numeric binning example)
        down_size_summary = dict(db.session.query(Dataset.download_size, func.count(Dataset.download_size)).group_by(Dataset.download_size).all())
        down_size_bins = Counter()
        for k,v in down_size_summary.items():
            if int(k)==0:
                down_size_bins['0'] += v #lotsa zeros
            elif int(k)<1000000:
                down_size_bins['0.1'] += v #many are skewed, can create long tail bin
            elif int(k)<10000000:
                down_size_bins['1000000'] += v
            else:
                down_size_bins[round(k,-7)] += v #round every 10MB

        #avg_percent_gc
        avg_gc_summary = dict(db.session.query(Dataset.avg_percent_gc, func.count(Dataset.avg_percent_gc)).group_by(Dataset.avg_percent_gc).all())
        avg_gc_bins = Counter()
        for k,v in avg_gc_summary.items(): #is there a way to do this that doesn't loop through each returned value?
            if not k:
                next
            else:
                avg_gc_bins[round(k,2)] += v

        #latlon map
        latlon = db.session.query(Dataset.latitude,Dataset.longitude).filter(Dataset.latitude.isnot(None),Dataset.longitude.isnot(None)).all()
        latlon = pd.DataFrame(latlon,columns=['latitude','longitude']) #0th column is lat (yaxis), 1th column is lon (xaxis)
        latlon_map = np.histogram2d(x=latlon['longitude'],y=latlon['latitude'],bins=[36,18], range=[[-180, 180], [-90, 90]]) #range should be flexible to rules in DatasetSearchSummary
        #latlon_map[0] is the lonxlat (XxY) array of counts; latlon_map[1] is the nx/lon bin starts; map[2] ny/lat bin starts
        lonstepsize = (latlon_map[1][1]-latlon_map[1][0])/2
        latstepsize = (latlon_map[2][1]-latlon_map[2][0])/2
        map_data = []
        for lon_ix,lonbin in enumerate(latlon_map[0]):
            for lat_ix,latbin in enumerate(lonbin):
                #[latlon_map[2][ix]+latstepsize for ix,latbin in enumerate(latlon_map[0][0])]
                lat = latlon_map[2][lat_ix]+latstepsize
                lon = latlon_map[1][lon_ix]+lonstepsize
                value = latbin
                map_data.append({"lat":lat,"lon":lon,"count":value})

        #num_latlon_None
        num_latlon_None = (Dataset.query.count()-Dataset.query.filter(Dataset.latitude.isnot(None),Dataset.longitude.isnot(None)).count())

        return {"summary":{"totalDatasets":int(total),
        "totalDownloadSize":int(total_download_size),
        "investigation_type_summary":investigation_summary,
        "library_source_summary":lib_source_summary,
        "env_package_summary":env_pkg_summary,
        "year_collected_summary":year_summary,
        "latitude_summary":lat_bins,
        "longitude_summary":lon_bins,
        "avg_read_length_summary":rd_lgth_bins,
        "total_reads_summary":total_rds_bins,
        "total_bases_summary":total_bases_bins,
        "download_size_summary":down_size_bins,
        "avg_percent_gc_summary":avg_gc_bins,
        "latlon_map":map_data,
        "num_latlon_None":num_latlon_None
        }}

class SearchDatasets(Resource):
    @marshal_with(marshalledDatasetFields, envelope='datasets')
    def post(self):
        try:
            parser = reqparse.RequestParser()
            parser.add_argument('filter_params', type=str)
            args = parser.parse_args()
            filter_params = json.loads(args['filter_params'])
            rules = filter_params['rules']

            queryObject = Dataset.query

            print rules
            for rule in rules:
                field = rule['field']
                ruletype = rule['type']
                value = rule['value']
                queryObject = filterQueryByRule(Dataset,queryObject,field,ruletype,value)

            matchingDatasets = queryObject.all()
            print matchingDatasets
            return matchingDatasets

        except Exception as e:
            return {'error': str(e)}

class SearchDatasetsSummary(Resource):
    def post(self):
        try:
            parser = reqparse.RequestParser()
            parser.add_argument('filter_params', type=str)
            args = parser.parse_args()

            filter_params = json.loads(args['filter_params'])
            rules = filter_params['rules']

            queryObject = Dataset.query

            for rule in rules:
                field = rule['field']
                ruletype = rule['type']
                value = rule['value']
                queryObject = filterQueryByRule(Dataset,queryObject,field,ruletype,value)

            matchCount = queryObject.count()
            return matchCount

        except Exception as e:
            return {'error': str(e)}

# /discovery routes
class GetDiscovery(Resource):
    @marshal_with({
        'filter_params':fields.String,
        'timestamp':fields.DateTime(dt_format='rfc822'),
        'uri': fields.Url('getdiscovery', absolute=True),
        'datasets':fields.Nested(marshalledDatasetFields),
        'owner':fields.Nested({
            'firebase_id':fields.String,
            'uri':fields.Url('getuser', absolute=True)
        })
    }, envelope='discovery')
    def get(self, id):
        return Discovery.query.get(id)

class GetAllDiscoveries(Resource):
    @marshal_with({
        'filter_params':fields.String,
        'timestamp':fields.DateTime(dt_format='rfc822'),
        'uri': fields.Url('getdiscovery', absolute=True),
        'datasets':fields.Nested(marshalledDatasetFields),
        'owner':fields.Nested({
            'firebase_id':fields.String,
            'uri':fields.Url('getuser', absolute=True)
        })
    }, envelope='discoveries')
    def get(self):
        return Discovery.query.all()

class CreateDiscovery(Resource):
    def post(self):
        try:
            parser = reqparse.RequestParser()
            parser.add_argument('owner_id', type=int)
            parser.add_argument('filter_params', type=str)
            args = parser.parse_args()

            filter_params = json.loads(args['filter_params'])
            rules = filter_params['rules']

            queryObject = Dataset.query

            for rule in rules:
                field = rule['field']
                ruletype = rule['type']
                value = rule['value']
                queryObject = filterQueryByRule(Dataset,queryObject,field,ruletype,value)

            matchingDatasets = queryObject.all()

            newDiscovery = Discovery(args['owner_id'],args['filter_params'],matchingDatasets)
            db.session.add(newDiscovery)
            db.session.commit()
            return {"discovery":{"id":newDiscovery.id,"uri":url_for('getdiscovery',id=newDiscovery.id,_external=True)}}

        except Exception as e:
            return {'error': str(e)}

# End route functions

# Declare routing
api.add_resource(CreateUser,            '/api/user/create')
api.add_resource(GetUser,               '/api/user/<int:id>')
api.add_resource(GetAllUsers,           '/api/users')
api.add_resource(GetUserDiscoveries,    '/api/user/<int:id>/discoveries')

api.add_resource(CreateDataset,         '/api/dataset/create')
api.add_resource(GetDataset,            '/api/dataset/<int:id>')
api.add_resource(GetAllDatasets,        '/api/datasets')
api.add_resource(GetDatasetSummary,     '/api/datasets/summary')
api.add_resource(SearchDatasets,        '/api/datasets/search')
api.add_resource(SearchDatasetsSummary, '/api/datasets/search/summary')

api.add_resource(CreateDiscovery,       '/api/discovery/create')
api.add_resource(GetDiscovery,          '/api/discovery/<int:id>')
api.add_resource(GetAllDiscoveries,     '/api/discoveries')

# Start the app!
if __name__ == '__main__':
    app.run()
