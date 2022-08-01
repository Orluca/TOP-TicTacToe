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

// Go through each remaining empty cell and calc its score with minimax. Then choose the cell with highest score and place "O" in it
function computerMoveImpossible() {
  let bestScore = -Infinity;
  let bestMove;

  gameboard.forEach((cell, i) => {
    if (gameboard[i] === "") {
      // Set the current cell to "O"
      gameboard[i] = "O";
      // Based on this new gameboard, calc the score for the current cell using MINIMAX
      const score = minimax();
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

function minimax() {
  return 1;
}

function handleCellClicks(e) {
  const id = e.target.dataset.id;
  if (cellIsOccupied(id)) return;

  userMove(e.target.dataset.id);
  //   computerMoveEasy();
  computerMoveImpossible();
}

// ###############################################################
// ####################### EVENT LISTENERS #######################
// ###############################################################

$gameboard.addEventListener("click", handleCellClicks);
