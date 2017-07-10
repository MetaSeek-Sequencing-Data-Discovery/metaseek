import React from 'react';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryLabel, VictoryTooltip} from 'victory';
import CustomTheme from './CustomTheme';


var HistogramVictory = React.createClass({

  render : function() {
    // this.props.histinput is a field name that can be changed by the user
    // pull the right summary data from activeSummaryData
    var activeField = this.props.histinput;
    var activeFieldData = this.props.activeSummaryData[activeField];

    // remove nulls / boring values
    var activeFieldDataValidKeys = Object.keys(activeFieldData).filter(
      function(value, index) {
        if (value == "no data" || value == "other categories" || value == "Other") {
          return false; // skip
        } else {
          return true;
        }
      }
    );

    // Sort the fields by value and grab the top 6 to display if there are more than 6
    var activeFieldSorted = activeFieldDataValidKeys.sort(function(a, b) {return -(activeFieldData[a] - activeFieldData[b])});
    var finalDataPoints = (activeFieldSorted.length > 6) ? activeFieldSorted.slice(0, 6) : activeFieldSorted;

    // Format data the way VictoryChart / VictoryBar wants it
    var histData = finalDataPoints.map(
      function(value,index) {
        var count = activeFieldData[value];
        return {"x":value,"count":count,"label":value};
      }
    );

    return(
      <div className="histogram-container">
        <VictoryChart
          theme={CustomTheme.metaseek}
          // domainPadding will add space to each side of VictoryBar to
          // prevent it from overlapping the axis
          domainPadding={10}
        >

          <VictoryAxis
            // X axis with labels
            style={{
              tickLabels: {display:'none'}
            }}
          />
          <VictoryAxis
            // Y axis with labels
            dependentAxis
            style={{
              tickLabels: { fill: "#333",fontSize: 12}
            }}
          />
          <VictoryBar
            data={histData}
            x="x"
            y="count"
            labels={(d) => d.y}
            style={{ labels: { fill: "#333",fontSize: 12} }}
            labelComponent={<VictoryLabel dx={22}/>}
          />
        </VictoryChart>
      </div>
    )}
  });

  export default HistogramVictory;
