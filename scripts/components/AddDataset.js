import React from 'react';

// firebase
var firebaseEndpoint = 'https://metaseq-6b779.firebaseio.com/';
var Rebase = require('re-base');
import Firebase from 'firebase';
var base = Rebase.createClass(firebaseEndpoint);
var firebaseRoot = new Firebase(firebaseEndpoint);

// Component imports
import AddDatasetForm from './AddDatasetForm';

/*
  AddDataset
  AddDataset list on right side of page
*/

var AddDataset = React.createClass({
    getInitialState: function() {
        var datasetId = (new Date()).getTime();
        return {
          'dataset':{
            'owner': 'nb',
            'fields': {}
          },
          'datasetId':datasetId
        }
    },

    componentWillMount: function() {
        this.ref = base.syncState('/datasets/' + this.state.datasetId, {
            context: this,
            state: 'dataset'
        });
    },

    componentWillUnmount: function() {
      base.removeBinding(this.ref);
    },

    addDataset : function(dataset) {
      this.state.dataset.fields = dataset;
      this.state.dataset.owner = 'nb';
      this.setState({ 'dataset' : this.state.dataset});
      this.props.history.push('/dataset/' + this.state.datasetId);
    },

    render: function() {
        return (
          <div >
            <h2>Dataset</h2>
            <AddDatasetForm addDataset={this.addDataset} datasetId={this.state.datasetId}/>
            </div>
        )
    }
});

export default AddDataset;
