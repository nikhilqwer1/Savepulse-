function scrollToSection() {
  document.querySelector(".section").scrollIntoView({ behavior: "smooth" });
}

function accidentAlert() {
  document.getElementById("accidentMsg").innerText =
    "🚨 Accident detected! Alerts sent with location.";
}

function sosAlert() {
  document.getElementById("sosMsg").innerText =
    "🆘 SOS Activated! Location shared & video call started.";
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      document.getElementById("location").innerText =
        `Latitude: ${pos.coords.latitude}, Longitude: ${pos.coords.longitude}`;
    });
  } else {
    document.getElementById("location").innerText =
      "Geolocation not supported";
  }
}
