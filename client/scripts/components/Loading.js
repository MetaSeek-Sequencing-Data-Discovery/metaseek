import React from 'react';

var Loading = React.createClass({
  getInitialState : function() {
    return {}
  },

  render : function() {
    return (
      <div style={{'width':400,'margin':'125px auto 0px'}}>
        <div className='uil-rolling-css' style={{'margin':'0px auto','transform':'scale(0.44)'}}>
          <div>
            <div>
            </div>
            <div>
            </div>
          </div>
        </div>
        <h2>Loading, just one moment. . .</h2>
      </div>
    )
  }
});

export default Loading;
