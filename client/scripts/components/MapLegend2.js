import React from 'react';
import { scaleLinear } from 'd3-scale';
import { max } from 'd3-array';
import { select } from 'd3-selection';
import d3 from 'd3';

var MapLegend2 = React.createClass({
  getInitialState : function() {
    return {
      domain: [1,2.5,5,10,20],
      range: ["rgb(99, 105, 224, 0)", "rgb(99, 105, 224, 28.3)", "rgb(99, 105, 224, 56.7)", "rgb(99, 105, 224, 85)", "rgb(99, 105, 224, 113.3)"],
      g: null,
    }
  },

  onRef : function(ref) {
        this.setState({ g: d3.select(ref) }, () => this.renderBubbles())
  },

  renderBubbles() {
    var legendValues=[{color: "red", stop: [0,1]},{color: "blue", stop: [1,2]},{color: "purple", stop: [2,3]},{color: "yellow", stop: [3,4]},{color: "Aquamarine", stop: [4,5]}];
    var legendScale;
    var cellWidth = 30;
    var cellHeight = 20;
    var adjustable = false;
    var labelFormat = d3.format(".01f");
    var labelUnits = "units";
    var lastValue = 6;
    var changeValue = 1;
    var orientation = "horizontal";
    var cellPadding = 0;

    //const bubbles = this.state.g.selectAll('.bubble').data(data, d => d.id)


    const legend = this.state.g.selectAll("g.legendCells").data(legendValues);
    legend.exit().remove();
    const legendE = legend.enter()
                          .append("g")
                          .attr("class", "legendCells")
                          .attr("transform", function(d,i) {return "translate(" + (i * (cellWidth + cellPadding)) + ",0)" })

    legendE.selectAll("g.legendCells").select("rect").style("fill", function(d) {return d.color});

    legendE.selectAll("g.legendCells").select("text.breakLabels").style("display", "block").style("text-anchor", "start").attr("x", cellWidth + cellPadding).attr("y", 5 + (cellHeight / 2)).text(function(d) {return labelFormat(d.stop[0]) + (d.stop[1].length > 0 ? " - " + labelFormat(d.stop[1]) : "")});

    legendE.selectAll("g.legendCells").attr("transform", function(d,i) {return "translate(0," + (i * (cellHeight + cellPadding)) + ")"});

    legendE.selectAll("g.legendCells")
    .append("rect")
    .attr("height", cellHeight)
    .attr("width", cellWidth)
    .style("fill", function(d) {return d.color})
    .style("stroke", "black")
    .style("stroke-width", "2px");

    legendE.selectAll("g.legendCells")
    .append("text")
    .attr("class", "breakLabels")
    .style("pointer-events", "none");

    legendE.append("text")
    .text(labelUnits)
    .attr("y", -7);

  },

  render : function() {
    //const legend = this.legend
    //var sampleThreshold = d3.scale.threshold().domain(domain).range(range);

    return (
      <svg>
        <g ref={this.onRef} className="bubbles" />
      </svg>
    );
  }
});

export default MapLegend2;
