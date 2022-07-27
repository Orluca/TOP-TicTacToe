"use strict";

const Gameboard = (function () {
  const gameboardArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return { gameboardArray };
})();

const DisplayController = (function () {
  const displayGameboard = function (array) {
    const $gameboard = document.querySelector(".gameboard");
    array.forEach((val) => {
      $gameboard.insertAdjacentHTML("beforeend", `<div class="gameboard-cell">${val}</div>`);
    });
  };

  return { displayGameboard };
})();

const Player = function (playerName) {
  const name = playerName;
  return { name };
};

DisplayController.displayGameboard(Gameboard.gameboardArray);
