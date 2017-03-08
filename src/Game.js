import React, { Component } from 'react';
import './Game.css';
import Board from './Board';
import StartOverlay from './StartOverlay';
import GameOverOverlay from './GameOverOverlay';
import GameData from './GameData';
import GameDataItem from './GameDataItem';

class Game extends Component {
  constructor(props) {
    super(props);
    this.handleTileClick = this.handleTileClick.bind(this);
    this.handleStartClick = this.handleStartClick.bind(this);

    this.targets    = [2,3,5,8,13,21,34,55,89,144,233,377,610,987,1597,2584,4181,6765];
    this.running    = false;
    this.gameOver   = false;
    this.lastValue  = 0;
    this.round      = 0;
    this.current    = 0;
    this.target     = 0;
    this.hits       = 0;
    this.score      = 0;
    this.highScore  = 3000;
    this.grid       = this.initialGrid();

    this.state      = {
      running:    this.running,
      gameOver:   this.gameOver,
      round:      this.round,
      target:     this.target,
      current:    this.current,
      hits:       this.hits,
      score:      this.score,
      highScore:  this.highScore,
      grid:       this.grid
    };
  }

  initialGrid() {
    var grid = [];
    for(var y=0;y<5;y++) {
      grid.push([]);
      for(var x=0;x<5;x++) {
        grid[y].push({ val: 0, selected: false })
      }
    }
    return grid;
  }

  maxX() {
    return this.maxx ? this.maxx : (this.maxx = this.state.grid[0].length);
  }

  maxY() {
    return this.maxy ? this.maxy : (this.maxy = this.state.grid.length);
  }

  onGrid(x, y) {
    return !((x < 0) || (x >= this.maxX()) || (y < 0) || (y > this.maxY()));
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  setValue(x, y, val) {
    var cVal = this.grid[y][x].val;
    if (!this.onGrid(x, y) || (cVal > 0))
      return false;

    this.grid[y][x].val = val;
    this.updateState();
    return true
  }

  getTile(x, y) {
    if (!this.onGrid(x, y))
      return null;

    return this.grid[y][x];
  }

  getValue(x, y) {
    var tile = this.getTile(x, y);
    if (!tile) return null;
    return tile.value;
  }

  isSelected(x, y) {
    var tile = this.getTile(x, y);
    if (!tile) return null;
    return tile.selected;
  }

  clearValue(x, y) {
    if (!this.onGrid(x, y))
      return false;

    this.grid[y][x] = { val: 0, selected: false };
    this.updateState();
    return true;
  }

  nextTile() {
    this.determineHitMiss();

    if (this.gridIsFull()) {
      this.stop();
      this.gameOver = true;
      this.highScore = Math.max(this.score, this.highScore);
      this.updateState();
      return false;
    }

    if (this.lastValue <= 1)
      this.lastValue = this.target

    var x           = this.getRandomInt(0, this.maxX());
    var y           = this.getRandomInt(0, this.maxY());
    var val         = this.getRandomInt(1, this.lastValue);
    var valueSet    = this.setValue(x,y,val);

    if (!valueSet)
      this.nextTile();

    this.lastValue  = (val-1);
    this.decreaseScore(val);
    return valueSet;
  }

  toggleTile(x, y) {
    if (!this.onGrid(x, y))
      return null;

    var tile = this.getTile(x,y);
    if (!tile || (tile.val === 0))
      return null;

    tile.selected = !(tile.selected);

    if (tile.selected) {
      this.current += tile.val;
    } else {
      this.current -= tile.val;
    }

    this.grid[y][x] = tile;
    this.updateState();

    return tile.selected;
  }

  gridIsFull() {
    for(var y=0;y<this.maxY();y++) {
      for(var x=0;x<this.maxX();x++) {
        if (this.grid[y][x].val === 0)
          return false;
      }
    }

    return true;
  }

  start() {
    this.grid     = this.initialGrid();
    this.round    = 1;
    this.score    = 0;
    this.target   = this.targets[this.round-1];;
    this.hits     = 0;
    this.current  = 0;
    this.clearGrid();
    this.updateState();

    this.run();
  }

  run() {
    this.running = true;
    this.updateState();

    this.timerID = setInterval(
      () => this.nextTile(),
      1000
    );
  }

  nextLevel() {
    this.grid     = this.initialGrid();
    this.current  = 0;
    this.hits     = 0;
    this.round    += 1;
    this.target   = this.targets[this.round-1];
    this.updateState();
  }

  stop() {
    this.running = false;
    clearInterval(this.timerID);
    this.updateState();
  }

  increaseScore(amount) {
    this.score += amount;
    this.updateState();
  }

  decreaseScore(amount) {
    this.score -= amount;
    if (this.score <= 0)
      this.score = 0;
    this.updateState();
  }

  determineHitMiss() {
    if (this.current < this.target)
      return false;

    if (this.current === this.target)
      this.hit();
    else
      this.miss();
  }

  hit() {
    this.hits   += 1;
    this.increaseScore(this.target * 10);
    this.removeSelections();

    if (this.hits === 10)
      this.nextLevel();
    else {
      this.current = 0;
      this.updateState();
    }
  }

  miss() {
    this.clearSelections();
    this.current = 0;
    this.updateState();
  }

  removeSelections() {
    var grid = this.state.grid
    for(var y=0;y<this.maxY();y++) {
      for(var x=0;x<this.maxX();x++) {
        if (grid[y][x].selected)
          grid[y][x] = { val: 0, selected: false }
      }
    }
    this.setState({ grid: grid });
  }

  clearSelections() {
    var grid = this.state.grid
    for(var y=0;y<this.maxY();y++) {
      for(var x=0;x<this.maxX();x++) {
        grid[y][x].selected = false;
      }
    }
    this.setState({ grid: grid, current: 0 });
  }

  clearGrid() {
    this.setState({ grid: this.initialGrid() });
  }

  handleTileClick(y, x) {
    if ((!this.running) || (!this.onGrid(x,y)))
      return false;

    this.toggleTile(x,y);
    this.determineHitMiss();
  }

  handleStartClick() {
    this.start();
  }

  componentDidMount() {

  }

  componentWillUnmount() {
    this.stop();
  }

  updateState() {
    this.setState({
      running:    this.running,
      gameOver:   this.gameOver,
      round:      this.round,
      target:     this.target,
      current:    this.current,
      hits:       this.hits,
      score:      this.score,
      highScore:  this.highScore,
      grid:       this.grid
    })
  }

  render() {
    return (
      <div className="Game">
        {
          (!this.running && !this.gameOver) ? (
            <StartOverlay onStartClick={this.handleStartClick} />
          ) : ((!this.running && this.gameOver) ? (
            <GameOverOverlay onReplayClick={this.handleStartClick} />
          ): null)
        }
        <GameData position="top">
          <GameDataItem size="half" label="Score" value={this.state.score} />
          <GameDataItem size="half" label="High" value={this.state.highScore} />
        </GameData>
        <div className="Game-board">
          <Board grid={this.state.grid} tileClick={this.handleTileClick} />
        </div>
        <GameData position="bottom">
          <GameDataItem size="third" label="Round" value={this.state.round} />
          <GameDataItem size="third" label="Hits" value={this.state.hits + "/10"} />
          <GameDataItem size="third" label="Target" value={this.state.target} />
        </GameData>
      </div>
    );
  }
}

export default Game;
