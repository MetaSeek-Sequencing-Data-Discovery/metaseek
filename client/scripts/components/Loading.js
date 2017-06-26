import React from 'react';

var Loading = React.createClass({
  getInitialState : function() {
    return {}
  },

  render : function() {
    return (
      <div className='loader-container'>
        <div className='uil-rolling-css full-loader'>
          <div>
            <div>
            </div>
            <div>
            </div>
          </div>
        </div>
        <h3>Loading, just one moment. . .</h3>
      </div>
    )
  }
});

export default Loading;
