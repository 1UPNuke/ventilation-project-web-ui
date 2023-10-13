import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

function connectDB() : Promise<typeof mongoose>
{
    // Connect to database
    const host : string = process.env.MONGODB_HOST || "mongodb://127.0.0.1:27017/ventilationdb";
    return mongoose.connect(host).catch((err : Error) =>
    {
        throw err;
    });
}

export default connectDB;