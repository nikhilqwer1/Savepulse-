function scrollToSection() {
  const el = document.getElementById('about') || document.querySelector('.section');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

function accidentAlert() {
  const el = document.getElementById('accidentMsg');
  el.innerText = '🚨 Accident detected! Sending alerts...';
  getLocation(
    coords => el.innerText = `🚨 Accident alert sent. Lat: ${coords.latitude.toFixed(6)}, Lon: ${coords.longitude.toFixed(6)}`,
    err => el.innerText = '🚨 Accident alert sent (location unavailable).'
  );
}

function sosAlert() {
  const el = document.getElementById('sosMsg');
  el.innerText = '🆘 SOS activated — sending emergency message...';
  
  // TRIGGER THE VIDEO HERE
  initVideo();

  getLocation(
    coords => el.innerText = `🆘 SOS sent. Lat: ${coords.latitude.toFixed(6)}, Lon: ${coords.longitude.toFixed(6)}`,
    err => el.innerText = '🆘 SOS sent (location unavailable).'
  );
}

function getLocation(successCb, errorCb) {
  const output = document.getElementById('location');
  if (!navigator.geolocation) {
    output.innerText = 'Geolocation not supported by your browser.';
    if (typeof errorCb === 'function') errorCb(new Error('Geolocation not supported'));
    return;
  }
  output.innerText = 'Locating…';
  navigator.geolocation.getCurrentPosition(
    position => {
      const coords = position.coords;
      output.innerText = `Latitude: ${coords.latitude.toFixed(6)}, Longitude: ${coords.longitude.toFixed(6)}`;
      if (typeof successCb === 'function') successCb({ latitude: coords.latitude, longitude: coords.longitude });
    },
    err => {
      output.innerText = 'Unable to retrieve location: ' + (err.message || 'error');
      if (typeof errorCb === 'function') errorCb(err);
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
}

  const remoteId = document.getElementById('remotePeerId').value;
  if(!remoteId) return alert("Enter an ID");
  
  currentCall = peer.call(remoteId, localStream);
  currentCall.on('stream', remoteStream => {
    document.getElementById('remoteVideo').srcObject = remoteStream;
  });
}

function endCall() {
  if (currentCall) currentCall.close();
  if (localStream) {
    localStream.getTracks().forEach(track => track.stop());
  }
  document.getElementById('videoContainer').style.display = 'none';
}
let peer;
let localStream;
let currentCall;

// Define the ID of the person/base station you want to call automatically
const RECEIVER_ID = 'central-emergency-dispatch-001'; 

async function startEmergencyCall() {
    const el = document.getElementById('sosMsg');
    el.innerText = '🆘 SOS active. Connecting to emergency services...';
    
    // 1. Show UI
    document.getElementById('videoContainer').style.display = 'block';

    // 2. Initialize Peer with a random ID for the sender
    peer = new Peer(); 

    try {
        // 3. Get Camera Access
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        document.getElementById('localVideo').srcObject = localStream;

        peer.on('open', (id) => {
            console.log('My ID is: ' + id);
            // 4. AUTOMATICALLY call the receiver ID
            const call = peer.call(RECEIVER_ID, localStream);
            handleCall(call);
        });

        // Also handle incoming calls in case the base station calls back
        peer.on('call', (incomingCall) => {
            incomingCall.answer(localStream);
            handleCall(incomingCall);
        });

    } catch (err) {
        el.innerText = "❌ Camera Error: " + err.message;
    }

    // Trigger location sharing as well
    getLocation();
}

function handleCall(call) {
    currentCall = call;
    call.on('stream', (remoteStream) => {
        const remoteVid = document.getElementById('remoteVideo');
        remoteVid.srcObject = remoteStream;
    });
}

function endCall() {
    if (currentCall) currentCall.close();
    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
    }
    document.getElementById('videoContainer').style.display = 'none';
    document.getElementById('sosMsg').innerText = 'Call ended.';
}
  

