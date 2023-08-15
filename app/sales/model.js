const mongoose = require("mongoose");

const SalesSchema = mongoose.Schema(
  {
    kode_transaksi: {
      type: String,
      required: true,
    },
    tanggal_transaksi: {
      type: Date,
      default: Date.now(),
    },
    item: [
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
