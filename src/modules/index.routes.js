process.on("uncaughtException", (err) => console.log("error in coding", err));

import { globalErrorMiddleware } from "../middleware/globalErrorMiddleware.js";
import { appError } from "../utils/appError.js";
import carRouter from "./car/car.router.js";
import userRouter from "./user/user.router.js";

export const init = (app) => {
  app.get("/", (req, res, next) => {
    res.status(200).json({ message: "Welcome to Abulkhair Cars Api" });
  });
  app.use("/api/v1/users", userRouter);
  app.use("/api/v1/cars", carRouter);

  app.all("*", (req, res, next) => {
    next(new appError("invalid url" + req.originalUrl, 404));
  });

  // global error handling middleware
  app.use(globalErrorMiddleware);
};

process.on("unhandledRejection", (err) =>
  console.log("error outside express", err)
);
