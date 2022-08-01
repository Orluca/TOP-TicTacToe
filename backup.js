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

    if (Game.checkForWinner()) {
      Game.end("win");
      return;
    }
    if (Game.checkForDraw()) {
      Game.end("draw");
      return;
    }

    Game.switchActivePlayer();

    // AI MOVE
    AI.makeMove();
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

  function getActivePlayer() {
    return activePlayer;
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

  function checkForDraw(gameboard) {
    if (!gameboard) gameboard = getGameboard();
    return !gameboard.includes("");
  }

  function checkForWinner(gameboard) {
    if (!gameboard) gameboard = getGameboard();
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

  function end(result) {
    if (result === "win") console.log(`${activePlayer.name} wins the game!`);
    if (result === "draw") console.log(`It's a draw!`);
  }

  function init() {
    Interface.init();
    resetVariables();
    updateGameboard();
  }

  return { init, setCell, updateGameboard, switchActivePlayer, cellIsOccupied, checkForWinner, checkForDraw, end, getGameboard, getEmptyCells, getActivePlayer };
})();

const AI = (function () {
  function makeMove() {
    let bestScore = -Infinity;
    let bestMove;
    let gameboard = Game.getGameboard();

    gameboard.forEach((cell, i) => {
      if (gameboard[i] === "") {
        gameboard[i] = "O";
        // gameboard = ["X", "X", "X", "O", "O", "O", "", "", ""];
        const score = minimax(gameboard, true, 0);
        gameboard[i] = "";
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    });

    Game.setCell(bestMove);
    Game.updateGameboard();
    Game.switchActivePlayer();
  }

  function minimax(gameboard, isMax, depth) {
    if (Game.checkForWinner(gameboard) === "User") {
      console.log("user winner");
      return 10;
    }
    if (Game.checkForWinner(gameboard) === "CPU") {
      console.log("cpu winner");
      return -10;
    }
    if (Game.checkForDraw(gameboard)) {
      console.log("draw");
      return 0;
    }
    if (isMax) {
      let bestScore = -Infinity;
      gameboard.forEach((cell, i) => {
        if (gameboard[i] === "") {
          gameboard[i] = "X";
          let score = minimax(gameboard, false, depth + 1);
          gameboard[i] = "";
          bestScore = max(score, bestScore);
        }
      });
      return bestScore;
    } else if (!isMax) {
      let bestScore = Infinity;
      gameboard.forEach((cell, i) => {
        if (gameboard[i] === "") {
          gameboard[i] = "O";
          let score = minimax(gameboard, true, depth + 1);
          gameboard[i] = "";
          bestScore = min(score, bestScore);
        }
      });
      return bestScore;
    }
  }

  return { makeMove };
})();

Game.init();
