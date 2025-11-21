import express from "express";
import color from "@colors/colors"
import cors from 'cors'
import morgan from "morgan";
import { db } from "./src/DB/dataBaseConnection.js";
import contactRoute from "./src/modules/contact_us/contact.routes.js";
import { globalResponse } from "./src/middleware/ErrorHandeling.js";
import blogsRouter from "./src/modules/blogs/blogs.routes.js";
import userRouter from "./src/modules/auth/auth.routes.js";
import path from "path";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT


app.use(cors());
app.use(morgan("dev"));

app.use(express.json());


app.use('/api/v1/contact', contactRoute)
app.use('/api/v1/blogs', blogsRouter)
app.use('/api/v1/users', userRouter)
db;

const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Technoba API Documentation  🚀",
      version: "1.0.0",
    },
  },
apis: [
  path.join(__dirname, "./src/modules/blogs/blogs.routes.js"),
  path.join(__dirname, "./src/modules/auth/auth.routes.js"),
  path.join(__dirname, "./src/modules/contact_us/contact.routes.js")
]
});


app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(globalResponse);

app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () => console.log( "🗣 ".red+`app port is `.grey.bold  +  `${port} `.rainbow.bold+ "📡 ")); 