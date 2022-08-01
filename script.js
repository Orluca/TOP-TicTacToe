"use strict";

// ###############################################################
// ######################### VARIABLES #########################
// ###############################################################
const gameboard = new Array(9).fill("");

// ###############################################################
// ######################## HTML ELEMENTS ########################
// ###############################################################

const $gameboard = document.querySelector(".gameboard");
const $cells = document.querySelectorAll(".cell");

// ###############################################################
// ########################## FUNCTIONS ##########################
// ###############################################################

function updateGameboard() {
  $cells.forEach((cell, i) => (cell.textContent = gameboard[i]));
}

function userMove(id) {
  gameboard[id] = "X";
  updateGameboard();
}

function cellIsOccupied(id) {
  return gameboard[id] ? true : false;
}

function getRandomFreeCell() {
  const freeCells = gameboard.reduce((acc, cell, i) => {
    if (cell === "") acc.push(i);
    return acc;
  }, []);
  return freeCells[Math.floor(Math.random() * freeCells.length)];
}

function computerMoveEasy() {
  gameboard[getRandomFreeCell()] = "O";
  updateGameboard();
}

function checkForWinner() {
  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  if (winningCombos.some((cmb) => cmb.every((i) => gameboard[i] === "X"))) return "user";
  if (winningCombos.some((cmb) => cmb.every((i) => gameboard[i] === "O"))) return "cpu";
  if (!gameboard.includes("")) return "draw";
}

// Go through each remaining empty cell and calc its score with minimax. Then choose the cell with highest score and place "O" in it
function computerMoveImpossible() {
  let bestScore = -Infinity;
  let bestMove;

  gameboard.forEach((_cell, i) => {
    if (gameboard[i] === "") {
      // Set the current cell to "O"
      gameboard[i] = "O";
      // Based on this new gameboard, calc the score for the current cell using MINIMAX
      const score = minimax(gameboard, true);
      // Undo the gameboard move
      gameboard[i] = "";
      // If the score is bigger than the current bestScore, reassign it and use current move as best move
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  });

  gameboard[bestMove] = "O";
  updateGameboard();
}

function minimax(gameboard, isMax) {
  // Check if game is over, either through a winner or because of a draw
  if (checkForWinner() === "user") return 10;
  if (checkForWinner() === "cpu") return -10;
  if (checkForWinner() === "draw") return 0;

  // Go through each remaining empty cell and calc the score for each. Then choose the one with the best score for the CURRENT PLAYER
  if (isMax) {
    let bestScore = -Infinity;
    gameboard.forEach((_cell, i) => {
      if (gameboard[i] === "") {
        gameboard[i] = "X";
        const score = minimax(gameboard, false);
        gameboard[i] = "";
        bestScore = Math.max(score, bestScore);
      }
    });
    return bestScore;
  } else if (!isMax) {
    let bestScore = Infinity;
    gameboard.forEach((_cell, i) => {
      if (gameboard[i] === "") {
        gameboard[i] = "O";
        const score = minimax(gameboard, false);
        gameboard[i] = "";
        bestScore = Math.min(score, bestScore);
      }
    });
    return bestScore;
  }
}

function handleCellClicks(e) {
  const id = e.target.dataset.id;
  if (cellIsOccupied(id)) return;

  userMove(e.target.dataset.id);
  if (checkForWinner() === "user") console.log("User wins");
  if (checkForWinner() === "draw") console.log("It's a draw");
  //   computerMoveEasy();
  computerMoveImpossible();
  if (checkForWinner() === "cpu") console.log("CPU wins");
  if (checkForWinner() === "draw") console.log("It's a draw");
}

// ###############################################################
// ####################### EVENT LISTENERS #######################
// ###############################################################

$gameboard.addEventListener("click", handleCellClicks);
