import { Router } from "express";
import * as servicesCon from "./services.controller.js";
import { multerCloudFunction } from "../../services/multerCloud.js";
import { allowedExtensions } from "../../utilities/allowedExtensions.js";

const servicesRouter = Router();

servicesRouter.post(
    "/add",
    multerCloudFunction(allowedExtensions.Image).array("images", 5),
    servicesCon.createService
    )

    servicesRouter.get("/",servicesCon.getAllServices);
export default servicesRouter;