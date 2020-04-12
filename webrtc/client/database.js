// Set the configuration for your app
// TODO: Replace with your project's config object

// Get a reference to the database service
var database = firebase.database();
var rootRef = database.ref("rooms/r1")
var usersRef = rootRef.child("users")
var USERID = null



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
  signInUser()
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      var isAnonymous = user.isAnonymous;
      USERID = user.uid;
      console.log("USER ID: " + USERID)
      createNewUser()
      setInterval ( function() {
           getUserPositions(callback)
       }, 200);
    } else {
      // User is signed out.
      // ...
    }
    // ...
  });

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


function signInUser() {
  firebase.auth().signInAnonymously().catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...

    console.log(error)
  });
}
function distance(user1, user2) {
  if (user1 != null && user2 != null) {
    var heightDiff = Math.abs(user1.y - user2.y);
    var widthDiff = Math.abs(user1.x - user2.x);
    return Math.sqrt(pow(heightDiff,2) + pow(widthDiff,2));
  }
}
