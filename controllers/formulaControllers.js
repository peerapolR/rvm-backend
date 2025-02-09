const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const Formula = require("../models/formula");
const Formulation = require("../models/formulation");
const DosageForm = require("../models/dosageForm");
const config = require("../config/index");
const responseMessage = require("../utils/responseMessage");
const getTodayForCode = require("../utils/getTodayForCode");
// const s3url = require("../utils/content");
// const logger = require("../utils/logger");

exports.addFormula = async (req, res, next) => {
  try {
    const {
      product_category,
      formula_name,
      formula_type,
      formulation,
      dosage_form,
      master_ingredient,
      ingredient,
      createdBy,
      formula_status,
      price,
    } = req.body;

    const existFormula = await Formula.findOne({
      formula_name: formula_name,
    });
    if (existFormula) {
      const error = new Error("ไม่สามารถใช้ชื่อของสูตรซ้ำกันได้");
      error.statusCode = 404;
      throw error;
    }
    const today = getTodayForCode();
    const patternCode = `RVM${today}`;

    const checkCount = await Formula.find({
      pattern_code: patternCode,
    }).sort({ createdAt: -1 });
    const formula_code = `RVM${today}-${checkCount.length + 1}`;

    let newFormula = new Formula({
      product_category,
      pattern_code: patternCode,
      formula_code: formula_code,
      formula_name: formula_name,
      formula_type: formula_type,
      formulation: formulation,
      dosage_form: dosage_form,
      master_ingredient: master_ingredient,
      ingredient: ingredient,
      createdBy: createdBy,
      formula_status: formula_status,
      price: price,
    });

    await newFormula.save();
    //Example for log information data
    // logger.info("Car", {
    //   Patient: id,
    //   brain: brain,
    // });
    return res.status(201).json({
      ...responseMessage.success,
      data: "ทำรายการเรียบร้อยแล้ว",
    });
  } catch (error) {
    //Example for log error data
    // logger.error(error.message);
    next(error);
  }
};

exports.listAllFormula = async (req, res, next) => {
  try {
    const allFormula = await Formula.find()
      .select("-created_by -updatedAt -__v")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(201).json({
      ...responseMessage.success,
      data: allFormula,
    });
  } catch (error) {
    next(error);
  }
};

exports.getFormulaByCon = async (req, res, next) => {
  try {
    const { product_category, formulation, dosage_form } = req.body;
    const formula = await Formula.find({
      product_category: product_category,
      formulation: { $in: formulation },
      dosage_form: dosage_form,
      formula_status: "publish",
    })
      .select("-created_by -createdAt -updatedAt -__v")
      .lean();

    if (!formula) {
      const error = new Error("ไม่พบสูตรที่ต้องการ");
      error.statusCode = 404;
      throw error;
    }
    return res.status(201).json({
      ...responseMessage.success,
      data: formula,
    });
  } catch (error) {
    next(error);
  }
};

exports.getFormulaById = async (req, res, next) => {
  try {
    const { _id } = req.params;

    const existFormula = await Formula.findOne({ _id: _id });
    if (!existFormula) {
      const error = new Error("ไม่พบสูตร");
      error.statusCode = 404;
      throw error;
    }

    return res.status(201).json({
      ...responseMessage.success,
      data: existFormula,
    });
  } catch (error) {
    next(error);
  }
};

exports.listAllFormulation = async (req, res, next) => {
  try {
    const allFormulation = await Formulation.find()
      .select("-_id -created_by -createdAt -updatedAt -__v")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(201).json({
      ...responseMessage.success,
      data: allFormulation,
    });
  } catch (error) {
    next(error);
  }
};

exports.listAllDosage = async (req, res, next) => {
  try {
    const allDosage = await DosageForm.find()
      .select("-_id -created_by -createdAt -updatedAt -__v")
      .lean();

    return res.status(201).json({
      ...responseMessage.success,
      data: allDosage,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteFormula = async (req, res, next) => {
  try {
    const { _id } = req.params;
    const formula = await Formula.deleteOne({ _id });
    if (formula.deletedCount === 0) {
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

exports.updateFormula = async (req, res, next) => {
  try {
    const {
      _id,
      formula_name,
      formula_type,
      formulation,
      dosage_form,
      master_ingredient,
      ingredient,
      createdBy,
      formula_status,
    } = req.body;

    const existFormula = await Formula.findOne({ _id: _id });
    if (!existFormula) {
      const error = new Error("Formula not found");
      error.statusCode = 404;
      throw error;
    }

    const editFormula = await Formula.updateOne(
      { _id: _id },
      {
        formula_name,
        formula_type,
        formulation,
        dosage_form,
        master_ingredient,
        ingredient,
        createdBy,
        formula_status,
      }
    );
    if (editFormula.nModified === 0) {
      throw new Error("ไม่สามารถแก้ไขข้อมูลได้");
    } else {
      return res.status(200).json({
        ...responseMessage.success,
        data: "Formula updated",
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.unPubFormula = async (req, res, next) => {
  try {
    const { _id } = req.params;
    const formula = await Formula.findOne({ _id })
      .select("-_id -created_by -createdAt -updatedAt -__v")
      .lean();

    if (!formula) {
      const error = new Error("ไม่พบ formula ที่ต้องการแก้ไข");
      error.statusCode = 404;
      throw error;
    }
    const unPubFor = await Formula.updateOne(
      { _id: _id },
      {
        formula_status: "draft",
      }
    );
    if (unPubFor.nModified === 0) {
      throw new Error("ไม่สามารถแก้ไขข้อมูลได้");
    } else {
      res.status(200).json({
        ...responseMessage.success,
        data: "Formula has been draft.",
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.deleteFormula = async (req, res, next) => {
  try {
    const { _id } = req.params;
    const ingredient = await Formula.deleteOne({ _id });
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
