import React from 'react';
import { TagCloud } from 'react-tagcloud';
import {randomColor} from 'randomcolor';

var WordCloud = React.createClass({

  render : function() {
    var colors = ["#6369E0","#8387E6","#9396E9","#A3A5EC","#C3C3F2","#FFD3C8","#FFCBBE","#FC99E8","#FCADEC","#FCC1F0","#82FFEA","#A9FFF0","#C3FFF4","#FFB3A0","#B1FEF1"]
    var data = this.props.activeSummaryData[this.props.histinput];
    var clouddata = Object.keys(data).filter(function(value, index) {
      if (value === "no data" | value === "other categories") {
        return false; // skip
      }
      return true;}).map(function(value,index) {
        var rand = colors[Math.floor(Math.random() * colors.length)]
        return {"value":value,"count":data[value],"color":rand};
      });

    return(
      <TagCloud tags={clouddata}
      minSize={16}
      maxSize={48}
      />
    )}
  });

export default WordCloud;
