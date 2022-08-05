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

    Game.setCell(idClickedCell);
    updateGameboard();
  }

  function updateGameboard() {
    const gameboard = Game.getGameboard();
    $cells.forEach((cell, i) => (cell.innerHTML = gameboard[i]));
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
  }

  function handleOpponentSelection(e) {
    hideStartGameButton();
    toggleRadioButtons(e);
    revealRemainingOptions(e);
  }

  function handleDifficultySelection(e) {
    toggleRadioButtons(e);
    showStartGameButton();
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

  function init() {
    initListeners();
  }

  return { init };
})();

const Game = (function () {
  const playerUser = Player("User", "X");
  const playerComputer = Player("CPU", "O");
  let gameboard;
  let activePlayer;

  function setCell(id) {
    const symbol = activePlayer.symbol === "X" ? `<i class="fa-solid fa-x"></i>` : `<i class="fa-solid fa-o"></i>`;
    gameboard[id] = symbol;
  }

  function getGameboard() {
    return gameboard;
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

  return { init, setCell, getGameboard };
})();

const AI = (function () {})();

Game.init();
