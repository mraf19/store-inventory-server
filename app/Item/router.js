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
  "/otem/:id",
  multer({ dest: os.tmpdir() }).single("image"),
  itemController.updateItem
);
router.delete("/itemm/:id", itemController.deleteItem);

module.exports = router;
