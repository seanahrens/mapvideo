var localVideo;
var otherVideos;
var localStream;


var peerConnections = [];
var uuid;
var serverConnection;

var peerConnectionConfig = {
  'iceServers': [
    { 'urls': 'stun:stun.stunprotocol.org:3478' },
    { 'urls': 'stun:stun.l.google.com:19302' },
  ]
};

function pageReady() {
  uuid = createUUID();
  console.log("OWN UUID", uuid)

  localVideo = document.getElementById('localVideo');
  otherVideos = document.getElementById('otherVideos');

  const ws_port = fetch('/websockets_port')
    .then((response) => {
      return response.json();
    })
    .then(connectWebsocket);
  console.log(ws_port);
}

function connectWebsocket(port) {
  console.log(port)
  serverConnection = new WebSocket('wss://' + window.location.hostname + ':' + port.port);
  serverConnection.onmessage = gotMessageFromServer;

  var constraints = {
    video: true,
    audio: true,
  };

  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(getUserMediaSuccess)
      .catch(errorHandler("getUserMedia"));
  } else {
    alert('Your browser does not support getUserMedia API');
  }
}


function getUserMediaSuccess(stream) {
  localStream = stream;
  localVideo.srcObject = stream;
}

function start(isCaller, id) {
  console.log("START", isCaller, id)
  if(isCaller || !peerConnections[id]){
    pc = new RTCPeerConnection(peerConnectionConfig);
    pc.onicecandidate = gotIceCandidate;
    pc.ontrack = gotRemoteStream;
    pc.addStream(localStream);
    console.log("added local stream", localStream)
    if(isCaller){
      peerConnections[uuid] = pc;
    } else {
      peerConnections[id] = pc
    }
  }

  if (isCaller) {
    peerConnections[uuid].createOffer().then(createdDescription(uuid))
    .catch(errorHandler("CreateOfferStart"));
  }
}

function gotMessageFromServer(message) {
  
  var signal = JSON.parse(message.data);
  
  // Ignore messages from ourself
  if (signal.uuid == uuid) return;
  console.log("Message from server", signal)

  start(false, signal.uuid);
  
  if (signal.sdp) {
    peerConnections[signal.uuid].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(function () {
      // Only create answers in response to offers
      if (signal.sdp.type == 'offer') {
        peerConnections[signal.uuid].createAnswer().then(createdDescription(signal.uuid))
        .catch(errorHandler("CreateSdpAnswer"));
      }
    })
    .catch(errorHandler);
  } else if (signal.ice) {
    var candidate = new RTCIceCandidate(signal.ice);
    // var receivers = peerConnections[signal.uuid].getReceivers();
  
    // console.log("we have ", receivers.length, " receivers");
    // console.log(receivers)
  
  
    peerConnections[signal.uuid].addIceCandidate(signal.ice)
      .catch(errorHandler("AddIceCandidate"));



  }
}

function gotIceCandidate(event) {
  console.log("got ice candidate", event)
  if (event.candidate != null) {
    serverConnection.send(JSON.stringify({ 'ice': event.candidate, 'uuid': uuid }));
  }
}

function createdDescription(id) {
  return function (description) {
    console.log('got description', description);
    console.log(peerConnections)
    peerConnections[id].setLocalDescription(description).then(function () {
      serverConnection
        .send(JSON.stringify({ 'sdp': description, 'uuid': uuid }));
    })
    .catch(errorHandler("setLocalDescription"));
}
}

function createVideoElement() {
  console.log("Creating video element")
  var video = document.createElement("video");
  video.style = "width:40%"
  video.autoplay = true;
  otherVideos.appendChild(video);
  return video;
}


function gotRemoteStream(event) {
  console.log("Got remote stream" ,event)
  if (event.track.kind == "video"){
    var remoteVideo = createVideoElement()
    localVideo.srcObject = event.streams[0];
  }
}

function errorHandler(where){
  return function(error) {
    // throw error
    console.error(where,"---", error);
  }
}

// Taken from http://stackoverflow.com/a/105074/515584
// Strictly speaking, it's not a real UUID, but it gets the job done here
function createUUID() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }

  // return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  return s4();
}
