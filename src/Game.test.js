import React from 'react';
import ReactDOM from 'react-dom';
import Board from './Game';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Game />, div);
});
