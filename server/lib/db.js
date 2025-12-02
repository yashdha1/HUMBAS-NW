import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); 
export const connectDB = async ()=> {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL) 
        console.log(`MONGO Connected : ${conn.connection.host}.`)
    } catch (error) {
        console.log("ERROR CONNECTING THE MONGO DB? WHY? ")
        console.log(`Error connect DB: ${error}`);
        process.exit(1); 
    }
}