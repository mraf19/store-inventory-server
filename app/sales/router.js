const router = require("express").Router();
const salesController = require("./controller");

router.get("/sales", salesController.getSales);
router.post("/sales", salesController.createSales);

module.exports = router;
