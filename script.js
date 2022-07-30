"use strict";

const Player = function (name, symbol) {
  return { name, symbol };
};

const Interface = (function () {
  const $gameboard = document.querySelector(".gameboard");

  function handleCellClicks(e) {
    const id = e.target.dataset.id;
    Game.setCell(id, "X");
    Game.updateGameboard();
  }

  function init() {
    $gameboard.addEventListener("click", handleCellClicks);
  }

  return { init };
})();

const Game = (function () {
  let gameboard = new Array(9).fill("");

  function updateGameboard() {
    const $cells = document.querySelectorAll(".cell");
    $cells.forEach((cell, i) => (cell.textContent = gameboard[i]));
  }

  function setCell(id, symbol) {
    gameboard[id] = symbol;
  }

  function init() {
    Interface.init();
    updateGameboard();
  }

  return { init, setCell, updateGameboard };
})();

const AI = (function () {})();

Game.init();
