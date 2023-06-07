const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const verifyToken = require('../../utils/auth');
const ShippingPricing = require('../models/ShippingPricing');

router.get('/all/:companyId', (req, res) => {
    //TODO: validate user is admin or company employee
    let companyId = req.params.companyId;

    ShippingPricing.find({ company: companyId }).populate("addedBy", "-password").populate("updatedBy", "-password").limit(7)
        .sort({ date: -1 })
        .then(items => {
            res.json(items);
        });
});

router.get('/latest/:companyId', (req, res) => {
    //TODO: validate user is admin or company employee
    let companyId = req.params.companyId;

    ShippingPricing.find({ company: companyId }).populate("addedBy", "-password").populate("updatedBy", "-password").limit(7)
        .sort({ date: -1 })
        .limit(1)
        .then(item => {
            res.json(item);
        });
});

router.post('/calculatePrice', verifyToken, async (req, res) => {
    let cartItems = req.body.cartItems;
    let companyId = req.body.companyId;
    let shippingMethodId = req.body.shippingMethodId;
    let result = { messages: [], success: false };
    // console.log(cartItems);
    console.log('company ID: ' + companyId);
    console.log('Shipping Method Id: ' + shippingMethodId);

    if (!cartItems || cartItems.length == 0) {
        result.messages.push("No Items to calculate princing for.!");
    }
    let pricing = await ShippingPricing.findOne({ company: companyId }).sort({ date: -1 });
    if (!pricing) {
        result.messages.push("Pricing Information Not Found!");
    }
    console.log(pricing);

    //separate items according to stacking option 'packaging.stacking'   ('Non-Stackable', 'Stackable')
    let stackableItems = [];
    let nonStackableItems = [];
    let unknownItems = [];
    cartItems.forEach(cartItem => {
        if (cartItem.packaging) {
            if (cartItem.packaging.stacking == 'Stackable') {
                stackableItems.push(cartItem);
            } else if (cartItem.packaging.stacking == 'Non-Stackable') {
                nonStackableItems.push(cartItem);
            } else {
                unknownItems.push(cartItem);
            }
        } else {
            unknownItems.push(cartItem);
        }
    });
    result.details = {
        stackable: {
            count: stackableItems.length
        },
        nonStackable: {
            count: nonStackableItems.length
        },
        unknown: {
            count: unknownItems.length
        }
    }

    if (shippingMethodId == 'land') {
        result.amount = pricing.fullLandContainerPrice.amount * 0.25;
        result.currencyCode = 'USD';
        result.success = true;
    } else if (shippingMethodId == 'sea') {
        result.amount = pricing.fullSeaContainerPrice.amount * 0.25;
        result.currencyCode = 'USD';
        result.success = true;
    } else if (shippingMethodId == 'air') {
        result.messages.push("Contact us for pricing");
    }
    else {
        result.messages.push("Contact us for pricing");
    }

    res.json(result);
});

router.post('/create', verifyToken, async (req, res) => {
    //TODO: validate user is admin or company employee
    const newObject = new ShippingPricing({
        ...req.body
    });
    newObject._id = new mongoose.Types.ObjectId();
    newObject.addedBy = req.user.id;
    newObject.updatedBy = req.user.id;
    newObject.save().then(createdObject => {

        console.log('saved into database...');
        res.json(createdObject);
    }).catch(e => {
        console.log('cannot save into database', e.message);
        res.json(e);
    });
});

router.post('/update', verifyToken, async (req, res) => {
    //TODO: validate user is admin or company employee
    console.log('update ShippingPricing called...');
    console.log(req.body);
    ShippingPricing.findByIdAndUpdate(req.body._id, { ...req.body, updatedBy: req.user.id }, function (err, item) {
        console.log('saved into database...');
        res.json(item);
    })
});



module.exports = router;