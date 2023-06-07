const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderStatusSchema = new Schema({
    _id: Number,
    name: {
        english: String,
        arabic: String,
        turkish: String
    }

}, { collection: 'OrderStatus' });


module.exports = OrderStatus = mongoose.model("OrderStatus", OrderStatusSchema);