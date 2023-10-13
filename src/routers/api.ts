import { Request, Response, Router } from "express";
import VentData, { IVentData } from "../models/VentData.ts";
import dotenv from "dotenv";
import connectMQTT from '../mqtt.ts';
dotenv.config();
const router = Router();

const client = connectMQTT();

// Get all cars with or without filters
router.get("/", async (req : Request, res : Response) => res.json(await VentData.find().sort({createdAt:1}).limit(8640)));
router.get("/latest", async (req : Request, res : Response) => res.json(await VentData.findOne().sort({createdAt:-1})));

router.post("/", async (req : Request, res : Response) => {
    // Parse body contents
    const auto : boolean = req.body.auto;
    const fanSpeed : number = +req.body.fanSpeed;
    const targetPa : number = +req.body.targetPa;

    if(isNaN(fanSpeed) || isNaN(targetPa)) {
        res.status(400);
        res.json({ error: "Fan speed and target Pascals must be numbers." });
        return;
    }

    let json = {};
    if(auto) json = {auto, targetPa}
    else json = {auto, fanSpeed}

    client.publish("controller/settings", JSON.stringify(json));
    
    res.status(201);
});

export default router;