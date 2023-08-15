const path = require("path");
const fs = require("fs");
const config = require("../../config");

const Customer = require("./model");

const getCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.find();

    res.status(200).json({ data: customer });
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

const createCustomer = async (req, res, next) => {
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
        `public/images/customers/${filename}`
      );

      const src = fs.createReadStream(tmp_path);
      const dest = fs.createWriteStream(target_path);

      src.pipe(dest);

      src.on("end", async () => {
        try {
          payload = { ...payload, ktp: filename };
          let customer = await new Customer(payload);
          await customer.save();
          res.status(200).json({
            message: "success",
            data: customer,
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
      let customer = new Customer(payload);
      await customer.save();

      res.status(200).json({
        message: "success",
        data: customer,
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
        `public/images/customers/${filename}`
      );

      const src = fs.createReadStream(tmp_path);
      const dest = fs.createWriteStream(target_path);

      src.pipe(dest);

      src.on("end", async () => {
        try {
          let customer = await Customer.findById(id);
          const currentImage = `${config.rootPath}/public/images/customers/${customer.ktp}`;

          if (fs.existsSync(currentImage)) {
            fs.unlinkSync(currentImage);
          }

          customer = await Customer.findByIdAndUpdate(id, payload, {
            new: true,
            runValidators: true,
          });

          res.status(200).json({
            message: "success",
            data: customer,
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
      let customer = await Customer.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
      });

      await customer.save();

      res.status(200).json({
        message: "success",
        data: customer,
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

const deleteCustomer = async (req, res, next) => {
  try {
    let customer = await Customer.findByIdAndDelete({ _id: req.params.id });

    let currentImage = `${config.rootPath}/public/images/customer/${item.ktp}`;
    if (fs.existsSync(currentImage)) {
      fs.unlinkSync(currentImage);
    }
    res.status(200).json({
      message: "success",
      data: customer,
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
