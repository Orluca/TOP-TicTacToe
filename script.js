"use strict";

const Gameboard = (function () {
  const values = new Array(9).fill("");

  function display(element) {
    values.forEach((val, i) => element.insertAdjacentHTML("beforeend", `<div class="gameboard-cell" data-id="${i}">${val}</div>`));
  }

  function setCell(symbol, id) {
    values[id] = symbol;
  }

  function getCell(id) {
    return values[id];
  }

  return { display, getCell, setCell };
})();

const Player = function (playerName, playerSymbol) {
  const symbol = playerSymbol;
  const name = playerName;
  return { name, symbol };
};

const Game = (function () {
  const playerUser = Player("User", "X");
  const playerComputer = Player("CPU", "O");
  const $gameboard = document.querySelector(".gameboard");
  let activePlayer = playerUser;

  function switchActivePlayer() {
    activePlayer = activePlayer === playerUser ? playerComputer : playerUser;
  }

  function getActiveSymbol() {
    return activePlayer.symbol;
  }

  function checkForWinner() {
    if (Gameboard.getCell(0) === Gameboard.getCell(1) && Gameboard.getCell(0) === Gameboard.getCell(2) && Gameboard.getCell(1) === Gameboard.getCell(2) && Gameboard.getCell(0)) console.log("WIN");
  }

  function playRound(e) {
    const clickedCell = e.target;
    const symbol = activePlayer.symbol;
    const cellId = clickedCell.dataset.id;

    if (clickedCell.textContent) return; // Don't overwrite cells that have already been clicked

    clickedCell.textContent = symbol;
    Gameboard.setCell(symbol, cellId);

    checkForWinner();
    switchActivePlayer();
  }

  function start() {
    Gameboard.display($gameboard);
    $gameboard.addEventListener("click", playRound);
  }

  return { start, switchActivePlayer, getActiveSymbol, checkForWinner };
})();

Game.start();
