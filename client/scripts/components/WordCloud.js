import React from 'react';
import { TagCloud } from 'react-tagcloud';
import ReactTooltip from 'react-tooltip';

var WordCloud = React.createClass({
  getInitialState : function() {
    return {}
  },

  showHover : function(value, event) {
    this.setState({"hoverValue":value});
  },

  render : function() {
    // Colors from color brewer http://colorbrewer2.org/#type=sequential&scheme=PuBuGn&n=8
    // Order matters - higher values will get the later colors in this list
    // Another good option http://colorbrewer2.org/?type=sequential&scheme=BuGn&n=7
    // var colors = ['#a6bddb','#67a9cf','#3690c0','#02818a','#016450'];
    var colors = ["#6369E0","#8387E6","#9396E9","#C3C3F2","#FFD3C8","#FFCBBE","#FC99E8","#FCADEC","#FCC1F0","#82FFEA","#A9FFF0","#C3FFF4","#FFB3A0","#B1FEF1","#88D7FF","#A0DFFF","#B8E7FF"];

    // Min / max font sizes in pixels for words in word cloud
    var min = 8;
    var max = 40; // has to be pretty small to fit in the word cloud box

    // this.props.wordinput is a field name that can be changed by the user
    // pull the right summary data from activeSummaryData
    var activeField = this.props.wordinput;
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

    // Format data the way TagCloud wants it
    var wordCloudData = activeFieldDataValidKeys.map(
      function(value,index) {
        var count = activeFieldData[value];
        return {"value":value,"count":count};
      }
    );

    // Use a customRenderer so we can make the color scale with the value vs. be random
    var customRenderer = function(tag, size) {
      // Find how far in between min and max the tag size is, find the right color for that slot
      var colorScaler = ((size - min) / (max - min)) * (colors.length - 1);
      var color = colors[Math.floor(Math.random() * colors.length)];
      // var color = colors[Math.floor(colorScaler)];

      // More styles in css for word-cloud-tag - only on-the-fly calculated styles go here
      return <div className='word-cloud-tag-wrapper'>
              <span
                key={activeField + '-word-' + tag.value}
                data-tip
                data-for={activeField + '-tip-' + tag.value}
                className='word-cloud-tag'
                style={{
                  fontSize: size + 'px',
                  color: color
                }}>
                {tag.value}
              </span>
              <ReactTooltip
                id={activeField + '-tip-' + tag.value}
                key={activeField + '-tip-' + tag.value}
                place="top"
                type="light"
                effect="solid"
                border={true}
              >
                <span>{tag.value + " : " + activeFieldData[tag.value] + ' datasets'}</span>
              </ReactTooltip>
            </div>
    };

    return(
      <div>
        <TagCloud
          tags={wordCloudData}
          minSize={min}
          maxSize={max}
          renderer={customRenderer}
        />
      </div>
    )}
  });

export default WordCloud;
