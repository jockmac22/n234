import React, { Component } from 'react';
import './Tile.css';

class Tile extends Component {
  render() {
    return (
      <a href="#" className={ "Tile Tile-value-" + this.props.value + " " + (this.props.selected ? "Tile-selected" : "") } onClick={this.props.tileClick} >
        {this.props.value > 0 ? this.props.value : ""}
      </a>
    );
  }
}

export default Tile;
