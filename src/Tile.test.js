import React from 'react';
import ReactDOM from 'react-dom';
import Board from './Tile';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Tile index=0 />, div);
});
