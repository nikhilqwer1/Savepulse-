// --- Global Configurations ---
const emergencyChannel = new BroadcastChannel('emergency_link');
let peer;
let localStream;
let currentCall;

// 1. Smooth Scroll
function scrollToSection() {
    const el = document.getElementById('about');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// 2. Phase 1: Accident Simulation
function accidentAlert() {
    const el = document.getElementById('accidentMsg');
    el.innerText = '🚨 Accident detected! Locating...';
    
    navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        el.innerHTML = `🚨 Alert Sent! <br> <small>Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}</small>`;
    }, () => {
        el.innerText = '🚨 Alert sent (Location denied).';
    });
}

// 3. Phase 2: SOS & Video Call (Sender Logic)
async function sosAlert() {
    const el = document.getElementById('sosMsg');
    el.innerText = '🆘 Initializing Emergency Stream...';

    try {
        // Get GPS and Camera first
        const pos = await new Promise((res, rej) => navigator.geolocation.getCurrentPosition(res, rej));
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

        // Show UI and Local Video
        document.getElementById('videoContainer').style.display = 'block';
        document.getElementById('localVideo').srcObject = localStream;

        // Initialize PeerJS to get a unique ID
        peer = new Peer();
        peer.on('open', (id) => {
            // BROADCAST: Tell all other tabs to call this ID
            emergencyChannel.postMessage({
                type: 'SOS_TRIGGERED',
                peerId: id,
                lat: pos.coords.latitude,
                lon: pos.coords.longitude
            });
            el.innerText = '🆘 SOS Broadcasted. Waiting for Responder...';
        });

        // Answer the call when the responder connects
        peer.on('call', (call) => {
            currentCall = call;
            call.answer(localStream);
            call.on('stream', (remoteStream) => {
                document.getElementById('remoteVideo').srcObject = remoteStream;
            });
        });

    } catch (err) {
        el.innerText = "❌ Error: Permission Denied.";
        console.error(err);
    }
}

// 4. Responder Logic (Receiver Logic - runs on the other tab)
emergencyChannel.onmessage = (event) => {
    if (event.data.type === 'SOS_TRIGGERED') {
        const { peerId, lat, lon } = event.data;
        
        // Update UI to show incoming alert
        const alertBox = document.getElementById('accidentMsg');
        alertBox.innerHTML = `
            <div style="background: #ff4b2b; color: white; padding: 10px; border-radius: 8px;">
                <strong>🚨 INCOMING SOS!</strong><br>
                <a href="https://www.google.com/maps?q=${lat},${lon}" target="_blank" style="color:yellow">📍 View Location</a>
            </div>`;

        // Create responder peer to call the victim
        if (!peer) peer = new Peer();
        
        const call = peer.call(peerId, null); // Responder watches, doesn't need to send video
        call.on('stream', (remoteStream) => {
            document.getElementById('videoContainer').style.display = 'block';
            document.getElementById('remoteVideo').srcObject = remoteStream;
        });
    }
};

function endCall() {
    location.reload(); // Resets everything
}