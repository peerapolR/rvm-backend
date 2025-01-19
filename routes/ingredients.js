const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const ingredientControllers = require("../controllers/ingredientControllers");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Set the destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Set the file name
  },
});

const upload = multer({ storage: storage });

router.post(
  "/addIngredient",
  upload.single("ingredient_image"),
  ingredientControllers.addIngredient
);
router.get("/listAllIngredient", ingredientControllers.listAllIngredient);
router.get("/listIngredientToUse", ingredientControllers.listIngredientToUse);
router.delete("/:_id", ingredientControllers.deleteIngredient);
router.put("/publish/:_id", ingredientControllers.publishUpdate);
router.put("/updateIngredient", ingredientControllers.updateIngredient);
router.get("/getIngredientById/:_id", ingredientControllers.getIngredientById);

router.post("/addDosageData", ingredientControllers.addDosageData);
router.post("/getDataByDosage", ingredientControllers.getDataByDosage);

module.exports = router;
