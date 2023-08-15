const router = require("express").Router();
const itemController = require("./controller");
const multer = require("multer");
const os = require("os");

router.get("/item", itemController.getItem);
router.post(
  "/item",
  multer({ dest: os.tmpdir() }).single("image"),
  itemController.createItem
);
router.put(
  "/item/:id",
  multer({ dest: os.tmpdir() }).single("image"),
  itemController.updateItem
);
router.delete("/item/:id", itemController.deleteItem);

module.exports = router;
