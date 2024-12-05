const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const orderControllers = require("../controllers/orderControllers");

router.post("/addOrder", orderControllers.addOrder);
router.put("/updateOrder", orderControllers.updateOrder);
router.delete("/:_id", orderControllers.deleteOrder);
router.post("/listOrderBySale", orderControllers.listOrderBySale);
router.get("/listOrderPending", orderControllers.listOrderPending);
router.get("/listOrderBysaleManager", orderControllers.listOrderBysaleManager);
router.get("/fetchOrderById/:_id", orderControllers.fetchOrderById);
router.get("/approveOrder/:_id", orderControllers.approveOrder);
router.get("/rejectOrder/:_id", orderControllers.rejectOrder);
router.get("/proposedOrder/:_id", orderControllers.proposedOrder);
router.get("/declineOrder/:_id", orderControllers.declineOrder);
router.get("/pendingOrder/:_id", orderControllers.pendingOrder);
router.get(
  "/getNumToGenOrderId/:order_id",
  orderControllers.getNumToGenOrderId
);

module.exports = router;
