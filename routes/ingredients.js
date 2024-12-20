const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const ingredientControllers = require("../controllers/ingredientControllers");

router.post("/addIngredient", ingredientControllers.addIngredient);
router.get("/listAllIngredient", ingredientControllers.listAllIngredient);
router.get("/listIngredientToUse", ingredientControllers.listIngredientToUse);
router.delete("/:_id", ingredientControllers.deleteIngredient);
router.put("/publish/:_id", ingredientControllers.publishUpdate);
router.put("/updateIngredient", ingredientControllers.updateIngredient);
router.get("/getIngredientById/:_id", ingredientControllers.getIngredientById);

router.post("/addDosageData", ingredientControllers.addDosageData);
router.post("/getDataByDosage", ingredientControllers.getDataByDosage);

module.exports = router;
