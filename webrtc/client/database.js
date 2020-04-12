// Set the configuration for your app
// TODO: Replace with your project's config object

// Get a reference to the database service
var database = firebase.database();
var rootRef = database.ref("rooms/r1")
var usersRef = rootRef.child("users")
var USERID = usersRef.push().key
setInterval ( function() {
     getUserPositions(console.log)
 }, 1000);
function createNewUser() {
  var userData = {
    x: 0,
    y: 0
  }
  var updates = {}
  updates[USERID] = userData
  usersRef.update(updates)
}

function getUserID() {
  return USERID
}

function databaseInit(callback) {
  createNewUser()
  getUserPositions(callback)
}

function updateUserPosition(user) {
  var userRef = usersRef.child(USERID)
  userRef.set(user)
}
function getUserPositions(callback) {
    usersRef.once("value", function(snapshot) {
        callback(getPositionsFrom(snapshot))
    })
}

function getPositionsFrom(snapshot) {
  var positions = {}
  snapshot.forEach(function(userSnapshot) {
      const userID = userSnapshot.key
      const userData = userSnapshot.val()
      const userDict = {
          x: userData.x,
          y: userData.y
      }
      positions[userID] = userDict
  })
  return positions;
};

function sayHi() {
  console.log("hi")
}

// function eucDistance(user1, user2) {
//   var
// }
