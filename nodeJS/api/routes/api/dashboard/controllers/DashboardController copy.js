const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const verifyToken = require('../../utils/auth');

const Order = require('../../orders/models/Order');



router.get('/info', verifyToken, async (req, res) => {

    let result = {
        orders: 0,
        users: 0,
        quotations:0,
        products:0

    }

    if (!req.user) {
        res.json({ message: 'unauthorized access' });
    }
    if (req.user.role != "Administrator" && (req.user.role != "Company")) {
        res.json({ success: false, message: "Unauthorized" });
    }
    let orders = await Order.find({ deleted: false }).populate("client", "-password").populate("status").populate({
        path: 'items',
        populate: {
            path: 'product',
            model: 'Product',

        }
    });



    if (req.user.role != "Administrator" && req.user.vendorId) {
        orders = orders.filter(order => order.items.some(item => item.product.vendor == req.user.vendorId));
    }
    result.orders = orders.length;

    if (req.user.role == "Administrator") {
        //TODO: deleted false
        let products = await Product.find({mainProduct:  {$eq : null}});
        result.products = products.length;
    }else if(req.user.role == "Company"){
        let products = await Product.find( { vendor: req.user.vendorId, mainProduct:  {$eq : null} });
        result.products = products.length;
    }
    

    if (req.user.role == "Administrator") {
        let users = await User.find({roles:  {$ne : []}});
        result.users = users.length;
    }else if(req.user.role == "Company"){
        let users = await User.find({ vendor: req.user.vendorId });
        result.users = users.length;
    }

    let quotations = await Quotation.find({ deleted: false }).populate("status").populate({
        path: 'items',
        populate: {
            path: 'product',
            model: 'Product',

        }
    });


    if (req.user.role == "Company" && req.user.vendorId) {
        quotations = quotations.filter(quote => quote.items.some(item => item.product.vendor == req.user.vendorId));
    }
    result.quotations = quotations.length;

    var clientsQuery = User.find({roles: []});
    var allClientsCount = await clientsQuery.countDocuments();
    result.allClients = allClientsCount;

    var thirtyDays = 60 * 60 * 24 * 30;
    var newClientsQuery = User.find({roles: [], registerDate: {$gte: Date.now() - thirtyDays} });
    var newClientsCount = await newClientsQuery.countDocuments();
    result.newClients = newClientsCount;

    
    var ordersQuery = Order.find({});
    var allOrdersCount = await ordersQuery.countDocuments();
    result.orders = allOrdersCount;

    var newOrdersQuery = Order.find({dateAdded: {$gte: Date.now() - thirtyDays} });
    var newOrdersCount = await newOrdersQuery.countDocuments();
    result.newOrders = newOrdersCount;



    res.json(result);







});


module.exports = router;