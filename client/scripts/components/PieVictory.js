import React from 'react';
import { VictoryPie, VictoryChart, VictoryVoronoiContainer, VictoryAxis, VictoryLabel, VictoryTooltip} from 'victory';



var PieVictory = React.createClass({

  renderLabel : function(centerLabel) {
    return (
      <svg width="100" height="50">
        <span>{centerLabel[0]}</span>
        <br/>
        <span>{centerLabel[1]}</span>
      </svg>
    );
  },

  render : function() {
    // this.props.histinput is a field name that can be changed by the user
    // pull the right summary data from activeSummaryData
    var activeField = this.props.pieinput;
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
    var pieData = finalDataPoints.map(
      function(value,index) {
        var count = activeFieldData[value];
        return {"x":value,"count":count,"label":value.substring(0,1).toUpperCase()};
      }
    );

    var centerLabel = pieData.map(function(value, index) {return value.x+" : "+value.count+" datasets"});

    return(
      <svg viewBox="0 0 350 350">
        <VictoryPie
          data={pieData}
          x="x"
          y="count"
          labels="label"
          theme={this.props.colortheme}
          padAngle={3}
          innerRadius={100}
          labelRadius={115}
          height={350}
          width={350}
          style={{labels: {fontSize: 18, fill: "rgb(255, 255, 255)", fontFamily:"Roboto", fontWeight:"bold"} }}
        />
        <VictoryLabel
        textAnchor="middle"
        x={180}
        y={180}
        text={[centerLabel[0], "  ", centerLabel[1]]}
        style={{fontFamily:"Roboto",fontSize:"16px",color:"rgb(75,75,75)"}}
        />
      </svg>
    )}
  });

  export default PieVictory;
