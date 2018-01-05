'''
this script uses manual rules, in some cases manual rules from other fields ('manual tree rules'), and in some cases modeling to fill in the metaseek_ value for investigation_type, env_package, mixs_specification, and sequencing_method

see CVmodelAdaboost notebook for notes and code used to produce this script as well (even though ultimately used logistic regression model and not Adaboost)

before running this script, make sure you've done a database migration to create the fields: metaseek_investigation_type, metaseek_investigation_type_P, metaseek_mixs_specification, metaseek_mixs_specification_P, metaseek_env_package, metaseek_sequencing_method
'''

import pandas as pd
import json
import numpy as np

import sys
sys.path.append('..')

from app import db
from models import *

#connect to metaseek db, pull in relevant fields needed for parsing/modeling
print "reading in relevant fields from database..."
queryObject = Dataset.query
parseObject = queryObject.with_entities(Dataset.id, Dataset.investigation_type,Dataset.env_package,
                                        Dataset.biosample_models,Dataset.biosample_package,Dataset.sequencing_method,
                                        Dataset.library_source,Dataset.library_strategy, Dataset.library_screening_strategy, Dataset.study_type)
parse = pd.read_sql(parseObject.statement,db.session.bind)

#read in manual and manual tree parsing rules json files
print "gathering parsing rules..."
with open('../scrapers/SRA/CVparse_rules.json') as json_file:
    manual_rules = json.load(json_file)
json_file.close()

#read in investigation type logreg model
print "loading investigation type model..."
with open('../scrapers/SRA/CVparse_manualtree_rules.json') as tree_file:
    tree_rules = json.load(tree_file)
tree_file.close()

#investigation type parsing
print "parsing and predicting investigation type..."
investigation_cv = ['eukaryote','bacteria_archaea','virus','plasmid','organelle', 'metagenome', 'mimarks-survey', 'mimarks-culture']
##manual rule parsing
investigation_rules = manual_rules['investigation_type']
manual_investigation_type = parse["investigation_type"].map(investigation_rules)
##manual tree parsing
tree_investigation_rules = tree_rules['investigation_type']
tree_investigation_type = parse["biosample_package"].map(tree_investigation_rules['biosample_package'])
##combine manual and tree into one list; prioritize tree parsed over manual parsed
metaseek_investigation_type = tree_investigation_type.combine_first(manual_investigation_type)
##create P values column with P=1 for any parsed values, NaN if not parsed
P_investigation_type = pd.notnull(metaseek_investigation_type).astype(int)
P_investigation_type[P_investigation_type==0] = None

##modeling to fill in missing
#define one-hot encoded features to extract
with open('../scrapers/SRA/model_features.json') as json_file:
    model_features = json.load(json_file)
json_file.close()
cats = model_features['investigation_type']['columns']
#load model
from sklearn.externals import joblib
investigation_model = joblib.load('../scrapers/SRA/investigation_type_logreg_model.pkl')
#extract one-hot encoded model_features
dummies = pd.get_dummies(parse)
newdummies = dummies.reindex(columns=cats).fillna(0)
#predict on all of parse
investigation_predictions = investigation_model.predict(newdummies)
investigation_predictions_P = np.max(investigation_model.predict_proba(newdummies), axis=1)
#combine manual/tree parsed and prediction parsed columns; prioritize manuals
merged_investigation_type = metaseek_investigation_type.combine_first(pd.Series(investigation_predictions))
merged_P_investigation_type = P_investigation_type.combine_first(pd.Series(investigation_predictions_P))
#add investigation type fields to parse
parse['metaseek_investigation_type'] = merged_investigation_type
parse['metaseek_investigation_type_P'] = merged_P_investigation_type


#mixs specification parsing
print "parsing MIxS specification..."
##convert from investigation_type predictions
#mixs specifications are either MIGS, MIMS, or MIMARKS
mixs_conversion = {"bacteria_archaea":"MIGS", "eukaryote":"MIGS", "virus":"MIGS", "plasmid":"MIGS", "organelle":"MIGS",
                   "metagenome":"MIMS", "mimarks-culture":"MIMARKS", "mimarks-survey":"MIMARKS"}
metaseek_mixs_specification = merged_investigation_type.map(mixs_conversion)
##copy P values
metaseek_mixs_specification_P = merged_P_investigation_type
#insert in parse
parse['metaseek_mixs_specification'] = metaseek_mixs_specification
parse['metaseek_mixs_specification_P'] = metaseek_mixs_specification_P


#env package parsing
print "parsing env package..."
##manual rule parsing
env_package_rules = manual_rules['env_package']
manual_env_package = parse["env_package"].map(env_package_rules)
##manual tree parsing
tree_env_rules = tree_rules['env_package']
tree_env_package = parse["biosample_package"].map(tree_env_rules['biosample_package'])
#combine manual and tree
metaseek_env_package = tree_env_package.combine_first(manual_env_package)
#insert in parse
parse['metaseek_env_package'] = metaseek_env_package


#sequencing method parsing
print "parsing sequencing method..."
##manual rule parsing
seq_meth_rules = manual_rules['sequencing_method']
metaseek_sequencing_method = parse["sequencing_method"].map(seq_meth_rules)
#insert in parse
parse['metaseek_sequencing_method'] = metaseek_sequencing_method


#for each row in database, write new values
for row in Dataset.query.all():
    print "processing row ", row.id, " out of ", len(parse)

    #get new values from parse for this id
    parsed_row = parse.loc[parse['id']==row.id,:]
    row.metaseek_investigation_type =  parsed_row['metaseek_investigation_type'].to_string(index=False)
    row.metaseek_investigation_type_P =  parsed_row['metaseek_investigation_type_P'].to_string(index=False)
    row.metaseek_mixs_specification =  parsed_row['metaseek_mixs_specification'].to_string(index=False)
    row.metaseek_mixs_specification_P =  parsed_row['metaseek_mixs_specification_P'].to_string(index=False)
    row.metaseek_env_package =  parsed_row['metaseek_env_package'].to_string(index=False)
    row.metaseek_sequencing_method =  parsed_row['metaseek_sequencing_method'].to_string(index=False)

    db.session.add(row)
    db.session.commit()
