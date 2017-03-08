import React, { Component } from 'react';
import './GameOverOverlay.css';

class GameOverOverlay extends Component {
  render() {
    return (
      <div className="GameOverOverlay">
        <h1>(n)234</h1>
        <h2>Game Over!</h2>
        { (this.state.score >= this.state.highScore) ? (
          <p className="highScore">
            <label>High Score</label>
            {this.state.score}
          </p>
        ) : (
          <p className="score">
            <label>Score</label>
            {this.state.score}
          </p>
        )}
        <p>
          <a href="#" onClick={this.props.onReplayClick}>Play Again</a>
        </p>
      </div>
    );
  }
}

export default GameOverOverlay;
