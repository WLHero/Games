documentWidth = window.screen.availWidth;
gridContentWidth = 0.92 * documentWidth;
cellSideLength = 0.18 * documentWidth;
cellSpace = 0.04 * documentWidth;


function getPosTop(i, j) {
	return cellSpace + i * (cellSpace + cellSideLength)
}

function getPosLeft(i, j) {
	return cellSpace + j * (cellSpace + cellSideLength)
}

function getNumberBackgroundColor (number) {
	switch (number) {
		case 2: return "#eee4da"; break;
		case 4: return "#ede0c8"; break;
		case 8: return "#f2b179"; break;
		case 18: return "#f59563"; break;
		case 32: return "#f67c5f"; break;
		case 64: return "#f65e3b"; break;
		case 128: return "#edcf72"; break;
		case 256: return "#edcc61"; break;
		case 512: return "#9c0"; break;
		case 1024: return "#33b5e5"; break;
		case 2048: return "#09c"; break;
		case 4096: return "#a6c"; break;
		case 8192: return "#93c"; break;
	}
	return "black";
}

function getNumberColor (number) {
	if (number < 4) {
		return "#776e65";
	}
	return "white";
}

function nospace(board) {
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			if (board[i][j] == 0) {
				return false;
			}
		}
	}
	return true;
}

function canMoveLeft (board) {
	for (var i = 0; i < 4; i++) {
		for (var j = 1; j < 4; j++) { // 第一列不用考虑，因为第一列肯定不能向左移动
			// 当他左边没有值 或者 左边的值与他相等时就可以移动
			if (board[i][j] !== 0) {
				if (board[i][j - 1] == 0 || board[i][j - 1] == board[i][j]) {
					return true;
				}
			}
		}
	}
	return false
}

function canMoveRight (board) {
	for (var i = 0; i < 4; i++) {
		for (var j = 2; j >= 0; j--) { // 第一列不用考虑，因为第一列肯定不能向左移动
			if (board[i][j] !== 0) {
				// 当他左边没有值 或者 左边的值与他相等时就可以移动
				if (board[i][j + 1] == 0 || board[i][j + 1] == board[i][j]) {
					return true;
				}
			}
			
		}
	}
	return false
}

function canMoveUp (board) {	
	for (var i = 0; i < 4; i++) {
		for (var j = 1; j < 4; j++) { // 第一列不用考虑，因为第一列肯定不能向左移动
			if (board[j][i] !== 0) {
				// 当他左边没有值 或者 左边的值与他相等时就可以移动
				if (board[j - 1][i] == 0 || board[j - 1][i] == board[j][i]) {
					return true;
				}
			}
			
		}
	}
	return false
}

function canMoveDown (board) {
	for (var i = 0; i < 4; i++) {
		for (var j = 2; j >= 0; j--) { // 第一列不用考虑，因为第一列肯定不能向左移动
			if (board[j][i] !== 0) {
				// 当他左边没有值 或者 左边的值与他相等时就可以移动
				if (board[j + 1][i] == 0 || board[j + 1][i] == board[j][i]) {
					return true;
				}
			}
		}
	}
	return false
}

// 判断是否有障碍物
function noBlockHorizontal (row, col1, col2, board) {
	for (var i = col1 + 1; i < col2; i++) {
		// 如果有一个值有值就说明有障碍物
		if (board[row][i] != 0) {
			return false
		}
	}
	return true;
}

function noBlockVertical (col, row1, row2, board) {
	for (var i = row1 + 1; i < row2; i++) {
		// 如果有一个值有值就说明有障碍物
		if (board[i][col] != 0) {
			return false
		}
	}
	return true;
}

// 是否还可以移动 用来判断游戏结束
function nomove (board) {
	if (canMoveDown(board) || 
		canMoveUp(board) ||
		canMoveRight(board) ||
		canMoveLeft(board)) {
		return false
	}
	return true
}