import React, { Component } from 'react';
import './StartOverlay.css';

class StartOverlay extends Component {
  render() {
    return (
      <div className="StartOverlay">
        <h1>(n)234</h1>
        <p>
          <a href="#" onClick={this.props.onStartClick}>Start Game</a>
        </p>
      </div>
    );
  }
}

export default StartOverlay;
