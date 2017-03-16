import React from 'react';
import rd3 from 'rd3';

const BarChart = rd3.BarChart;

var Histogram = React.createClass({
  getInitialState : function() {
    return {
      "data":[],
      "values":{}
    }
  },

  render: function() {
    var data = this.props.summaryData[this.props.histinput];

    var values = Object.keys(data).map(function(value,index) {
      return {"x":value, "y":data[value]};
    });

    var barData = [
      {
        "name":"histogram",
        "values":values
      }
    ];

    console.log(data);
    console.log(values);

    return  (
    	<BarChart
      data={barData}
      width={400}
      height={250}
      yAxisLabel="Dataset Count"
      />
  )}
});

export default Histogram;
