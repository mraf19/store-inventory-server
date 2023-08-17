const Sales = require("./model");
const Item = require("../Item/model");
const Customer = require("../Customer/model");
const { v4: uuidv4 } = require("uuid");

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

    const customer = await Customer.find({ _id: req.body.customer });

    const listItem = payload.items.map(async (item) => {
      const itemMap = await Item.find({ _id: item });
      return itemMap;
    });

    payload.kode_transaksi = uuidv4();
    payload.qty = listItem.length;
    payload.total_diskon = Number(customer.diskon) / 100;
    payload.total_harga = listItem.reduce(
      (total, current) => total + current.harga_satuan,
      0
    );
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
