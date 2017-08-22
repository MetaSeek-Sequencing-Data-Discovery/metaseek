from app import db
from models import *
import pandas as pd
import numpy as np
import json
import pickle

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

investigation_decision_rules = {'MIGS.ba':'bacteria_archaea', 'MIGS.eu':'eukaryote', 'MIGS.vi':'virus',
                              'MIMARKS.specimen':'mimarks-specimen', 'MIMARKS.survey':'mimarks-survey','MIMS.me':'metagenome'}

def extract_hotcols(hotcols, target_df):
    #hotcols are the names of the correct one-hot encoded column names and order;
    #target_df is the one-hot encoded df for which you want correct one-hot encoded columns for model input

    #find columns in df_a_hot not in df_b_hot - add as columns of 0
    to_add = np.setdiff1d(hotcols, target_df.columns)
    to_remove = np.setdiff1d(target_df.columns,hotcols)

    # add these columns to target, setting them equal to zero
    for add in to_add:
        target_df[add] = 0

    #remove columns in target shouldn't be there
    for remove in to_remove:
        del target_df[remove]

    # reorder columns so in same order as model hotcols
    target_df = target_df[hotcols]
    return target_df

def fill_investigation_type(use_model=False):
    answers = pd.DataFrame(columns = ['label','P'])
    if use_model==True:
        #load logreg model
        log = pickle.load(open('test_investigation_type_logreg.sav', 'rb'))
        with open('onehotcolnames.json','r+') as f:
            hotcols = json.load(f)
        #load one-hot encoded column names
        investigation_hotfeatcols = hotcols["investigation_type"]
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
        if use_model==True and match==None and P==None:
            #convert row to one-hot encoded features
            row_df = pd.get_dummies(row.to_frame().T)
            feats = extract_hotcols(hotcols=investigation_hotfeatcols, target_df=row_df)
            ##logreg model, predict label and get probability
            match = log.predict(feats.values.reshape(1,-1))[0]
            P = max(log.predict_proba(feats.values.reshape(1,-1))[0])

        print "appending row %s, match:%s, P:%s" % (index, match, P)
        answers = answers.append({'label':match,'P':P}, ignore_index=True)

    return answers

print "filling investigation type with model..."
answers = fill_investigation_type(use_model=True)

parse['metaseek_investigation_type'] = answers['label']
parse['P_investigation_type'] = answers['P']

print "inserted inferred investigation types:"
print count_fields(parse['metaseek_investigation_type'])


#save columns as csv for now... figure out how to insert in db later
predictions = pd.DataFrame()
predictions['id'] = parse['id']
predictions['metaseek_investigation_type'] = parse['metaseek_investigation_type']
predictions['P_investigation_type'] = parse['P_investigation_type']
predictions.to_csv("predictions.csv")
