import React from 'react';
import { VictoryChart, VictoryVoronoiContainer, VictoryArea, VictoryAxis, VictoryTooltip} from 'victory';
import CustomTheme from './CustomTheme';

var AreaChart = React.createClass({

  render : function() {
    var data = this.props.activeSummaryData[this.props.areainput];
    var chartdata = Object.keys(data).map(function(value,index) {
      return {"x":parseInt(index),"count":data[value],"label":value+" : "+data[value]};
    });
    var ticklabels = Object.keys(data).map(function(value,index) {
      return value
    })

    return(
      <VictoryChart
        theme={CustomTheme.metaseek}
        containerComponent={<VictoryVoronoiContainer
            dimension="x"
            labels={(chartdata) => `count: ${chartdata.label}`}
            labelComponent={
              <VictoryTooltip
                flyoutStyle={{fill: "white"}}
              />}
        />}
      >
        <VictoryAxis height={100}
          tickValues={ticklabels}
          style={{
            tickLabels: {angle: -60, fontSize: 9, padding: 30}
          }}
        />

        <VictoryArea
          labelComponent={<VictoryTooltip style={{fontSize:9}}/>}
          data={chartdata}
          x="x"
          y="count"
          style={{ data: { fillOpacity: 0.5, strokeWidth: 2 } }}
        />
      </VictoryChart>
    )}
  });

export default AreaChart;
