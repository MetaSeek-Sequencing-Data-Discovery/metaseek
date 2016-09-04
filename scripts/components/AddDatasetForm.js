import React from 'react';

/*
  AddDatasetForm
  Add a single dataset
*/

var AddDatasetForm = React.createClass({
    createDataset : function(e) {
      e.preventDefault();
      var dataset = {
        url:this.refs.url.value,
        lat:this.refs.lat.value,
        long:this.refs.long.value,
        description:this.refs.desc.value,
        sourceDatabase:this.refs.sourceDatabase.value
      };
      this.props.addDataset(dataset);
    },

  render : function() {
    return (
      <form ref="datasetForm" className="dataset-edit" onSubmit={this.createDataset}>
        <input type="text" ref="url" placeholder="URL to this dataset"/>
        <input type="text" ref="lat" placeholder="Latitude" />
        <input type="text" ref="long" placeholder="Longitude" />
        <select ref="sourceDatabase">
          <option value="genbank">Genbank</option>
          <option value="edi">EDI</option>
        </select>
        <textarea type="text" ref="desc" placeholder="Description"></textarea>
        <button type="submit">+ Add Dataset</button>
      </form>
    )
  }
});

export default AddDatasetForm;
