import React from 'react';
import axios from 'axios';

// Material Design imports
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// My component imports
import AddDatasetForm from './AddDatasetForm';
import Header from './Header';

var apiRequest = axios.create({
  baseURL: 'http://ec2-35-166-20-248.us-west-2.compute.amazonaws.com/api/'
});

var AddDataset = React.createClass({
    getInitialState: function() {
        return {}
    },

    addDataset : function(dataset) {
      var self = this;
      apiRequest.post('/dataset/create', dataset)
      .then(function (response) {
        self.props.history.push('/dataset/' + response.data.dataset.id);
      });
    },
    render: function() {
        return (
          <div>
            <Header history={this.props.history}/>
            <div >
              <h2>Contribute a dataset</h2>
              <AddDatasetForm addDataset={this.addDataset}/>
            </div>
          </div>
        )
    }
});

export default AddDataset;
