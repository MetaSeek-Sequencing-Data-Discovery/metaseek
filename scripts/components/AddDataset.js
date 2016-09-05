import React from 'react';

// Firebase imports / setup
import Rebase from 're-base';
import Firebase from 'firebase';

// Material Design imports
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// My component imports
import AddDatasetForm from './AddDatasetForm';
import Header from './Header';

// Firebase setup
var firebaseEndpoint = 'https://metaseq-6b779.firebaseio.com/';
var base = Rebase.createClass(firebaseEndpoint);
var firebaseRoot = new Firebase(firebaseEndpoint);

var AddDataset = React.createClass({
    getInitialState: function() {
        return {
          'dataset':{
            'owner': 'nb',
            'fields': {}
          },
          'datasetId':0
        }
    },
    componentWillMount: function() {
        var datasetId = (new Date()).getTime();
        this.state.datasetId = datasetId;
        this.ref = base.syncState('/dataset/' + this.state.datasetId, {
            context: this,
            state: 'dataset'
        });
        this.setState({ 'dataset' : this.state.dataset});
    },
    componentWillUnmount: function() {
      base.removeBinding(this.ref);
    },
    addDataset : function(dataset) {
      this.state.dataset.fields = dataset;
      this.state.dataset.owner = 'nb';
      this.setState({ 'dataset' : this.state.dataset});
    },
    render: function() {
        return (
          <div>
            <Header history={this.props.history}/>
            <div >
              <h2>Contribute a dataset</h2>
              <AddDatasetForm addDataset={this.addDataset} datasetId={this.state.datasetId} history={this.props.history}/>
            </div>
          </div>
        )
    }
});

export default AddDataset;
