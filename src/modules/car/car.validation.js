import Joi from "joi";

const createCarSchema = Joi.object({
  name: Joi.string().required(),
  rate: Joi.number().required(),
  reviewsCount: Joi.number().required(),
  passengers: Joi.number().required(),
  transmissions: Joi.string().valid("Auto", "Manual").required(),
  airConditioning: Joi.boolean().required(),
  doors: Joi.number().required(),
  price: Joi.number().required(),
});

const getCarSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

const updateCarSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
  name: Joi.string(),
  rate: Joi.number(),
  reviewsCount: Joi.number(),
  passengers: Joi.number(),
  transmissions: Joi.string().valid("Auto, Manual"),
  airConditioning: Joi.boolean(),
  doors: Joi.number(),
  price: Joi.number(),
});

export { createCarSchema, getCarSchema, updateCarSchema };
