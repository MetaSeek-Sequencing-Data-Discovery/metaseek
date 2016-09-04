import React from 'react';

// firebase
var firebaseEndpoint = 'https://metaseq-6b779.firebaseio.com/';
var Rebase = require('re-base');
import Firebase from 'firebase';
var base = Rebase.createClass(firebaseEndpoint);
var firebaseRoot = new Firebase(firebaseEndpoint);

/*
  DatasetDetail
  DatasetDetail list on right side of page
*/

var DatasetDetail = React.createClass({
    getInitialState: function() {
        return {
          'dataset':{
            'owner': 'nb',
            'fields': {}
          }
        }
    },

    componentWillMount: function() {

        base.syncState('/datasets/' + this.props.params.id, {
            context: this,
            state: 'dataset'
        });
    },

    addDataset : function(dataset) {
      this.state.dataset.fields = dataset;
      this.state.dataset.owner = 'nb';
      this.setState({ 'dataset' : this.state.dataset});
    },

    renderField : function(field) {
      return (
        <li key={field}>{field} - {this.state.dataset.fields[field]}</li>
      )
    },

    render: function() {
        return (
          <div >
            <h2>Dataset</h2>
            <ul>
              {Object.keys(this.state.dataset.fields).map(this.renderField)}
            </ul>
            </div>
        )
    }
});

export default DatasetDetail;
