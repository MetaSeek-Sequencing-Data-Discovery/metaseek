import React from 'react';
import { VictoryBar, VictoryChart, VictoryVoronoiContainer, VictoryAxis, VictoryLabel, VictoryTooltip} from 'victory';


var HistogramVictory = React.createClass({

  render : function() {
    // this.props.histinput is a field name that can be changed by the user
    // pull the right summary data from activeSummaryData
    var activeField = this.props.histinput;
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

    // Sort the fields by value and grab the top 6 to display if there are more than 6
    var activeFieldSorted = activeFieldDataValidKeys.sort(function(a, b) {return -(activeFieldData[a] - activeFieldData[b])});
    var finalDataPoints = Object.keys(activeFieldData).includes("other categories") ? activeFieldSorted.concat(["other categories"]) : activeFieldSorted;
    var finalDataPoints = Object.keys(activeFieldData).includes("no data") ? finalDataPoints.concat(["no data"]) : finalDataPoints;

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
          theme={this.props.colortheme}
          width={778}
          padding={{top: 0, right: 25, bottom: 5, left: 65 }}
          // domainPadding will add space to each side of VictoryBar to
          // prevent it from overlapping the axis
          domainPadding={50}
          containerComponent={
            <VictoryVoronoiContainer
              dimension="x"
              labels={(histData) => histData.x + " : " + histData.count }
              labelComponent={
                <VictoryTooltip
                  flyoutStyle={{fill: "white"}}
                />}
          />}
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
            style={{ labels: { fill: "#333",fontSize: 12 } }}
            labelComponent={<VictoryLabel angle={-45} textAnchor="start" verticalAnchor="end"/>}
          />
        </VictoryChart>
      </div>
    )}
  });

  export default HistogramVictory;
