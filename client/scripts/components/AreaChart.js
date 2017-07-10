import React from 'react';
import { VictoryChart, VictoryVoronoiContainer, VictoryArea, VictoryAxis, VictoryTooltip} from 'victory';
import CustomTheme from './CustomTheme';

var AreaChart = React.createClass({

  render : function() {
    // this.props.areainput is a field name that can be changed by the user
    // pull the right summary data from activeSummaryData
    var activeField = this.props.areainput;
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

    // Format data the way VictoryChart / VictoryArea wants it
    var chartData = activeFieldDataValidKeys.map(
      function(value,index) {
        var count = activeFieldData[value];
        return {"x":parseInt(index),"count":count,"label":value + " : " + count};
      }
    );

    return(
      <div className="area-container">
        <VictoryChart
          theme={CustomTheme.metaseek}
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
              data: { fillOpacity: 0.5, strokeWidth: 2 }
            }}
          />
        </VictoryChart>
      </div>
    )}
  });

export default AreaChart;
