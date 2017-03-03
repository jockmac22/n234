import React, { Component } from 'react';
import './Row.css';
import Tile from './Tile';

class Row extends Component {
  render() {
    return (
      <div className="Row">
        {this.props.tiles.map((tile, index) => <Tile key={index.toString()} value={tile.val} selected={tile.selected} tileClick={() => this.props.tileClick(this.props.index, index)} />)}
      </div>
    );
  }
}

export default Row;
