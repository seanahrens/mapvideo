// Set the configuration for your app
// TODO: Replace with your project's config object
var config = {
  apiKey: "AIzaSyDOnKy-7VXVobK80o7PDRD78yUAmsGm8TQ",
  authDomain: "mapvideo-ddb83.firebaseapp.com",
  databaseURL: "https://mapvideo-ddb83.firebaseio.com/",
  storageBucket: "bucket.appspot.com"
};
console.log("Testing")
firebase.initializeApp(config);
// Get a reference to the database service
var database = firebase.database();
var rootRef = database.ref("rooms/r1")
function getUserPositions() {
    rootRef.on("value")
      .then(function(snapshot) {
          return getPositionsFromSnapshot(snapshot)
})


function updateUserPosition(user) {
  var userRef = rootRef.child(`users/${user.id}`)
  userRef.set({
    x: user.xCoord,
    y: user.yCoord
  })
}
function getPositionsFromSnapshot(snapshot) {
  var positions = []
  snapshot.forEach(function(userSnapshot) {
      var userID = userSnapshot.key
      var userData = userSnapshot.val()
      var xCoord = userData.xCoord
      var yCoord = userData.yCoord
      var userData = {
          userID: userID,
          xCoord:  xCoord,
          yCoord: yCoord
      }
      console.log(userData)
      positions.append(userData)
  })
  return positons
}
