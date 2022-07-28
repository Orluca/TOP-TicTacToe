"use strict";

const Player = function (name, symbol) {
  return { name, symbol };
};

const Interface = (function () {
  const $gameboard = document.querySelector(".gameboard");
  const $btnStart = document.querySelector(".btn-start-game");

  function updateGameboard() {
    const values = Game.getGameboardValues();
    values.forEach((val, i) => $gameboard.insertAdjacentHTML("beforeend", `<div class="gameboard-cell" data-id="${i}">${val}</div>`));
  }

  function handleCellClicks(e) {
    const clickedCell = e.target;
    const cellId = Number(clickedCell.dataset.id);
    const symbol = Game.getActiveSymbol();

    if (clickedCell.textContent) return; // Don't overwrite cells that have already been clicked

    drawSymbol(clickedCell, symbol);
    Game.setCell(cellId);
    Game.switchActivePlayer();
  }

  function enableInput() {
    $gameboard.addEventListener("click", handleCellClicks);
  }

  function drawSymbol(clickedCell, symbol) {
    clickedCell.textContent = symbol;
  }

  function init() {
    $btnStart.addEventListener("click", Game.start);
    updateGameboard();
  }

  return { init, enableInput };
})();

const Game = (function () {
  const playerUser = Player("User", "X");
  const playerComputer = Player("CPU", "O");
  let activePlayer;

  let values = new Array(9).fill("");

  function getGameboardValues() {
    return values;
  }

  function getActiveSymbol() {
    return activePlayer.symbol;
  }

  function setCell(id) {
    values[id] = activePlayer.symbol;
  }

  function switchActivePlayer() {
    activePlayer = activePlayer === playerUser ? playerComputer : playerUser;
  }

  function start() {
    Interface.enableInput();
    activePlayer = playerUser;
  }

  function stop() {
    console.log("STOPP");
  }

  function init() {
    Interface.init();
  }

  return { init, getGameboardValues, getActiveSymbol, setCell, start, switchActivePlayer };
})();

Game.init();
