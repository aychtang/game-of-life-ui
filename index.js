var board = require('n-board');
var wrapper = require('board-access');
var classlist = require('class-list');
var _ = require('lodash');
var findNeighbours = require('./findNeighbours');

var grid = document.getElementById('grid');

var b = wrapper(new board(50, function(i, j) {
  return Math.random() > 0.85 ? 1 : 0;
}));

var isDead = function(board) {
  return _.chain(board)
  .flatten()
  .foldl(function(acc, e) {
    return acc + e;
  }, 0)
  .value() === 0;
};

var build = function(board) {
  _.flatten(board).forEach(function(e) {
    var node = document.createElement('div');
    node.className = 'cell';
    node.className += e === 0 ? ' dead' : ' alive';
    grid.appendChild(node);
  });
};

var clCache = {};

var render = function(board) {
  _.flatten(board).forEach(function(e, i) {
    var domNode = grid.childNodes[i];
    var cl = clCache[i] || classlist(domNode);
    if (!clCache[i]) {
      clCache[i] = cl;
    }
    if (e === 0) {
      cl.remove('alive');
    }
    else {
      cl.add('alive');
    }
  });
};

var step = function(x, y, e, board) {
  var neighbours = findNeighbours(board, x, y);
  if ((e === 0 && neighbours === 3) || (e === 1 && neighbours <= 3 && neighbours >= 2)) {
    return 1;
  }
  return 0;
};

// Builds the initial grid DOM.
build(b.value());

// Steps the board and re-renders.
var stepInterval = setInterval(function() {
  if (isDead(b.value())) {
    clearInterval(stepInterval);
  }
  else {
    var currentBoard = b.value();
    b.map(function(x, y, e) {
      return step(x, y, e, currentBoard);
    });
  };
  render(b.value());
}, 250);
