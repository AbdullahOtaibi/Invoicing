const express = require('express');
const Cart = require('../models/Cart')


function Carts() {

    this.getCart = async (userId) => {
        let result = {};
        try {
            let cart = await Cart.findOne({ client: userId });
            result.data = cart;
            result.success = true;
        } catch (e) {
            result.errorMessage = e.message;
            result.success = false;
        }

        return result;
    }

    this.addCartItem = async (userId, item) => {
        let result = {};
        try {
            let cart = await Cart.findOne({ client: userId });
            result.data = cart;
            result.success = true;
        } catch (e) {
            result.errorMessage = e.message;
            result.success = false;
        }


        return result;
    }

    this.removeCartItem = async (userId, item) => {
        let result = {};
        try {
            let cart = await Cart.findOne({ client: userId });
            result.data = cart;
            result.success = true;
        } catch (e) {
            result.errorMessage = e.message;
            result.success = false;
        }

        return result;
    }


    this.addCart = async (userId, cart) => {
        let result = {};
        try{
            let newObject = new Cart({...cart});
            newObject._id = new mongoose.Types.ObjectId();
            newObject.client = userId;
            let savedCart = await newObject.save();
            result.data = savedCart;
            result.success = true;
        }catch(e){
            result.errorMessage = e.message;
            result.success = false;
        }

        return result;
    }

}

module.exports = new Carts(); 