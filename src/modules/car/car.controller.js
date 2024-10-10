import { appError } from "../../utils/appError.js";
import { catchAsyncError } from "../../middleware/catchAsyncError.js";
import { carModel } from "../../../databases/models/car.model.js";
import { ApiFeatures } from "../../utils/ApiFeatures.js";
import cloudinary from "../../utils/cloud.js";

const addCar = catchAsyncError(async (req, res, next) => {
  if (!req.file) return next(new appError("car image is required", 400));

  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.CLOUD_FOLDER_NAME}/car`,
    }
  );

  const result = new carModel({
    image: { id: public_id, url: secure_url },
    ...req.body,
  });
  await result.save();

  res.status(201).json({ message: "success", result });
});

const getAllCars = catchAsyncError(async (req, res, next) => {
  const apiFeatures = new ApiFeatures(carModel.find(), req.query)
    .paginate()
    .filter()
    .sort()
    .search()
    .fields();

  const result = await apiFeatures.mongooseQuery.exec();

  const totalCars = await carModel.countDocuments(
    apiFeatures.mongooseQuery._conditions
  );

  !result.length && next(new appError("Not cars added yet", 404));

  apiFeatures.calculateTotalAndPages(totalCars);
  result.length &&
    res.status(200).json({
      message: "success",
      totalCars,
      metadata: apiFeatures.metadata,
      result,
    });
});

const getCar = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const result = await carModel.findById(id);

  !result && next(new appError("car not found", 404));
  result && res.status(200).json({ message: "success", result });
});

const updateCar = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const car = await carModel.findById(id);
  if (!car) return next(new appError("car not found", 404));

  if (req.file) {
    await cloudinary.api.delete_resources(car.image.id);
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `${process.env.CLOUD_FOLDER_NAME}/car`,
      }
    );
    car.image = { id: public_id, url: secure_url };
  }

  const result = await carModel.findByIdAndUpdate(
    id,
    { image: car.image, ...req.body },
    { new: true }
  );

  res.status(200).json({ message: "success", result });
});

const deleteCar = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const car = await carModel.findByIdAndDelete(id);
  if (!car) return next(new appError("car not found", 404));

  await cloudinary.api.delete_resources(car.image.id);

  res.status(200).json({ message: "success", result: car });
});

export { addCar, getAllCars, getCar, updateCar, deleteCar };
