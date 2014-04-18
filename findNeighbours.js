
module.exports = function(board, row, col) {
  var neighbours = 0;
  for (var i = row - 1; i <= row + 1; i++) {
    for (var j = col - 1; j <= col + 1; j++) {
      if (i >= 0 && j >= 0 && i < board.length && j < board.length) {
        neighbours += board[i][j];
      }
    }
  }
  return neighbours - board[row][col];
};
