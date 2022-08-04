"use strict";

const Player = function (name, symbol) {
  return { name, symbol };
};

const Interface = (function () {
  const $newGameModal = document.querySelector(".new-game-modal");
  const $playerContainers = document.querySelectorAll(".player-container");
  const $btnNewGame = document.querySelector(".btn-new-game");

  function initListeners() {
    $newGameModal.addEventListener("click", handleOutsideModalClicks);
    $btnNewGame.addEventListener("click", openNewGameWindow);
  }

  function handleOutsideModalClicks(e) {
    if ($newGameModal.classList.contains("hidden")) return;
    if (e.target.closest(".new-game-window")) return;
    closeNewGameWindow();
  }

  function closeNewGameWindow() {
    $newGameModal.classList.add("hidden");
    $playerContainers.forEach((el) => el.classList.remove("blurry"));
  }

  function openNewGameWindow() {
    $newGameModal.classList.remove("hidden");
    $playerContainers.forEach((el) => el.classList.add("blurry"));
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
