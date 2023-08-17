const path = require("path");
const fs = require("fs");
const config = require("../../config");

const Item = require("./model");

const getItem = async (req, res, next) => {
  try {
    let items = await Item.find();

    res.status(200).json({ data: items });
  } catch (err) {
    if (err && err.name === "ValidationError") {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }

    next(err);
  }
};

const getItemById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let items = await Item.find({ _id: id });

    res.status(200).json({ data: items });
  } catch (err) {
    if (err && err.name === "ValidationError") {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }

    next(err);
  }
};

const createItem = async (req, res, next) => {
  try {
    let payload = req.body;

    if (req.file) {
      let tmp_path = req.file.path;
      let originalExt =
        req.file.originalname.split(".")[
          req.file.originalname.split(".").length - 1
        ];
      let filename = req.file.filename + "." + originalExt;
      let target_path = path.resolve(
        config.rootPath,
        `public/images/products/${filename}`
      );

      const src = fs.createReadStream(tmp_path);
      const dest = fs.createWriteStream(target_path);

      src.pipe(dest);

      src.on("end", async () => {
        try {
          payload = { ...payload, barang: filename };
          let item = await new Item(payload);
          await item.save();
          res.status(200).json({
            message: "success",
            data: item,
          });
        } catch (err) {
          fs.unlinkSync(target_path);
          if (err && err.name === "ValidationError") {
            return res.json({
              error: 1,
              message: err.message,
              fields: err.errors,
            });
          }
          next(err);
        }
      });
      src.on("error", async () => {
        next(err);
      });
    } else {
      let item = new Item(payload);
      await item.save();

      res.status(200).json({
        message: "success",
        data: item,
      });
    }
  } catch (err) {
    if (err && err.name === "ValidationError") {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }

    next(err);
  }
};

const updateItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    let payload = req.body;

    if (req.file) {
      let tmp_path = req.file.path;
      let originalExt =
        req.file.originalname.split(".")[
          req.file.originalname.split(".").length - 1
        ];
      let filename = req.file.filename + "." + originalExt;
      let target_path = path.resolve(
        config.rootPath,
        `public/images/products/${filename}`
      );

      const src = fs.createReadStream(tmp_path);
      const dest = fs.createWriteStream(target_path);

      src.pipe(dest);

      src.on("end", async () => {
        try {
          let item = await Item.findById(id);
          const currentImage = `${config.rootPath}/public/images/products/${item.barang}`;

          if (fs.existsSync(currentImage)) {
            fs.unlinkSync(currentImage);
          }

          item = await Item.findByIdAndUpdate(
            id,
            {
              ...payload,
              barang: filename,
            },
            {
              new: true,
              runValidators: true,
            }
          );

          res.status(200).json({
            message: "success",
            data: item,
          });
        } catch (err) {
          fs.unlinkSync(target_path);
          if (err && err.name === "ValidationError") {
            return res.json({
              error: 1,
              message: err.message,
              fields: err.errors,
            });
          }

          next(err);
        }
      });

      src.on("error", async () => {
        next(err);
      });
    } else {
      let item = await Item.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
      });
      await item.save();

      res.status(200).json({
        message: "success",
        data: item,
      });
    }
  } catch (err) {
    if (err && err.name === "ValidationError") {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }

    next(err);
  }
};

const deleteItem = async (req, res, next) => {
  try {
    let item = await Item.findByIdAndDelete({ _id: req.params.id });

    let currentImage = `${config.rootPath}/public/images/products/${item.barang}`;
    if (fs.existsSync(currentImage)) {
      fs.unlinkSync(currentImage);
    }
    res.status(200).json({
      message: "success",
      data: item,
    });
  } catch (err) {
    if (err && err.name === "ValidationError") {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }

    next(err);
  }
};

module.exports = {
  getItem,
  createItem,
  updateItem,
  deleteItem,
  getItemById,
};
