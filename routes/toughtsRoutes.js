const express = require("express");
const router = express.Router();

const ToughtController = require("../controllers/ToughtController");
const checkAuth = require("../helpers/Auth").checkAuth

router.get("/add",checkAuth, ToughtController.createTought)
router.post("/add",checkAuth, ToughtController.createToughtSave)
router.get("/dashboard",checkAuth, ToughtController.dashboard);
router.get("/", ToughtController.showThoughts);


module.exports = router;
