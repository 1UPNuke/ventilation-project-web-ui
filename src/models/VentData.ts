import { Schema, model } from "mongoose";

export interface IVentData {
    sampleNr: number,
    fanSpeed: number,
    targetPa: number,
    pressurePa: number,
    co2ppm: number,
    rHumidity: number,
    tempCelsius: number,
    auto: boolean,
    error: boolean
}

const schema = new Schema<IVentData>({
    sampleNr: { type: Number, required: true},
    fanSpeed: { type: Number, required: true },
    targetPa: { type: Number, required: true },
    pressurePa: { type: Number, required: true },
    co2ppm: { type: Number, required: true },
    rHumidity: { type: Number, required: true },
    tempCelsius: { type: Number, required: true },
    auto: { type: Boolean, required: true },
    error: { type: Boolean, required: true },
}, { timestamps: true });

export default model<IVentData>("VentData", schema);