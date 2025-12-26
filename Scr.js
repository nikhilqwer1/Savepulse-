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
