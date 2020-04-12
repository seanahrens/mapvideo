

// GAMEBOARD DIMENSIONS
var BOARD_SQUARES_X = 30;
var BOARD_SQUARES_Y = 20;
var SQUARE_SIZE_IN_PIXELS = 20;


// USER OBJECTS (REPLACE W/ QUERYSNAPSHOTS)
// how do we tie user in DB to which user in the browser? some session ID? IP?
var users = {
  1: {
    color: "red",
    x: 0,
    y: 0
  },
  2: {
    color: "green",
    x: 5,
    y: 8
  },
  3: {
    color: "blue",
    x: 4,
    y: 6
  }
};

// HANDLE KEY PRESSES
document.onkeydown = handleKeyDown;
var KEYCODE_LEFT = 37;
var KEYCODE_RIGHT = 39;
var KEYCODE_UP = 38;
var KEYCODE_DOWN = 40;

// MATRIX REPRESENTING ALL LEGAL MOVES (Moves where other pawns are not)
var is_legal_square = [];
for(var i=0; i<BOARD_SQUARES_X; i++) {
  is_legal_square[i] = [];
  for(var j=0; j<BOARD_SQUARES_Y; j++) {
      is_legal_square[i][j] = true;
  }
}

var pawn;
var stage;

// SET UP INITIAL GAMEBOARD STATE AND PAWN POSITIONS
function init() {
  stage = new createjs.Stage("gameboard");

  Object.keys(users).forEach(user_id => {
    var user = users[user_id];
    let color = user.color;
    let x = user.x;
    let y = user.y;

    // Initial Creation & Placement of Circle
    pawn = new createjs.Shape();
    pawn.graphics.beginFill(color).drawCircle(0, 0, SQUARE_SIZE_IN_PIXELS/2);
    pawn.x = toPixel(x);
    pawn.y = toPixel(y);
    is_legal_square[x][y] = false; //prevent others from moving here
    stage.addChild(pawn);
  });

  stage.update();
}


// MOVE PAWN (MAKING SURE IT'S A VALID MOVE)
function move(x,y){
  oldX = PixelToSquare(pawn.x);
  oldY = PixelToSquare(pawn.y);
  newX = oldX + x;
  newY = oldY + y;

  if ((isInBounds(newX,newY) && (is_legal_square[newX][newY]===true))){
    is_legal_square[oldX][oldY]=true; //mark old spot as free
    is_legal_square[newX][newY]=false; //mark new spot as occupied

    pawn.x = SquareToPixel(newX);
    pawn.y = SquareToPixel(newY);
    // TO DO: MAKE THIS MOVE WITH THE DATABASE;

    stage.update();
  }
}

// Make sure pawn wouldn't fall off the board.
function isInBounds(x,y){
  return ((x >= 0) && (y >= 0) && (x<BOARD_SQUARES_X) && (y<BOARD_SQUARES_Y));
}
// Translate Square to Which Pixel the center of the Pawn should be placed.
function SquareToPixel(z){
  return (z*SQUARE_SIZE_IN_PIXELS)+(SQUARE_SIZE_IN_PIXELS/2);
}
// Translate Pixel to Which Square This Is
function PixelToSquare(z){
  return (z-(SQUARE_SIZE_IN_PIXELS/2))/SQUARE_SIZE_IN_PIXELS;
}



// HANDLE KEYBOARD INPUT
function handleKeyDown(e) {
	//cross browser issues exist
	if (!e) {
		var e = window.event;
	}
	switch (e.keyCode) {
		case KEYCODE_LEFT:
      move(-1,0);
			return false;
		case KEYCODE_RIGHT:
      move(1,0);
			return false;
		case KEYCODE_UP:
      move(0,-1);
			return false;
    case KEYCODE_DOWN:
      move(0,1);
			return false;
	}
}
