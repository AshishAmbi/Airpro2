import { db } from "./firebase.js";
import { ref, onValue } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const liveRef = ref(db, "helmet_01/live_data");

onValue(liveRef, (snapshot) => {
  const d = snapshot.val();
  if (!d) return;

  document.getElementById("aqiValue").innerText = d.aqi;
  document.getElementById("battery").innerText = d.battery + "%";
  document.getElementById("fan").innerText = d.fan_status;

  const acc = document.getElementById("accident");
  acc.innerText = d.accident_detected ? "⚠ ACCIDENT" : "Safe";
  acc.style.color = d.accident_detected ? "red" : "lightgreen";

  const status = document.getElementById("aqiStatus");
  if (d.aqi < 50) status.innerText = "Good";
  else if (d.aqi < 100) status.innerText = "Moderate";
  else status.innerText = "Poor";
});

