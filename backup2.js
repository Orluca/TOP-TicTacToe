"use strict";

const Player = function (name, symbol) {
  return { name, symbol };
};

const Interface = (function () {
  const $gameboard = document.querySelector(".gameboard");

  function handleCellClicks(e) {
    const id = Number(e.target.dataset.id);

    if (Game.cellIsOccupied(id)) return;

    // HUMAN PLAYER MOVE
    Game.setCell(id);
    Game.updateGameboard();

    if (Game.isOver()) console.log("jaklsdjl");
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

  function cellIsOccupied(id) {
    return gameboard[id] ? true : false;
  }

  function updateGameboard() {
    const $cells = document.querySelectorAll(".cell");
    $cells.forEach((cell, i) => (cell.textContent = gameboard[i]));
  }

  function setCell(id) {
    // gameboard[id] = activePlayer.symbol;
    gameboard[id] = "X";
  }

  function resetVariables() {
    activePlayer = playerUser;
    gameboard = new Array(9).fill("");
  }

  function checkForDraw() {
    return !gameboard.includes("");
  }

  function checkForWinner() {
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

    console.log(gameboard);

    if (
      winningCombos.some((cmb) =>
        cmb.every((i) => {
          return gameboard[i] === activePlayer.symbol;
        })
      )
    ) {
      console.log("yo");
      return activePlayer.name;
    }
  }

  function isOver() {
    if (checkForWinner()) {
      return true;
    }
    if (checkForDraw()) {
      return true;
    }
  }

  function init() {
    Interface.init();
    resetVariables();
    updateGameboard();
  }

  return { init, updateGameboard, setCell, cellIsOccupied, isOver };
})();

const AI = (function () {})();

Game.init();
