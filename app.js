/*----- constants -----*/
// create an object that will hold any possible value that we can have in our board and its pertaining mark (either pyramid, beetle or nothing)
const MARKS = {
  0: `url("https://i.postimg.cc/2jTxSg36/ancient-egypt-eye-of-horus-eye-of-providence-pyramid-texts-png-favpng-1c-Mxbhv-TLNniwq-F8z-Gu-FSkq-Su.jpg")`,
  1: `url("https://i.postimg.cc/jjp9H8G9/egyptian-anubis-illustration-43623-798.jpg")`,
  "-1": `url("https://i.postimg.cc/GhgXP7DQ/e80d9df3009f1e7b3a51a79cec61ae3e.jpg")`,
};

const NAMES = {
  1: "Anubis",
  "-1": "Cleopatra",
};

/*----- state variables -----*/
// Declare the application-wide state variables

let turn; // will be 1 or -1
let board; // this will be a 2d array
let winner; // this will be set to null, 1, -1, or 'T'

/*----- cached elements  -----*/
// get a hold of the h1 tag that contains the message with player turn
const turnMessage = document.querySelector("#turn h1");

/*----- event listeners -----*/
document.querySelector("button").addEventListener("click", init);
const tiles = document.querySelectorAll(".tile");
tiles.forEach(function (tile) {
  tile.addEventListener("click", handleMove);
});

/*----- functions -----*/

// write and invoke the init() function that will initialize the state variables, the last line in init() should call render() to render that state to the DOM
// for the first time

init();

function init() {
  turn = 1; // first player to start the game

  // 2D array, 0 represents no mark at current position -- turn this -90 deg
  board = [
    [0, 0, 0], // col 0
    [0, 0, 0], // col 1
    [0, 0, 0], // col 2
    //  r0 r1 r2
  ];
  winner = null; // indicates that there's no winner yet and keeps the game going
  render();
}

function render() {
  // render() transfers the state of the app to the DOM
  renderBoard();
  renderTurn();
}

function renderBoard() {
  // iterate through the first array layer and get a hold of the first array row
  board.forEach(function (arr, index) {
    // iterate through the each individual array and get a hold of each element
    arr.forEach(function (elem, idx) {
      // create a variable that will match the id assigned to every div in the board
      const boardId = `${index}-${idx}`; // gives me all ids --> c0r0
      //   select the id elements using DOM
      const boardEl = document.getElementById(boardId);
      //   user markers object to look up the color we should update the background marker div to
      // the elem parameter I'm passing represents the actual value of each element in the board
      boardEl.style.backgroundImage = MARKS[elem];
    });
  });
}
renderBoard();

// This function will update current player's turn in the browser
function renderTurn() {
  if (winner === "T") {
    turnMessage.innerText = "It's a tie!!!";
  } else if (winner === 1 || winner === -1) {
    turnMessage.innerHTML = `<span style ="color:#ffd700">Player ${NAMES[winner]} has won</span>`;
  } else {
    turnMessage.innerHTML = `${NAMES[turn]}'s turn`;
  }
}

function handleMove(event) {
  // Get the column and the row of current click from the board
  const [col, row] = event.target.id.split("-").map(Number);
  // at this point we have the column and row of the tile clicked to update the background image of the board
  // now we have to make sure that the current column and row are blank before changing the bg
  if (board[col][row] === 0) {
    board[col][row] = turn;
    winner = checkWinner();
    // console.log(winner);
    turn *= -1;
    render();
  }
}

function checkWinner() {
  // player wins the round if they have successfully added 3 of their marks in a row
  const columnWin = checkColumns();
  const rowWin = checkRows();
  const diagonalWin = checkDiagonal();
  //   will return whichever is truthy, if none is truthy then it returns false
  return columnWin || rowWin || diagonalWin;
}

function checkColumns() {
  // player wins the round if they have successfully added 3 of their marks in a row
  board.forEach(function (col) {
    const sum = col.reduce(function (total, num) {
      return total + num;
    }, 0);
    if (sum === 3) {
      return true;
    } else if (sum === -3) {
      return true;
    }
  });
  return false;
}

function checkRows() {
  // player wins the round if they have successfully added 3 of their marks in a row

  for (let r = 0; r < board.length; r++) {
    let sum = 0;
    for (let c = 0; c < board[r].length; c++) {
      //   console.log(c, r);
      sum += board[c][r];
    }
    if (sum === 3) {
      return true;
    } else if (sum === -3) {
      return true;
    }
  }
  return false;
}

function checkDiagonal() {
  // a diagonal wins means that the sum of [(0,0),(1,1),(2,2)] or [(2,0),(1,1),(0,2)] === 3 or -3
  //   diagonals variable holds the combination oftiles in the board that would make a diagonal win
  const diagonals = [
    [board[0][0], board[1][1], board[2][2]],
    [board[2][0], board[1][1], board[0][2]],
  ];

  //   use the map method to loop through the diagonals array of arrays, col represents each element row (inner array)
  const sums = diagonals.map(function (col) {
    // use reduce to calculate the sum of each inner array
    return col.reduce(function (total, num) {
      return total + num;
    }, 0);
    // sums array is an array with the sum of diagonals[0] and diagonals[1] at index 0 and 1, respectively
    return sums;
  });

  //   evaluate the sums array to check if any player connected 3 marks, if true then that player is a winner
  if (sums[0] === 3 || sums[1] === 3) {
    return true;
  } else if (sums[0] === -3 || sums[1] === -3) {
    return true;
  }
  return false;
}
