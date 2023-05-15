const { Router } = require("express");
const ListController = require("./app/controllers/ListController");
const UserController = require("./app/controllers/UserController");

const router = Router();

router.get("/user", UserController.index);
router.get("/user/:id", UserController.show);
router.post("/user", UserController.store);

router.get("/list/:id", ListController.index);
router.get("/list/:id", ListController.show);
router.post("/list", ListController.store);

module.exports = router;
