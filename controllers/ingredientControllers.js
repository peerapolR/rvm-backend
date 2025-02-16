const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const Ingredient = require("../models/ingredient");
const DosageForm = require("../models/dosageForm");
const config = require("../config/index");
const responseMessage = require("../utils/responseMessage");
// const getTodatDate = require("../utils/getTodatDate");
const s3url = require("../utils/content");
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

    let getImage;
    if (req.file) {
      const { path, mimetype, filename } = req.file;

      const imgLocation = `${filename}`;
      getImage = imgLocation;
      await s3url.uploadFileFromLocal(path, mimetype, imgLocation);
    } else {
      getImage = "";
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
      ingredient_image: getImage,
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
      _id,
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

    const existIngredient = await Ingredient.findOne({ _id: _id });
    if (!existIngredient) {
      const error = new Error("Ingredient not found");
      error.statusCode = 404;
      throw error;
    }

    let getImage;
    if (req.file) {
      const { path, mimetype, filename } = req.file;

      const imgLocation = `${filename}`;
      getImage = imgLocation;
      await s3url.uploadFileFromLocal(path, mimetype, imgLocation);
    } else {
      getImage = "";
    }
    const editIngredient = await Ingredient.updateOne(
      { _id: _id },
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
        ingredient_image: getImage,
        createdBy,
        ingredient_status,
      }
    );
    if (editIngredient.nModified === 0) {
      throw new Error("ไม่สามารถแก้ไขข้อมูลได้");
    } else {
      return res.status(200).json({
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
      .select("-__v")
      .sort({ createdAt: -1 })
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
      .select("-__v")
      .sort({ createdAt: -1 })
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
    const { _id } = req.params;
    const today = new Date();

    const ingredient = await Ingredient.findOne().where("_id").eq(_id);
    if (!ingredient) {
      const error = new Error("ไม่พบ Ingredient");
      error.statusCode = 404;
      throw error;
    }
    let update;
    if (ingredient.ingredient_status === "draft") {
      update = await Ingredient.updateOne(
        { _id: _id },
        {
          ingredient_status: "publish",
          publishAt: today,
        }
      );
    } else if (ingredient.ingredient_status === "publish") {
      update = await Ingredient.updateOne(
        { _id: _id },
        {
          ingredient_status: "unpublish",
          publishAt: null,
        }
      );
    } else if (ingredient.ingredient_status === "unpublish") {
      update = await Ingredient.updateOne(
        { _id: _id },
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
  try {
    const ingredient = await Ingredient.findOne({ _id })
      .select("-created_by -updatedAt -__v")
      .lean();
    let paramSend;
    if (ingredient.ingredient_image) {
      const getImage = await s3url.getImageUrl(ingredient.ingredient_image);
      paramSend = {
        ...ingredient,
        ingredient_image: getImage != "" ? getImage.s3url : "",
      };
    } else {
      paramSend = ingredient;
    }

    return res.status(201).json({
      ...responseMessage.success,
      data: paramSend,
    });
  } catch (error) {
    next(error);
  }
};

exports.addDosageData = async (req, res, next) => {
  try {
    const { dosage_name, condition, standard } = req.body;

    const existDosage = await DosageForm.findOne({
      dosage_name: dosage_name,
    });
    if (!existDosage) {
      const error = new Error("ไม่พบ Dosage Form");
      error.statusCode = 404;
      throw error;
    }

    const editDosage = await DosageForm.updateOne(
      { dosage_name: dosage_name },
      {
        condition,
        standard,
      }
    );
    if (editDosage.nModified === 0) {
      throw new Error("ไม่สามารถแก้ไขข้อมูลได้");
    } else {
      return res.status(201).json({
        ...responseMessage.success,
        data: "ทำรายการเรียบร้อยแล้ว",
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.getDataByDosage = async (req, res, next) => {
  try {
    const { dosage_form } = req.body;

    const existDosage = await DosageForm.findOne({
      dosage_name: dosage_form,
    });
    if (!existDosage) {
      const error = new Error("ไม่พบ Dosage Form");
      error.statusCode = 404;
      throw error;
    }

    return res.status(201).json({
      ...responseMessage.success,
      data: existDosage,
    });
  } catch (error) {
    next(error);
  }
};
