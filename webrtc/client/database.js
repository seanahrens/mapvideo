// Set the configuration for your app
// TODO: Replace with your project's config object

console.log("Testing")
// Get a reference to the database service
var database = firebase.database();
var rootRef = database.ref("rooms/r1")
var usersRef = rootRef.child("users")
var USERID = usersRef.push().key

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

function init(callback) {
  createNewUser()
  getUserPositions(callback)
}

function updateUserPosition(user) {
  var userRef = usersRef.child(USERID)
  userRef.set(user)
}
function getUserPositions(callback) {
    rootRef.once("value", function(snapshot) {
        callback(getPositionsFromSnapshot(snapshot))
    })
}

function getPositionsFromSnapshot(snapshot) {
  var positions = {};
  return snapshot.val()
};

function eucDistance(user1, user2) {
  var
}
