import React, { Component } from 'react';
import './Board.css';
import Row from './Row';

class Board extends Component {
  render() {
    return (
      <div className="Board" >
        {this.props.grid.map((tiles, index) => <Row tiles={tiles} key={index.toString()} index={index} tileClick={this.props.tileClick} /> )}
      </div>
    );
  }
}

export default Board;
