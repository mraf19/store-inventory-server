const mongoose = require("mongoose")

const ItemSchema = mongoose.Schema({
    nama_item: {
        type: String,
        required: [true, "nama_item harus diisi!"],
        minLength: [4, "nama_item minimal harus 4 karakter!"]
    },
    unit: {
        type: String,
        required: [true, "unit harus diisi!"],
    },
    stok: {
        type: Number,
        required: [true, "stok harus diisi!"],
        min: [0, "stok tidak boleh negatif!"],
        defaul: 0
    },
    harga_satuan: {
        type: Number,
        required: [true, "harga_satuan harus diisi!"],
        min: [0, "harga_satuan tidak boleh negatif!"],
        DEFAULT: 0
    },
    barang: {
        type: String
    }

}, {timestamps: true})

module.exports = mongoose.model("Item", ItemSchema)