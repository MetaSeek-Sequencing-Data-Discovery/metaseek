import React from 'react';
import {VictoryChart, VictoryArea, VictoryPolarAxis, VictoryVoronoiContainer, VictoryLabel, VictoryTooltip} from 'victory';
import CustomTheme from './CustomTheme';


var RadarChart = React.createClass({

  render : function() {
    var data = this.props.activeSummaryData[this.props.radarinput];

    var counts = Object.keys(data).filter(function(value, index) {
      if (value === "no data" | value === "other categories") {
        return false; // skip
      }
      return true;}).map(function(value,index) {
      return parseInt(data[value]);
    });
    var countmax = Math.max.apply(null, counts);
    var radardata = Object.keys(data).filter(function(value, index) {
      if (value === "no data" | value === "other categories") {
        return false; // skip
      }
      return value;}).map(function(value,index) {
      return {"x":value,"y":data[value]/countmax, "label":value+" : "+data[value]};
    });

    return(
      <div className="radar-container">
        <VictoryChart
          polar
          theme={CustomTheme.metaseek}
          domain={{ y: [ 0, 1 ] }}
          containerComponent={<VictoryVoronoiContainer/>}
          >
          <VictoryArea
            data={radardata}
            labels={(radardata) => `${radardata.label}`}
            labelComponent={<VictoryTooltip flyoutStyle={{fill: "white"}}/>}
            style={{ data: { fillOpacity: 0.2, strokeWidth: 1.5 } }}
          />
          {
            Object.keys(radardata).map((key, i) => {
              return (
                <VictoryPolarAxis
                  key={i}
                  dependentAxis
                  style={{
                    axisLabel: { padding: 10 },
                    axis: { stroke: "none" },
                    grid: { stroke: "grey", strokeWidth: 0.25, opacity: 0.5 },
                    tickLabels: {fontSize: 9}
                  }}
                  labelPlacement="parallel"
                  axisValue={i + 1}
                  label={radardata[key]["x"].substring(0,10)}
                  tickFormat={(t) => Math.ceil(t * countmax)}
                  tickValues={[0]}
                />
              );
            })
          }
          <VictoryPolarAxis
            labelPlacement="parallel"
            style={{
              tickLabels: {fill:"none"},
              axis: { stroke: "none" },
              grid: { stroke: "grey", opacity: 0.5 }
            }}
          />
        </VictoryChart>
      </div>
    )}
  });

  export default RadarChart;
