"use strict";

const Gameboard = (function () {
  let values = new Array(9).fill("");
  let winTracker;
  const $gameboard = document.querySelector(".gameboard");

  function display() {
    values.forEach((val, i) => $gameboard.insertAdjacentHTML("beforeend", `<div class="gameboard-cell" data-id="${i}">${val}</div>`));
  }

  function setCell(symbol, id) {
    values[id] = symbol;
  }

  function getCell(id) {
    return values[id];
  }

  function checkForWinner(id, symbol, activePlayer) {
    const add = activePlayer.symbol === "X" ? 1 : -1;
    if (id === 0) {
      winTracker.row1 += add;
      winTracker.col1 += add;
      winTracker.diag1 += add;
    } else if (id === 1) {
      winTracker.row1 += add;
      winTracker.col2 += add;
    } else if (id === 2) {
      winTracker.row1 += add;
      winTracker.col3 += add;
      winTracker.diag2 += add;
    } else if (id === 3) {
      winTracker.row2 += add;
      winTracker.col1 += add;
    } else if (id === 4) {
      winTracker.row2 += add;
      winTracker.col2 += add;
      winTracker.diag1 += add;
      winTracker.diag2 += add;
    } else if (id === 5) {
      winTracker.row2 += add;
      winTracker.col3 += add;
    } else if (id === 6) {
      winTracker.row3 += add;
      winTracker.col1 += add;
      winTracker.diag2 += add;
    } else if (id === 7) {
      winTracker.row3 += add;
      winTracker.col2 += add;
    } else if (id === 8) {
      winTracker.row3 += add;
      winTracker.col3 += add;
      winTracker.diag1 += add;
    }

    return Object.values(winTracker).some((val) => val === 3 || val === -3);
  }

  function checkIfFull() {
    if (!values.includes("")) return true;
  }

  function clear() {
    $gameboard.innerHTML = "";
    values = new Array(9).fill("");
  }

  function init() {
    winTracker = { row1: 0, row2: 0, row3: 0, col1: 0, col2: 0, col3: 0, diag1: 0, diag2: 0 };
    clear();
    display();
  }

  return { getCell, setCell, checkIfFull, checkForWinner, init };
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
  const $btnStart = document.querySelector(".btn-start-game");
  let activePlayer;

  function switchActivePlayer() {
    activePlayer = activePlayer === playerUser ? playerComputer : playerUser;
  }

  function playRound(e) {
    const clickedCell = e.target;
    const symbol = activePlayer.symbol;
    const cellId = Number(clickedCell.dataset.id);

    if (clickedCell.textContent) return; // Don't overwrite cells that have already been clicked

    clickedCell.textContent = symbol;
    Gameboard.setCell(symbol, cellId);

    if (Gameboard.checkForWinner(cellId, symbol, activePlayer)) {
      console.log(`The winner is ${activePlayer.name}!`);
      disableInput();
    }
    if (Gameboard.checkIfFull()) {
      console.log(`It's a draw!`);
      disableInput();
    }
    switchActivePlayer();
  }

  function enableInput() {
    $gameboard.addEventListener("click", playRound);
  }

  function disableInput() {
    $gameboard.removeEventListener("click", playRound);
  }

  function start() {
    activePlayer = playerUser;
    Gameboard.init();
    enableInput();
  }

  function init() {
    $btnStart.addEventListener("click", start);
  }

  return { init };
})();

Game.init();
