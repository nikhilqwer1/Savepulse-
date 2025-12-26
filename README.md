# Smart Accident & SOS Alert System (Savepulse)

A simple front-end demo for a smart accident & SOS alert system. The UI simulates automatic accident detection and SOS activation, shows live location (via the browser Geolocation API), and provides basic user feedback. The device-side logic and backend integrations are out of scope — this repo contains a static demo (Ui.html, Scr.js, Sty.css).

## Features
- Simulate accident detection and send an alert message.
- Activate SOS mode (simulated).
- Get and display current location using the browser Geolocation API.
- Responsive UI and basic accessibility improvements (aria-live, role=status).

## Files
- Ui.html — Main demo UI
- Scr.js — JavaScript for interactions (scroll, accident/sos alerts, geolocation)
- Sty.css — Styling

## Requirements
- Modern web browser (Chrome, Firefox, Edge, Safari)
- Geolocation requires HTTPS to work in most browsers (localhost is allowed for development)

## Quickstart (local)
1. Clone the repo:
   git clone https://github.com/nikhilqwer1/Savepulse-.git
2. Change into the repo folder:
   cd Savepulse-
3. Serve the files locally (one simple option):
   - Python 3:
     python -m http.server 8000
   - Or, if you have Node.js:
     npx http-server -p 8000
4. Open the demo in your browser:
   http://localhost:8000/Ui.html

## Demo / How to test
- Explore Project: Click "Explore Project" to smoothly scroll to the About section.
- Simulate Accident: Click "Simulate Accident". The page will show a status message and attempt to fetch your location.
- Activate SOS: Click "Activate SOS". The page will show a status message and attempt to fetch your location.
- Get My Location: Click "Get My Location" to request your device location and display coordinates.
- Note: If location access is denied or unavailable, the demo will show an appropriate message.

## Browser / Permissions notes
- Geolocation only works on secure contexts (HTTPS) or on http://localhost. If you open Ui.html directly as a file (file://), geolocation will not work.
- The browser will ask the user to grant location permission. Denying it will trigger an error message in the demo.

## Deploy to GitHub Pages (optional)
1. Push changes to main.
2. In your repository settings, enable GitHub Pages from the main branch (root).
3. After a minute, your demo will be available at:
   https://nikhilqwer1.github.io/Savepulse-/

## Development notes
- Scr.js currently simulates alerts and displays local coordinates. Integrate with backend or device firmware to send real alerts.
- The “Auto video call” feature in the UI is a label only; implementing real calls requires a signaling server / WebRTC integration.

## Contributing
Contributions, bug reports and improvements are welcome — open an issue or submit a PR.

## License
Add a license if you want to publish this project (e.g., MIT). Add a LICENSE file to the repo.
