import React, { Component } from 'react';
import './Game.css';
import Board from './Board';

class Game extends Component {
  constructor(props) {
    super(props);
    this.handleTileClick = this.handleTileClick.bind(this);

    this.running    = true;
    this.round      = 0;
    this.current    = 0;
    this.target     = 0;
    this.hits       = 0;
    this.score      = 0;
    this.highScore  = 0;
    this.grid       = this.initialGrid();

    this.state      = {
      running:    this.running,
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
      alert("Game Over");
      return false;
    }

    var x         = this.getRandomInt(0, this.maxX());
    var y         = this.getRandomInt(0, this.maxY());
    var val       = this.getRandomInt(1,this.state.target);
    var valueSet  = this.setValue(x,y,val);

    if (!valueSet)
      this.nextTile();

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
    this.round = 1;
    this.score = 0;
    this.target = 2;
    this.hits = 0;
    this.current = 0;
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
    this.target   += 1;
    this.round    += 1;
    this.updateState();
  }

  stop() {
    this.running = false;
    clearInterval(this.timerID);
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
    this.score  += (this.target * 10);
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

  componentDidMount() {
    this.start();
  }

  componentWillUnmount() {
    this.stop();
  }

  updateState() {
    this.setState({
      running:    this.running,
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
        <div className="Game-data">
          <span>
            Round: {this.state.level}
          </span>
          <span>
            Score: {this.state.score}
          </span>
          <span>
            High Score: {this.state.highScore}
          </span>
          <span>
            Target: {this.state.target}
          </span>
          <span>
            Hits: {this.state.hits}
          </span>

        </div>
        <div className="Game-board">
          <Board grid={this.state.grid} tileClick={this.handleTileClick} />
        </div>
        <div className="Game-debug">
          <span>
            Current: {this.state.current}
          </span>
        </div>
      </div>
    );
  }
}

export default Game;
