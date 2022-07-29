"use strict";

const Player = function (name, symbol) {
  return { name, symbol };
};

const Interface = (function () {
  const $gameboard = document.querySelector(".gameboard");
  const $btnStart = document.querySelector(".btn-start-game");
  const $resultDisplay = document.querySelector(".result-display");

  function updateGameboard() {
    $gameboard.innerHTML = "";
    const values = Game.getGameboardValues();
    values.forEach((val, i) => $gameboard.insertAdjacentHTML("beforeend", `<div class="gameboard-cell" data-id="${i}">${val}</div>`));
  }

  function handleCellClicks(e) {
    const cellId = Number(e.target.dataset.id);

    if (Game.getGameboardValues()[cellId]) return; // Don't overwrite cells that have already been clicked

    if (Game.isOver(Game.userMove(cellId))) {
      Game.endMatch();
      return;
    }
    if (Game.isOver(AI.makeMove())) {
      Game.endMatch();
      return;
    }
  }

  function showResult(winner) {
    $resultDisplay.classList.remove("hidden");

    if (!winner) $resultDisplay.textContent = "It's a draw!";
    else $resultDisplay.textContent = `${winner} wins!`;
  }

  function hideResult() {
    $resultDisplay.classList.add("hidden");
  }

  function enableInput() {
    $gameboard.addEventListener("click", handleCellClicks);
  }

  function disableInput() {
    $gameboard.removeEventListener("click", handleCellClicks);
  }

  function clearGameboard() {
    $gameboard.innerHTML = "";
  }

  function reset() {
    enableInput();
    hideResult();
    clearGameboard();
    updateGameboard();
  }

  function init() {
    $btnStart.addEventListener("click", Game.start);
    updateGameboard();
  }

  return { init, reset, disableInput, showResult, updateGameboard };
})();

const Game = (function () {
  const playerUser = Player("User", "X");
  const playerComputer = Player("CPU", "O");
  let activePlayer;
  let winTracker;
  let values = new Array(9).fill("");
  let winner;

  function getGameboardValues() {
    return values;
  }

  function getActivePlayer() {
    return activePlayer;
  }

  function getWinTracker() {
    return winTracker;
  }

  function setActivePlayer(player) {
    if (player === "user") activePlayer = playerUser;
    if (player === "computer") activePlayer = playerComputer;
  }

  function setCell(id) {
    values[id] = activePlayer.symbol;
  }

  function endMatch() {
    Interface.disableInput();
    Interface.showResult(winner);
  }

  function isOver(cellId) {
    if (checkForWinner(cellId)) {
      winner = getActivePlayer().name;
      return true;
    }
    if (checkIfFull()) return true;
  }

  function checkForWinner(id) {
    const add = activePlayer === playerUser ? 1 : -1;
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

  function resetVariables() {
    activePlayer = playerUser;
    winTracker = { row1: 0, row2: 0, row3: 0, col1: 0, col2: 0, col3: 0, diag1: 0, diag2: 0 };
    values = new Array(9).fill("");
    winner = "";
  }

  function userMove(cellId) {
    setActivePlayer("user");
    setCell(cellId);
    Interface.updateGameboard();
    return cellId;
  }

  function start() {
    resetVariables();
    Interface.reset();
  }

  function init() {
    Interface.init();
  }

  return { init, getGameboardValues, getActivePlayer, setCell, start, setActivePlayer, isOver, userMove, endMatch, getWinTracker };
})();

const AI = (function () {
  let freeCells = [];

  function makeMove() {
    Game.setActivePlayer("computer");
    updateFreeCells();
    let cellId = getRandomPosition();
    if (detectUser3s()) cellId = detectUser3s();
    if (detectOwn3s()) cellId = detectOwn3s();
    Game.setCell(cellId);
    Interface.updateGameboard();
    return cellId;
  }

  function testtemp(pos) {
    if (pos === "row1") return [0, 1, 2];
    if (pos === "row2") return [3, 4, 5];
    if (pos === "row3") return [6, 7, 8];
    if (pos === "col1") return [0, 3, 6];
    if (pos === "col2") return [1, 4, 7];
    if (pos === "col3") return [2, 5, 8];
    if (pos === "diag1") return [0, 4, 8];
    if (pos === "diag2") return [2, 4, 6];
  }

  function detectOwn3s() {
    const winTracker = Game.getWinTracker();
    let id;

    for (const prop in winTracker) {
      if (winTracker[prop] === -2) {
        const positions = testtemp(prop);
        const values = Game.getGameboardValues();
        positions.forEach((pos) => {
          if (values[pos] === "") id = pos;
        });
      }
    }

    return id;
  }

  function detectUser3s() {
    const winTracker = Game.getWinTracker();
    let id;

    for (const prop in winTracker) {
      if (winTracker[prop] === 2) {
        const positions = testtemp(prop);
        const values = Game.getGameboardValues();
        positions.forEach((pos) => {
          if (values[pos] === "") id = pos;
        });
      }
    }

    return id;
  }

  function updateFreeCells() {
    const cellsArray = Game.getGameboardValues();
    freeCells = cellsArray.reduce((acc, cell, i) => {
      if (cell === "") acc.push(i);
      return acc;
    }, []);
  }

  function getRandomPosition() {
    return freeCells[Math.floor(Math.random() * freeCells.length)];
  }

  return { makeMove };
})();

Game.init();
