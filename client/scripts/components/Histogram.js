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

    var values = Object.keys(data).sort(function(a, b) {
      var newkey = (parseFloat(a) - parseFloat(b));
      if (newkey) {
        return newkey;
      } else{
        return a - b;
      }
    }).map(function(value,index) {
      return {"x":value,"y":data[value]};
    });

    var barData = [
      {
        "name":"histogram",
        "values":values
      }
    ];

    return  (
    	<BarChart
        data={barData}
        width={760}
        height={250}
        fill="#6369E0"
      />
  )}
});

export default Histogram;
