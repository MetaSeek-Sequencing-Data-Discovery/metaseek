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

# production DB
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://metaseek:' + dbPass + '@ec2-35-166-20-248.us-west-2.compute.amazonaws.com/metaseek'

# local DB - uncomment for local testing
# app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost/metaseek'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
api = Api(app)

from models import *

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

def summarizeDatasets(queryObject):
    queryResultDataframe = pd.read_sql(queryObject.statement,db.session.bind)
    total = len(queryResultDataframe.index)
    if total == 0:
        return {
            "summary":{
                "totalDatasets":0,
                "totalDownloadSize":0,
                "investigation_type_summary":{},
                "library_source_summary":{},
                "env_package_summary":{},
                "year_collected_summary":{},
                "latitude_summary":{},
                "longitude_summary":{},
                "avg_read_length_summary":{},
                "total_reads_summary":{},
                "total_bases_summary":{},
                "download_size_summary":{},
                "avg_percent_gc_summary":{},
                "latlon_map":{},
                "empty":1
                }
            }
    else:
        total_download_size = sum(queryResultDataframe["download_size"])

        investigation_summary = dict(queryResultDataframe.groupby('investigation_type').size())
        if '' in investigation_summary.keys():
            del investigation_summary['']

        lib_source_summary = dict(queryResultDataframe.groupby('library_source').size())
        if '' in lib_source_summary.keys():
            del lib_source_summary['']

        env_pkg_summary = dict(queryResultDataframe.groupby('env_package').size())
        if '' in env_pkg_summary.keys():
            del env_pkg_summary['']

        # collection_date - keep just year for summary for now (might want month for e.g. season searches later on, but default date is 03-13 00:00:00 and need to deal with that)
        # Would really like to fill in empty values here, histogram of years without empty years is a bit odd
        yearFrame = queryResultDataframe['collection_date'].dt.to_period("A")
        year_summary = queryResultDataframe.groupby(yearFrame).size()
        year_summary.index = year_summary.index.to_series().astype(str)
        year_summary = dict(year_summary)

        lat_summary = dict(queryResultDataframe.groupby('latitude').size())
        lat_bins = Counter()
        for k,v in lat_summary.items(): #is there a way to do this that doesn't loop through each returned value?
            if not k:
                next
            else:
                lat_bins[round(k,0)] += v

        lon_summary = dict(queryResultDataframe.groupby('longitude').size())
        lon_bins = Counter()
        for k,v in lon_summary.items(): #is there a way to do this that doesn't loop through each returned value?
            if not k:
                next
            else:
                lon_bins[round(k,0)] += v

        read_length_summary = dict(queryResultDataframe.groupby('avg_read_length').size())
        rd_lgth_bins = Counter()
        for k,v in read_length_summary.items(): #is there a way to do this that doesn't loop through each returned value?
            if not k:
                next
            else:
                rd_lgth_bins[round(k,-2)] += v

        total_rds_summary = dict(queryResultDataframe.groupby('total_num_reads').size())
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

        total_bases_summary = dict(queryResultDataframe.groupby('total_num_bases').size())
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

        down_size_summary = dict(queryResultDataframe.groupby('download_size').size())
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

        avg_gc_summary = dict(queryResultDataframe.groupby('avg_percent_gc').size())
        avg_gc_bins = Counter()
        for k,v in avg_gc_summary.items(): #is there a way to do this that doesn't loop through each returned value?
            if not k:
                next
            else:
                avg_gc_bins[round(k,2)] += v

        latlon  = queryResultDataframe[['latitude','longitude']]
        latlon = latlon[pd.notnull(latlon['latitude'])]
        latlon = latlon[pd.notnull(latlon['longitude'])]
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

        return {
            "summary":{
                "totalDatasets":int(total),
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
                "latlon_map":map_data
                }
            }

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
                return {'error':'User already exists!','uri':url_for('getuser',id=existingUser.id,_external=True)}
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

            for rule in rules:
                field = rule['field']
                ruletype = rule['type']
                value = rule['value']
                queryObject = filterQueryByRule(Dataset,queryObject,field,ruletype,value)

            matchingDatasets = queryObject.all()
            return matchingDatasets

        except Exception as e:
            return {'error': str(e)}

class GetDatasetSummary(Resource):
    def get(self):
        queryObject = Dataset.query
        return summarizeDatasets(queryObject)

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

            return summarizeDatasets(queryObject)

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
            parser.add_argument('owner_id', type=str)
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

            owner = User.query.filter_by(firebase_id=args['owner_id']).first()

            newDiscovery = Discovery(owner.id,args['filter_params'],matchingDatasets)
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
    app.run(debug=True)
