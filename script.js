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

    if (Game.checkForWinner(id)) {
      Game.end("win");
      return;
    }
    if (Game.checkForDraw()) {
      Game.end("draw");
      return;
    }

    Game.switchActivePlayer();

    // AI MOVE
    AI.minimax();
    // Game.switchActivePlayer();
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

  function getGameboard() {
    return gameboard;
  }

  function getEmptyCells() {
    return gameboard.reduce((acc, cell, i) => {
      if (cell === "") acc.push(i);
      return acc;
    }, []);
  }

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
      .filter(cmb => cmb.includes(id))
      .some(cmb => cmb.every(i => gameboard[i] === activePlayer.symbol))
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

  return { init, setCell, updateGameboard, switchActivePlayer, cellIsOccupied, checkForWinner, checkForDraw, end, getGameboard, getEmptyCells };
})();

const AI = (function () {
  function minimax() {
    // get (free) gameboard ids
    const emptyCells = Game.getEmptyCells();
    emptyCells.forEach((cell, i) => {
      //   Game.setCell(cell);
      //   Game.updateGameboard();
      // Set "O" on the cell
      // Check if the game is over
      // If yes, give points and return
      // If not, make opponent move
    });
  }

  return { minimax };
})();

Game.init();
