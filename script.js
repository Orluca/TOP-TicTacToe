"use strict";

const Player = function (name, symbol) {
  return { name, symbol };
};

const Interface = (function () {
  const $gameboard = document.querySelector(".gameboard");

  function handleCellClicks(e) {
    const id = e.target.dataset.id;

    if (!Game.cellIsOccupied(id)) return;
    Game.setCell(id);
    Game.updateGameboard();
    Game.switchActivePlayer();
  }

  function init() {
    $gameboard.addEventListener("click", handleCellClicks);
  }

  return { init };
})();

const Game = (function () {
  const playerUser = Player("User", "X");
  const playerComputer = Player("CPU", "O");
  let gameboard;
  let activePlayer;

  function updateGameboard() {
    const $cells = document.querySelectorAll(".cell");
    $cells.forEach((cell, i) => (cell.textContent = gameboard[i]));
  }

  function cellIsOccupied(id) {
    return gameboard[id] ? false : true;
  }

  function setCell(id) {
    gameboard[id] = activePlayer.symbol;
  }

  function switchActivePlayer() {
    activePlayer = activePlayer === playerUser ? playerComputer : playerUser;
  }

  function resetVariables() {
    activePlayer = playerUser;
    gameboard = new Array(9).fill("");
  }

  function init() {
    Interface.init();
    resetVariables();
    updateGameboard();
  }

  return { init, setCell, updateGameboard, switchActivePlayer, cellIsOccupied };
})();

const AI = (function () {})();

Game.init();
