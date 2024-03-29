const mongoose = require("mongoose");

const SalesSchema = mongoose.Schema(
  {
    kode_transaksi: {
      type: String,
      required: true,
    },
    tanggal_transaksi: {
      type: String,
    },
    customer: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Customer",
    },
    items: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Item",
      },
    ],
    qty: {
      type: Number,
      default: 0,
    },
    total_diskon: {
      type: Number,
    },
    total_harga: {
      type: Number,
    },
    total_bayar: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Sales", SalesSchema);
