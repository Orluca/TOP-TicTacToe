"use strict";

const Player = function (name, symbol) {
  return { name, symbol };
};

const Interface = (function () {
  const $newGameModal = document.querySelector(".new-game-modal");
  const $btnNewGame = document.querySelector(".btn-new-game");
  const $btnStartGame = document.querySelector(".btn-start-game");
  const $opponentSelectionSection = document.querySelector(".opponent-selection");
  const $difficultySelectionSection = document.querySelector(".difficulty-selection");
  const $difficultySelectionSectionContainer = document.querySelector(".difficulty-selection-container");
  const $nameInputsContainer = document.querySelector(".name-inputs-container");
  const $btnsOpponentSelections = document.querySelectorAll(".btn-opponent");
  const $btnsDifficultySelections = document.querySelectorAll(".btn-difficulty");
  const $gameContainer = document.querySelector(".game-container");
  const $gameboard = document.querySelector(".gameboard");
  const $resultOverlay = document.querySelector(".result-overlay");
  const $resultMessage = document.querySelector(".result-message");
  const $cells = document.querySelectorAll(".cell");

  function initListeners() {
    $newGameModal.addEventListener("click", handleOutsideModalClicks);
    $btnNewGame.addEventListener("click", handleNewGamePresses);
    $btnStartGame.addEventListener("click", handleStartGamePresses);
    $opponentSelectionSection.addEventListener("click", handleOpponentSelection);
    $difficultySelectionSection.addEventListener("click", handleDifficultySelection);
    $gameboard.addEventListener("click", handleGameboardClicks);
  }

  function handleGameboardClicks(e) {
    const idClickedCell = Number(e.target.dataset.id);

    // Opponent is other human
    Game.playRound(idClickedCell);

    // Opponent is AI
    // Game.setCell(idClickedCell);
    // updateGameboard();
    // switch active player
    // ai move (easy, medium, hard or unbeatable). get cell id, update gameboard array
    // updateGameboard()
    // switch active player
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

  function handleStartGamePresses() {
    closeNewGameWindow();
    Game.startGame();
  }

  function handleOpponentSelection(e) {
    hideStartGameButton();
    toggleRadioButtons(e);
    revealRemainingOptions(e);
    Game.setOpponent(e.target.dataset.opponent);
  }

  function handleDifficultySelection(e) {
    toggleRadioButtons(e);
    showStartGameButton();
    Game.setDifficulty(e.target.dataset.difficulty);
  }

  function handleOutsideModalClicks(e) {
    if (e.target.closest(".new-game-window")) return;
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
    if (result === "draw") $resultMessage.textContent = "It's a TIE!";
    else $resultMessage.textContent = `${result} wins the game!`;
  }

  function showResultMessage() {
    setResultMessage();
    $resultOverlay.classList.remove("hidden");
  }

  function hideResultMessage() {
    $resultOverlay.classList.add("hidden");
  }

  function endGame() {
    showResultMessage();
  }

  function init() {
    initListeners();
  }

  return { init, updateGameboard, endGame };
})();

const Game = (function () {
  const playerUser = Player("User", "X");
  const playerComputer = Player("CPU", "O");
  let gameboard;
  let activePlayer;
  let opponent;
  let difficulty;
  let result;

  function setCell(id) {
    gameboard[id] = activePlayer.symbol;
  }

  function getGameboard() {
    return gameboard;
  }

  function getEmptyCells() {
    return gameboard.reduce((acc, cell, i) => {
      if (cell === "") acc.push(i);
      return acc;
    }, []);
  }

  function switchActivePlayer() {
    activePlayer = activePlayer === playerUser ? playerComputer : playerUser;
  }

  function setOpponent(opp) {
    opponent = opp;
  }

  function setDifficulty(diff) {
    difficulty = diff;
    console.log(difficulty);
  }

  function getResult() {
    return result;
  }

  function startGame() {
    console.log("starting game...");
    // reset ui elements
    // reset certain values (gameboard, active player)
  }

  function checkForDraw() {
    if (gameboard.includes("")) return false;
    result = "draw";
    return true;
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

    if (winningCombos.some((cmb) => cmb.every((i) => gameboard[i] === activePlayer.symbol))) {
      result = activePlayer.name;
      return true;
    }
  }

  function gameIsOver() {
    if (checkForWinner()) {
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
  }

  function endGame() {
    Interface.endGame();
  }

  function initValues() {
    gameboard = new Array(9).fill("");
    activePlayer = playerUser;
    // activePlayer = playerComputer;
  }

  function init() {
    Interface.init();
    initValues();
  }

  return { init, setCell, getGameboard, setOpponent, setDifficulty, getEmptyCells, startGame, switchActivePlayer, playRound, getResult };
})();

const AI = (function () {
  function makeMoveEasy() {
    console.log(Game.getEmptyCells());
  }

  return { makeMoveEasy };
})();

Game.init();
