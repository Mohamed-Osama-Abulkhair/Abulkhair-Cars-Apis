import mongoose from "mongoose";

const carSchema = mongoose.Schema(
  {
    name: String,
    rate: Number,
    reviewsCount: Number,
    passengers: Number,
    transmissions: {
      type: String,
      enum: ["Auto", "Manual"],
    },

    airConditioning: Boolean,
    doors: Number,
    price: Number,

    image: {
      id: { type: String, required: true },
      url: { type: String, required: true },
    },
  },
  { timestamps: true }
);

export const carModel = mongoose.model("car", carSchema);
