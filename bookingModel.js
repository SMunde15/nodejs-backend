const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  bookingId: { type: String, required: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  train_name: { type: String, required: true },
  train_number: { type: String, required: true },
});

const BookingModel = mongoose.model("Booking", bookingSchema);

module.exports = BookingModel;
