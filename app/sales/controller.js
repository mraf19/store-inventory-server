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
    console.log(req.body);

    const customer = await Customer.find({ _id: payload.customer });
    let items = await Item.find({ name: { $in: payload.items } });

    console.log(customer);
    console.log(items);

    payload.kode_transaksi = uuidv4();
    payload.qty = items.length;
    payload.total_diskon = customer[0].diskon;
    payload.total_harga = items.reduce(
      (total, current) => total + current.harga_satuan,
      0
    );
    if (customer.tipe_diskon === "persentase") {
      payload.total_bayar =
        payload.total_harga -
        payload.total_harga * (payload.total_diskon / 100);
    } else if (customer.tipe_diskon === "fix_diskon") {
      payload.total_bayar = payload.total_harga - payload.total_diskon;
    } else {
      payload.total_bayar = payload.total_harga;
    }
    console.log(payload);

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
