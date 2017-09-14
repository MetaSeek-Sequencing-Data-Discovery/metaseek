import React from 'react';
import { VictoryChart, VictoryVoronoiContainer, VictoryArea, VictoryAxis, VictoryTooltip} from 'victory';
import {getReadableFileSizeString} from '../helpers';

var AreaChart = React.createClass({

  render : function() {
    // this.props.areainput is a field name that can be changed by the user
    // pull the right summary data from activeSummaryData
    var activeField = this.props.areainput;
    var activeFieldData = this.props.activeSummaryData[activeField];

    // remove nulls / boring values
    var activeFieldDataValidKeys = Object.keys(activeFieldData).filter(
      function(value, index) {
        if (value == "no data" || value == "other categories") {
          return false; // skip
        } else {
          return true;
        }
      }
    );

    var activeFieldSorted = activeFieldDataValidKeys.sort(function(a, b) {
      if (a.includes("^")) {
        var match_a = a.match(/\d+/g); //find all the integers, for 10^2-10^3 will return [10,2,10,3]
        var match_b = b.match(/\d+/g);
        return (Math.pow(match_a[0],match_a[1]) - Math.pow(match_b[0],match_b[1]));
      }
      else {
        return (parseInt(a) - parseInt(b))}
      });

    // Format data the way VictoryChart / VictoryArea wants it
    var chartData = activeFieldSorted.map(
      function(value,index) {
        var count = activeFieldData[value];
        if (activeField=="download_size_summary") {
          var match = value.match(/\d+/g);
          var first = getReadableFileSizeString(Math.pow(match[0],match[1]));
          var second = getReadableFileSizeString(Math.pow(match[2],match[3]));
          var newfield = first + " - " + second;
        }
        else {
          var newfield = value;
        }
        return {"x":parseInt(index),"count":count,"label":newfield + " : " + count};
      }
    );

    return(
      <div className="area-container">
        <VictoryChart
          theme={this.props.colortheme}
          width={380}
          height={240}
          padding={{top: 20, right: 10, bottom: 10, left: 10 }}
          containerComponent={
            <VictoryVoronoiContainer
              dimension="x"
              labels={(chartData) => chartData.label}
              labelComponent={
                <VictoryTooltip
                  flyoutStyle={{fill: "white"}}
                />}
          />}
        >
          <VictoryAxis height={100}
            style={{
              tickLabels: {display:'none'}
            }}
          />

          <VictoryArea
            data={chartData}
            x="x"
            y="count"
            style={{
              data: { fillOpacity: 0.5, strokeWidth: 2 },
              labels: { fill: "#333",fontSize: 12 }
            }}
          />
        </VictoryChart>
      </div>
    )}
  });

export default AreaChart;
