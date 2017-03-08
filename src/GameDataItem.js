import React, { Component } from 'react';
import './GameDataItem.css';

class GameDataItem extends Component {
  render() {
    return (
      <div className={"GameDataItem " + this.props.size}>
        <label>{this.props.label}</label>
        <div>{this.props.value}</div>
      </div>
    );
  }
}

export default GameDataItem;
