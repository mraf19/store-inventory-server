const Sales = require("./model");
const Item = require("../Item/model");
const Customer = require("../Customer/model");

const getSales = async (req, res, next) => {
  try {
    const sales = await Sales.find().populate("item");

    res.status(200).json({ data: sales });
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

const createSales = async (req, res, next) => {
  try {
    let payload = req.body;

    const customer = awaitCustomer.find({ _id: req.body.customer });

    const listItem = payload.items.map(async (item) => {
      const item = await Item.find({ _id: item });
      return item;
    });

    payload.qty = listItem.length;
    payload.total_diskon = customer.diskon;
    payload.total_harga = listItem
      .map((item) => {
        return item.harga_satuan;
      })
      .reduce((current, total) => current + total);
    if (customer.tipe_diskon === "persentase") {
      payload.total_bayar =
        payload.total_harga - payload.total_harga * payload.total_diskon;
    } else if (customer.tipe_diskon === "fix_diskon") {
      payload.total_bayar = payload.total_harga - payload.total_diskon;
    } else {
      payload.total_bayar = payload.total_harga;
    }

    const sales = new Sales(payload);
    await sales.save();

    res.status(200).json({
      message: "success",
      data: sales,
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
  getSales,
  createSales,
};
