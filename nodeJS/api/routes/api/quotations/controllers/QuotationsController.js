const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const verifyToken = require('../../utils/auth');

const Quotation = require('../models/Quotation');
const QuotationItem = require('../models/QuotationItem');

const getNewStatus = (quotation) => {
    let newStatusId = quotation.status;
    let allItemsConfirmed = true;
    let allItemsAvailable = true;
    let partiallyAvaiable = false;
    let partiallyConfırmed = false;
    for(let itemIndex in quotation.items){
        //console.log("index: " + itemIndex)
        let item = quotation.items[itemIndex];
        if(!item.status){
            item.status = {};
        }
        if(!item.status.available){
            allItemsAvailable = false;
        }else{
            partiallyAvaiable = true;
        }
        if(!item.status.confirmed){
            allItemsConfirmed = false;
        }else{
            partiallyConfırmed = true;
        }
    }

    
    if(allItemsConfirmed){
        //confirmed
        newStatusId = 3;
    }else if(partiallyConfırmed){
        newStatusId = 2;
    }else if(allItemsAvailable){
        newStatusId = 5;
    }
    else if(partiallyAvaiable){
        newStatusId = 4;
    }
    else{
        newStatusId = 1;
    }
    return newStatusId;
}


router.get('/get/:id', verifyToken, async (req, res) => {
    console.log(req.user);
    Quotation.findOne({ _id: req.params.id }).populate("client", "-password")
    .populate("items")
    .populate({
        path: 'items',
        populate: {
            path: 'product',
            model: 'Product',
            populate: {
                path: 'vendor',
                model: 'Company'
            }
        }

    })
        .populate("status")
        .sort({ id: 1 })
        .then(quote => {
            if (req.user.role != 'Administrator' && req.user.vendorId) {
               // quote.items = quote.items.filter(oi => oi.product.vendor._id == req.user.vendorId);
                //for (var index in quote.items) {
                    //quote.items[index].itemPrice.subtotal = quote.items[index].itemPrice.vendorSubtotal;
               // }
            }
            res.json(quote);
        });
});



router.get('/new', (req, res) => {
    Quotation.find({ deleted: false }).populate("client", "-password").populate("status")
    .sort( {id: 1})
    .then(items => {
        res.json(items);
    });
});


router.post('/create', verifyToken, async (req, res, next) => {
   // console.log(req.user);
   let lastOrder = await Quotation.findOne({}).sort({ serialNumber: -1 });
   let newSerial = 1;
   if (lastOrder && lastOrder.serialNumber) {
       newSerial = lastOrder.serialNumber + 1;
   }

    let newObject = new Quotation({
        client: req.user.id,
        deleted: false,
        serialNumber: newSerial,
        guest:{
            name:req.body.name,
            email:req.email,
            phone:req.body.phone,
            message:req.body.message
        },
        items:[]
    });
    //console.log(req.body.items)
    newObject._id = new mongoose.Types.ObjectId();
    let created = await newObject.save().then(createdObject => {
        console.log('saved into database...');
       
    }).catch(e => {
        console.log('cannot save into database', e.message);
       // res.json(e);
    });
    res.notify = {code: 'quotations', extra: 'new-quotation'};

    if(req.body.items && req.body.items.length > 0){
        for (let index in req.body.items)
        {
            const newItem = new QuotationItem({order:newObject._id, product: req.body.items[index]._id, qty: req.body.items[index].qty });
            newItem._id = new mongoose.Types.ObjectId();
            await newItem.save();
            newObject.items.push(newItem._id);
            
        }
    }

    await Quotation.findByIdAndUpdate(newObject._id, newObject);
   
    res.json(newObject);
    next();
});

router.get('/remove/:id', verifyToken, async (req, res) => {
    if (req.user.role != "Administrator" && (req.user.role != "Company")) {
        res.json({ success: false, message: "Unauthorized" });
    }
    //TODO: if user is vendor check if item product belongs to the same vendor
    Quotation.findByIdAndUpdate(req.params.id, { deleted: true }, function (err, item) {
        console.log('marked as deleted...');
        res.json({ success: true, message: 'deleted' });

    })
});

//=================================
router.get('/clientQuotations', verifyToken, async (req, res) => {

    

    Quotation.find({ deleted: false, client: req.user.id }).populate("status").populate({
        path: 'items',
        populate: {
            path: 'product',
            model: 'Product',

        }
    })
        .sort({ dateAdded: -1 })
        .then(quotations => {
            
            res.json(quotations);
        });
});


router.post('/updateItemAvailable', verifyToken, async (req, res) => {
    if (req.user.role != "Administrator" && (req.user.role != "Company")) {
        res.json({ success: false, message: "Unauthorized" });
    }
    //TODO: if user is vendor check if item product belongs to the same vendor
    let quotationId = req.body.quotationId;
    let itemId = req.body.itemId;
    let available = req.body.available||undefined;
    if(available == "0"){
        available = undefined;
    }
    Quotation.findOne({ _id: quotationId, deleted: false }).then(quotation => {
        let item = quotation.items.filter(oi => oi._id == itemId)[0];
        if (!item.status) {
            item.status = {};
        }
        item.status.available = available;
        item.status.statusDate = new Date();
        item.status.updatedBy = req.user.id;
        quotation.status = getNewStatus(quotation);
        Quotation.findByIdAndUpdate(quotationId, quotation,
            function (err, docs) {
                if (err) {
                    res.json({ success: false, message: err.message });
                }
                else {
                    res.json({ success: true, message: 'updated' });
                }
            });


    });



});

router.post('/updateItemConfirmed', verifyToken, async (req, res) => {
    if (req.user.role != "Administrator") {
        res.json({ success: false, message: "Unauthorized" });
    }
    let quotationId = req.body.quotationId;
    let itemId = req.body.itemId;
    let confirmed = req.body.confirmed;
    Quotation.findOne({ _id: quotationId, deleted: false }).then(quotation => {
        let item = quotation.items.filter(oi => oi._id == itemId)[0];
        if (!item.status) {
            item.status = {};
        }
        item.status.confirmed = confirmed;
        item.status.statusDate = new Date();
        item.status.confirmedBy = req.user.id;
        console.log("new status : " + getNewStatus(quotation));
        quotation.status = getNewStatus(quotation);
        Quotation.findByIdAndUpdate(quotationId, quotation,
            function (err, docs) {
                if (err) {
                    res.json(quotation);
                }
                else {
                    res.json(quotation);
                }
            });


    });



});


router.post('/addItemMessage', verifyToken, async (req, res) => {
    if (req.user.role != "Administrator" && (req.user.role != "Company")) {
        res.json({ success: false, message: "Unauthorized" });
    }
    //TODO: if user is vendor check if item product belongs to the same vendor

    let quotationId = req.body.quotationId;
    let itemId = req.body.itemId;
    let message = req.body.message;
    Quotation.findOne({ _id: quotationId, deleted: false }).then(quotation => {
        let item = quotation.items.filter(oi => oi._id == itemId)[0];
        if (!item.messages) {
            item.messages = [];
        }
        item.messages.push({
            message: message,
            date: new Date(),
            addedBy: req.user.id
        });


        Quotation.findByIdAndUpdate(quotationId, quotation,
            function (err, docs) {
                if (err) {
                    res.json({ success: false, message: err.message });
                }
                else {
                    res.json({ success: true, message: 'updated' });
                }
            });


    });



});


router.get('/sendToCompanies/:id', verifyToken, async (req, res) => {
    let companies = [];
    let emails = [];
    Quotation.findOne({ _id: req.params.id, deleted: false }).populate("client", "-password").populate({
        path: 'items',
        populate: {
            path: 'product',
            model: 'Product',
            populate: {
                path: 'vendor',
                model: 'Company'
            }
        }
    }).then(quotation => {
        for (var index in quotation.items) {
            let vendor = quotation.items[index].product.vendor;
            if (companies.filter(v => v._id == vendor._id).length == 0) {
                companies.push(vendor);
                emails.push(vendor.contactDetails.infoEmail);
            }
        }
        for (var vendorIndex in companies) {
            let vendor = companies[vendorIndex];
            let messageBody = "Dears " + vendor.name.english + ", <br/>New quotation Received, please <a href='https://waredly.com/admin/quotations/" + quotation._id + "'>Click Here </a> to see quotation details.";
            messageBody += "<br/><b>quotation Number: </b> " + quotation._id + "<br />";
            try {
                sendEmail(vendor.contactDetails.infoEmail, "New quotation Received", messageBody);
            } catch (e) {
                console.log(e);
            }
        }

        res.json(quotation);
    });
});



module.exports = router;