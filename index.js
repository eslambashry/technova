import express from "express";
import color from "@colors/colors"
import cors from 'cors'
import morgan from "morgan";
import contactRoute from "./src/modules/contact_us/contact.routes.js";
import blogsRouter from "./src/modules/blogs/blogs.routes.js";
import userRouter from "./src/modules/auth/auth.routes.js";
import servicesRouter from "./src/modules/services/services.router.js";
import path from "path";
import swaggerJSDoc from "swagger-jsdoc";
import { globalResponse } from "./src/middleware/ErrorHandeling.js";
import { db } from "./src/DB/dataBaseConnection.js";
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
app.use('/api/v1/services', servicesRouter)
db;

const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "techvoba API Documentation  📡",
      version: "1.0.0",
      description: "API documentation for the techvoba backend services",
    },
     servers: [
      {
        url: "http://localhost:8080/",
        description: "Local Server",
      },
      {
        url: "https://techvoba.vercel.app/",
        description: "Production Server",
      },
    ],
  },
apis: [
  path.join(__dirname, "./src/modules/blogs/blogs.routes.js"),
  path.join(__dirname, "./src/modules/services/services.router.js"),
  path.join(__dirname, "./src/modules/auth/auth.routes.js"),
  path.join(__dirname, "./src/modules/contact_us/contact.routes.js")
]
});


app.get("/api-docs", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>API Docs</title>

      <link rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.10.5/swagger-ui.min.css" />

      <style>
        body { margin: 0; padding: 0; }
      </style>
    </head>

    <body>
      <div id="swagger-ui"></div>

      <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.10.5/swagger-ui-bundle.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.10.5/swagger-ui-standalone-preset.min.js"></script>

      <script>
        window.onload = function () {
          SwaggerUIBundle({
            url: '/swagger.json',
            dom_id: '#swagger-ui',
            presets: [
              SwaggerUIBundle.presets.apis,
              SwaggerUIStandalonePreset
            ],
            layout: "StandaloneLayout",
          });
        };
      </script>
    </body>
    </html>
  `);
});

app.get("/swagger.json", (req, res) => {
  res.json(swaggerSpec);
});

app.use(globalResponse);

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Backend API</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #4e73df, #1cc88a);
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .container {
          background: white;
          padding: 40px;
          border-radius: 18px;
          width: 90%;
          max-width: 600px;
          text-align: center;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          animation: fadeIn 0.8s ease-in-out;
        }
        h1 {
          margin-bottom: 10px;
          color: #4e73df;
        }
        p {
          margin: 8px 0;
          font-size: 16px;
          color: #555;
        }
        a {
          display: inline-block;
          margin-top: 15px;
          padding: 10px 20px;
          background: #1cc88a;
          color: white;
          text-decoration: none;
          border-radius: 8px;
          font-weight: bold;
          transition: 0.3s;
        }
        a:hover {
          background: #17a673;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🚀 Backend API is Running</h1>
        <p>Status: <strong style="color: green">Online</strong></p>
        <p>API Version: <strong>v1.0.0</strong></p>
        <p>Welcome to your backend server!</p>
        <a href="/api-docs" target="_blank">📘 Open Swagger Documentation</a>
      </div>
    </body>
    </html>
  `);
});

app.listen(port, () => console.log( "🗣 ".red+`app port is `.grey.bold  +  `${port} `.rainbow.bold+ "📡 ")); 
