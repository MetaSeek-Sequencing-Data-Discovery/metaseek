import React from 'react';
import MapGL from 'react-map-gl';
import MapOverlay from './MapOverlay';

// Set your mapbox token here
// const MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-line
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoibWV0YXNlZWsiLCJhIjoiY2o3YjQ4anVrMG5vaDMycW14bWcwbTBnaSJ9.67xUW2hLL2laKI8XyY91dA';

var MapDeckGL = React.createClass({
  getInitialState : function() {
    return {
      viewport: {
        'width': 510,
        'height': 510,
        'latitude': 0,
        'longitude': 0,
        'zoom': 0,
        'maxZoom': 16,
        'pitch': 0,
        'fov':100,
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
      <div className="explore-map-contents">
        <MapGL
          {...this.state.viewport}
          onViewportChange={this._onViewportChange}
          mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}>
          <MapOverlay viewport={this.state.viewport}
            data={this.props.mapdata} />
        </MapGL>
      </div>
    );
  }
});

//render(<Root />, document.body.appendChild(document.createElement('div')));
export default MapDeckGL;
