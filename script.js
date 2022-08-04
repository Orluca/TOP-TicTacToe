"use strict";

const Player = function (name, symbol) {
  return { name, symbol };
};

const Interface = (function () {
  const $newGameModal = document.querySelector(".new-game-modal");
  // const $playerContainers = document.querySelectorAll(".player-container");
  const $btnNewGame = document.querySelector(".btn-new-game");
  const $opponentSelectionSection = document.querySelector(".opponent-selection");
  const $difficultySelectionSection = document.querySelector(".difficulty-selection");
  const $btnsOpponentSelections = document.querySelectorAll(".btn-opponent");
  const $gameContainer = document.querySelector(".game-container");

  function initListeners() {
    $newGameModal.addEventListener("click", handleOutsideModalClicks);
    $btnNewGame.addEventListener("click", openNewGameWindow);
    $opponentSelectionSection.addEventListener("click", handleOpponentSelection);
    $difficultySelectionSection.addEventListener("click", handleDifficultySelection);
  }

  function toggleRadioButtons(e) {
    const $buttons = e.target.closest(".radio-btns-container").querySelectorAll(".radio-btn");
    const $target = e.target.closest(".radio-btn");

    $buttons.forEach((btn) => {
      if (btn === $target) btn.classList.add("active-button-1");
      else btn.classList.remove("active-button-1");
    });
  }

  function handleOpponentSelection(e) {
    toggleRadioButtons(e);
  }

  function handleDifficultySelection(e) {
    toggleRadioButtons(e);
  }

  function handleOutsideModalClicks(e) {
    if ($newGameModal.classList.contains("hidden")) return;
    if (e.target.closest(".new-game-window")) return;
    closeNewGameWindow();
  }

  function closeNewGameWindow() {
    $newGameModal.classList.add("hidden");
    // $playerContainers.forEach((el) => el.classList.remove("blurry"));
    $gameContainer.classList.remove("blurry");
  }

  function openNewGameWindow() {
    $newGameModal.classList.remove("hidden");
    // $playerContainers.forEach((el) => el.classList.add("blurry"));
    $gameContainer.classList.add("blurry");
  }

  function init() {
    initListeners();
  }

  return { init };
})();

const Game = (function () {
  function init() {
    Interface.init();
  }

  return { init };
})();

const AI = (function () {})();

Game.init();
