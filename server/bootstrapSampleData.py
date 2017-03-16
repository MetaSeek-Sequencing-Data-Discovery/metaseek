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
import sframe
from collections import Counter

# Config / initialize the app, database and api
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost/metaseek'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


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

sample_data = sframe.SFrame('/Users/Adrienne/Projects/metaseek/DataScraping/db_sample_data')
for row in sample_data:
    try:
        datetimeguess = dateparser.parse(row['collection_date'])
    except ValueError:
        datetimeguess = None
    newDataset = Dataset(row['biosample_link'],row['sample_title'],row['investigation_type'],row['library_source'], row['env_package'],datetimeguess, row['latitude'], row['longitude'], row['avg_read_length'], row['total_num_reads'], row['total_num_bases'], row['download_size'],row['avg_percent_gc'])
    db.session.add(newDataset)
    db.session.commit()
