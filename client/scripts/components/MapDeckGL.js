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
  {elevation:45,
  polygon:[[0,0],[0,89.999],[10,89.999],[10,0],[0,0]],
  fillColor: [255, 0, 0]
  },
  {elevation:16,
  polygon:[[0,0],[0,-89.999],[10,-89.999],[10,0],[0,0]],
  fillColor: [128, 255, 0]
  },
  {elevation:80,
  polygon:[[-180,-80],[-180,-70],[-170,-70],[-170,-80],[-180,-80]],
  fillColor: [0, 255, 255]
  },
  {elevation:25,
  polygon:[[-170,-80],[-170,-70],[-160,-70],[-160,-80],[-170,-80]],
  fillColor: [128, 0, 255]
}];

// const colorScale = r => [r * 255, 140, 200 * (1 - r)];
const colorScale = d3.scale.linear()
                         .domain([0, d3.max(data, function(d) {return d.count; })])
                         .range(["#FFFFFF", "#151174"]);

var MapDeckGL = React.createClass({
  getInitialState : function() {
    return {
      viewport: {
        'width': 720,
        'height': 360,
        'latitude': 0,
        'longitude': 0,
        'zoom': 0,
        'maxZoom': 16,
        'pitch': 10,
        'bearing': 0
      },
      'data': data
    }
  },

  _onViewportChange(viewport) {
    this.setState({
      viewport: {...this.state.viewport, ...viewport}
    });
  },

  render : function() {
    const {viewport, data} = this.state;
    return (
      <MapGL
        {...viewport}
        onViewportChange={this._onViewportChange}
        mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}>
        <MapOverlay viewport={this.state.viewport}
          data={data}
          colorScale={colorScale} />
      </MapGL>
    );
  }
});

//render(<Root />, document.body.appendChild(document.createElement('div')));
export default MapDeckGL;
