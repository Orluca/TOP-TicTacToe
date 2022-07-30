"use strict";

const Player = function (name, symbol) {
  return { name, symbol };
};

const Interface = (function () {
  const $gameboard = document.querySelector(".gameboard");
  const $btnStart = document.querySelector(".btn-start-game");
  const $resultDisplay = document.querySelector(".result-display");

  function handleCellClicks(e) {
    const cellId = Number(e.target.dataset.id);

    if (Game.getGameboardValues()[cellId]) return; // Don't overwrite cells that have already been clicked

    if (Game.isOver(Game.userMove(cellId))) {
      Game.endMatch();
      return;
    }
    if (Game.isOver(AI.makeMove())) {
      Game.endMatch();
      return;
    }
  }

  function updateGameboard() {
    $gameboard.innerHTML = "";
    const values = Game.getGameboardValues();
    values.forEach((val, i) => $gameboard.insertAdjacentHTML("beforeend", `<div class="gameboard-cell" data-id="${i}">${val}</div>`));
  }

  function hideResult() {
    $resultDisplay.classList.add("hidden");
  }

  function enableInput() {
    $gameboard.addEventListener("click", handleCellClicks);
  }

  function clearGameboard() {
    $gameboard.innerHTML = "";
  }

  function reset() {
    enableInput();
    hideResult();
    clearGameboard();
    updateGameboard();
  }

  function init() {
    $btnStart.addEventListener("click", Game.start);
    updateGameboard();
  }

  return { init, reset, updateGameboard };
})();

const Game = (function () {
  const playerUser = Player("User", "X");
  const playerComputer = Player("CPU", "O");
  let values = new Array(9).fill("");
  let activePlayer;
  let winTracker;
  let winner;

  function getGameboardValues() {
    return values;
  }

  function resetVariables() {
    activePlayer = playerUser;
    // winTracker = { row1: 0, row2: 0, row3: 0, col1: 0, col2: 0, col3: 0, diag1: 0, diag2: 0 };
    values = new Array(9).fill("");
    winner = "";
  }

  function setActivePlayer(player) {
    if (player === "user") activePlayer = playerUser;
    if (player === "computer") activePlayer = playerComputer;
  }

  function setCell(id) {
    values[id] = activePlayer.symbol;
  }

  function userMove(cellId) {
    setActivePlayer("user");
    setCell(cellId);
    Interface.updateGameboard();
    return cellId;
  }

  function start() {
    resetVariables();
    Interface.reset();
  }

  function init() {
    resetVariables();
    Interface.init();
  }

  return { init, getGameboardValues, start, userMove };
})();

const AI = (function () {})();

Game.init();
