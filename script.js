"use strict";

const Player = function (name, symbol) {
  return { name, symbol };
};

const Interface = (function () {
  const $gameboard = document.querySelector(".gameboard");

  function handleCellClicks(e) {
    const id = Number(e.target.dataset.id);

    if (Game.cellIsOccupied(id)) return;

    Game.setCell(id);
    Game.updateGameboard();

    if (Game.checkForWinner(id)) {
      Game.end("win");
      return;
    }
    if (Game.checkForDraw()) {
      Game.end("draw");
      return;
    }

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
    return gameboard[id] ? true : false;
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

  function checkForDraw() {
    return !gameboard.includes("");
  }

  function checkForWinner(id) {
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

    // prettier-ignore
    return winningCombos
      .filter(comb => comb.includes(id))
      .some(comb => comb.every(i => gameboard[i] === activePlayer.symbol))
  }

  function end(result) {
    if (result === "win") console.log(`${activePlayer.name} wins the game!`);
    if (result === "draw") console.log(`It's a draw!`);
  }

  function init() {
    Interface.init();
    resetVariables();
    updateGameboard();
  }

  return { init, setCell, updateGameboard, switchActivePlayer, cellIsOccupied, checkForWinner, checkForDraw, end };
})();

const AI = (function () {})();

Game.init();
