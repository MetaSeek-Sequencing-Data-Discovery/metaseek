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
        return {
          'dataset':{
            'owner': 'nb',
            'fields': {}
          }
        }
    },

    componentWillMount: function() {
        var timestamp = (new Date()).getTime();
        base.syncState('/datasets/' + timestamp, {
            context: this,
            state: 'dataset'
        });
    },

    addDataset : function(dataset) {
      this.state.dataset.fields = dataset;
      this.state.dataset.owner = 'nb';
      this.setState({ 'dataset' : this.state.dataset});
    },

    render: function() {
        return (
          <div >
            <h2>Dataset</h2>
            <AddDatasetForm addDataset={this.addDataset}/>
            </div>
        )
    }
});

export default AddDataset;
