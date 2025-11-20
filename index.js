import express from "express";
import color from "@colors/colors"
import cors from 'cors'
import morgan from "morgan";
import { db } from "./src/DB/dataBaseConnection.js";
import contactRoute from "./src/modules/contact_us/contact.routes.js";
import { globalResponse } from "./src/middleware/ErrorHandeling.js";


const app = express();
const port = process.env.PORT


app.use(cors());
app.use(morgan("dev"));

app.use(express.json());


app.use('/api/v1/contact', contactRoute)
db;

app.use(globalResponse);

app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () => console.log( "🗣 ".red+`app port is `.grey.bold  +  `${port} `.rainbow.bold+ "📡 ")); 