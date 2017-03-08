import React, { Component } from 'react';
import './GameData.css';

class GameData extends Component {
  render() {
    return (
      <div className={"GameData " + this.props.position}>
        {this.props.children}
      </div>
    );
  }
}

export default GameData;
