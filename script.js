"use strict";

const Gameboard = (function () {
  const values = ["X", "O", "X", "O", "X", "O", "O", "X", "X"];
  const display = function () {
    const $gameboard = document.querySelector(".gameboard");
    values.forEach((val) => {
      $gameboard.insertAdjacentHTML("beforeend", `<div class="gameboard-cell">${val}</div>`);
    });
  };
  return { display };
})();

const DisplayController = (function () {
  return;
})();

const Player = function (playerName) {
  const name = playerName;
  return { name };
};

Gameboard.display();
