from app import db
from models import *
import pandas as pd
import json
import pickle
import os

#fields to add (and parse):
#1) investigation_type
#2) env_package
#3) MIxS sequence type (good name?); MIMARKS/MIMS/MIGS -- marker gene/metagenome or metatranscriptome/genome
#4) sequencing_method

queryObject = Dataset.query
parseObject = queryObject.with_entities(Dataset.id, Dataset.investigation_type,Dataset.env_package,
                                        Dataset.biosample_models,Dataset.biosample_package,
                                        Dataset.library_source,Dataset.library_strategy, Dataset.library_screening_strategy, Dataset.study_type)
parse = pd.read_sql(parseObject.statement,db.session.bind)
print "read in %s records" % len(parse)
#load manual rules
with open("scrapers/SRA/CVparse_rules.json") as json_rules:
    rules = json.load(json_rules)
    json_rules.close()

def count_fields(field): #e.g. seq['sequencing_method']
    from collections import Counter
    import numpy as np, pandas as pd
    counts = Counter(field)
    counts_df = pd.DataFrame.from_dict(counts, orient='index')
    counts_df.columns = ['count']
    counts_df['key'] = counts_df.index
    counts_df = counts_df.sort_values('count', ascending=False)
    counts_df.index = np.arange(len(counts_df))
    return counts_df

def parse_biosample_types(rules, pkg_value, model_value):
    match = [rules[key] for key in rules.keys() if key in str(pkg_value)]
    P = None
    if len(match)==1:
        match = match[0]
    elif len(match)==0:
        #look in biosample_models if can't match biosample_package (or is none)
        match = [rules[key] for key in rules.keys() if key in str(model_value)]
        if len(match)==1:
            match = match[0]
        else:
            match = None
    else:
        match = None
    return match, P

investigation_cv = ['eukaryote','bacteria_archaea','virus','plasmid','organelle', 'metagenome', 'mimarks-survey', 'mimarks-specimen']

#investigation type
##manual parse CV
investigation_manual_rules = rules['investigation_rules']

parse['metaseek_investigation_type'] = None #this will be the predicted values
parse['P_investigation_type'] = None #probabilities from logreg (if manually inferred, keep as None)

investigation_decision_rules = {'MIGS.ba':'bacteria_archaea', 'MIGS.eu':'eukaryote', 'MIGS.vi':'virus',
                              'MIMARKS.specimen':'mimarks-specimen', 'MIMARKS.survey':'mimarks-survey','MIMS.me':'metagenome'}

def fill_investigation_type(use_model=False):
    answers = pd.DataFrame(columns = ['label','P'])
    if use_model==True:
        log = pickle.load(open('investigation_type_logreg.sav', 'rb'))
    for index, row in parse.iterrows():
        #rename misnomers/misspellings
        if row['investigation_type'] in investigation_manual_rules.keys():
            match = investigation_manual_rules[row['investigation_type']]
            P = None
            #parse.iloc[index]['metaseek_investigation_type'] = investigation_manual_rules[row['investigation_type']]
        #accept values that are correctly named
        elif row['investigation_type'] in investigation_cv:
            match = row['investigation_type']
            P = None
            #parse.iloc[index]['metaseek_investigation_type'] = row['investigation_type']

        elif row['investigation_type']==None:
            ##manual decisions (from biosample_package or biosample_models)
            match, P = parse_biosample_types(rules=investigation_decision_rules, pkg_value=row['biosample_package'], model_value=row['biosample_models'])
            #parse.iloc[index]['metaseek_investigation_type'] = match
            #parse.iloc[index]['P_investigation_type'] = P

        ##if match and P are None, try to predict the field from the model
        #if use_model==True and match==None and P==None:
            ##logreg model
        print "appending row %s, match:%s, P:%s" % (index, match, P)
        answers = answers.append({'label':match,'P':P}, ignore_index=True)

    return answers

print "filling investigation type without model..."
#warning - this will take a really long time to iterate through all the rows
answers = fill_investigation_type(use_model=False)

parse['metaseek_investigation_type'] = answers['label']
parse['P_investigation_type'] = answers['P']

print "inserted inferred investigation types:"
print count_fields(parse['metaseek_investigation_type'])

featcols = ['biosample_models','biosample_package','library_source','library_strategy','library_screening_strategy','study_type']
short_featcols = ['library_source','library_strategy','study_type'] #only those always complete

#dropna
investigation = parse.loc[parse["metaseek_investigation_type"].dropna().index]
print "number of non-empty parsed investigation types: ", len(investigation)
#one-hot encode featcols
investigation_hot = pd.get_dummies(investigation,columns=featcols)
print "one-hot encoded investigation types:"
print investigation_hot.columns[5:]

hot_featcols = investigation_hot.columns[5:] #new feat cols with one-hot-encoded features
#save these featcols as the category names should have in future, e.g. when incorporated into scrapers
output = {"investigation_type":list(hot_featcols)}
if os.path.isfile("onehotcolnames.json"):
    with open('onehotcolnames.json','r+') as f:
        dic = json.load(f)
    dic["investigation_type"] = list(cat_columns)
    with open("onehotcolnames.json", 'wb') as outfile:
        json.dump(dic, outfile)
else:
    with open("onehotcolnames.json", 'wb') as outfile:
        json.dump(output, outfile)

def train_logreg(data, target, feats,penalty='l2',C=1.0,max_iter=500, multi_class='multinomial', solver='sag'):
    #split into training and test set, with 75/25 split
    from sklearn.model_selection import train_test_split
    train, test = train_test_split(data, test_size = 0.25)
    print "train/test length:",len(train), len(test)
    train_features = train[feats]
    test_features = test[feats]
    train_targets = train[target]
    test_targets = test[target]

    from sklearn.linear_model import LogisticRegression
    log = LogisticRegression(penalty=penalty, C=C, max_iter=max_iter, multi_class=multi_class, solver=solver)
    log.fit(X=train_features,y=train_targets)

    test_accuracy = log.score(X=test_features,y=test_targets)
    train_accuracy = log.score(X=train_features,y=train_targets)
    print "test accuracy, train accuracy:", test_accuracy, train_accuracy

    return log, test_accuracy, train_accuracy

log_investigation, test_acc, train_acc = train_logreg(data=investigation_hot, target='metaseek_investigation_type', feats=hot_featcols)

pickle.dump(log_investigation, open('test_investigation_type_logreg.sav', 'wb'))

print "model achieved %s test accuracy; (%s train accuracy)" % (test_acc, train_acc)
