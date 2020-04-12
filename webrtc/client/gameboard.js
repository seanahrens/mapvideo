

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
var icons= [];


// SET UP INITIAL GAMEBOARD STATE AND PAWN POSITIONS
function init() {
  onAuth(assignUserID,fail);

  stage = new createjs.Stage("gameboard");


  manifest = [
    {src: "art/hiking-solid.png", id: "hiking"},
    {src: "art/running-solid.png", id: "running"},
    {src: "art/skating-solid.png", id: "skating"},
    {src: "art/snowboarding-solid.png", id: "snowboarding"},
    {src: "art/walking-solid.png", id: "walking"},
    {src: "art/wheelchair-solid.png", id: "wheelchair"},
    {src: "art/user-secret-solid.png", id: "secret"},
    {src: "art/swimmer-solid.png", id: "swimmer"},
    {src: "art/poo-solid.png", id: "poo"},
    {src: "art/user-astronaut-solid.png", id: "astronaut"},
  ];

  icons = [
    "hiking",
    "running",
    "skating",
    "snowboarding",
    "walking",
    "wheelchair",
    "secret",
    "swimmer",
    "poo",
    "astronaut",
  ]

  loader = new createjs.LoadQueue(false);
  //loader.addEventListener("complete", handleComplete);
  loader.loadManifest(manifest, true, "");

  databaseInit(placePawns); // Call Initialize on the Database. Expect an Immediate Callback with Pawn Position Data. Place those pawns.
}

function assignUserID(userID){
  myUserID = userID;
  myPawn = pawnMap[myUserID];
}
function fail(){
  alert("Auth failed!");
}


// PLACE PAWNS ON THE BOARD GIVEN COORDINATE DATA (Called initially, and repeatedly)
function placePawns(users){
  Object.keys(users).forEach(user_id => {
    let coords = users[user_id];

    if (isInBounds(coords.x,coords.y)){ // ignore any off-board positions in the db

      pawn = pawnMap[user_id];
      if (!pawn){ // if pawn does not exist, lets create it and add it to the board
        pawn = new createjs.Shape();
        //pawn.graphics.beginFill(determineColor(user_id)).drawCircle(0, 0, SQUARE_SIZE_IN_PIXELS/2);
        pawn.graphics.beginBitmapFill(loader.getResult(determineIcon(user_id)),"no-repeat").drawRect(0, 0, SQUARE_SIZE_IN_PIXELS, SQUARE_SIZE_IN_PIXELS);

        // pawn = new Image();
        // pawn.onload = function() {
        //     stage.drawImage(pawn, 0, 0);
        // }
        // pawn.src = "http://upload.wikimedia.org/wikipedia/commons/d/d2/Svg_example_square.svg";

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
  if (myUserID){ myPawn = pawnMap[myUserID]; };
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
  //return (z*SQUARE_SIZE_IN_PIXELS)+(SQUARE_SIZE_IN_PIXELS/2);
  return (z*SQUARE_SIZE_IN_PIXELS);
}
// Translate Pixel to Which Square This Is
function PixelToSquare(z){
  //return (z-(SQUARE_SIZE_IN_PIXELS/2))/SQUARE_SIZE_IN_PIXELS;
  return z/SQUARE_SIZE_IN_PIXELS;
}

function determineColor(string){
  return colors[string.charCodeAt(string.length-1) % (colors.length)];
}

function determineIcon(string){
  return icons[string.charCodeAt(string.length-1) % (icons.length)];
}


// HANDLE KEYBOARD INPUT
function handleKeyDown(e) {
	//cross browser issues exist
	if (!e) {
		var e = window.event;
	}
  if (myPawn){ // if we haven't yet placed or assigned current users pawn on the board, no movement makes sense
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
}

//
// function loadImage() {
//   var preload = new createjs.LoadQueue();
//   preload.addEventListener("fileload", handleFileComplete);
//   preload.loadFile("assets/preloadjs-bg-center.png");
// }
//
// function handleFileComplete(event) {
//   document.body.appendChild(event.result);
// }
