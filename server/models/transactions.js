const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  hotel: { type: Schema.Types.ObjectId, required: true, ref: "Hotel" },
  room: [{ type: String, required: true }],
  dateStart: { type: Date, required: true },
  dateEnd: { type: Date, required: true },
  price: { type: Number, required: true },
  payment: { type: String, required: true, enum: ["Credit cart", "Cash"] },
  status: {
    type: String,
    required: true,
    enum: ["Booked", "Checkin", "Checkout"],
    default: "Booked",
  },
});

module.exports = mongoose.model("Transaction", transactionSchema);
