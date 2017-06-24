import React from 'react';
import { VictoryChart, VictoryLine, VictoryTooltip, VictoryVoronoiContainer } from 'victory';

var Victory = React.createClass({
  getInitialState : function() {
    return {}
  },

  handleZoom : function(domain) {
    this.setState({selectedDomain: domain});
  },

  handleBrush : function(domain) {
    this.setState({zoomDomain: domain});
  },

  render : function() {
    return (
      <div>
        <VictoryChart width={600} height={400} containerComponent={<VictoryVoronoiContainer/>}>
        <VictoryLine
        labelComponent={<VictoryTooltip/>}
        data={[
          {x: 2, y: 5, label: "right-side-up"},
          {x: 4, y: -6, label: "upside-down"},
          {x: 6, y: 4, label: "tiny"},
          {x: 8, y: -5, label: "or a little \n BIGGER"},
          {x: 10, y: 7, label: "automatically"}
        ]}
        />
          </VictoryChart>
      </div>
    );
  }
});

export default Victory;
