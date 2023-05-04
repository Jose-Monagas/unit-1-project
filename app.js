/*----- constants -----*/
// create an object that will hold any possible value that we can have in our board and its pertaining mark (either pyramid, beetle or nothing)
const MARKS = {
  0: "white",
  1: "black",
  "-1": "red",
};

/*----- state variables -----*/
// Declare the application-wide state variables

let turn; // will be 1 or -1
let board; // this will be a 2d array
let winner; // this will be set to null, 1, -1, or 'T'

/*----- cached elements  -----*/

/*----- event listeners -----*/

/*----- functions -----*/

// write and invoke the init() function that will initialize the state variables, the last line in init() should call render() to render that state to the DOM
// for the first time

init();

function init() {
  turn = -1; // first player to start the game

  // 2D array, 0 represents no mark at current position -- turn this -90 deg
  board = [
    [0, 0, 0], // col 0
    [0, -1, 0], // col 1
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
  renderControls();
}

function renderBoard() {
  // iterate through the first array layer and get a hold of the first array row
  board.forEach(function (arr, index) {
    // iterate through the each individual array and get a hold of each element
    arr.forEach(function (elem, idx) {
      // create a variable that will match the id assigned to every div in the board
      const boardId = `c${index}r${idx}`; // gives me all ids --> c0r0
      //   select the id elements using DOM
      const boardEl = document.getElementById(boardId);
      //   user markers object to look up the color we should update the background marker div to
      // the elem parameter I'm passing represents the actual value of each element in the board
      boardEl.style.backgroundColor = MARKS[elem];
    });
  });
}
renderBoard();

// This function will update current player's turn in the browser
function renderTurn() {}

function renderControls() {}
