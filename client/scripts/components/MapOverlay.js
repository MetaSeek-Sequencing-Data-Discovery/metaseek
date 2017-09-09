import React from 'react';
import {setParameters} from 'luma.gl';
import DeckGL, {PolygonLayer} from 'deck.gl';


var MapOverlay = React.createClass({
  getInitialState : function() {
    return {
      'defaultViewport': {
        'width': 720,
        'height': 360,
        'latitude': 0,
        'longitude': 0,
        'zoom': 0,
        'maxZoom': 16,
        'pitch': 0
      }
    }
  },

  _initialize(gl) {
    setParameters(gl, {
      depthTest: true,
      depthFunc: gl.LEQUAL
    });
  },

  showHover: function(info) {
    console.log(info)

  },

  render : function() {
    const {viewport, data} = this.props;

    if (!data) {
      return null;
    }

    const layer = new PolygonLayer({
      id: 'square',
      data,
      opacity: 0.6,
      stroked: false,
      filled: true,
      extruded: true,
      pickable: true,
      onHover: info => this.showHover(info)
    });
    return (
      <DeckGL {...viewport} layers={ [layer] } onWebGLInitialized={this._initialize} />
    );
  }
});

export default MapOverlay;
