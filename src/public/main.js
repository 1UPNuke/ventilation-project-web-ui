const byId = id => document.getElementById(id);

let pressureChart, tempChart, humidChart, co2Chart, xValues, lastTime;

document.addEventListener("DOMContentLoaded", async () => {
    await init();
    update();
    window.setInterval(update, 3000);
});

function makeChart(id, data, color, unit, title) {
    return new Chart(id, {
        type: "line",
        data: {
            labels: xValues,
            datasets: [{
                data,
                backgroundColor: color,
                borderColor: color,
                fill: false
            }]
        },
        options: {
            animation: {
                duration: 0
            },
            scales: {
                y: {ticks: {callback: (v,i,t) => v+unit}}
            },
            title: {
                display: true,
                color,
                font: {size: 32},
                text: title + " (" + unit + ")"
            },
            legend: {display: false}
        }
    });
}

async function publish() {
    const json = {
        auto: byId("auto").checked,
        fanSpeed: byId("fan-speed").value,
        targetPa: byId("target-pa").value
    }
    await fetch("/api", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(json),
    });
}

function renderCharts(data) {
    pressureChart = makeChart("pressure-chart", data.map(x => x.pressurePa), "yellow", "Pa", "Pressure");
    tempChart = makeChart("temperature-chart", data.map(x => x.tempCelsius), "red", "°C", "Temperature");
    humidChart = makeChart("humidity-chart", data.map(x => x.rHumidity), "blue", "%", "Relative Humidity");
    co2Chart = makeChart("co2-chart", data.map(x => x.co2ppm), "black", "ppm", "CO₂");
}

async function init() {
    const data = await (await fetch("/api")).json();
    xValues = data.map(x => getTime(x.createdAt));

    renderCharts(data);

    addSliderListener(byId("fan-speed"), byId("fan-speed-value"), "%", 4);
    addSliderListener(byId("target-pa"), byId("target-pa-value"), "Pa", 6);

    byId("auto").addEventListener("input", e=>{
        if(e.target.checked) {
            byId("fan-speed-container").classList.add("hidden");
            byId("target-pa-container").classList.remove("hidden");
            byId("target-pa").dispatchEvent(new Event('input'));
        }
        else {
            byId("fan-speed-container").classList.remove("hidden");
            byId("target-pa-container").classList.add("hidden");
            byId("fan-speed").dispatchEvent(new Event('input'));
        }
    });
    byId("auto").addEventListener("change", publish);
}

function chartPushData(chart, data, createdAt) {
    chart.data.labels.push(getTime(createdAt));
    chart.data.datasets[0].data.push(data);
    chart.update();
}

async function update() {
    let data = await (await fetch("/api")).json();
    xValues = data.map(x => getTime(x.createdAt));

    renderCharts(data);

    data = data[data.length-1];

    byId("pressure").textContent = data.pressurePa + "Pa" + (data.error ? "!" : "");
    byId("temp").textContent = data.tempCelsius + "°C";
    byId("rh").textContent = data.rHumidity + "%";
    byId("co2").textContent = data.co2ppm + "ppm";

    byId("fan-speed").value = ""+(data.fanSpeed);
    byId("fan-speed").dispatchEvent(new Event('input'));

    byId("target-pa").value = ""+data.targetPa;
    byId("target-pa").dispatchEvent(new Event('input'));

    byId("auto").checked = data.auto;
    byId("auto").dispatchEvent(new Event('input'));

    if(data.error) {
        byId("error-notif").classList.remove("hidden");
    }
    else {
        byId("error-notif").classList.add("hidden");
    }
}

function addSliderListener(slider, value, unit, unitlength) {
    value.textContent = (slider.value + unit).padStart(length);
    slider.addEventListener("input", e => {
        value.textContent = (slider.value + unit).padStart(unitlength);
        document.documentElement.style.setProperty('--spin-speed', 0.5/(slider.value / slider.max) + "s");
    });
    slider.addEventListener("change", publish);
}

function getTime(x) {
    let date = new Date(x);

    let h = date.getHours();
    h = (h < 10 ? "0" : "") + h;

    let m = date.getMinutes();
    m = (m < 10 ? "0" : "") + m;

    let s = date.getSeconds();
    s = (s < 10 ? "0" : "") + s;

    return h + ":" + m + ":" + s;
}