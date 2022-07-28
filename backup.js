const Gameboard = (function () {
  let winTracker;
  const $gameboard = document.querySelector(".gameboard");

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

const Interface = (function () {
  const $gameboard = document.querySelector(".gameboard");
  const $resultDisplay = document.querySelector(".result-display");

  function enableInput() {
    $gameboard.addEventListener("click", Game.playRound);
  }

  function disableInput() {
    $gameboard.removeEventListener("click", Game.playRound);
  }

  function showResult(winner) {
    $resultDisplay.classList.remove("hidden");

    if (!winner) $resultDisplay.textContent = "It's a draw!";
    else $resultDisplay.textContent = `${winner} wins!`;
  }

  function hideResult() {
    $resultDisplay.classList.add("hidden");
  }

  function updateGameboard() {
    const values = Game.getGameboardValues();
    values.forEach((val, i) => $gameboard.insertAdjacentHTML("beforeend", `<div class="gameboard-cell" data-id="${i}">${val}</div>`));
  }

  function init() {
    hideResult();
    updateGameboard();
  }

  return { enableInput, disableInput, showResult, hideResult, updateGameboard, init };
})();

const Game = (function () {
  function playRound(e) {
    if (clickedCell.textContent) return; // Don't overwrite cells that have already been clicked

    clickedCell.textContent = symbol;
    setCell(symbol, cellId);

    if (Gameboard.checkForWinner(cellId, symbol, activePlayer)) {
      Interface.disableInput();
      Interface.showResult(activePlayer.name);
    }
    if (Gameboard.checkIfFull()) {
      Interface.disableInput();
      Interface.showResult();
    }
    switchActivePlayer();
  }

  function getGameboardValues() {
    return values;
  }

  function setCell(symbol, id) {
    values[id] = symbol;
  }

  function start() {
    console.log("STAERT");
    Interface.hideResult();
    Interface.enableInput();
    activePlayer = playerUser;
    // Gameboard.init();
  }

  function init() {
    Interface.init();
  }

  return { init, start, playRound, getGameboardValues };
})();

Game.init();
