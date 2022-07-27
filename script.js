"use strict";

const Gameboard = (function () {
  const values = new Array(9).fill("");

  function display(target) {
    values.forEach((val, i) => target.insertAdjacentHTML("beforeend", `<div class="gameboard-cell" data-id="${i}">${val}</div>`));
  }

  function setCell(symbol, id) {
    values[id] = symbol;
  }

  function getCell(id) {
    return values[id];
  }

  function checkRows() {
    // const row1 = new Set(values.slice(0, 3));
    // const row2 = new Set(values.slice(3, 6));
    // const row3 = new Set(values.slice(6, 9));
    // console.log(row1);
    // console.log(row2);
    // console.log(row3);
  }

  return { display, getCell, setCell, checkRows };
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

  const winTracker = { row1: 0, row2: 0, row3: 0, col1: 0, col2: 0, col3: 0, diag1: 0, diag2: 0 };

  function checkForWinner(id, symbol) {
    const add = symbol === playerUser.symbol ? 1 : -1;
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

  function playRound(e) {
    const clickedCell = e.target;
    const symbol = activePlayer.symbol;
    const cellId = Number(clickedCell.dataset.id);

    if (clickedCell.textContent) return; // Don't overwrite cells that have already been clicked

    clickedCell.textContent = symbol;
    Gameboard.setCell(symbol, cellId);

    checkForWinner(cellId, symbol);
    switchActivePlayer();
  }

  function start() {
    Gameboard.display($gameboard);
    $gameboard.addEventListener("click", playRound);
  }

  return { start };
})();

Game.start();
