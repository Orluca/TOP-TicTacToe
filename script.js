"use strict";

const Gameboard = (function () {
  const $gameboard = document.querySelector(".gameboard");
  const values = new Array(9).fill("");

  function display() {
    values.forEach((val, i) => $gameboard.insertAdjacentHTML("beforeend", `<div class="gameboard-cell" data-id="${i}">${val}</div>`));
  }

  function draw(e) {
    const clickedCell = e.target;

    if (clickedCell.textContent) return;

    const symbol = Game.getActiveSymbol();
    clickedCell.textContent = symbol;
    Game.switchActivePlayer();
    updateArray(symbol, clickedCell.dataset.id);
  }

  function updateArray(symbol, id) {
    values[id] = symbol;
  }

  $gameboard.addEventListener("click", draw);

  return { display };
})();

const Player = function (playerName, playerSymbol) {
  const symbol = playerSymbol;
  const name = playerName;
  return { name, symbol };
};

const Game = (function () {
  const playerUser = Player("User", "X");
  const playerComputer = Player("CPU", "O");
  let activePlayer = playerUser;

  function switchActivePlayer() {
    activePlayer = activePlayer === playerUser ? playerComputer : playerUser;
  }

  function getActiveSymbol() {
    return activePlayer.symbol;
  }

  function start() {
    Gameboard.display();
  }

  return { start, switchActivePlayer, getActiveSymbol };
})();

Game.start();
