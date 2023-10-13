import mqtt from 'mqtt';
import VentData, { IVentData } from "./models/VentData.ts";

function connectMQTT() {
  const client = mqtt.connect("mqtt:localhost");

  client.on("connect", () => {
    client.subscribe("controller/status", err=>{
      if(!err) console.log("MQTT connected.");
    });
  });

  client.on("message", (topic, message) => {
    let data;
    try {
      data = JSON.parse(message.toString());
    }
    catch {
      return;
    }

    const sampleNr : number = data.nr ?? data.sampleNr ?? -1;
    const fanSpeed : number = data.speed ?? data.fanSpeed ?? -1;
    const targetPa : number = data.setpoint ?? data.targetPa ?? -1;
    const pressurePa : number = data.pressure ?? data.pressurePa ?? -1;
    const co2ppm : number = data.co2 ?? data.co2ppm ?? -1;
    const rHumidity : number = data.rh ?? data.rHumidity ?? -1;
    const tempCelsius : number = data.temp || data.tempCelsius || -1;
    const auto : boolean = data.auto != 0|| false;
    const error : boolean = data.error != 0 || false;

    VentData.create({sampleNr, fanSpeed, targetPa, pressurePa, co2ppm, rHumidity, tempCelsius, auto, error});

    console.log({sampleNr, fanSpeed, targetPa, pressurePa, co2ppm, rHumidity, tempCelsius, auto, error});
  });
  
  return client;
}

export default connectMQTT;