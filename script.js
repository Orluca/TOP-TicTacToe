"use strict";

const Player = function (name, symbol, score, id) {
  return { name, symbol, score, id };
};

const Interface = (function () {
  const $newGameModal = document.querySelector(".new-game-modal");
  const $btnNewGame = document.querySelector(".btn-new-game");
  const $btnNextRound = document.querySelector(".btn-next-round");
  const $btnStartGame = document.querySelector(".btn-start-game");
  const $btnReset = document.querySelector(".btn-reset");
  const $btnsOpponentSelections = document.querySelectorAll(".btn-opponent");
  const $btnsDifficultySelections = document.querySelectorAll(".btn-difficulty");
  const $opponentSelectionSection = document.querySelector(".opponent-selection");
  const $difficultySelectionSection = document.querySelector(".difficulty-selection");
  const $difficultySelectionSectionContainer = document.querySelector(".difficulty-selection-container");
  const $nameInputsContainer = document.querySelector(".name-inputs-container");
  const $gameContainer = document.querySelector(".game-container");
  const $gameboard = document.querySelector(".gameboard");
  const $resultOverlay = document.querySelector(".result-overlay");
  const $resultMessage = document.querySelector(".result-message");
  const $cells = document.querySelectorAll(".cell");
  const $scoreP1 = document.querySelector("#score-value-player1");
  const $scoreP2 = document.querySelector("#score-value-player2");
  const $nameInputP1 = document.querySelector("#input-name-p1");
  const $nameInputP2 = document.querySelector("#input-name-p2");
  const $nameDisplayP1 = document.querySelector("#name-display-p1");
  const $nameDisplayP2 = document.querySelector("#name-display-p2");
  const $nameDisplayP2Difficulty = document.querySelector("#name-display-p2-difficulty");
  const $roundCounter = document.querySelector("#round-value");

  let startingPlayer = "player1";
  let gameWasStarted = false;

  function initListeners() {
    $newGameModal.addEventListener("click", handleOutsideModalClicks);
    $btnNewGame.addEventListener("click", handleNewGamePresses);
    $btnStartGame.addEventListener("click", handleStartGamePresses);
    $btnNextRound.addEventListener("click", handleNextRoundPresses);
    $btnReset.addEventListener("click", handleResetPresses);
    $opponentSelectionSection.addEventListener("click", handleOpponentSelection);
    $difficultySelectionSection.addEventListener("click", handleDifficultySelection);
    $gameboard.addEventListener("click", handleGameboardClicks);
    $nameInputsContainer.addEventListener("keypress", listenForEnterPresses);
  }

  function listenForEnterPresses(e) {
    if (e.key !== "Enter") return;
    handleStartGamePresses();
  }

  function handleGameboardClicks(e) {
    const idClickedCell = Number(e.target.dataset.id);

    if (!Game.checkIfCellIsEmpty(idClickedCell)) return;

    Game.playRound(idClickedCell);
  }

  function handleNextRoundPresses() {
    hideResultMessage();
    Game.resetValues();
    if (startingPlayer === "player2" && Game.getOpponent() === "computer") {
      Game.switchActivePlayer();
      Game.setCell(AI.makeMove(Game.getDifficulty()));
      Game.switchActivePlayer();
    }
    if (startingPlayer === "player2" && Game.getOpponent() === "human") {
      Game.switchActivePlayer();
    }
    updateGameboard();
    Game.increaseRoundCounter();
    updateRoundCounter();
  }

  function handleResetPresses() {
    Game.resetValues();
    Game.resetScores();
    Game.resetRoundCounter();
    hideResultMessage();
    updateGameboard();
    updateScores();
    updateRoundCounter();
    startingPlayer = "player1";
  }

  function updateRoundCounter() {
    $roundCounter.textContent = Game.getRounds();
  }

  function updateGameboard() {
    const gameboard = Game.getGameboard();
    $cells.forEach((cell, i) => {
      let symbol;
      if (gameboard[i] === "X") symbol = `<i class="fa-solid fa-x"></i>`;
      else if (gameboard[i] === "O") symbol = `<i class="fa-solid fa-o"></i>`;
      else symbol = "";

      cell.innerHTML = symbol;
    });
  }

  function toggleRadioButtons(e) {
    const $buttons = e.target.closest(".radio-btns-container").querySelectorAll(".radio-btn");
    const $target = e.target.closest(".radio-btn");

    $buttons.forEach((btn) => {
      if (btn === $target) btn.classList.add("active-button-1");
      else btn.classList.remove("active-button-1");
    });
  }

  function handleNewGamePresses() {
    resetNewGameWindow();
    openNewGameWindow();
  }

  function showStartGameButton() {
    $btnStartGame.classList.remove("hidden");
  }

  function hideStartGameButton() {
    $btnStartGame.classList.add("hidden");
  }

  function showDifficultySelection() {
    $difficultySelectionSectionContainer.classList.remove("hidden");
  }

  function hideDifficultySelection() {
    $difficultySelectionSectionContainer.classList.add("hidden");
  }

  function showNameInputs() {
    $nameInputsContainer.classList.remove("hidden");
  }

  function hideNameInputs() {
    $nameInputsContainer.classList.add("hidden");
  }

  function difficultyIsSelected() {
    let state;
    $btnsDifficultySelections.forEach((btn) => {
      if (btn.classList.contains("active-button-1")) state = true;
    });
    return state;
  }

  function revealRemainingOptions(e) {
    if (e.target.closest("#btn-opponent-human")) {
      hideDifficultySelection();
      showNameInputs();
      showStartGameButton();
    }
    if (e.target.closest("#btn-opponent-computer")) {
      showDifficultySelection();
      hideNameInputs();
      if (difficultyIsSelected()) showStartGameButton();
    }
  }

  function resetGameboard() {
    hideResultMessage();
    updateScores();
    updateGameboard();
  }

  function handleStartGamePresses() {
    Game.resetScores();
    Game.resetValues();
    if (Game.getOpponent() === "human") checkNameInputs();
    if (Game.getOpponent() === "computer") {
      Game.updateNames("Human", "AI");
      setNameDisplays(Game.getDifficulty());
    }
    resetGameboard();
    closeNewGameWindow();
    gameWasStarted = true;
  }

  function checkNameInputs() {
    const nameP1 = $nameInputP1.value ? $nameInputP1.value : "Player 1";
    const nameP2 = $nameInputP2.value ? $nameInputP2.value : "Player 2";

    Game.updateNames(nameP1, nameP2);
    setNameDisplays();
    resetNameInputs();
  }

  function setNameDisplays(difficulty) {
    const [name1, name2] = Game.getNames();
    $nameDisplayP1.textContent = name1;
    $nameDisplayP2.textContent = name2;
    $nameDisplayP2Difficulty.textContent = difficulty ? difficulty.slice(0, 1).toUpperCase() + difficulty.slice(1) : "";
  }

  function resetNameInputs() {
    $nameInputP1.value = "";
    $nameInputP2.value = "";
  }

  function handleOpponentSelection(e) {
    hideStartGameButton();
    toggleRadioButtons(e);
    revealRemainingOptions(e);

    Game.setOpponent(e.target.closest(".btn-opponent").dataset.opponent);
  }

  function handleDifficultySelection(e) {
    toggleRadioButtons(e);
    showStartGameButton();
    Game.setDifficulty(e.target.dataset.difficulty);
  }

  function handleOutsideModalClicks(e) {
    if (e.target.closest(".new-game-window")) return;
    if (!gameWasStarted) return;
    closeNewGameWindow();
  }

  function closeNewGameWindow() {
    $newGameModal.classList.add("hidden");
    $gameContainer.classList.remove("blurry");
  }

  function openNewGameWindow() {
    $newGameModal.classList.remove("hidden");
    $gameContainer.classList.add("blurry");
  }

  function removePressedButtonHighlights() {
    $btnsDifficultySelections.forEach((btn) => btn.classList.remove("active-button-1"));
    $btnsOpponentSelections.forEach((btn) => btn.classList.remove("active-button-1"));
  }

  function resetNewGameWindow() {
    removePressedButtonHighlights();
    hideDifficultySelection();
    hideNameInputs();
    hideStartGameButton();
  }

  function setResultMessage() {
    const result = Game.getResult();
    const winnerName = Game.getNameWithID(result);
    const colorID = result === "Player 1" ? "player1" : "player2";
    if (result === "draw") $resultMessage.textContent = "It's a TIE!";
    else $resultMessage.innerHTML = `<span class="${colorID}-color">${winnerName}</span> wins the game!`;
  }

  function showResultMessage() {
    setResultMessage();
    $resultOverlay.classList.remove("hidden");
  }

  function hideResultMessage() {
    $resultOverlay.classList.add("hidden");
  }

  function updateScores() {
    const scores = Game.getScores();
    $scoreP1.textContent = scores[0];
    $scoreP2.textContent = scores[1];
  }

  function switchStartingPlayer() {
    startingPlayer = startingPlayer === "player1" ? "player2" : "player1";
  }

  function endGame() {
    switchStartingPlayer();
    showResultMessage();
    updateScores();
  }

  function init() {
    initListeners();
  }

  return { init, updateGameboard, endGame };
})();

const Game = (function () {
  const player1 = Player("User", "X", 0, "Player 1");
  const player2 = Player("CPU", "O", 0, "Player 2");
  let gameboard;
  let activePlayer;
  let opponent;
  let difficulty;
  let result;
  let round;

  function getPlayerNumber(playerName) {
    if (playerName === player1.name) return "player1";
    else if (playerName === player2.name) return "player2";
  }

  function updateNames(name1, name2) {
    player1.name = name1;
    player2.name = name2;
  }

  function getNames() {
    return [player1.name, player2.name];
  }

  function getNameWithID(id) {
    return id === "Player 1" ? player1.name : player2.name;
  }

  function getScores() {
    return [player1.score, player2.score];
  }

  function setCell(id) {
    gameboard[id] = activePlayer.symbol;
  }

  function getGameboard() {
    return gameboard;
  }

  function checkIfCellIsEmpty(id) {
    return gameboard[id] === "" ? true : false;
  }

  function getEmptyCells() {
    return gameboard.reduce((acc, cell, i) => {
      if (cell === "") acc.push(i);
      return acc;
    }, []);
  }

  function switchActivePlayer() {
    activePlayer = activePlayer === player1 ? player2 : player1;
  }

  function setOpponent(opp) {
    opponent = opp;
  }

  function setDifficulty(diff) {
    difficulty = diff;
  }

  function getResult() {
    return result;
  }

  function checkForDraw(board) {
    const gameboard = board ? board : getGameboard();

    if (gameboard.includes("")) return false;
    result = "draw";
    return true;
  }

  function getDifficulty() {
    return difficulty;
  }

  function checkForWinner(board) {
    const gameboard = board ? board : getGameboard();

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

    if (winningCombos.some((cmb) => cmb.every((i) => gameboard[i] === activePlayer.symbol))) {
      result = activePlayer.id;
      return true;
    }
  }

  function gameIsOver() {
    if (checkForWinner()) {
      increaseScore();
      return true;
    }
    if (checkForDraw()) {
      return true;
    }
  }

  function playRound(idClickedCell) {
    if (opponent === "human") {
      setCell(idClickedCell);
      Interface.updateGameboard();
      if (gameIsOver()) {
        endGame();
        return;
      }
      switchActivePlayer();
    }
    if (opponent === "computer") {
      setCell(idClickedCell);
      Interface.updateGameboard();
      if (gameIsOver()) {
        endGame();
        return;
      }
      switchActivePlayer();
      setCell(AI.makeMove(difficulty));
      Interface.updateGameboard();
      if (gameIsOver()) {
        endGame();
        return;
      }
      switchActivePlayer();
    }
  }

  function endGame() {
    Interface.endGame();
  }

  function increaseScore() {
    activePlayer.score += 1;
  }

  function resetScores() {
    player1.score = 0;
    player2.score = 0;
  }

  function makeP1active() {
    activePlayer = player1;
  }

  function makeP2active() {
    activePlayer = player2;
  }

  function getOpponent() {
    return opponent;
  }

  function increaseRoundCounter() {
    round++;
  }

  function getRounds() {
    return round;
  }

  function resetRoundCounter() {
    round = 1;
  }

  function resetValues() {
    gameboard = new Array(9).fill("");
    activePlayer = player1;
    // round = 1;
  }

  function init() {
    Interface.init();
    resetValues();
    round = 1;
  }

  function getActivePlayer() {
    return activePlayer;
  }

  return { init, setCell, getGameboard, setOpponent, getOpponent, setDifficulty, getEmptyCells, switchActivePlayer, playRound, getResult, resetValues, checkIfCellIsEmpty, getScores, resetScores, updateNames, getNames, getPlayerNumber, checkForWinner, checkForDraw, getNameWithID, makeP1active, makeP2active, getDifficulty, increaseRoundCounter, getRounds, resetRoundCounter, getActivePlayer };
})();

const AI = (function () {
  let winTracker;

  function resetWinTracker() {
    winTracker = { row1: 0, row2: 0, row3: 0, col1: 0, col2: 0, col3: 0, diag1: 0, diag2: 0 };
  }

  function updateWinTracker() {
    const gameboard = Game.getGameboard();
    resetWinTracker();

    gameboard.forEach((symbol, id) => {
      if (symbol === "") return;
      const add = symbol === "X" ? 1 : -1;
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
    });
  }

  function getWinTrackerPositions(pos) {
    if (pos === "row1") return [0, 1, 2];
    if (pos === "row2") return [3, 4, 5];
    if (pos === "row3") return [6, 7, 8];
    if (pos === "col1") return [0, 3, 6];
    if (pos === "col2") return [1, 4, 7];
    if (pos === "col3") return [2, 5, 8];
    if (pos === "diag1") return [0, 4, 8];
    if (pos === "diag2") return [2, 4, 6];
  }

  function detectOpponentWin() {
    let id;

    for (const prop in winTracker) {
      if (winTracker[prop] === 2) {
        const positions = getWinTrackerPositions(prop);
        const gameboard = Game.getGameboard();
        positions.forEach((pos) => {
          if (gameboard[pos] === "") id = pos;
        });
      }
    }

    return id;
  }

  function detectOwnWin() {
    let id;

    for (const prop in winTracker) {
      if (winTracker[prop] === -2) {
        const positions = getWinTrackerPositions(prop);
        const gameboard = Game.getGameboard();
        positions.forEach((pos) => {
          if (gameboard[pos] === "") id = pos;
        });
      }
    }

    return id;
  }

  function randomPosition() {
    const emptyCells = Game.getEmptyCells();
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  }

  function easyMove() {
    return randomPosition();
  }

  function mediumMove() {
    const winMove = detectOwnWin();
    if (winMove) return winMove;
    else return randomPosition();
  }

  function hardMove() {
    const winMove = detectOwnWin();
    const opponentWinMove = detectOpponentWin();
    if (winMove) return winMove;
    else if (opponentWinMove) return opponentWinMove;
    else return randomPosition();
  }

  function unbeatableMove() {
    let bestScore = -Infinity;
    let bestMove;
    const gameboard = Game.getGameboard();

    gameboard.forEach((_cell, i) => {
      if (gameboard[i] === "") {
        // Set the current cell to "O"
        gameboard[i] = "O";
        // Based on this new gameboard, calc the score for the current cell using MINIMAX
        const score = minimax(gameboard, false, 0);
        // Undo the gameboard move
        gameboard[i] = "";
        // If the score is bigger than the current bestScore, reassign it and use current move as best move
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    });
    Game.makeP2active(); // A temporary not-so-elegant solution to a bug
    return bestMove;
  }

  function minimax(gameboard, isMax, depth) {
    // Check if game is over, either through a winner or because of a draw
    if (Game.checkForWinner(gameboard)) {
      const result = Game.getResult();
      if (result === "Player 2") return 10 - depth;
      else if (result === "Player 1") {
        return depth - 10;
      }
    }
    if (Game.checkForDraw(gameboard)) {
      return 0;
    }

    Game.switchActivePlayer();

    // Go through each remaining empty cell and calc the score for each. Then choose the one with the best score for the CURRENT PLAYER
    if (isMax) {
      let bestScore = -Infinity;
      gameboard.forEach((_cell, i) => {
        if (gameboard[i] === "") {
          gameboard[i] = "O";
          const score = minimax(gameboard, false, depth + 1);
          gameboard[i] = "";
          bestScore = Math.max(score, bestScore);
        }
      });
      return bestScore;
    } else if (!isMax) {
      let bestScore = Infinity;
      gameboard.forEach((_cell, i) => {
        if (gameboard[i] === "") {
          gameboard[i] = "X";
          const score = minimax(gameboard, true, depth + 1);
          gameboard[i] = "";
          bestScore = Math.min(score, bestScore);
        }
      });
      return bestScore;
    }
  }

  function makeMove(difficulty) {
    updateWinTracker();
    if (difficulty === "easy") return easyMove();
    if (difficulty === "medium") return mediumMove();
    if (difficulty === "hard") return hardMove();
    if (difficulty === "unbeatable") return unbeatableMove();
  }

  return { makeMove };
})();

Game.init();
