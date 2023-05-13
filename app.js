/*----- constants -----*/
// MARKS object contains the background image pertaining to each player or empty position at the board
const MARKS = {
  0: `url("https://i.postimg.cc/2jTxSg36/ancient-egypt-eye-of-horus-eye-of-providence-pyramid-texts-png-favpng-1c-Mxbhv-TLNniwq-F8z-Gu-FSkq-Su.jpg")`,
  1: `url("https://i.postimg.cc/jjp9H8G9/egyptian-anubis-illustration-43623-798.jpg")`,
  "-1": `url("https://i.postimg.cc/GhgXP7DQ/e80d9df3009f1e7b3a51a79cec61ae3e.jpg")`,
};

// Display the players name in the turn <h1>
const NAMES = {
  1: "Anubis",
  "-1": "Cleopatra",
};

const gameStates = {
  winner: 1,
  tie: 2,
};

const roundsToWin = 3;
const maxRounds = 5;

// backgrounds for the modal
const modalBackground = {
  anubis: `url("https://i.postimg.cc/jjp9H8G9/egyptian-anubis-illustration-43623-798.jpg")`,
  cleopatra: `url("https://i.postimg.cc/GhgXP7DQ/e80d9df3009f1e7b3a51a79cec61ae3e.jpg")`,
  tie: `url("https://i.postimg.cc/vmjFnyhC/z6ebby06jkha1.jpg")`,
};

/*----- state variables -----*/
// Declare the application-wide state variables

let turn; // will be 1 or -1
let board; // this will be a 2d array
let winner; // this will be set to null (in progress), 1 / -1 (the winner), or 0 (tie)
let anubisWins = 0; // this holds the num of times this player has won
let cleopatraWins = 0; // this holds the num of times this player has won
let gameOver = false;
let completedRounds = 0;

/*----- cached elements  -----*/
// get a hold of the h1 tag that contains the message with player turn
const turnMessage = document.querySelector("#turn h1");
const anubisScore = document.querySelector("#anubis-score h2");
const cleopatraScore = document.querySelector("#cleopatra-score h2");

/*----- event listeners -----*/
const nextRoundBttn = document.querySelector("button");
nextRoundBttn.addEventListener("click", init);
const restartBttn = document.getElementById("restart");
restartBttn.addEventListener("click", restartGame);
const tiles = document.querySelectorAll(".tile");
tiles.forEach(function (tile) {
  tile.addEventListener("click", handleMove);
});

/* Modal */

// Get the modal and close button elements
const modal = document.getElementById("modal");
const headerContent = document.querySelector(".modal-content h2");
const modalContent = document.querySelector(".modal-content p");
const closeModalButton = document.getElementById("close-modal");

// Function to show the modal
function showModal(header, displayText, backgroundImage) {
  headerContent.innerText = header;
  modalContent.innerText = displayText;
  modal.style.backgroundImage = backgroundImage;
  modal.style.display = "block";
}

// Function to close the modal
function closeModal() {
  modal.style.display = "none";
}

closeModalButton.addEventListener("click", closeModal);

// Event listener to close the modal when clicking outside the modal content
modal.addEventListener("click", function (event) {
  if (event.target === modal) {
    closeModal();
  }
});

/*----- functions -----*/

// write and invoke the init() function that will initialize the state variables, the last line in init() should call render() to render that state to the DOM
// for the first time

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
  anubisScore.textContent = anubisWins;
  cleopatraScore.textContent = cleopatraWins;
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

// This function will update current player's turn in the browser
function renderTurn() {
  if (winner === 0) {
    turnMessage.innerText = "It's a tie!!!";
  } else if (winner === 1 || winner === -1) {
    turnMessage.innerHTML = `<span style ="color:#ffd700">Player ${NAMES[winner]} has won this round</span>`;
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
    checkWinner();
    // if we have a winner then stop the game
    if (winner === 1) {
      anubisWins++;
      completedRounds++;
      anubisScore.textContent = anubisWins;
    } else if (winner === -1) {
      cleopatraWins++;
      completedRounds++;
      cleopatraScore.textContent = cleopatraWins;
    } else if (winner === 0) {
      completedRounds++;
    } else {
      turn *= -1;
    }
    checkGameStatus();
    render();
  }
}
// to explain
// The game ends when these 3 condition happen
function checkGameStatus() {
  if (
    anubisWins === roundsToWin || //3
    cleopatraWins === roundsToWin || //3
    completedRounds === maxRounds //5
  ) {
    if (anubisWins === roundsToWin) {
      // anubisWins --> var that holds the num of times this player has won
      // pop up modal player 1 has won
      showModal("Congratulations", "Anubis Wins!!!", modalBackground.anubis);
    } else if (cleopatraWins === roundsToWin) {
      // pop up modal player -1 has won
      showModal(
        "Congratulations",
        "Cleopatra Wins!!!",
        modalBackground.cleopatra
      );
    } else if (completedRounds === maxRounds) {
      showModal("It's a tie!", "TRY AGAIN", modalBackground.tie);
    }
    nextRoundBttn.disabled = true;
    nextRoundBttn.style.backgroundColor = "darkgray";
    nextRoundBttn.style.backgroundImage = "none";
  }
}

function checkWinner() {
  // player wins the round if they have successfully added 3 of their marks in a row
  checkColumns();
  checkRows();
  checkDiagonal();
  checkTie();
}

function checkColumns() {
  // player wins the round if they have successfully added 3 of their marks in a row
  // create variable that holds whether or not there is a winner in any columm
  board.forEach(function (col) {
    const sum = col.reduce(function (total, num) {
      return total + num;
    }, 0);
    if (sum === 3 || sum === -3) {
      winner = turn;
    }
  });
}

function checkRows() {
  // player wins the round if they have successfully added 3 of their marks in a row
  for (let r = 0; r < board.length; r++) {
    let sum = 0;
    for (let c = 0; c < board[r].length; c++) {
      sum += board[c][r];
    }
    if (sum === 3 || sum === -3) {
      winner = turn;
    }
  }
}

// this function checks whether there are spots or zeros left in the board
function checkTie() {
  let numZeros = 0;
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      if (board[c][r] === 0) {
        numZeros += 1;
      }
    }
  }
  if (numZeros === 0) {
    winner = 0;
  }
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
    winner = turn;
  } else if (sums[0] === -3 || sums[1] === -3) {
    winner = turn;
  }
}

function restartGame() {
  init();
  anubisWins = 0;
  cleopatraWins = 0;
  completedRounds = 0;
  nextRoundBttn.disabled = false;
  nextRoundBttn.style.backgroundImage = `url("https://i.postimg.cc/2jTxSg36/ancient-egypt-eye-of-horus-eye-of-providence-pyramid-texts-png-favpng-1c-Mxbhv-TLNniwq-F8z-Gu-FSkq-Su.jpg")`;
  render();
}

init();
renderBoard();
showModal(
  "Welcome to the TIC TAC TOE",
  "Once upon a time, in the mystical land of ancient Egypt, a captivating story unfolded, revealing the origin of the game known as Tic Tac Toe. Legend had it that the game was bestowed upon the people of Egypt by the powerful Pharaohs, blessed by the gods themselves.",
  `url("https://i.postimg.cc/FRfRkckv/38652-free-download-ancient-egypt-capture-the-mind-2500x1767.jpg")`
);
