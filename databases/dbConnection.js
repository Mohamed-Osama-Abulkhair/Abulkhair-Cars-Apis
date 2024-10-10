import mongoose from "mongoose";
import { userModel } from "./models/user.model.js";

export const dbConnection = () => {
  mongoose
    .connect(process.env.dbConnection)
    .then(() => {
      console.log("database Connected");
      createAdmin();
    })
    .catch((error) => console.log("database Error", error));
};

const createAdmin = async () => {
  const admin = await userModel.findOne({ email: process.env.ADMIN_EMAIL });
  if (!admin) {
    await new userModel({
      name: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASS,
      phone: process.env.ADMIN_PHONE,
      role: "admin",
      isActive: true,
      verified: true,
    }).save();
  }
};
