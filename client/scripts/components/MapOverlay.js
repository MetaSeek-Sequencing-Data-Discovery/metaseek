import React from 'react';
import {setParameters} from 'luma.gl';
import DeckGL, {PolygonLayer} from 'deck.gl';


var MapOverlay = React.createClass({
  getInitialState : function() {
    return {
      hoverInfo : null
    }
  },

  _initialize(gl) {
    setParameters(gl, {
      depthTest: true,
      depthFunc: gl.LEQUAL
    });
  },

  showHover: function(info) {
    this.setState({hoverInfo: info});
    console.log(this.state.hoverInfo.object.count, this.state.hoverInfo.object.fillColor);
  },

  renderTooltip: function() {
    const hoverInfo = this.state.hoverInfo;
    return hoverInfo && (
      <div className="tooltipMap" style={{top:hoverInfo.y, left:hoverInfo.x}}>
        <div><b>{hoverInfo.object.count}</b></div>
        <div><b>Datasets</b></div>
      </div>
    );
  },

  render : function() {
    const {viewport, data} = this.props;

    if (!data) {
      return null;
    }

    const layer = new PolygonLayer({
      id: 'square',
      data,
      filled: true,
      extruded: false,
      pickable: true,
    });

    const tooltipStyle = {
      display: this.state.hover ? 'block' : 'none',
      fill: 'rgb(80,80,80)',
      opacity: 0.5
    };

    return (
      <div>
        <DeckGL {...viewport} layers={ [layer] } onWebGLInitialized={this._initialize} onLayerHover={this.showHover}/>
        {this.renderTooltip}
      </div>
    );
  }
});

export default MapOverlay;
