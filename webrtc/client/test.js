// Set the configuration for your app
// TODO: Replace with your project's config object

console.log("Testing")
// Get a reference to the database service
var database = firebase.database();
var rootRef = database.ref("rooms/r1")
var USERID = rootRef.child("users").push().key
// function getUserPositions() {
//     rootRef.on("value")
//       .then(function(snapshot) {
//           return getPositionsFromSnapshot(snapshot)
// })
//
// function moveUserLeft(user) {
//   var user = {
//     x: user.xCoord - 1,
//     y: user.yCoord
//   }
//   updateUserPosition(user)
// }
// function moveUserRight(user) {
//   var user = {
//     x: user.xCoord + 1,
//     y: user.yCoord
//   }
//   updateUserPosition(user)
// }
// function moveUserDown(user) {
//   var user = {
//     x: user.xCoord,
//     y: user.yCoord + 1
//   }
//   updateUserPosition(user)
// }
// function moveUserUp(user) {
//   var user = {
//     x: user.xCoord,
//     y: user.yCoord - 1
//   }
//   updateUserPosition(user)
// }
// function updateUserPosition(user) {
//   var userRef = rootRef.child(`users/${USERID}`)
//   userRef.set({
//     x: user.xCoord,
//     y: user.yCoord
//   })
// }

// function getPositionsFromSnapshot(snapshot) {
//   var positions = []
//   // snapshot.forEach(function(userSnapshot) {
//   //     var userID = userSnapshot.key
//   //     var userData = userSnapshot.val()
//   //     var xCoord = userData.xCoord
//   //     var yCoord = userData.yCoord
//   //     var userData = {
//   //         userID: userID,
//   //         xCoord:  xCoord,
//   //         yCoord: yCoord
//   //     }
//   //     console.log(userData)
//   //     positions.append(userData)
//   // })
//   return positons
// }
