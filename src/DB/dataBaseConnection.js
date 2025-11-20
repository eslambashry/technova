import mongoose from "mongoose";
import { config } from 'dotenv'
import path from 'path'
config({path: path.resolve('./config/.env')})

export const db = mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to DB 📥 📤".green.bgBrightGreen.bold); 
  })
  .catch((err) => {
    console.error("Error connecting to database:".black.bgBrightRed, err);
});