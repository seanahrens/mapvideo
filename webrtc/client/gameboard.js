
var KEYCODE_LEFT = 37;		//useful keycode
var KEYCODE_RIGHT = 39;		//useful keycode
var KEYCODE_UP = 38;		//useful keycode
var KEYCODE_DOWN = 40;		//useful keycode
var SQUARE_SIZE = 20;
var BOARD_SIZE_X = 30;
var BOARD_SIZE_Y = 20;

//register key functions
document.onkeydown = handleKeyDown;

var circle;
var stage;

var is_legal_square = [];
for(var i=0; i<BOARD_SIZE_X; i++) {
  is_legal_square[i] = [];
  for(var j=0; j<BOARD_SIZE_Y; j++) {
      is_legal_square[i][j] = true;
  }
}

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
// for some reason x validity check is not working
function isInBounds(x,y){
  return ((x >= 0) && (y >= 0) && (x<BOARD_SIZE_X) && (y<BOARD_SIZE_Y));
}
function init() {
  stage = new createjs.Stage("gameboard");

  Object.keys(users).forEach(user_id => {
    var user = users[user_id];
    var color = user.color;
    var x = user.x;
    var y = user.y;

    // Initial Creation & Placement of Circle
    circle = new createjs.Shape();
    circle.graphics.beginFill(color).drawCircle(0, 0, SQUARE_SIZE/2);
    circle.x = toPixel(x);
    circle.y = toPixel(y);
    is_legal_square[x][y]=false; //prevent others from moving into here
    stage.addChild(circle);

  });

  //Update stage will render next frame
  stage.update();
}

function toPixel(z){
  return (z*SQUARE_SIZE)+(SQUARE_SIZE/2);
}
function toSquare(z){
  return (z-(SQUARE_SIZE/2))/SQUARE_SIZE;
}

function move(x,y){
  oldX = toSquare(circle.x);
  oldY = toSquare(circle.y);
  newX = oldX + x;
  newY = oldY + y;

  if ((isInBounds(newX,newY) && (is_legal_square[newX][newY]===true))){
    is_legal_square[oldX][oldY]=true; //mark old spot as free
    is_legal_square[newX][newY]=false; //mark new spot as occupied
    circle.x = toPixel(newX);
    circle.y = toPixel(newY);
    stage.update();
  }
}

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
