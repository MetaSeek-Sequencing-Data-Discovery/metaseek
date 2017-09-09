import React from 'react';
import MapGL from 'react-map-gl';
import MapOverlay from './MapOverlay';
import d3 from 'd3';

// Set your mapbox token here
// const MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-line
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoibWV0YXNlZWsiLCJhIjoiY2o3YjQ4anVrMG5vaDMycW14bWcwbTBnaSJ9.67xUW2hLL2laKI8XyY91dA';

// Source data GeoJSON
// const DATA_URL = 'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/geojson/vancouver-blocks.json'; // eslint-disable-line
const data = [
  {count:45,
  polygon:[[0,0],[0,50],[10,50],[10,0],[0,0]],
  fillColor: [255, 0, 0]
  },
  {count:16,
  polygon:[[0,0],[0,-89.999],[10,-89.999],[10,0],[0,0]],
  fillColor: [128, 255, 0]
  },
  {count:80,
  polygon:[[-180,-80],[-180,-70],[-170,-70],[-170,-80],[-180,-80]],
  fillColor: [0, 255, 255]
  },
  {count:25,
  polygon:[[-170,-80],[-170,-70],[-160,-70],[-160,-80],[-170,-80]],
  fillColor: [128, 0, 255]
}];

var MapDeckGL = React.createClass({
  getInitialState : function() {
    return {
      viewport: {
        'width': 510,
        'height': 400,
        'latitude': 0,
        'longitude': 0,
        'zoom': 0,
        'maxZoom': 16,
        'pitch': 0,
        'fov':100
      },
      mapdata: null
    }
  },

  _onViewportChange(viewport) {
    this.setState({
      viewport: {...this.state.viewport, ...viewport}
    });
  },

  render : function() {
    return (
      <MapGL
        {...this.state.viewport}
        onViewportChange={this._onViewportChange}
        mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}>
        <MapOverlay viewport={this.state.viewport}
          data={this.props.mapdata} />
      </MapGL>
    );
  }
});

//render(<Root />, document.body.appendChild(document.createElement('div')));
export default MapDeckGL;
