/*----- constants -----*/

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
  board = [
    // 0 represents no mark at current position
    [O, O, O], // col 0
    [O, O, O], // col 1
    [O, O, O], // col 2
    //  r0 r1 r2
  ];
  winner = null; // indicates that there's no winner yet and keeps the game going
  render();
}

function render() {}
