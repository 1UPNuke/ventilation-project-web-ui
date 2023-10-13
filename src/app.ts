import express from 'express';
import connectDB from './connectdb.ts';
import apiRouter from './routers/api.ts';
import path from 'path';
import connectMQTT from './mqtt.ts';

const app = express();
const client = connectMQTT();

app.use(express.json());
app.use("/api", apiRouter);
app.use("/", express.static(path.resolve("./src/public")));

// Connect to database
const port : string = process.env.PORT || "3000";
connectDB().then(() =>
{
    app.listen(port, () => console.log(`Server running on ${port}, http://localhost:${port}`));
});