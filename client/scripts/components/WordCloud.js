import React from 'react';
import { TagCloud } from 'react-tagcloud';

var WordCloud = React.createClass({
  getInitialState : function() {
    return {
      'hoverValue':{value:'click on word to see count'},
    }
  },

  showHover : function(value, event) {
    this.setState({"hoverValue":value});
  },

  render : function() {
    var colors = ["#6369E0","#8387E6","#9396E9","#A3A5EC","#C3C3F2","#FFD3C8","#FFCBBE","#FC99E8","#FCADEC","#FCC1F0","#82FFEA","#A9FFF0","#C3FFF4","#FFB3A0","#B1FEF1"]
    var data = this.props.activeSummaryData[this.props.wordinput];
    var clouddata = Object.keys(data).filter(function(value, index) {
      if (value === "no data" | value === "other categories") {
        return false; // skip
      }
      return true;}).map(function(value,index) {
        var rand = colors[Math.floor(Math.random() * colors.length)]
        return {"value":value,"count":data[value],"color":rand};
      });

    return(
      <div>
        <span>{this.state.hoverValue.value} : {this.state.hoverValue.count}</span>
        <TagCloud tags={clouddata}
        minSize={16}
        maxSize={48}
        onClick={this.showHover}
        shuffle={false}
        />
      </div>
    )}
  });

export default WordCloud;
