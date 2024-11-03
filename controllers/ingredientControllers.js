const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const Ingredient = require("../models/ingredient");
const config = require("../config/index");
const responseMessage = require("../utils/responseMessage");
// const getTodatDate = require("../utils/getTodatDate");
// const s3url = require("../utils/content");
// const logger = require("../utils/logger");

exports.addIngredient = async (req, res, next) => {
  try {
    const {
      product_category,
      ingredient_name,
      dose_min,
      dose_max,
      dose_clinical,
      leadTime,
      price_min,
      price_max,
      chemical_comp,
      cert,
      health_benefits,
      ex_health_benefits,
      formulation,
      incomp_Ingredient,
      ingredient_image,
      createdBy,
      ingredient_status,
    } = req.body;

    const existIngredient = await Ingredient.findOne({
      ingredient_name: ingredient_name,
    });
    if (existIngredient) {
      const error = new Error("ไม่สามารถเพิ่มสารที่มีอยู่แล้วได้");
      error.statusCode = 404;
      throw error;
    }

    let newIngredient = new Ingredient({
      product_category,
      ingredient_name: ingredient_name,
      dose_min: dose_min,
      dose_max: dose_max,
      dose_clinical: dose_clinical,
      leadTime: leadTime,
      price_min: price_min,
      price_max: price_max,
      chemical_comp: chemical_comp,
      cert: cert,
      health_benefits: health_benefits,
      ex_health_benefits: ex_health_benefits,
      formulation: formulation,
      incomp_Ingredient: incomp_Ingredient,
      ingredient_image: ingredient_image,
      createdBy: createdBy,
      ingredient_status: ingredient_status,
    });

    await newIngredient.save();
    return res.status(201).json({
      ...responseMessage.success,
      data: "ทำรายการเรียบร้อยแล้ว",
    });
  } catch (error) {
    next(error);
  }
};

exports.updateIngredient = async (req, res, next) => {
  try {
    const {
      id,
      ingredient_name,
      dose_min,
      dose_max,
      dose_clinical,
      leadTime,
      price_min,
      price_max,
      chemical_comp,
      cert,
      health_benefits,
      ex_health_benefits,
      formulation,
      incomp_Ingredient,
      ingredient_image,
      createdBy,
      ingredient_status,
    } = req.body;

    const existIngredient = await Ingredient.findOne({ _id: id });
    if (!existIngredient) {
      const error = new Error("Ingredient not found");
      error.statusCode = 404;
      throw error;
    }

    const editIngredient = await Ingredient.updateOne(
      { _id: id },
      {
        ingredient_name,
        dose_min,
        dose_max,
        dose_clinical,
        leadTime,
        price_min,
        price_max,
        chemical_comp,
        cert,
        health_benefits,
        ex_health_benefits,
        formulation,
        incomp_Ingredient,
        ingredient_image,
        createdBy,
        ingredient_status,
      }
    );
    if (editIngredient.nModified === 0) {
      throw new Error("ไม่สามารถแก้ไขข้อมูลได้");
    } else {
      res.status(200).json({
        ...responseMessage.success,
        data: "Ingredient updated",
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.listAllIngredient = async (req, res, next) => {
  try {
    const allIngredient = await Ingredient.find()
      .select("-created_by -updatedAt -__v")
      .lean();

    return res.status(201).json({
      ...responseMessage.success,
      data: allIngredient,
    });
  } catch (error) {
    next(error);
  }
};

exports.listIngredientToUse = async (req, res, next) => {
  try {
    const ingredients = await Ingredient.find()
      .select("-_id -created_by -createdAt -updatedAt -__v")
      .where("ingredient_status")
      .equals("publish")
      .lean();

    return res.status(201).json({
      ...responseMessage.success,
      data: ingredients,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteIngredient = async (req, res, next) => {
  try {
    const { _id } = req.params;
    const ingredient = await Ingredient.deleteOne({ _id });
    if (ingredient.deletedCount === 0) {
      throw new Error("ไม่สามารถลบข้อมูลได้");
    } else {
      res.status(200).json({
        ...responseMessage.success,
        data: `ลบข้อมูลเรียบร้อยแล้ว`,
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.publishUpdate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const today = new Date();

    const ingredient = await Ingredient.findOne().where("_id").eq(id);
    if (!ingredient) {
      const error = new Error("ไม่พบ Ingredient");
      error.statusCode = 404;
      throw error;
    }
    let update;
    if (ingredient.ingredient_status === "draft") {
      update = await Ingredient.updateOne(
        { _id: id },
        {
          ingredient_status: "publish",
          publishAt: today,
        }
      );
    } else if (ingredient.ingredient_status === "publish") {
      update = await Ingredient.updateOne(
        { _id: id },
        {
          ingredient_status: "unpublish",
          publishAt: null,
        }
      );
    } else if (ingredient.ingredient_status === "unpublish") {
      update = await Ingredient.updateOne(
        { _id: id },
        {
          ingredient_status: "publish",
          publishAt: today,
        }
      );
    }
    if (update.nModified === 0) {
      throw new Error("ไม่สามารถแก้ไขข้อมูลได้");
    } else {
      return res.status(200).json({
        ...responseMessage.success,
        data: `Publish สำเร็จ`,
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.getIngredientById = async (req, res, next) => {
  const { _id } = req.params;
  console.log(req.parmas);
  try {
    const ingredient = await Ingredient.findOne({ _id })
      .select("-created_by -updatedAt -__v")
      .lean();

    return res.status(201).json({
      ...responseMessage.success,
      data: ingredient,
    });
  } catch (error) {
    next(error);
  }
};