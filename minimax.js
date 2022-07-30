const gameboard = ["X", "", "", "", "", "", "", "", ""];

function minimax(gameboard, activeSymbol) {
  if (!gameboard.includes("")) return;

  gameboard.forEach((cell, i) => {
    if (cell === "") {
      gameboard[i] = activeSymbol;
      activeSymbol = activeSymbol === "O" ? "X" : "O";
      console.log(gameboard);
      minimax(gameboard, activeSymbol);
    }
  });
}

minimax(gameboard, "O");

//   const symbol = activeSymbol === "X" ? "O" : "X" ;
