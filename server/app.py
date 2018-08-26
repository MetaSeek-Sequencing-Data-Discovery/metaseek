from __future__ import division
from flask import Flask, url_for, make_response
from flask_cors import CORS, cross_origin
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api, Resource, reqparse, fields, marshal_with, marshal
from dateutil import parser as dateparser
from datetime import datetime
import json
import unicodecsv
import StringIO
from pyhashxx import hashxx
from pymemcache.client.base import Client
import os

dbPass = os.environ['METASEEK_DB']

# Config / initialize the app, database and api
app = Flask(__name__)
CORS(app)

# production DB
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://metaseek:' + dbPass + '@ec2-52-33-134-115.us-west-2.compute.amazonaws.com/metaseek'

# local DB - uncomment for local testing
#app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost/metaseek'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
api = Api(app)

# Set up memcached
def json_serializer(key, value):
    if type(value) == str:
        return value, 1
    return json.dumps(value), 2

def json_deserializer(key, value, flags):
    if flags == 1:
        return value
    if flags == 2:
        return json.loads(value)
    raise Exception("Unknown serialization format")

# production memcached
# client = Client(('TODO set up prod memcached', 11211), serializer=json_serializer, deserializer=json_deserializer)

# local memcached
client = Client(('localhost', 11211), serializer=json_serializer, deserializer=json_deserializer)

import tasks
from helpers import *
from models import *
from marshals import *

# Declare route functions
# /user routes
class CreateUser(Resource):
    def post(self):
        try:
            parser = reqparse.RequestParser()
            parser.add_argument('firebase_id', type=str, help='Email address to create user')
            parser.add_argument('firebase_name', type=str, help='Name to create user')
            parser.add_argument('admin', type=int)
            args = parser.parse_args()

            existingUser = Account.query.filter_by(firebase_id=args['firebase_id']).first()

            if (existingUser):
                return {'error':'User already exists!','uri':url_for('getuser',id=existingUser.id)}
            else:
                newUser = Account(args['firebase_id'],args['firebase_name'], args['admin'])
                db.session.add(newUser)
                db.session.commit()
                return {"user":{"uri":url_for('getuser',id=newUser.id)}}

        except Exception as e:
            return {'error': str(e)}
    def get(self):
        return "hi!"

class GetUser(Resource):
    @marshal_with({
        'firebase_id':fields.String,
        'firebase_name':fields.String,
        'admin':fields.Integer,
        'uri':fields.Url('getuser', absolute=True)
    }, envelope='user')
    def get(self, id):
        return Account.query.get(id)

class GetAllUsers(Resource):
    @marshal_with({
        'firebase_id':fields.String,
        'firebase_name':fields.String,
        'admin':fields.Integer,
        'uri':fields.Url('getuser', absolute=True)
    }, envelope='users')
    def get(self):
        return Account.query.all()

class GetUserDiscoveries(Resource):
    @marshal_with({
        'filter_params':fields.String,
        'timestamp':fields.DateTime(dt_format='rfc822'),
        'uri': fields.Url('getdiscovery', absolute=True),
        'discovery_title': fields.String,
        'num_datasets': fields.Integer
    }, envelope='discoveries')

    def get(self, id):
        owner = Account.query.filter_by(firebase_id=id).first()
        return Discovery.query.filter_by(owner_id=owner.id).all()

## /dataset routes
class GetDataset(Resource):
    @marshal_with(fullDatasetFields, envelope='dataset')
    def get(self, id):
        return Dataset.query.get(id)

datasetsPerPage = 15

class GetAllDatasets(Resource):
    def get(self,page):
        try:
            val = int(page)
            if val < 1:
                raise ValueError
        except ValueError:
            return {'error':'page must be a positive integer','page':page}
        pageObject = Dataset.query.paginate(page,datasetsPerPage,False)
        totalPageCount = int(math.ceil(pageObject.total / datasetsPerPage))
        paginatedDatasetResponse = {}
        paginatedDatasetResponse['currentUri'] = url_for('getalldatasets',page=page)
        paginatedDatasetResponse['page'] = page
        paginatedDatasetResponse['datasets'] = marshal(pageObject.items,summarizedDatasetFields)
        paginatedDatasetResponse['totalCount'] = pageObject.total
        paginatedDatasetResponse['perPage'] = datasetsPerPage
        paginatedDatasetResponse['totalPages'] = totalPageCount
        paginatedDatasetResponse['hasNext'] = pageObject.has_next
        paginatedDatasetResponse['hasPrevious'] = pageObject.has_prev
        if pageObject.has_prev:
            if len(pageObject.items) == 0:
                paginatedDatasetResponse['previousUri'] = url_for('getalldatasets',page=totalPageCount)
            else:
                paginatedDatasetResponse['previousUri'] = url_for('getalldatasets',page=page -1)
        if pageObject.has_next:
            paginatedDatasetResponse['nextUri'] = url_for('getalldatasets',page=page + 1)
        return paginatedDatasetResponse

class SearchDatasets(Resource):
    def post(self,page):
        try:
            val = int(page)
            if val < 1:
                raise ValueError
        except ValueError:
            return {'error':'page must be a positive integer','page':page}
        try:
            parser = reqparse.RequestParser()
            parser.add_argument('filter_params', type=str)
            args = parser.parse_args()
            filter_params = json.loads(args['filter_params'])

            queryObject = filterDatasetQueryObjectWithRules(Dataset.query,filter_params['rules'])

            pageObject = queryObject.paginate(page,datasetsPerPage,False)
            totalPageCount = int(math.ceil(pageObject.total / datasetsPerPage))
            paginatedDatasetResponse = {}
            paginatedDatasetResponse['currentUri'] = url_for('searchdatasets',page=page)
            paginatedDatasetResponse['page'] = page
            paginatedDatasetResponse['datasets'] = marshal(pageObject.items,summarizedDatasetFields)
            paginatedDatasetResponse['totalCount'] = pageObject.total
            paginatedDatasetResponse['perPage'] = datasetsPerPage
            paginatedDatasetResponse['totalPages'] = totalPageCount
            paginatedDatasetResponse['hasNext'] = pageObject.has_next
            paginatedDatasetResponse['hasPrevious'] = pageObject.has_prev
            if pageObject.has_prev:
                if len(pageObject.items) == 0:
                    paginatedDatasetResponse['previousUri'] = url_for('searchdatasets',page=totalPageCount)
                else:
                    paginatedDatasetResponse['previousUri'] = url_for('searchdatasets',page=page -1)
            if pageObject.has_next:
                paginatedDatasetResponse['nextUri'] = url_for('searchdatasets',page=page + 1)
            return paginatedDatasetResponse

        except Exception as e:
            return {'error': str(e)}

class GetDatasetSummary(Resource):
    def get(self):
        # This is the result of:
        # str(hashxx(json.dumps(json.loads('{"rules":[]}')['rules'])))
        # Allows this cached value to be reused by SearchDatasetsSummary when no rules are set
        cache_key = '2027185612'
        rules = []

        from_cache = client.get(cache_key)

        db.session.add(Filter('{"rules":[]}'))
        db.session.commit()

        if from_cache is None:
            queryObject = Dataset.query
            summary = summarizeDatasets(queryObject,rules)
            client.set(cache_key, summary)
            return summary
        else:
            return from_cache

class SearchDatasetsSummary(Resource):
    def post(self):
        try:
            parser = reqparse.RequestParser()
            parser.add_argument('filter_params', type=str)
            args = parser.parse_args()
            filter_params = json.loads(args['filter_params'])
            rules = filter_params['rules']
            if 'prediction_threshold' in filter_params.keys():
                metaseek_power = filter_params['prediction_threshold']
                print "getting metaseek power"
            else:
                metaseek_power = 0.9
            print metaseek_power

            cache_key = str(hashxx(json.dumps(filter_params)))
            from_cache = client.get(cache_key)
            if from_cache:
                print "cached"

            db.session.add(Filter(args['filter_params']))
            db.session.commit()

            if from_cache is None:
                summary = summarizeDatasets(Dataset.query,rules,sampleRate=0.05, metaseek_power=metaseek_power)
                client.set(cache_key, summary)
                return summary
            else:
                return from_cache

        except Exception as e:
            return {'error': str(e)}

# /discovery routes
class GetDiscovery(Resource):
    @marshal_with({
        'filter_params':fields.String,
        'timestamp':fields.DateTime(dt_format='rfc822'),
        'discovery_title':fields.String,
        'discovery_description':fields.String,
        'uri': fields.Url('getdiscovery', absolute=True),
        'owner':fields.Nested({
            'firebase_id':fields.String,
            'firebase_name':fields.String,
            'uri':fields.Url('getuser', absolute=True)
        })
    }, envelope='discovery')
    def get(self, id):
        return Discovery.query.get(id)

class DownloadDiscovery(Resource):
    def get(self, id):
        discovery = Discovery.query.filter_by(id=id).first()
        filter_params = json.loads(discovery.filter_params)
        rules = filter_params['rules']

        queryObject = filterDatasetQueryObjectWithRules(Dataset.query,filter_params['rules'])
        results = queryObject.all()

        # StringIO lets you write a csv to a buffer instead of directly to a file with csv writer
        si = StringIO.StringIO()

        # have to use unicodecsv instead of csv or it fails on our unicode data (like the "degree" sign)
        cw = unicodecsv.writer(si, encoding='utf-8')

        # write all of the names of the columns as the first row so the CSV has column headers
        cw.writerow([column.name for column in Dataset.__mapper__.columns])

        # for every result object, get the value for every column, store in an array and write to the csv buffer
        [cw.writerow([getattr(row, column.name) for column in Dataset.__mapper__.columns]) for row in results]

        # send with the right headers to have the browser treat it like a downloadable file
        output = make_response(si.getvalue())
        output.headers["Content-Disposition"] = "attachment; filename=" + slugify(discovery.discovery_title) + "_discovery_data.csv"
        output.headers["Content-type"] = "text/csv"
        return output

class DownloadDiscoveryIds(Resource):
    def get(self, id):
        print 'downloading all ids'
        discovery = Discovery.query.filter_by(id=id).first()
        print 'found the discovery in question'
        print discovery
        filter_params = json.loads(discovery.filter_params)
        print filter_params
        rules = filter_params['rules']
        print 'filtering query object'
        queryObject = filterDatasetQueryObjectWithRules(Dataset.query,filter_params['rules'])
        print queryObject
        print 'gathering all results, this could be sloooooow'
        results = queryObject.all()
        print results[0:5]
        print 'assembling string'
        # StringIO lets you write a csv to a buffer instead of directly to a file with csv writer
        si = StringIO.StringIO()

        # have to use unicodecsv instead of csv or it fails on our unicode data (like the "degree" sign)
        cw = unicodecsv.writer(si, encoding='utf-8')

        targetColumns = ['id', 'db_source', 'db_source_uid', 'expt_id']

        # write the names of the target columns as the first row so the CSV has column headers
        cw.writerow(targetColumns)

        # for every result object, get the value for the target columns, store in an array and write to the csv buffer
        [cw.writerow([getattr(row, column) for column in targetColumns]) for row in results]

        # send with the right headers to have the browser treat it like a downloadable file
        output = make_response(si.getvalue())
        output.headers["Content-Disposition"] = "attachment; filename=" + slugify(discovery.discovery_title) + "_discovery_ids.csv"
        output.headers["Content-type"] = "text/csv"
        print 'done with assembly'
        return output

class GetAllDiscoveries(Resource):
    @marshal_with({
        'filter_params':fields.String,
        'timestamp':fields.DateTime(dt_format='rfc822'),
        'discovery_title':fields.String,
        'uri': fields.Url('getdiscovery', absolute=True),
        'num_datasets': fields.Integer,
        'owner':fields.Nested({
            'firebase_id':fields.String,
            'firebase_name':fields.String,
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
            parser.add_argument('discovery_title', type=str)
            parser.add_argument('discovery_description')
            parser.add_argument('num_datasets', type=int)
            args = parser.parse_args()
            print args

            owner = Account.query.filter_by(firebase_id=args['owner_id']).first()
            print owner.id

            newDiscovery = Discovery(owner.id,args['filter_params'],args['discovery_title'], args['num_datasets'], args['discovery_description'])
            db.session.add(newDiscovery)
            db.session.commit()
            return {"discovery":{"id":newDiscovery.id,"uri":url_for('getdiscovery',id=newDiscovery.id)}}

        except Exception as e:
            return {'error': str(e)}

class PurgeCache(Resource):
    def get(self):
        client.flush_all()
        return client.stats()

class CacheStats(Resource):
    def get(self):
        return client.stats()

class BuildCaches(Resource):
    def get(self):
        # Looks up literally every filter anyone has ever looked up in descending order by how often
        # For now...let's build all of them!
        allFilterSetsWithCounts = db.session.query(Filter.filter_params,func.count(Filter.filter_params).label('times_filtered')).group_by(Filter.filter_params).order_by('times_filtered DESC').all()
        results = {}

        for (filter_string, times_filtered) in allFilterSetsWithCounts:
            print 'running ' + filter_string
            print 'has been run ' + str(times_filtered) + ' times.'
            filter_params = json.loads(filter_string)
            rules = filter_params['rules']

            cache_key = str(hashxx(json.dumps(filter_params)))
            from_cache = client.get(cache_key)

            results[cache_key] = {}
            results[cache_key]['rules'] = rules

            if from_cache is None:
                tasks.buildCache.delay(cache_key,rules)
                results[cache_key]['existing-cache'] = False
            else:
                results[cache_key]['existing-cache'] = True

        return results

#user-facing calls
user_n_threshold = 1000

class SearchDatasetIds(Resource):
    def post(self):
        try:
            parser = reqparse.RequestParser()
            parser.add_argument('filter_params', type=str)
            args = parser.parse_args()
            filter_params = json.loads(args['filter_params'])
            rules = filter_params['rules']
            if 'prediction_threshold' in filter_params.keys():
                metaseek_power = filter_params['prediction_threshold']
            else:
                metaseek_power = 0.9

            queryObject = filterDatasetQueryObjectWithRules(Dataset.query,rules,metaseek_power=metaseek_power)
            result = queryObject.with_entities(Dataset.id).all()
            datasets = [x[0] for x in result]
            print datasets[0:10]
            return {"count_matching_datasets":len(datasets), "filter_params":filter_params, "matching_dataset_ids":datasets}

        except Exception as e:
            return {'error': str(e)}

class SearchDatasetMetadata(Resource):
    def post(self):
        try:
            parser = reqparse.RequestParser()
            parser.add_argument('filter_params', type=str)
            args = parser.parse_args()
            filter_params = json.loads(args['filter_params'])
            rules = filter_params['rules']
            if 'prediction_threshold' in filter_params.keys():
                metaseek_power = filter_params['prediction_threshold']
            else:
                metaseek_power = 0.9

            queryObject = filterDatasetQueryObjectWithRules(Dataset.query,rules,metaseek_power=metaseek_power)
            result = marshal(queryObject.all(), fullDatasetFields)
            if queryObject.count()>user_n_threshold:
                return {'error':'you are trying to get metadata for too many datasets at once. Please query the database for '+str(user_n_threshold)+' or fewer datasets at a time'}
            else:
                return {"count_matching_datasets":len(result), "filter_params":filter_params, "datasets":result}

        except Exception as e:
            return {'error': str(e)}

class MetadataFromIds(Resource):
    def post(self):
        try:
            parser = reqparse.RequestParser()
            parser.add_argument('metaseek_ids', type=str)
            args = parser.parse_args()
            metaseek_ids = json.loads(args['metaseek_ids'])

            #check if the number of ids you're looking up is below an acceptable threshold; otherwise return error
            if len(metaseek_ids)>user_n_threshold:
                return {'error':'you are trying to get metadata for too many datasets at once. Please query the database for '+str(user_n_threshold)+' or fewer datasets at a time'}
            else:
                queryObject = filterQueryByRule(Dataset,Dataset.query,'id',8,metaseek_ids)
                result = marshal(queryObject.all(), fullDatasetFields)
                return {"count_matching_datasets":len(result), "datasets":result}

        except Exception as e:
            return {'error': str(e)}


# End route functions

# Declare routing
api.add_resource(CreateUser,            '/user/create')
api.add_resource(GetUser,               '/user/<int:id>')
api.add_resource(GetAllUsers,           '/users')
api.add_resource(GetUserDiscoveries,    '/user/<string:id>/discoveries')

api.add_resource(GetDataset,            '/dataset/<int:id>')
api.add_resource(GetAllDatasets,        '/datasets/<int:page>')
api.add_resource(SearchDatasets,        '/datasets/search/<int:page>')
api.add_resource(GetDatasetSummary,     '/datasets/summary')
api.add_resource(SearchDatasetsSummary, '/datasets/search/summary')

api.add_resource(CreateDiscovery,       '/discovery/create')
api.add_resource(GetDiscovery,          '/discovery/<int:id>')
api.add_resource(DownloadDiscovery,     '/discovery/<int:id>/download')
api.add_resource(DownloadDiscoveryIds,  '/discovery/<int:id>/ids')

# This gets all discoveries for all users - we never use it
# TODO delete or make this do something more useful
api.add_resource(GetAllDiscoveries,     '/discoveries')

api.add_resource(PurgeCache,            '/cache/purge')
api.add_resource(CacheStats,            '/cache/stats')
api.add_resource(BuildCaches,           '/cache/build')

#user-facing API calls
#SearchDatasetIds, return matching ids from filter params
api.add_resource(SearchDatasetIds,      '/datasets/search/ids')
#SearchDatasetMetadata, return matching metadata from filter params
api.add_resource(SearchDatasetMetadata, '/datasets/search/metadata')
#MetadataFromIds, return metadata from list of metaseek ids
api.add_resource(MetadataFromIds,       '/datasets/metadatafromids')

# Start the app!
if __name__ == '__main__':
    app.run(debug=True)
