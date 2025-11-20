import { Router } from "express";
import { sendContactUsEmail } from "./contact.controller.js";

const contactRoute = Router();

contactRoute.post("/send", sendContactUsEmail);

export default contactRoute;