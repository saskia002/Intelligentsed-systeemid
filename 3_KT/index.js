const EMPTY = 0;
const PLAYER = 1;
const PC = 2;

let board = [];
let currentPlayer = PLAYER;
let movesLeft = 9;

let pcMoves = 0;
let playerMoves = 0;

function initializeBoard() {
	document.querySelector("#stepCount").innerHTML = movesLeft;
	board = Array(9).fill(EMPTY);
	const cells = document.querySelectorAll(".tg-0lax");
	cells.forEach((cell, index) => {
		cell.addEventListener("click", () => {
			if (board[index] === EMPTY) {
				board[index] = PLAYER;
				cell.textContent = "x";
				cell.style.backgroundColor = currentPlayer === PLAYER ? "#ADD8E6" : "#FFCCCB";
				endTurn();
			}
		});
	});
}

function endTurn() {
	movesLeft -= 1;
	document.querySelector("#stepCount").innerHTML = movesLeft;

	console.log(currentPlayer, getAvailableMoves(board, currentPlayer));
	if (getAvailableMoves(board, currentPlayer).length === 0) {
		alert(currentPlayer === PLAYER ? "Player wins!" : "PC wins!");
	} else if (movesLeft == 0) {
		alert("Draw!");
		resetGame();
	}

	if (currentPlayer === PLAYER) {
		currentPlayer = PC;
		aiMove();
	} else {
		currentPlayer = PLAYER;
	}
}

function aiMove() {
	const bestMove = findBestMove(getAvailableMoves(board, PC), PC);
	board[bestMove.index] = currentPlayer;
	const aiCell = document.querySelectorAll(".tg-0lax")[bestMove.index];
	aiCell.textContent = "O";
	aiCell.style.backgroundColor = "#FFCCCB";
	endTurn();
}

function getAvailableMoves(board, player) {
	const availableMoves = [];
	for (let i = 0; i < 9; i++) {
		if (board[i] === 1) {
			if (i - 3 >= 0 && board[i - 3] === 0) availableMoves.push(i - 3);
			if (i + 3 < 9 && board[i + 3] === 0) availableMoves.push(i + 3);
			if (i - 1 >= 0 && board[i - 1] === 0) availableMoves.push(i - 1);
			if (i + 1 < 9 && board[i + 1] === 0) availableMoves.push(i + 1);
		}
	}
	return availableMoves;
}

function findBestMove(availableMoves, player) {
	let bestMove = null;
	let bestScore = player === PC ? -Infinity : Infinity;

	for (let i = 0; i < availableMoves.length; i++) {
		const index = availableMoves[i];
		const newBoard = [...board];
		newBoard[index] = player;
		const score = minimax(newBoard, 1, true);
		newBoard[index] = EMPTY;

		if ((player === PC && score > bestScore) || (player === PLAYER && score < bestScore)) {
			bestScore = score;
			bestMove = { index, score };
		}
	}

	return bestMove;
}

function minimax(board, depth, isMaximizing) {
	const scores = {
		[PC]: 1,
		[PLAYER]: -1,
		[EMPTY]: 0,
	};

	if (depth >= movesLeft || movesLeft == 0) {
		return scores[currentPlayer] === PC ? -1 : 1;
	}

	if (isMaximizing) {
		let bestScore = -Infinity;
		for (let i = 0; i < 9; i++) {
			if (board[i] === EMPTY) {
				board[i] = PC;
				const score = minimax(board, depth + 1, false);
				board[i] = EMPTY;
				bestScore = Math.max(score, bestScore);
			}
		}
		return bestScore;
	} else {
		let bestScore = Infinity;
		for (let i = 0; i < 9; i++) {
			if (board[i] === EMPTY) {
				board[i] = PLAYER;
				const score = minimax(board, depth + 1, true);
				board[i] = EMPTY;
				bestScore = Math.min(score, bestScore);
			}
		}
		return bestScore;
	}
}

function resetGame() {
	board = Array(9).fill(EMPTY);
	movesLeft = 9;
	const cells = document.querySelectorAll(".tg-0lax");
	cells.forEach((cell) => {
		cell.textContent = "";
		cell.style.backgroundColor = "transparent";
	});
	currentPlayer = PLAYER;
}
