const { Router } = require("express");
const ListController = require("./app/controllers/ListController");
const UserController = require("./app/controllers/UserController");
const ProductController = require("./app/controllers/ProductController");
const MeasureController = require("./app/controllers/MeasureController");
const MercadoLivreController = require("./app/controllers/MercadoLivreController");
const checkToken = require("./app/middlewares/checkToken");

const router = Router();
router.post("/user", UserController.store);
router.post('/auth/login', UserController.login);
router.post('/auth/google', UserController.loginWithGoogle);

router.use(checkToken);

router.get("/user", UserController.index);
router.get("/auth/user", UserController.show);
router.put("/auth/user", UserController.update);
router.delete("/auth/user", UserController.delete);

router.get("/list/user", ListController.index);
router.get("/list/:id", ListController.show);
router.post("/list", ListController.store);
router.put("/list/:id", ListController.update);
router.delete("/list/:id", ListController.delete);

router.get("/measure", MeasureController.index);
router.get("/measure/:id", MeasureController.show);
router.post("/measure", MeasureController.store);
router.put("/measure/:id", MeasureController.update);
router.delete("/measure/:id", MeasureController.delete);

router.get("/product/list/:id", ProductController.index);
router.get("/product/:id", ProductController.show);
router.post("/product", ProductController.store);
router.put("/product/:id", ProductController.update);
router.delete("/product/:id", ProductController.delete);

router.get("/api/categories", MercadoLivreController.categories);
router.get("/api/products/:categoryId?/:product", MercadoLivreController.products);

module.exports = router;
