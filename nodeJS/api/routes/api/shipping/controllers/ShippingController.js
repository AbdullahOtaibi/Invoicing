const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const verifyToken = require('../../utils/auth');

const Shipment = require('../models/Shipment');
const ShippingCompany = require('../models/ShippingCompany');


router.get('/get/:id', (req, res) => {
    Shipment.findOne({ _id: req.params.id })
        .sort({ id: 1 })
        .then(item => {
            res.json(item);
        });
});

router.get('/getAvailableOptions', async (req, res) => {
    let options = [];
    let companies = await ShippingCompany.find({ published: true }).sort({ _id: 1 });
    companies.forEach(company => {
        if (company.landTransportationPricing.optionAvailable == true) {
            options.push({
                companyId: company._id,
                companyName: company.name,
                eta: company.landTransportationPricing.eta,
                type: 'land'
            });
        }
        if (company.seaTransportationPricing.optionAvailable == true) {
            options.push({
                companyId: company._id,
                companyName: company.name,
                eta: company.seaTransportationPricing.eta,
                type: 'sea'
            });
        }
        if (company.airTransportationPricing.optionAvailable == true) {
            options.push({
                companyId: company._id,
                companyName: company.name,
                eta: company.airTransportationPricing.eta,
                type: 'air'
            });
        }
    });
    res.json(options);
});


router.get('/byOrderNumber/:id', (req, res) => {
    Shipment.findOne({ order: req.params.id })
        .sort({ id: 1 })
        .then(item => {
            res.json(item);
        });
});

router.post('/create', verifyToken, (req, res) => {
    if (!req.body.order) {
        res.json({ success: false, message: "Order Id Required" });
    }
    Shipment.findOne({ order: req.body.order })
        .then(item => {
            if (item) {
                console.log("Shipment already exists for order " + req.body.order)
                res.json(item);
            } else {
                const newObject = new Shipment({
                    ...req.body,

                });
                newObject._id = new mongoose.Types.ObjectId();
                newObject.save().then(createdObject => {

                    Order.findByIdAndUpdate(req.body.order, { shipment: newObject._id },
                        function (err, docs) {

                        });

                    console.log('saved into database...');
                    res.json(createdObject);
                }).catch(e => {
                    console.log('cannot save into database', e.message);
                    res.json(e);
                });
            }

        });


});

router.post('/update', verifyToken, (req, res) => {
    console.log(req.body);
    Shipment.findByIdAndUpdate(req.body._id, req.body, function (err, item) {
        console.log('saved into database...');
        res.json(item);
    })


});

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

    result.page = page;
    let queryParams = {
        '$and': []
    };
    let sortParams = {
        _id: -1
    }

    let query = Shipment.find({}).sort({ _id: -1 });
    //if(queryParams){
    //   query = Shipment.find(queryParams).sort({_id:-1});
    //}





    //console.log(JSON.stringify(query));

    var count = await query.countDocuments();
    result.count = count;
    result.pages = Math.ceil(count / pageSize);


    query.skip(page * pageSize).limit(pageSize).exec('find', function (err, items) {
        result.items = items;
        res.json(result);
    });


});


router.post('/getSippingCost', (req, res) => {
    let cartItems = req.body;

    Shipment.findOne({ _id: req.params.id })
        .then(item => {
            res.json(item);
        });
});



module.exports = router;