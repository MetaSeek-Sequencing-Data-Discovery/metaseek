import React from 'react';
import ReactMapGL, {StaticMap} from 'react-map-gl';
import MapOverlay from './MapOverlay';
import {getLatCenter, getLonCenter, getMapBounds} from '../helpers';
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoibWV0YXNlZWsiLCJhIjoiY2o3YjQ4anVrMG5vaDMycW14bWcwbTBnaSJ9.67xUW2hLL2laKI8XyY91dA';

var MapDeckGL = React.createClass({
  getInitialState : function() {
    return {
      viewport: {
        'width': 500,
        'height': 500,
        'latitude': 0,
        'longitude': 0,
        'zoom': 0
      }
    }
  },

  _onViewportChange(viewport) {
    this.setState({
      viewport: {...this.state.viewport, ...viewport}
    });
  },

  componentWillMount : function() {
    var latitude = getLatCenter(this.props.filter_params);
    var longitude = getLonCenter(this.props.filter_params);
    this.state.viewport.latitude = latitude;
    this.state.viewport.longitude = longitude;
    this.setState({"viewport":this.state.viewport});
  },

  render : function() {
    return (
      <div className="explore-map-contents">
        <StaticMap
          {...this.state.viewport}
          mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
          ref={ map => this.mapRef = map }
        >
          <MapOverlay
            viewport={this.state.viewport}
            data={this.props.mapdata}
          />
        </StaticMap>
      </div>
    );
  }
});

export default MapDeckGL;
