import React, { Component } from 'react';
import './GameData.css';

class GameData extends Component {
  render() {
    return (
      <div className={"GameData " + (this.props.full ? "full" : "half") }>
        <label>{this.props.label}</label>
        <div>{this.props.value}</div>
      </div>
    );
  }
}

export default GameData;
