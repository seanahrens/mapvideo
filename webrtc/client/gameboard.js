

// GAMEBOARD DIMENSIONS
var BOARD_SQUARES_X = 30;
var BOARD_SQUARES_Y = 20;
var SQUARE_SIZE_IN_PIXELS = 20;

var colors = ["Lime",
  "GreenYellow",
  "MediumAquamarine",
  "DarkGreen",
  "Aqua",
  "Aquamarine",
  "LightSeaGreen",
  "Teal",
  "DeepPink",
  "Pink",
  "DarkRed",
  "Red",
  "LightSalmon",
  "Orange",
  "DarkKhaki",
  "SaddleBrown",
  "SandyBrown",
  "MediumPurple",
  "Indigo",
  "DarkSlateGray",
  "DimGray"];
//var colorsSimple = ["sizzlingred", "orange soda", "yellow", "green", "blue", "violet", "brown", "gray"];


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

var pawnMap = {};
var myPawn;
var myUserID;

var stage;


// SET UP INITIAL GAMEBOARD STATE AND PAWN POSITIONS
function init() {
  stage = new createjs.Stage("gameboard");

  databaseInit(placePawns); // Call Initialize on the Database. Expect an Immediate Callback with Pawn Position Data. Place those pawns.
  myUserID = getUserID();
}



// PLACE PAWNS ON THE BOARD GIVEN COORDINATE DATA (Called initially, and repeatedly)
function placePawns(users){
  Object.keys(users).forEach(user_id => {
    let coords = users[user_id];

    if (isInBounds(coords.x,coords.y)){ // ignore any off-board positions in the db

      pawn = pawnMap[user_id];
      if (!pawn){ // if pawn does not exist, lets create it and add it to the board
        pawn = new createjs.Shape();
        pawn.graphics.beginFill(determineColor(user_id)).drawCircle(0, 0, SQUARE_SIZE_IN_PIXELS/2);
        stage.addChild(pawn);
        pawnMap[user_id] = pawn;
      } else { // This is a redraw. Free up the old space.
        is_legal_square[PixelToSquare(pawn.x)][PixelToSquare(pawn.y)]= true; //mark old spot as free
      }

      // Set/Update All Pawn Positions
      pawn.x = SquareToPixel(coords.x);
      pawn.y = SquareToPixel(coords.y);

      //Prevent others from moving here
      is_legal_square[coords.x][coords.y] = false;

    }
  });
  stage.update();

  // MyPawn = the current web users pawn. We make movement calls to this pawn.
  myPawn = pawnMap[myUserID];
}



// MOVE PAWN (MAKING SURE IT'S A VALID MOVE)
function move(x,y){
  oldX = PixelToSquare(myPawn.x);
  oldY = PixelToSquare(myPawn.y);
  newX = oldX + x;
  newY = oldY + y;

  if ((isInBounds(newX,newY) && (is_legal_square[newX][newY]===true))){
    is_legal_square[oldX][oldY]=true; //mark old spot as free
    is_legal_square[newX][newY]=false; //mark new spot as occupied

    myPawn.x = SquareToPixel(newX);
    myPawn.y = SquareToPixel(newY);

    updateUserPosition({
      x: newX,
      y: newY
    });

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

function determineColor(string){
  return colors[string.charCodeAt(string.length-1) % (colors.length)];
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
