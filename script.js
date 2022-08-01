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

function computerMoveImpossible() {
  // Go through each remaining empty cell and calc its score with minimax. Then choose the cell with highest score and place "O"
  let bestScore = -Infinity;
  let bestMove;

  gameboard.forEach((cell, i) => {
    if (cell === "") {
      // Calc the score for the current cell using MINIMAX
      const score = minimax();
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
  console.log("minimax");
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
