import React from 'react';
import ReactDOM from 'react-dom';

// Create a div element to render the React component
const root = document.createElement('div');
document.body.appendChild(root);

// Render a simple React component in the root div
ReactDOM.render(
  <h1>Hello from React!</h1>,
  root,
);
