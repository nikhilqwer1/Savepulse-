// --- Global Configurations ---
const emergencyChannel = new BroadcastChannel('emergency_link');
const PRIMARY_EMERGENCY_CONTACT = "9162327765"; // Your specific number
let peer;
let localStream;

// 1. Navigation
function scrollToSection() {
    const el = document.getElementById('about');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// 2. Accident Detection Logic
function accidentAlert() {
    const el = document.getElementById('accidentMsg');
    el.innerText = '🚨 Accident detected! Locating...';
    
    navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        el.innerHTML = `🚨 Alert Sent! <br> <small>Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}</small>`;
        // Here you could also trigger an SMS for Phase 1
    }, () => {
        el.innerText = '🚨 Alert sent (Location denied).';
    });
}

// 3. Phase 2: SOS & Video Call (Sender)
async function sosAlert() {
    const el = document.getElementById('sosMsg');
    el.innerText = '🆘 Initializing Emergency Services...';

    try {
        const pos = await new Promise((res, rej) => navigator.geolocation.getCurrentPosition(res, rej));
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

        document.getElementById('videoContainer').style.display = 'block';
        document.getElementById('localVideo').srcObject = localStream;

        peer = new Peer();
        peer.on('open', (id) => {
            // Send Alert via Broadcast Channel
            emergencyChannel.postMessage({
                type: 'SOS_TRIGGERED',
                peerId: id,
                lat: pos.coords.latitude,
                lon: pos.coords.longitude,
                contact: PRIMARY_EMERGENCY_CONTACT
            });

            // LOGIC FOR SMS:
            // In a real app, you would call a backend here to send an actual SMS
            console.log(`Sending SMS to ${PRIMARY_EMERGENCY_CONTACT}: Help! View my location: http://maps.google.com/?q=${pos.coords.latitude},${pos.coords.longitude}`);
            
            el.innerText = `🆘 SOS & SMS Alerted to ${PRIMARY_EMERGENCY_CONTACT}.`;
        });

        peer.on('call', (call) => {
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
            <div style="background: #ff4b2b; color: white; padding: 15px; border-radius: 8px; border: 2px solid yellow;">
                <strong>🚨 INCOMING SOS!</strong><br>
                <span>Victim Contact: ${contact}</span><br>
                <a href="https://www.google.com/maps?q=${lat},${lon}" target="_blank" style="color:yellow; font-weight:bold;">📍 Open GPS Location</a>
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
