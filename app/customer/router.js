const router = require("express").Router();
const customerController = require("./controller");
const multer = require("multer");
const os = require("os");

router.get("/customer", customerController.getCustomer);
router.post(
  "/customer",
  multer({ dest: os.tmpdir() }).single("image"),
  customerController.createCustomer
);
router.put(
  "/customer/:id",
  multer({ dest: os.tmpdir() }).single("image"),
  customerController.updateCustomer
);
router.delete("/customer/:id", customerController.deleteCustomer);

module.exports = router;
