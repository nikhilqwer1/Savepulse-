// --- Global Configurations ---
const emergencyChannel = new BroadcastChannel('emergency_link');
const EMERGENCY_CONTACT = "9162327765"; // Hardcoded emergency number
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
        const pos = await new Promise((res, rej) => navigator.geolocation.getCurrentPosition(res, rej));
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

        document.getElementById('videoContainer').style.display = 'block';
        document.getElementById('localVideo').srcObject = localStream;

        peer = new Peer();
        peer.on('open', (id) => {
            // BROADCAST: Send SOS signal with coordinates and contact number
            emergencyChannel.postMessage({
                type: 'SOS_TRIGGERED',
                peerId: id,
                lat: pos.coords.latitude,
                lon: pos.coords.longitude,
                contact: EMERGENCY_CONTACT
            });
            el.innerText = `🆘 SOS Broadcasted to ${EMERGENCY_CONTACT}.`;
        });

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

// 4. Responder Logic (Receiver)
emergencyChannel.onmessage = (event) => {
    if (event.data.type === 'SOS_TRIGGERED') {
        const { peerId, lat, lon, contact } = event.data;
        
        const alertBox = document.getElementById('accidentMsg');
        alertBox.innerHTML = `
            <div style="background: #ff4b2b; color: white; padding: 10px; border-radius: 8px;">
                <strong>🚨 INCOMING SOS!</strong><br>
                <span>Target Contact: ${contact}</span><br>
                <a href="https://www.google.com/maps?q=${lat},${lon}" target="_blank" style="color:yellow">📍 View Location</a>
            </div>`;

        if (!peer) peer = new Peer();
        
        const call = peer.call(peerId, null); 
        call.on('stream', (remoteStream) => {
            document.getElementById('videoContainer').style.display = 'block';
            document.getElementById('remoteVideo').srcObject = remoteStream;
        });
    }
};

function endCall() {
    location.reload(); 
}
