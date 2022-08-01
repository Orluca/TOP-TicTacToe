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

function computerMoveRandom() {
  const freeCells = gameboard.reduce((acc, cell, i) => {
    if (cell === "") acc.push(i);
    return acc;
  }, []);
  console.log(freeCells);
  const randomID = Math.floor(Math.random() * freeCells.length);
  gameboard[freeCells[randomID]] = "O";
  updateGameboard();
}

function handleCellClicks(e) {
  userMove(e.target.dataset.id);
  computerMoveRandom();
}

// ###############################################################
// ####################### EVENT LISTENERS #######################
// ###############################################################

$gameboard.addEventListener("click", handleCellClicks);
