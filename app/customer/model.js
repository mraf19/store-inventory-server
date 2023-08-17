const mongoose = require("mongoose");

const CustomerSchema = mongoose.Schema(
  {
    nama: {
      type: String,
      require: [true, "nama harus diisi!"],
      minLength: [3, "nama paling tidak harus 3 karakter!"],
    },
    contact: {
      type: String,
      require: [true, "contact harus diisi!"],
      minLength: [3, "contact paling tidak harus 3 karakter!"],
    },
    email: {
      type: String,
      required: [true, "email harus diisi!"],
    },
    alamat: {
      type: String,
      required: [true, "alamat harus diisi!"],
    },
    diskon: {
      type: String,
    },
    tipe_diskon: {
      type: String,
      enum: ["persentase", "fix_diskon"],
      default: "persentase",
    },
    ktp: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customer", CustomerSchema);
