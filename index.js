var board = require('n-board');
var wrapper = require('board-access');
var classlist = require('class-list');
var _ = require('lodash');
var findNeighbours = require('./findNeighbours');

var grid = document.getElementById('grid');

var b = wrapper(new board(10, function(i, j) {
	return Math.random() > 0.8 ? 1 : 0;
}));

// Stops stepping out of order errors. -> TODO: use this implementation in module.
b.map = function(fn) {
	var size = this.board.length;
	var cleanBoard = board(size);
	for (var i = 0; i < size; i++) {
		for (var j = 0; j < size; j++) {
			var element = this.board[i][j];
			cleanBoard[i][j] = fn(i, j, element);
		}
	}
	this.board = cleanBoard;
};

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

var render = function(board) {
	_.flatten(board).forEach(function(e, i) {
		var domNode = grid.childNodes[i];
		var cl = classlist(domNode);
		if (e === 0) {
			cl.remove('alive');
			cl.add('dead');
		}
		else {
			cl.remove('dead');
			cl.add('alive');
		}
	});
};


// Builds the initial grid DOM.
build(b.value());

// Steps the board and re-renders.
var stepInterval = setInterval(function() {
	if (isDead(b.value())) {
		clearInterval(stepInterval);
	}
	else {
		b.map(function(x, y, e) {
			var neighbours = findNeighbours(b.value(), x, y);
			if (e === 0 && neighbours === 3) {
				return 1;
			}
			else if (e === 1 && neighbours <= 3 && neighbours >= 2) {
				return 1;
			}
			return 0;
		});
		render(b.value());
	}
}, 250);
