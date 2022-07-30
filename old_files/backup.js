"use strict";

const Player = function (name, symbol) {
  return { name, symbol };
};

const Interface = (function () {
  const $gameboard = document.querySelector(".gameboard");
  const $btnStart = document.querySelector(".btn-start-game");
  const $resultDisplay = document.querySelector(".result-display");

  function showResult(winner) {
    $resultDisplay.classList.remove("hidden");

    if (!winner) $resultDisplay.textContent = "It's a draw!";
    else $resultDisplay.textContent = `${winner} wins!`;
  }

  function disableInput() {
    $gameboard.removeEventListener("click", handleCellClicks);
  }

  function init() {
    $btnStart.addEventListener("click", Game.start);
    updateGameboard();
  }

  return { init, reset, disableInput, showResult, updateGameboard };
})();

const Game = (function () {
  function getActivePlayer() {
    return activePlayer;
  }

  function getWinTracker() {
    return winTracker;
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

  // function checkForWinner(id) {
  //   const add = activePlayer === playerUser ? 1 : -1;
  //   if (id === 0) {
  //     winTracker.row1 += add;
  //     winTracker.col1 += add;
  //     winTracker.diag1 += add;
  //   } else if (id === 1) {
  //     winTracker.row1 += add;
  //     winTracker.col2 += add;
  //   } else if (id === 2) {
  //     winTracker.row1 += add;
  //     winTracker.col3 += add;
  //     winTracker.diag2 += add;
  //   } else if (id === 3) {
  //     winTracker.row2 += add;
  //     winTracker.col1 += add;
  //   } else if (id === 4) {
  //     winTracker.row2 += add;
  //     winTracker.col2 += add;
  //     winTracker.diag1 += add;
  //     winTracker.diag2 += add;
  //   } else if (id === 5) {
  //     winTracker.row2 += add;
  //     winTracker.col3 += add;
  //   } else if (id === 6) {
  //     winTracker.row3 += add;
  //     winTracker.col1 += add;
  //     winTracker.diag2 += add;
  //   } else if (id === 7) {
  //     winTracker.row3 += add;
  //     winTracker.col2 += add;
  //   } else if (id === 8) {
  //     winTracker.row3 += add;
  //     winTracker.col3 += add;
  //     winTracker.diag1 += add;
  //   }
  //   return Object.values(winTracker).some((val) => val === 3 || val === -3);
  // }

  function checkForWinner(cellId) {
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

    winningCombos.filter((comb) => comb.includes(cellId)).some((comb) => comb.every);
  }

  function checkIfFull() {
    if (!values.includes("")) return true;
  }

  return { init, getGameboardValues, getActivePlayer, setCell, start, setActivePlayer, isOver, userMove, endMatch, getWinTracker, checkForWinner, checkIfFull };
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

  const minimax = function (gameboard, activeSymbol) {
    if (!gameboard.includes("")) return;

    gameboard.forEach((cell, i) => {
      if (cell === "") {
        gameboard[i] = activeSymbol;
        if (Game.checkIfFull(i)) {
          console.log("draw");
        }
        if (Game.checkForWinner(i)) {
          console.log("winner");
        }
        gameboard[i] = "";
        activeSymbol = activeSymbol === "O" ? "X" : "O";
        console.log(gameboard);
        // minimax(gameboard, activeSymbol);
      }
    });
  };

  return { makeMove, minimax };
})();

Game.init();

// ###################################################################
// ###################################################################
// ###################################################################
const gameboard = ["X", "", "", "", "", "", "", "", ""];
AI.minimax(gameboard, "O");
