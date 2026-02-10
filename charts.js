import { db } from "./firebase.js";
import { ref, onValue, push } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const liveRef = ref(db, "helmet_01/live_data");
const historyRef = ref(db, "helmet_01/history/aqi");

let values = [];
let labels = [];

function color(aqi){
  if(aqi < 50) return "green";
  if(aqi < 100) return "orange";
  return "red";
}

/* LINE CHART */
const chart = new Chart(document.getElementById("aqiChart"), {
  type: "line",
  data: {
    labels: labels,
    datasets: [{
      data: values,
      borderWidth: 3,
      tension: 0.4
    }]
  },
  options: {
    plugins:{ legend:{ display:false }},
    responsive:true
  }
});

/* GAUGE */
const gauge = new Chart(document.getElementById("aqiGauge"), {
  type: "doughnut",
  data: {
    datasets: [{
      data: [0,300],
      backgroundColor:["green","#222"],
      cutout:"75%"
    }]
  },
  options:{
    rotation:-90,
    circumference:180,
    plugins:{ legend:{ display:false }}
  }
});

onValue(liveRef, (snap)=>{
  const d = snap.val();
  if(!d) return;

  const time = new Date().toLocaleTimeString();

  if(values.length > 12){
    values.shift();
    labels.shift();
  }

  values.push(d.aqi);
  labels.push(time);

  chart.data.datasets[0].borderColor = color(d.aqi);
  chart.update();

  gauge.data.datasets[0].data = [d.aqi, 300-d.aqi];
  gauge.data.datasets[0].backgroundColor[0] = color(d.aqi);
  gauge.update();

  push(historyRef, { value:d.aqi, time:Date.now() });
});

window.exportCSV = ()=>{
  let csv = "Time,AQI\n";
  values.forEach((v,i)=> csv += `${labels[i]},${v}\n`);
  const blob = new Blob([csv],{type:"text/csv"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "AQI_Data.csv";
  a.click();
};
