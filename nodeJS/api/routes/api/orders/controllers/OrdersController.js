const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const verifyToken = require('../../utils/auth');

const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const OrderStatus = require('../models/OrderStatus');
const config = require('config');
const nodemailer = require("nodemailer");
const { query } = require('express');
const Payment = require('../../payments/models/Payment');
const Orders = require('../data-access/Orders');
const { json } = require('body-parser');


const sendEmail = async (to, subject, body) => {

    let transporter = nodemailer.createTransport({
        host: config.get("mailServer"),
        port: config.get("mailPort"),
        secure: true, // true for 465, false for other ports
        auth: {
            user: config.get("mailUser"), // generated ethereal user
            pass: config.get("mailPassword"), // generated ethereal password
        },
        tls: {
            ciphers: 'SSLv3'
        }
    });

    console.log("sending email...");
    let mailMessage = {
        from: config.get("mailFrom"), // sender address
        to: to, // list of receivers,
        // bcc: to,
        subject: subject, // Subject line
        html: body, // html body
    }

    let info = await transporter.sendMail(mailMessage);
    console.log(info);

}

const getNewStatus = (order) => {
    let newStatusId = order.status;
    let allItemsConfirmed = true;
    let allItemsAvailable = true;
    let partiallyAvaiable = false;
    let partiallyConfırmed = false;
    for (let itemIndex in order.items) {
        //console.log("index: " + itemIndex)
        let item = order.items[itemIndex];
        if (!item.status) {
            item.status = {}
        }
        if (!item.status.available) {
            allItemsAvailable = false;
        } else {
            partiallyAvaiable = true;
        }
        if (!item.status.confirmed) {
            allItemsConfirmed = false;
        } else {
            partiallyConfırmed = true;
        }
    }


    if (allItemsConfirmed) {
        //confirmed
        newStatusId = 3;
    } else if (partiallyConfırmed) {
        newStatusId = 2;
    } else if (allItemsAvailable) {
        newStatusId = 5;
    }
    else if (partiallyAvaiable) {
        newStatusId = 4;
    }
    else {
        newStatusId = 1;
    }
    return newStatusId;
}

router.post('/filter', verifyToken, async (req, res) => {

    if (!req.user) {
        res.json({ message: 'unauthorized access' });
    }
    if (req.user.role != "Administrator" && (req.user.role != "Company")) {
        res.json({ success: false, message: "Unauthorized" });
    }
    var result = {};


    let filters = req.body || {};
    let page = filters.page || 0;
    let pageSize = filters.pageSize || 20;
    let vendorId = filters.vendorId || null;
    let clientId = filters.clientId || null;
    let deleted = filters.deleted || false;
    let status = filters.status || 'pending';
    let orderBy = filters.orderBy || '_idDesc';
    //pending, 1=new, 2=Partially Confirmed, 3=All Items Confirmed, 4=Partially Available, 5=All Items Available, 100=Closed
    //0-incomplete

    result.page = page;
    let queryParams = {
        '$and': []
    };
    let sortParams = {
        _id: -1
    }
    let orderNumber = filters.orderNumber || null;

    if (deleted) {
        queryParams['$and'].push({ "deleted": { $eq: true } });
    } else {
        queryParams['$and'].push({ "deleted": { $ne: true } });
    }

    if (orderNumber && orderNumber.length > 0) {
        queryParams['$and'].push({ "_id": orderNumber });

    }
    if (status == 'pending') {
        //queryParams['$and'].push({ "payments": { $ne: [] } });
        queryParams['$and'].push({ "status": { $in: [1, 2, 3, 4, 5] } });

    } else if (status == 'closed') {
        queryParams['$and'].push({ "status": 100 });
    } else if (status == 'incomplete') {
        queryParams['$and'].push({ "status": 0 });
    }

    if (clientId && clientId.length > 0) {
        queryParams['$and'].push({ "client": clientId });
    }

    if (req.user.role != "Administrator" && req.user.vendorId) {
        queryParams['$and'].push({ "items.vendorId": req.user.vendorId });
    } else if (vendorId && vendorId.length > 0) {
        queryParams['$and'].push({ "items.vendorId": vendorId });
    }

    let query = Order.find({ deleted: false });
    let countQuery = Order.find({ deleted: false });
    if (orderBy == '_id') {
        sortParams = {
            _id: 1
        }
    } else if (orderBy == 'amount') {
        sortParams = {
            'totalAmount.amount': 1
        }
    } else if (orderBy == 'amountDesc') {
        sortParams = {
            'totalAmount.amount': -1
        }
    }


    query = Order.find(queryParams).populate("client", "-password").populate("status").populate({
        path: 'items',
        populate: {
            path: 'product',
            model: 'Product',

        }
    }).sort(sortParams);

    countQuery = Order.find(queryParams).populate("client", "-password").populate("status").populate({
        path: 'items',
        populate: {
            path: 'product',
            model: 'Product',

        }
    }).sort(sortParams);




    //console.log(JSON.stringify(query));

    var count = await countQuery.countDocuments();
    result.count = count;
    result.pages = Math.ceil(count / pageSize);


    query.skip(page * pageSize).limit(pageSize).exec('find', function (err, items) {
        result.items = items;
        res.json(result);
    });


});

router.post('/getContainerDetails', async (req, res) => {
    let cart = req.body;
    let containerDetails = await Orders.getContainerDetails(cart);
    res.json(containerDetails);
});

router.get('/new', verifyToken, async (req, res) => {

    if (!req.user) {
        res.json({ message: 'unauthorized access' });
    }
    if (req.user.role != "Administrator" && (req.user.role != "Company")) {
        res.json({ success: false, message: "Unauthorized" });
    }

    Order.find({ deleted: false }).populate("client", "-password").populate("status").populate({
        path: 'items',
        populate: {
            path: 'product',
            model: 'Product',

        }
    })
        .sort({ id: 1 })
        .then(orders => {
            if (req.user.role != "Administrator" && req.user.vendorId) {
                orders = orders.filter(order => order.items.some(item => item.product.vendor == req.user.vendorId));
            }
            res.json(orders);
        });
});

router.get('/clientOrders', verifyToken, async (req, res) => {



    Order.find({ deleted: false, client: req.user.id }).populate("status").populate({
        path: 'items',
        populate: {
            path: 'product',
            model: 'Product',

        }
    })
        .sort({ dateAdded: -1 })
        .then(orders => {

            res.json(orders);
        });
});


router.get('/closed', verifyToken, async (req, res) => {
    Order.find({ deleted: false, }).populate("client", "-password").populate("status").populate({
        path: 'items',
        populate: {
            path: 'product',
            model: 'Product',

        }
    })

        .sort({ id: 1 })
        .then(orders => {
            if (req.user.role != "Administrator" && req.user.vendorId) {
                orders = orders.filter(order => order.items.some(item => item.product.vendor == req.user.vendorId));
            }
            res.json(orders);
        });
});

router.get('/getPaymentDetails/:id', verifyToken, async (req, res) => {
    let result = {};
    let order = await Order.findOne({ _id: req.params.id });
    result.totalItemsPrice = order.totalAmount.amount;
    let payments = await Payment.find({ status: 'CAPTURED', order: req.params.id });
    console.log(payments);
    let totalPaid = 0;
    payments.forEach(payment => {
        totalPaid += payment.amount;
    });
    if (totalPaid == 0) {
        result.requiredAmount = parseFloat(result.totalItemsPrice) * 0.1;
    } else if (totalPaid > 0 && totalPaid < result.totalItemsPrice) {
        result.requiredAmount = parseFloat(result.totalItemsPrice) * 0.4;
    }
    result.requiredAmount = result.requiredAmount.toFixed(2);
    if (order.status != 3) {
        result.requiredAmount = 0;
        result.message = "Checking the availability of your ordered items. you will be notified once all items are available";
    }
    result.totalPaid = totalPaid;
    res.json(result);
});



router.get('/get/:id', verifyToken, async (req, res) => {

    let order = await Orders.getOrderById(req.params.id);
    if (req.user.role != 'Administrator' && req.user.vendorId) {
        order.items = order.items.filter(oi => oi.product.vendor._id == req.user.vendorId);
        for (var index in order.items) {
            order.items[index].itemPrice.subtotal = order.items[index].itemPrice.vendorSubtotal;
        }
    }


    res.json(order);
});



router.post('/create', verifyToken, async (req, res, next) => {
    // console.log(req.user);
    if (!req.user) {
        res.json({ message: 'unauthorized access' });
    }
    if (req.user.role != "Administrator" && (req.user.role != "Company")) {
        res.json({ success: false, message: "Unauthorized" });
    }

    let lastOrder = await Order.findOne({}).sort({ serialNumber: -1 });
    let newSerial = 1;
    if (lastOrder && lastOrder.serialNumber) {
        newSerial = lastOrder.serialNumber + 1;
    }
    const newObject = new Order({
        client: req.user.id,
        items: [],
        shippingAddress: req.body.shippingAddressId,
        serialNumber: newSerial,
        shippingCompany: req.body.shippingCompany,
        shippingMethod: req.body.shippingMethod
    });

    newObject.deleted = false;
    newObject._id = new mongoose.Types.ObjectId();
    let savedOrder = await newObject.save();
    res.notify = { code: 'orders', extra: 'new-order' };
    console.log("New Order Saved Into Database With ID: " + savedOrder._id);

    /*------------------------------ Add Order Items ------------------------------*/
    //console.log(req.body.cart)
    let total = 0;
    let currencyCode = 'USD';
    if (req.body.cart && req.body.cart.length > 0) {
        console.log("Adding " + req.body.cart.length + " Order Items From Cart");
        for (let index in req.body.cart) {

            const product = await Product.findOne({ _id: req.body.cart[index]._id }).populate("vendor");
            if (!product) {
                continue;
            }

            let discount = 0;
            if (product && product.discountPercentage && product.discountPercentage > 0) {
                discount = product.price.amount * (product.discountPercentage / 100);
            }
            let profitPercentage = 0;
            try {
                if (product && product.vendor.profitPercentage && product.vendor.profitPercentage > 0) {
                    profitPercentage = (product.price.amount - discount) * (product.vendor.profitPercentage / 100);
                }
            } catch (e) { }

            let netItemPrice = product.price.amount - discount + profitPercentage;
            total += netItemPrice * req.body.cart[index].qty;
            currencyCode = product.price.currencyCode;
            const newOrderItem = new OrderItem({
                _id: new mongoose.Types.ObjectId(),
                order: savedOrder._id,
                vendor: product.vendor._id,
                product: req.body.cart[index]._id,
                qty: req.body.cart[index].qty,
                itemPrice: {
                    amount: product.price.amount,
                    discount: discount,
                    margin: profitPercentage,
                    net: Math.ceil(netItemPrice),
                    subtotal: Math.ceil(netItemPrice * req.body.cart[index].qty),
                    vendorSubtotal: Math.ceil((product.price.amount - discount) * req.body.cart[index].qty),
                    currencyCode: product.price.currencyCode

                }
            });
            if (!newOrderItem.status) {
                newOrderItem.status = { deleted: false }
            }
            try {
                let savedOrderItem = await newOrderItem.save();
                savedOrder.items.push(savedOrderItem._id);

            } catch (e) {
                console.log('Order Item Error', e);
            }

        }
    }
    savedOrder.totalAmount = { amount: Math.ceil(total), currencyCode: currencyCode };
    savedOrder = await Order.findByIdAndUpdate(savedOrder._id, savedOrder);
    res.json(savedOrder);
    next();
});

// "/v1/orders/addItem"
router.post('/addItem', verifyToken, async (req, res) => {
    let orderId = req.body.orderId;
    let productId = req.body.productId;
    let qty = req.body.qty;

    let result = await Orders.addOrderItem(orderId, productId, qty);
    res.json(result);
});


router.get('/remove/:id', verifyToken, async (req, res) => {
    if (req.user.role != "Administrator" && (req.user.role != "Company")) {
        res.json({ success: false, message: "Unauthorized" });
    }
    //TODO: if user is vendor check if item product belongs to the same vendor
    Order.findByIdAndUpdate(req.params.id, { deleted: true }, function (err, item) {
        console.log('marked as deleted...');
        res.json({ success: true, message: 'deleted' });

    })
});

router.get('/closeOrder/:id', verifyToken, async (req, res) => {
    if (req.user.role != "Administrator" && (req.user.role != "Company")) {
        res.json({ success: false, message: "Unauthorized" });
    }
    //TODO: if user is vendor check if item product belongs to the same vendor
    Order.findByIdAndUpdate(req.params.id, { status: 100, dateClosed: new Date() }, function (err, item) {
        console.log('marked as deleted...');
        res.json({ success: true, message: 'closed' });

    })
});

router.get('/deleteItem/:id', verifyToken, async (req, res) => {
    if (req.user.role != "Administrator" && (req.user.role != "Company")) {
        res.json({ success: false, message: "Unauthorized" });
    }
    //TODO: if user is vendor check if item product belongs to the same vendor
    let deletedItem = await OrderItem.findByIdAndUpdate(req.params.id, { status: { deleted: true } }, function (err, item) {
        console.log('marked as deleted...');
        console.log(item);
    });
    await Orders.recalculateTotals(deletedItem.order);
    res.json({ success: true, message: 'closed' });
});

router.post('/updateItemAvailable', verifyToken, async (req, res) => {
    let result = { success: false }
    try {
        if (req.user.role != "Administrator" && (req.user.role != "Company")) {
            res.json({ success: false, message: "Unauthorized" });
        }

        //TODO: if user is vendor check if item product belongs to the same vendor
        let orderId = req.body.orderId || "";
        let itemId = req.body.itemId || "";
        let available = req.body.available;
        console.log("orderIdLength : " + orderId.length);
        console.log("itemIdLength : " + itemId.length);
        if (orderId.length < 24 || itemId.length < 24) {
            result.message = "invalid id";
            res.json(result);
            return;
        }




        let orderItem = await OrderItem.findOne({ _id: itemId }).populate("product");

        if (!orderItem.status) {
            orderItem.status = {};
        }
        if (available == null) {
            console.log('updating available to undefined');
            orderItem.status.available = undefined;
        } else {
            console.log('updating available to ' + available);
            orderItem.status.available = available;
        }

        orderItem.status.statusDate = new Date();
        orderItem.status.updatedBy = req.user.id;

        await OrderItem.findByIdAndUpdate(itemId, orderItem);

        let order = await Order.findOne({ _id: orderId }).populate("items");
        console.log("new status : " + getNewStatus(order));


        let logMessage = {
            createdBy: req.user.id,
            message: "Order Item " + orderItem.product.alias + " availability status set to " + (available == '-' ? 'Unknown' : available)
        }
        order.status = getNewStatus(order);
        if (!order.actions) {
            order.actions = [];
        }
        order.actions.push(logMessage);
        Order.findByIdAndUpdate(orderId, order,
            function (err, docs) {
                if (err) {
                    res.json(order);
                }
                else {
                    res.json(order);
                }
            });


    } catch (e) {
        console.log(e);
        result.message = e.message;
        res.json(result);
        return;
    }


});

router.post('/updateItemConfirmed', verifyToken, async (req, res) => {
    if (req.user.role != "Administrator") {
        res.json({ success: false, message: "Unauthorized" });
    }
    let orderId = req.body.orderId;
    let itemId = req.body.itemId;
    let confirmed = req.body.confirmed;
    let item = {};


    let orderItem = await OrderItem.findOne({ _id: itemId }).populate("product");

    if (!orderItem.status) {
        orderItem.status = {};
    }
    orderItem.status.confirmed = confirmed;
    orderItem.status.statusDate = new Date();
    orderItem.status.confirmedBy = req.user.id;

    await OrderItem.findByIdAndUpdate(itemId, orderItem);

    let order = await Order.findOne({ _id: orderId }).populate("items");
    console.log("new status : " + getNewStatus(order));


    let logMessage = {
        createdBy: req.user.id,
        message: "Order Item " + orderItem.product.alias + " confirmation status set to " + confirmed
    }
    order.status = getNewStatus(order);
    if (!order.actions) {
        order.actions = [];
    }
    order.actions.push(logMessage);
    Order.findByIdAndUpdate(orderId, order,
        function (err, docs) {
            if (err) {
                res.json({ confirmed: confirmed });
            }
            else {
                res.json({ confirmed: confirmed });
            }
        });








});


router.post('/addItemMessage', verifyToken, async (req, res) => {
    if (req.user.role != "Administrator" && (req.user.role != "Company")) {
        res.json({ success: false, message: "Unauthorized" });
    }
    //TODO: if user is vendor check if item product belongs to the same vendor

    let orderId = req.body.orderId;
    let itemId = req.body.itemId;
    let message = req.body.message;

    let orderItem = await OrderItem.findOne({ _id: itemId }).populate("product");
    if (!orderItem.messages) {
        orderItem.messages = [];
    }
    orderItem.messages.push({
        message: message,
        date: new Date(),
        addedBy: req.user.id
    });

    await OrderItem.findByIdAndUpdate(itemId, orderItem);
    let order = await Order.findOne({ _id: orderId });
    let logMessage = {
        createdBy: req.user.id,
        message: "Message [" + message + "] Added for " + orderItem.product.alias
    }
    if (!order.actions) {
        order.actions = [];
    }
    order.actions.push(logMessage);


    Order.findByIdAndUpdate(orderId, order,
        function (err, docs) {
            if (err) {
                res.json({ success: false, message: err.message });
            }
            else {
                res.json({ success: true, message: 'updated' });
            }
        });


});






router.get('/sendToCompanies/:id', verifyToken, async (req, res) => {
    let companies = [];
    let emails = [];
    Order.findOne({ _id: req.params.id, deleted: false }).populate("client", "-password").populate({
        path: 'items',
        populate: {
            path: 'product',
            model: 'Product',
            populate: {
                path: 'vendor',
                model: 'Company'
            }
        }
    }).then(order => {
        for (var index in order.items) {
            let vendor = order.items[index].product.vendor;
            if (companies.filter(v => v._id == vendor._id).length == 0) {
                companies.push(vendor);
                emails.push(vendor.contactDetails.infoEmail);
            }
        }
        for (var vendorIndex in companies) {
            let vendor = companies[vendorIndex];
            let messageBody = "Dears " + vendor.name.english + ", <br/>New Order Received, please <a href='https://website-domain.com/admin/orders/" + order._id + "'>Click Here </a> to see order details.";
            messageBody += "<br/><b>Order Number: </b> " + order._id + "<br />";
            try {
                sendEmail(vendor.contactDetails.infoEmail, "New Order Received", messageBody);
            } catch (e) {
                console.log(e);
            }
        }

        res.json(order);
    });
});






module.exports = router;