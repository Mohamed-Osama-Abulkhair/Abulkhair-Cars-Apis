import express from "express";
import * as carController from "./car.controller.js";
import { allowedTo, isConfirmed, protectRoutes } from "../auth/auth.js";
import { validation } from "../../middleware/validation.js";
import {
  createCarSchema,
  getCarSchema,
  updateCarSchema,
} from "./car.validation.js";
import { fileUpload } from "../../middleware/fileUpload.js";
const carRouter = express.Router();

carRouter
  .route("/")
  .post(
    protectRoutes,
    allowedTo("admin"),
    isConfirmed,
    fileUpload().single("image"),
    validation(createCarSchema),
    carController.addCar
  )
  .get(carController.getAllCars);

carRouter
  .route("/:id")
  .get(validation(getCarSchema), carController.getCar)
  .put(
    protectRoutes,
    allowedTo("admin"),
    isConfirmed,
    fileUpload().single("image"),
    validation(updateCarSchema),
    carController.updateCar
  )
  .delete(
    protectRoutes,
    allowedTo("admin"),
    isConfirmed,
    validation(getCarSchema),
    carController.deleteCar
  );

export default carRouter;
