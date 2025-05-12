const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const Order = require("../models/order");
const config = require("../config/index");
const responseMessage = require("../utils/responseMessage");
const getTodayForCode = require("../utils/getTodayForCode");
const s3url = require("../utils/content");
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
      begin_master_ingredient,
      begin_ingredient,
      carton,
      carton_detail,
      carton_screen,
      carton_price,
      proposal_name,
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
      moq1,
      price1,
      packaging1,
      packaging_detail1,
      packaging_price1,
      moq2,
      price2,
      packaging2,
      packaging_detail2,
      packaging_price2,
      moq3,
      price3,
      packaging3,
      packaging_detail3,
      packaging_price3,
      prePrice,
      begin_prePrice,
    } = req.body;
    if (order_id && order_id !== "") {
      const existOrder = await Order.findOne({
        order_id: order_id,
      });
      if (existOrder) {
        const error = new Error("ไม่สามารถสร้าง Order ที่มี id ซ้ำกันได้");
        error.statusCode = 404;
        throw error;
      }
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
      begin_master_ingredient,
      begin_ingredient,
      carton,
      carton_detail,
      carton_screen,
      carton_price,
      proposal_name,
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
      moq1,
      price1,
      packaging1,
      packaging_detail1,
      packaging_price1,
      moq2,
      price2,
      packaging2,
      packaging_detail2,
      packaging_price2,
      moq3,
      price3,
      packaging3,
      packaging_detail3,
      packaging_price3,
      prePrice,
      begin_prePrice,
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
      _id,
      product_category,
      formulation,
      dosage_form,
      formula,
      formular_name,
      master_ingredient,
      ingredient,
      begin_master_ingredient,
      begin_ingredient,
      carton,
      carton_detail,
      carton_screen,
      carton_price,
      proposal_name,
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
      moq1,
      price1,
      packaging1,
      packaging_detail1,
      packaging_price1,
      moq2,
      price2,
      packaging2,
      packaging_detail2,
      packaging_price2,
      moq3,
      price3,
      packaging3,
      packaging_detail3,
      packaging_price3,
      prePrice,
      begin_prePrice,
    } = req.body;

    const existOrder = await Order.findOne({ _id: _id });
    if (!existOrder) {
      const error = new Error("ไม่พบ Order Id นี้");
      error.statusCode = 404;
      throw error;
    }

    const editorder = await Order.updateOne(
      { _id: _id },
      {
        product_category,
        formulation,
        dosage_form,
        formula,
        formular_name,
        master_ingredient,
        ingredient,
        begin_master_ingredient,
        begin_ingredient,
        carton,
        carton_detail,
        carton_screen,
        carton_price,
        proposal_name,
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
        moq1,
        price1,
        packaging1,
        packaging_detail1,
        packaging_price1,
        moq2,
        price2,
        packaging2,
        packaging_detail2,
        packaging_price2,
        moq3,
        price3,
        packaging3,
        packaging_detail3,
        packaging_price3,
        prePrice,
        begin_prePrice,
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

exports.updateVerifyOrder = async (req, res, next) => {
  try {
    const {
      _id,
      master_ingredient,
      ingredient,
      price1,
      price2,
      price3,
      prePrice,
      order_status,
    } = req.body;

    const existOrder = await Order.findOne({ _id: _id });
    if (!existOrder) {
      const error = new Error("ไม่พบ Order Id นี้");
      error.statusCode = 404;
      throw error;
    }

    const editorder = await Order.updateOne(
      { _id: _id },
      {
        master_ingredient,
        ingredient,
        price1,
        price2,
        price3,
        prePrice,
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
      .select(" -created_by -updatedAt -__v")
      .sort({ createdAt: -1 })
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

exports.fetchOrderById = async (req, res, next) => {
  try {
    const { _id } = req.params;

    const order = await Order.find({ _id: _id })
      .select(" -created_by -updatedAt -__v")
      .lean();

    if (!order) {
      const error = new Error("ไม่พบ Order");
      error.statusCode = 404;
      throw error;
    }

    if (order[0].master_ingredient && order[0].master_ingredient?.length > 0) {
      order[0].master_ingredient = await Promise.all(
        order[0].master_ingredient.map(async (ingredient) => {
          if (ingredient.ingredient_image) {
            // Only update if ingredient_image exists
            const updatedImageUrl = await s3url.getImageUrl(
              ingredient.ingredient_image
            );
            return {
              ...ingredient,
              ingredient_image: updatedImageUrl.s3url,
            };
          }
          return ingredient; // Return ingredient as is if no ingredient_image
        })
      );
    }

    if (order[0].ingredient && order[0].ingredient?.length > 0) {
      order[0].ingredient = await Promise.all(
        order[0].ingredient.map(async (ingredient) => {
          if (ingredient.ingredient_image) {
            // Only update if ingredient_image exists
            const updatedImageUrl = await s3url.getImageUrl(
              ingredient.ingredient_image
            );
            return {
              ...ingredient,
              ingredient_image: updatedImageUrl.s3url,
            };
          }
          return ingredient; // Return ingredient as is if no ingredient_image
        })
      );
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
      .select(" -created_by  -updatedAt -__v")
      .sort({ createdAt: -1 })
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

exports.listOrderVerify = async (req, res, next) => {
  try {
    const order = await Order.find({ order_status: "verify" })
      .select(" -created_by  -updatedAt -__v")
      .sort({ createdAt: -1 })
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

exports.listOrderBysaleManager = async (req, res, next) => {
  try {
    const order = await Order.find({
      order_status: { $in: ["approve", "success", "reject", "decline"] },
    })
      .select(" -created_by  -updatedAt -__v")
      .sort({ createdAt: -1 })
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
      { _id: _id },
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

exports.pdVerifyOrder = async (req, res, next) => {
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
    const pdVerifyOrder = await Order.updateOne(
      { _id: _id },
      {
        order_status: "pending",
      }
    );
    if (pdVerifyOrder.nModified === 0) {
      throw new Error("ไม่สามารถแก้ไขข้อมูลได้");
    } else {
      res.status(200).json({
        ...responseMessage.success,
        data: "Proposal has been verified.",
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
      { _id: _id },
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
      const error = new Error("ไม่พบ Order ที่ต้องการ Success");
      error.statusCode = 404;
      throw error;
    }
    const proposedOrder = await Order.updateOne(
      { _id: _id },
      {
        order_status: "success",
      }
    );
    if (proposedOrder.nModified === 0) {
      throw new Error("ไม่สามารถแก้ไขข้อมูลได้");
    } else {
      res.status(200).json({
        ...responseMessage.success,
        data: "Proposal has been success.",
      });
    }
  } catch (error) {
    next(error);
  }
};
exports.declineOrder = async (req, res, next) => {
  try {
    const { _id } = req.params;
    const order = await Order.findOne({ _id })
      .select("-_id -created_by -createdAt -updatedAt -__v")
      .lean();

    if (!order) {
      const error = new Error("ไม่พบ Order ที่ต้องการ Decline");
      error.statusCode = 404;
      throw error;
    }
    const proposedOrder = await Order.updateOne(
      { _id: _id },
      {
        order_status: "decline",
      }
    );
    if (proposedOrder.nModified === 0) {
      throw new Error("ไม่สามารถแก้ไขข้อมูลได้");
    } else {
      res.status(200).json({
        ...responseMessage.success,
        data: "Proposal has been Decline.",
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
      { _id: _id },
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

exports.getNumToGenOrderId = async (req, res, next) => {
  try {
    const { order_id } = req.params;

    const orders = await Order.find({
      order_id: { $regex: new RegExp(`^${order_id}`) },
    })
      .select("_id order_id")
      .lean();

    return res.status(201).json({
      ...responseMessage.success,
      data: orders.length,
    });
  } catch (error) {
    next(error);
  }
};
