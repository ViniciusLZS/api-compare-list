const { Router } = require("express");
const ListController = require("./app/controllers/ListController");
const UserController = require("./app/controllers/UserController");
const ProductController = require("./app/controllers/ProductController");
const MeasurementController = require("./app/controllers/MeasurementController");

const router = Router();

router.get("/user", UserController.index);
router.get("/user/:id", UserController.show);
router.post("/user", UserController.store);
router.put("/user/:id", UserController.update);

router.get("/list/user/:id", ListController.index);
router.get("/list/:id", ListController.show);
router.post("/list", ListController.store);

router.get("/measurement", MeasurementController.index);
router.get("/measurement/:id", MeasurementController.show);
router.post("/measurement", MeasurementController.store);

router.get("/product/list/:id", ProductController.index);
router.get("/product/:id", ProductController.show);
router.post("/product", ProductController.store);

module.exports = router;
