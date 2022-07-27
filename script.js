"use strict";

const Gameboard = (function () {
  const $gameboard = document.querySelector(".gameboard");
  const values = new Array(9).fill("");

  function display() {
    values.forEach((val) => $gameboard.insertAdjacentHTML("beforeend", `<div class="gameboard-cell">${val}</div>`));
  }

  function draw(e) {
    if (e.target.textContent) return;
    e.target.textContent = Game.getSymbol();
    Game.switchActivePlayer();
  }

  $gameboard.addEventListener("click", draw);

  return { display };
})();

const Player = function (playerSymbol) {
  const symbol = playerSymbol;
  return { symbol };
};

const Game = (function () {
  const playerUser = Player("X");
  const playerComputer = Player("O");
  let activePlayer = playerUser;

  function switchActivePlayer() {
    activePlayer = activePlayer === playerUser ? playerComputer : playerUser;
  }

  function getSymbol() {
    return activePlayer.symbol;
  }

  function start() {
    Gameboard.display();
  }

  return { start, activePlayer, switchActivePlayer, getSymbol };
})();

Game.start();
