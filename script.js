"use strict";

const Player = function (name, symbol) {
  return { name, symbol };
};

const Interface = (function () {
  const $gameboard = document.querySelector(".gameboard");
  const $btnStart = document.querySelector(".btn-start-game");
  const $resultDisplay = document.querySelector(".result-display");

  function updateGameboard() {
    const values = Game.getGameboardValues();
    values.forEach((val, i) => $gameboard.insertAdjacentHTML("beforeend", `<div class="gameboard-cell" data-id="${i}">${val}</div>`));
  }

  function handleCellClicks(e) {
    const clickedCell = e.target;
    const cellId = Number(clickedCell.dataset.id);
    const symbol = Game.getActivePlayer().symbol;

    if (clickedCell.textContent) return; // Don't overwrite cells that have already been clicked

    drawSymbol(clickedCell, symbol);
    Game.setCell(cellId);

    if (Game.checkForWinner(cellId)) {
      disableInput();
      showResult(Game.getActivePlayer().name);
      return;
    }
    if (Game.checkIfFull()) {
      disableInput();
      showResult();
      return;
    }
    Game.switchActivePlayer();
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

  function drawSymbol(clickedCell, symbol) {
    clickedCell.textContent = symbol;
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

  return { init, reset };
})();

const Game = (function () {
  const playerUser = Player("User", "X");
  const playerComputer = Player("CPU", "O");
  let activePlayer;
  let winTracker;
  let values = new Array(9).fill("");

  function getGameboardValues() {
    return values;
  }

  function getActivePlayer() {
    return activePlayer;
  }

  function setCell(id) {
    values[id] = activePlayer.symbol;
  }

  function switchActivePlayer() {
    activePlayer = activePlayer === playerUser ? playerComputer : playerUser;
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
  }

  function start() {
    resetVariables();
    Interface.reset();
  }

  function init() {
    Interface.init();
  }

  return { init, getGameboardValues, getActivePlayer, setCell, start, switchActivePlayer, checkForWinner, checkIfFull };
})();

Game.init();
