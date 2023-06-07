const mongoose = require('mongoose');
const Schema = mongoose.Schema;




const CartSchema = new Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        qty: {
            type: Number,
            default: 1
        }
    }]


}, { collection: 'Carts' });


module.exports = Cart = mongoose.model("Cart", CartSchema);