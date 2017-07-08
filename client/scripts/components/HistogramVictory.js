import React from 'react';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryLabel, VictoryTooltip} from 'victory';
import CustomTheme from './CustomTheme';


var HistogramVictory = React.createClass({

  render : function() {
    var data = this.props.activeSummaryData[this.props.histinput];
    var histdata = Object.keys(data).map(function(value,index) {
      return {"x":value,"count":data[value],"label":value+" : "+data[value]};
    });

    return(
      <VictoryChart
        theme={CustomTheme.metaseek}
        // domainPadding will add space to each side of VictoryBar to
        // prevent it from overlapping the axis
        domainPadding={20}
      >
        <VictoryAxis height={100}
          style={{
            tickLabels: {angle: -60, fontSize: 9, padding: 30}
          }}
        />
        <VictoryLabel dy={20}/>
        <VictoryAxis
          dependentAxis
          style={{
            tickLabels: {fontSize: 9}
          }}
        />
        <VictoryBar
          labelComponent={<VictoryTooltip style={{fontSize:9}}/>}
          data={histdata}
          x="x"
          y="count"
        />
      </VictoryChart>

    )}
  });

  export default HistogramVictory;
