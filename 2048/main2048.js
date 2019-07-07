var board = new Array();
var score = 0;
var hasConflicted = new Array();
var $score = $("#score");

var startX = 0;
var startY = 0;
var endX = 0;
var endY = 0;

$(document).ready(function() {
	prepareForMobile();
	newgame();
})

function prepareForMobile () {
	if (documentWidth > 500) {
		documentWidth = 500;
		cellSpace = 20;
		cellSideLength = 100;
	}

	$("#grid-container").css({
		width: gridContentWidth - 2 * cellSpace,
		height: gridContentWidth - 2 * cellSpace,
		padding: cellSpace,
		borderRadius: 0.02 * gridContentWidth
	})
	$(".grid-cell").css({
		width: cellSideLength,
		height: cellSideLength,
		borderRadius: 0.02 * cellSideLength
	})
}

function newgame() {
	// 初始化棋盘
	init();
	// 在随机2个格子生成数字
	generateOneNumber();
	generateOneNumber();
}

function init() {
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			var gridCell = $("#grid-cell-"+i+"-"+j+"");
			gridCell.css("top", getPosTop(i, j));
			gridCell.css("left", getPosLeft(i, j));
		}
	}

	for (var i = 0; i < 4; i++) {
		board[i] = new Array();
		hasConflicted[i] = new Array();
		for (var j = 0; j < 4; j++) {
			board[i][j] = 0;
			hasConflicted[i][j] = false;
		}
	}

	updateBoardView();
}

function updateBoardView() {
	$(".number-cell").remove();
	$score.html(score)
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			$("#grid-container").append("<div class='number-cell' id='number-cell-"+i+"-"+j+"'></div>");
			var theNumberCell = $("#number-cell-"+i+"-"+j+"");

			if (board[i][j] == 0) {
				theNumberCell.css('width', '0px');
				theNumberCell.css('height', '0px');
				theNumberCell.css('top', getPosTop(i, j) + cellSideLength / 2);
				theNumberCell.css('left', getPosLeft(i, j) + cellSideLength / 2);
			} else {
				theNumberCell.css('width', cellSideLength);
				theNumberCell.css('height', cellSideLength);
				theNumberCell.css('top', getPosTop(i, j));
				theNumberCell.css('left', getPosLeft(i, j));
				theNumberCell.css('background-color', getNumberBackgroundColor(board[i][j]));
				theNumberCell.css('color', getNumberColor(board[i][j]));
				theNumberCell.text(board[i][j]);
			}
			hasConflicted[i][j] = false;
		}
	}
	$(".number-cell").css({
		"line-height": cellSideLength + "px",
		'font-size': 0.6 * cellSideLength
	})
}

function generateOneNumber () {
	// 判断是否还有位置
	if (nospace(board)) {
		return false;
	}

	// 随机生成一个位置
	var randx = parseInt(Math.floor(Math.random() * 4))
	var randy = parseInt(Math.floor(Math.random() * 4))

	// 优化随机循环
	var times = 0;
	while (times < 50) {
		if (board[randx][randy] == 0) {
			break;
		}
		randx = parseInt(Math.floor(Math.random() * 4))
		randy = parseInt(Math.floor(Math.random() * 4))

		times ++;
	}

	if (times == 50) {
		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < 4; j++) {
				randx = i;
				randy = j;
			}
		}
	}

	// 随机生成一个数 50%几率生成2或者4
	var randNumber = Math.random() < 0.5 ? 2 : 4;

	// 在随机位置显示随机数字
	board[randx][randy] = randNumber;
	showNumberWithAnimation(randx, randy, randNumber);
	return true;
}

$(document).keydown(function(event) {
	
	switch (event.keyCode) {
		case 37: // left
			event.preventDefault();
			if (moveLeft()) {
				setTimeout(generateOneNumber, 210)
				setTimeout(isgameover, 300)
			}
			break;
		case 38: // up
			event.preventDefault();
			if (moveUp()) {
				setTimeout(generateOneNumber, 210)
				setTimeout(isgameover, 300)
			}
			break;
		case 39: // right
			event.preventDefault();
			if (moveRight()) {
				setTimeout(generateOneNumber, 210)
				setTimeout(isgameover, 300)
			}
			break;
		case 40: // down
			event.preventDefault();
			if (moveDown()) {
				setTimeout(generateOneNumber, 210)
				setTimeout(isgameover, 300)
			}
			break;
		default: 
			break;
	}
})

document.addEventListener('touchstart', function(event) {
	startX = event.touches[0].pageX;
	startY = event.touches[0].pageY;
})
document.addEventListener('touchmove', function(event) {
	event.preventDefault();
})
document.addEventListener('touchend', function(event) {
	endX = event.changedTouches[0].pageX;
	endY = event.changedTouches[0].pageY;

	var deltaX = endX - startX;
	var deltaY = endY - startY;

	console.log(Math.abs(deltaX) < 0.3 * documentWidth, Math.abs(deltaY) < 0.3 * documentWidth)
	if (Math.abs(deltaX) < 0.3 * documentWidth && Math.abs(deltaY) < 0.3 * documentWidth) {
		return;
	}

	// x
	if (Math.abs(deltaX) > Math.abs(deltaY)) {
		if (deltaX > 0) {
			// move right
			if (moveRight()) {
				setTimeout(generateOneNumber, 210)
				setTimeout(isgameover, 300)
			}
		} else {
			// move left
			if (moveLeft()) {
				setTimeout(generateOneNumber, 210)
				setTimeout(isgameover, 300)
			}
		}

	} else { // y
		if (deltaY > 0) {
			// move down
			if (moveDown()) {
				setTimeout(generateOneNumber, 210)
				setTimeout(isgameover, 300)
			}
		} else {
			// move up
			if (moveUp()) {
				setTimeout(generateOneNumber, 210)
				setTimeout(isgameover, 300)
			}
		}
	}
})

function isgameover () {
	if (nospace(board) && nomove(board)) {
		gameover();
	}
}

function gameover () {
	alert("游戏结束")
}

function moveLeft () {
	if (!canMoveLeft(board)) {
		return false
	}

	for (var i = 0; i < 4; i++) {
		for (var j = 1; j < 4; j++) { // 第一列不用考虑，因为第一列肯定不能向左移动

			if (board[i][j] != 0) { // 当这个位置不等于0，那么这个位置就有可能会移动
				// 循环0到j之间的值
				for (var k = 0; k < j; k++) {
					// 如果中间值等于0且k到j之间没有障碍物就可以移动
					if (board[i][k] == 0 && noBlockHorizontal(i, k, j, board)) {
						// move
						showMoveAnimation(i, j, i, k);
						board[i][k] = board[i][j]; // 把移动之前（i，j）的值给到（i，k）这个位置
						board[i][j] = 0; // 同时把位置（i，j）的值赋值为0
						continue;
					// 如果k值与j值相等且k到j之间没有障碍物就可以移动
					} else if (board[i][k] == board[i][j] && noBlockHorizontal(i, k, j, board) && !hasConflicted[i][k]) {
						// move
						showMoveAnimation(i, j, i, k);
						// add
						board[i][k] += board[i][j]; // 把移动之前（i，j）的值与（i，k）这个位置的值相加
						score += board[i][k];
						board[i][j] = 0; // 同时把位置（i，j）的值赋值为0
						hasConflicted[i][k] = true;
						continue;
					}
				}
			}
		}
	}

	// 更新了之后所有的numberCell都回到了原处
	setTimeout("updateBoardView()", 200)
	return true;
}

function moveRight () {
	if (!canMoveRight(board)) {
		return false
	}

	for (var i = 0; i < 4; i++) {
		for (var j = 2; j >= 0; j--) { // 第一列不用考虑，因为第一列肯定不能向左移动

			if (board[i][j] != 0) { // 当这个位置不等于0，那么这个位置就有可能会移动
				// 循环0到j之间的值
				for (var k = 3; k > j; k--) {
					// 如果中间值等于0且k到j之间没有障碍物就可以移动
					if (board[i][k] == 0 && noBlockHorizontal(i, k, j, board)) {
						// move

						showMoveAnimation(i, j, i, k);
						board[i][k] = board[i][j]; // 把移动之前（i，j）的值给到（i，k）这个位置
						board[i][j] = 0; // 同时把位置（i，j）的值赋值为0
						continue;
					// 如果k值与j值相等且k到j之间没有障碍物就可以移动
					} else if (board[i][k] == board[i][j] && noBlockHorizontal(i, k, j, board) && !hasConflicted[i][k]) {
						// move
						showMoveAnimation(i, j, i, k);
						// add
						board[i][k] += board[i][j]; // 把移动之前（i，j）的值与（i，k）这个位置的值相加
						score += board[i][k];
						board[i][j] = 0; // 同时把位置（i，j）的值赋值为0
						hasConflicted[i][k] = true;
						continue;
					}
				}
			}
		}
	}

	// 更新了之后所有的numberCell都回到了原处
	setTimeout("updateBoardView()", 200)
	return true;
}


function moveUp () {
	if (!canMoveUp(board)) {
		return false
	}

	for (var i = 0; i < 4; i++) {
		for (var j = 1; j < 4; j++) { // 第一列不用考虑，因为第一列肯定不能向左移动

			if (board[j][i] != 0) { // 当这个位置不等于0，那么这个位置就有可能会移动
				// 循环0到j之间的值
				for (var k = 0; k < j; k++) {
					// 如果中间值等于0且k到j之间没有障碍物就可以移动
					if (board[k][i] == 0 && noBlockVertical(i, j, k, board)) {
						// move

						showMoveAnimation(j, i, k, i);
						board[k][i] = board[j][i]; // 把移动之前（i，j）的值给到（i，k）这个位置
						board[j][i] = 0; // 同时把位置（i，j）的值赋值为0
						continue;
					// 如果k值与j值相等且k到j之间没有障碍物就可以移动
					} else if (board[k][i] == board[j][i] && noBlockVertical(i, j, k, board) && !hasConflicted[k][i]) {
						// move
						showMoveAnimation(j, i, k, i);
						// add
						board[k][i] += board[j][i];; // 把移动之前（i，j）的值与（i，k）这个位置的值相加
						score += board[k][i];
						board[j][i] = 0; // 同时把位置（i，j）的值赋值为0
						hasConflicted[k][i] = true;
						continue;
					}
				}
			}
		}
	}
	// 更新了之后所有的numberCell都回到了原处
	setTimeout("updateBoardView()", 200)
	return true;
}


function moveDown () {
	if (!canMoveDown(board)) {
		return false
	}

	for (var i = 0; i < 4; i++) { // 列
		for (var j = 2; j >= 0; j--) { // 行

			if (board[j][i] != 0) { // 当这个位置不等于0，那么这个位置就有可能会移动
				// 循环0到j之间的值
				for (var k = 3; k > j; k--) {
					// 如果中间值等于0且k到j之间没有障碍物就可以移动
					if (board[k][i] == 0 && noBlockVertical(i, j, k, board)) {
						// move
						showMoveAnimation(j, i, k, i);
						board[k][i] = board[j][i]; // 把移动之前（i，j）的值给到（i，k）这个位置
						board[j][i] = 0; // 同时把位置（i，j）的值赋值为0
						continue;
					// 如果k值与j值相等且k到j之间没有障碍物就可以移动
					} else if (board[k][i] == board[j][i] && noBlockVertical(i, j, k, board) && !hasConflicted[k][i]) {
						// move
						showMoveAnimation(j, i, k, i);
						// add
						board[k][i] += board[j][i];; // 把移动之前（i，j）的值与（i，k）这个位置的值相加
						score += board[k][i];
						board[j][i] = 0; // 同时把位置（i，j）的值赋值为0
						hasConflicted[k][i] = true;
						continue;
					}
				}
			}
		}
	}

	// 更新了之后所有的numberCell都回到了原处
	setTimeout("updateBoardView()", 200)
	return true;
}