import React from 'react';
import {setParameters} from 'luma.gl';
import DeckGL, {PolygonLayer} from 'deck.gl';

const LIGHT_SETTINGS = {
  lightsPosition: [-125, 50.5, 5000, -122.8, 48.5, 8000],
  ambientRatio: 0.2,
  diffuseRatio: 0.5,
  specularRatio: 0.3,
  lightsStrength: [1.0, 0.0, 2.0, 0.0],
  numberOfLights: 2
};

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

  render : function() {
    const {viewport, data, colorScale} = this.props;

    if (!data) {
      return null;
    }

    const layer = new PolygonLayer({
      id: 'square',
      data,
      opacity: 0.5,
      stroked: false,
      filled: true,
      extruded: true,
      fp64: false,
      getElevation: f => f.elevation*100,
      lightSettings: LIGHT_SETTINGS,
      pickable: true,
      onHover: info => console.log('Hovered:', info)
    });
    return (
      <DeckGL {...viewport} layers={ [layer] } onWebGLInitialized={this._initialize} />
    );
  }
});

export default MapOverlay;
