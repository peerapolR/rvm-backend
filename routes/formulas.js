const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const formulaControllers = require("../controllers/formulaControllers");

router.post("/addFormula", formulaControllers.addFormula);
router.get("/listAllFormula", formulaControllers.listAllFormula);
router.delete("/:_id", formulaControllers.deleteFormula);
router.get("/listAllFormulation", formulaControllers.listAllFormulation);
router.get("/listAllDosage", formulaControllers.listAllDosage);
router.post("/getFormulaByCon", formulaControllers.getFormulaByCon);
router.put("/updateFormula", formulaControllers.updateFormula);

module.exports = router;