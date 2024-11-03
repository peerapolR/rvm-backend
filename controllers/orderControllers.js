const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const Order = require("../models/order");
const config = require("../config/index");
const responseMessage = require("../utils/responseMessage");
const getTodayForCode = require("../utils/getTodayForCode");
// const s3url = require("../utils/content");
// const logger = require("../utils/logger");

exports.addOrder = async (req, res, next) => {
  try {
    const {
      order_id,
      product_category,
      formulation,
      dosage_form,
      formula,
      formular_name,
      master_ingredient,
      ingredient,
      packaging,
      packaging_detail,
      packaging_price,
      carton,
      carton_detail,
      carton_screen,
      carton_price,
      moq,
      price,
      customer_name,
      proposal_code,
      address,
      sub_district,
      district,
      city,
      postal_code,
      tel,
      tax_id,
      contact_person,
      creator_id,
      order_status,
    } = req.body;

    const existOrder = await Order.findOne({
      order_id: order_id,
    });
    if (existOrder) {
      const error = new Error("ไม่สามารถสร้าง Order ที่มี id ซ้ำกันได้");
      error.statusCode = 404;
      throw error;
    }

    let newOrder = new Order({
      order_id,
      product_category,
      formulation,
      dosage_form,
      formula,
      formular_name,
      master_ingredient,
      ingredient,
      packaging,
      packaging_detail,
      packaging_price,
      carton,
      carton_detail,
      carton_screen,
      carton_price,
      moq,
      price,
      customer_name,
      proposal_code,
      address,
      sub_district,
      district,
      city,
      postal_code,
      tel,
      tax_id,
      contact_person,
      creator_id,
      order_status,
    });

    await newOrder.save();
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

exports.updateOrder = async (req, res, next) => {
  try {
    const {
      id,
      product_category,
      formulation,
      dosage_form,
      formula,
      formular_name,
      master_ingredient,
      ingredient,
      packaging,
      packaging_detail,
      packaging_price,
      carton,
      carton_detail,
      carton_screen,
      carton_price,
      moq,
      price,
      customer_name,
      proposal_code,
      address,
      sub_district,
      district,
      city,
      postal_code,
      tel,
      tax_id,
      contact_person,
      creator_id,
      order_status,
    } = req.body;

    const existOrder = await Order.findOne({ _id: id });
    if (!existOrder) {
      const error = new Error("ไม่พบ Order Id นี้");
      error.statusCode = 404;
      throw error;
    }

    const editorder = await Order.updateOne(
      { _id: id },
      {
        product_category,
        formulation,
        dosage_form,
        formula,
        formular_name,
        master_ingredient,
        ingredient,
        packaging,
        packaging_detail,
        packaging_price,
        carton,
        carton_detail,
        carton_screen,
        carton_price,
        moq,
        price,
        customer_name,
        proposal_code,
        address,
        sub_district,
        district,
        city,
        postal_code,
        tel,
        tax_id,
        contact_person,
        creator_id,
        order_status,
      }
    );
    if (editorder.nModified === 0) {
      throw new Error("ไม่สามารถแก้ไขข้อมูลได้");
    } else {
      res.status(200).json({
        ...responseMessage.success,
        data: "Order updated",
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.deleteOrder = async (req, res, next) => {
  try {
    const { _id } = req.params;
    const order = await Order.deleteOne({ _id });
    if (order.deletedCount === 0) {
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

exports.listOrderBySale = async (req, res, next) => {
  try {
    const { sale_id } = req.body;
    const order = await Order.find({ creator_id: sale_id })
      .select("-_id -created_by -createdAt -updatedAt -__v")
      .lean();

    if (!order) {
      const error = new Error("ไม่พบ Order");
      error.statusCode = 404;
      throw error;
    }

    return res.status(201).json({
      ...responseMessage.success,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

exports.listOrderPending = async (req, res, next) => {
  try {
    const order = await Order.find({ order_status: "pending" })
      .select("-_id -created_by -createdAt -updatedAt -__v")
      .lean();

    if (!order) {
      const error = new Error("ไม่พบ Order ที่รอการ Approve");
      error.statusCode = 404;
      throw error;
    }

    return res.status(201).json({
      ...responseMessage.success,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

exports.approveOrder = async (req, res, next) => {
  try {
    const { _id } = req.params;
    const order = await Order.findOne({ _id })
      .select("-_id -created_by -createdAt -updatedAt -__v")
      .lean();

    if (!order) {
      const error = new Error("ไม่พบ Order ที่ต้องการ Approve");
      error.statusCode = 404;
      throw error;
    }
    const approveOrder = await Order.updateOne(
      { _id: id },
      {
        order_status: "approve",
      }
    );
    if (approveOrder.nModified === 0) {
      throw new Error("ไม่สามารถแก้ไขข้อมูลได้");
    } else {
      res.status(200).json({
        ...responseMessage.success,
        data: "Proposal has been approved.",
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.rejectOrder = async (req, res, next) => {
  try {
    const { _id } = req.params;
    const order = await Order.findOne({ _id })
      .select("-_id -created_by -createdAt -updatedAt -__v")
      .lean();

    if (!order) {
      const error = new Error("ไม่พบ Order ที่ต้องการ Reject");
      error.statusCode = 404;
      throw error;
    }
    const rejectOrder = await Order.updateOne(
      { _id: id },
      {
        order_status: "reject",
      }
    );
    if (rejectOrder.nModified === 0) {
      throw new Error("ไม่สามารถแก้ไขข้อมูลได้");
    } else {
      res.status(200).json({
        ...responseMessage.success,
        data: "Proposal has been rejected.",
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.proposedOrder = async (req, res, next) => {
  try {
    const { _id } = req.params;
    const order = await Order.findOne({ _id })
      .select("-_id -created_by -createdAt -updatedAt -__v")
      .lean();

    if (!order) {
      const error = new Error("ไม่พบ Order ที่ต้องการ proposed");
      error.statusCode = 404;
      throw error;
    }
    const proposedOrder = await Order.updateOne(
      { _id: id },
      {
        order_status: "proposed",
      }
    );
    if (proposedOrder.nModified === 0) {
      throw new Error("ไม่สามารถแก้ไขข้อมูลได้");
    } else {
      res.status(200).json({
        ...responseMessage.success,
        data: "Proposal has been proposed.",
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.pendingOrder = async (req, res, next) => {
  try {
    const { _id } = req.params;
    const order = await Order.findOne({ _id })
      .select("-_id -created_by -createdAt -updatedAt -__v")
      .lean();

    if (!order) {
      const error = new Error("ไม่พบ Order ที่ต้องการ Pending");
      error.statusCode = 404;
      throw error;
    }
    const pendingOrder = await Order.updateOne(
      { _id: id },
      {
        order_status: "pending",
      }
    );
    if (pendingOrder.nModified === 0) {
      throw new Error("ไม่สามารถแก้ไขข้อมูลได้");
    } else {
      res.status(200).json({
        ...responseMessage.success,
        data: "Proposal has been pending.",
      });
    }
  } catch (error) {
    next(error);
  }
};
