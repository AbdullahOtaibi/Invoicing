const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const verifyToken = require('../../utils/auth');

const Invoice = require('../models/Invoice');
const InvoiceItem = require('../models/InvoiceItem');
const InvoiceStatus = require('../models/InvoiceStatus');


const { query } = require('express');
const Invoices = require('../data-access/Invoices');
const { json } = require('body-parser');
const  getInvoiceXML  = require('../data-access/ubl');
const xmlFormat =require('xml-formatter');



const getNewStatus = (Invoice) => {
    let newStatusId = Invoice.status;
    let allItemsConfirmed = true;
    let allItemsAvailable = true;
    let partiallyAvaiable = false;
    let partiallyConfırmed = false;
    for (let itemIndex in Invoice.items) {
        //console.log("index: " + itemIndex)
        let item = Invoice.items[itemIndex];
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
    let InvoiceBy = filters.InvoiceBy || '_idDesc';
    //pending, 1=new, 2=Partially Confirmed, 3=All Items Confirmed, 4=Partially Available, 5=All Items Available, 100=Closed
    //0-incomplete

    result.page = page;
    let queryParams = {
        '$and': []
    };
    let sortParams = {
        _id: -1
    }
    let InvoiceNumber = filters.InvoiceNumber || null;

    if (deleted) {
        queryParams['$and'].push({ "deleted": { $eq: true } });
    } else {
        queryParams['$and'].push({ "deleted": { $ne: true } });
    }

    if (InvoiceNumber && InvoiceNumber.length > 0) {
        queryParams['$and'].push({ "_id": InvoiceNumber });

    }
  


    let query = Invoice.find({ deleted: false });
    let countQuery = Invoice.find({ deleted: false });
    if (InvoiceBy == '_id') {
        sortParams = {
            _id: 1
        }
    } else if (InvoiceBy == 'amount') {
        sortParams = {
            'totalAmount.amount': 1
        }
    } else if (InvoiceBy == 'amountDesc') {
        sortParams = {
            'totalAmount.amount': -1
        }
    }


    query = Invoice.find(queryParams).populate("user", "-password").populate("status").sort(sortParams);

    countQuery = Invoice.find(queryParams).populate("user", "-password").populate("status").sort(sortParams);




    //console.log(JSON.stringify(query));

    var count = await countQuery.countDocuments();
    result.count = count;
    result.pages = Math.ceil(count / pageSize);


    query.skip(page * pageSize).limit(pageSize).exec('find', function (err, items) {
        result.items = items;
        res.json(result);
    });


});




router.get('/clientInvoices', verifyToken, async (req, res) => {



    Invoice.find({ deleted: false, client: req.user.id }).populate("status").populate({
        path: 'items',
        populate: {
            path: 'product',
            model: 'Product',

        }
    })
        .sort({ dateAdded: -1 })
        .then(Invoices => {

            res.json(Invoices);
        });
});


router.get('/get/:id',  async (req, res) => {

    let invoice = await Invoices.getInvoiceById(req.params.id);
   
    res.json(invoice);
});



router.post('/create', verifyToken, async (req, res, next) => {
    // console.log(req.user);
    if (!req.user) {
        res.json({ message: 'unauthorized access' });
    }
    if (req.user.role != "Administrator" && (req.user.role != "Company")) {
        res.json({ success: false, message: "Unauthorized" });
    }

    let lastInvoice = await Invoice.findOne({}).sort({ serialNumber: -1 });
    let newSerial = 1;
    if (lastInvoice && lastInvoice.serialNumber) {
        newSerial = lastInvoice.serialNumber + 1;
    }
    const newObject = new Invoice({
        user: req.user.id,
        items: []
       
    });

    newObject.deleted = false;
    newObject._id = new mongoose.Types.ObjectId();
    let savedInvoice = await newObject.save();
    res.notify = { code: 'Invoices', extra: 'new-Invoice' };
    console.log("New Invoice Saved Into Database With ID: " + savedInvoice._id);

    /*------------------------------ Add Invoice Items ------------------------------*/
    //console.log(req.body.cart)
    let total = 0;
    let currencyCode = 'USD';
    if (req.body.cart && req.body.cart.length > 0) {
        console.log("Adding " + req.body.cart.length + " Invoice Items From Cart");
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
            const newInvoiceItem = new InvoiceItem({
                _id: new mongoose.Types.ObjectId(),
                Invoice: savedInvoice._id,
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
            if (!newInvoiceItem.status) {
                newInvoiceItem.status = { deleted: false }
            }
            try {
                let savedInvoiceItem = await newInvoiceItem.save();
                savedInvoice.items.push(savedInvoiceItem._id);

            } catch (e) {
                console.log('Invoice Item Error', e);
            }

        }
    }
    savedInvoice.totalAmount = { amount: Math.ceil(total), currencyCode: currencyCode };
    savedInvoice = await Invoice.findByIdAndUpdate(savedInvoice._id, savedInvoice);
    res.json(savedInvoice);
    next();
});

// "/v1/Invoices/addItem"
router.post('/addItem', verifyToken, async (req, res) => {
    let InvoiceId = req.body.InvoiceId;
    let productId = req.body.productId;
    let qty = req.body.qty;

    let result = await Invoices.addInvoiceItem(InvoiceId, productId, qty);
    res.json(result);
});


router.get('/remove/:id', verifyToken, async (req, res) => {
    if (req.user.role != "Administrator" && (req.user.role != "Company")) {
        res.json({ success: false, message: "Unauthorized" });
    }
    //TODO: if user is vendor check if item product belongs to the same vendor
    Invoice.findByIdAndUpdate(req.params.id, { deleted: true }, function (err, item) {
        console.log('marked as deleted...');
        res.json({ success: true, message: 'deleted' });

    })
});



router.get('/deleteItem/:id', verifyToken, async (req, res) => {
    if (req.user.role != "Administrator" && (req.user.role != "Company")) {
        res.json({ success: false, message: "Unauthorized" });
    }
    //TODO: if user is vendor check if item product belongs to the same vendor
    let deletedItem = await InvoiceItem.findByIdAndUpdate(req.params.id, { status: { deleted: true } }, function (err, item) {
        console.log('marked as deleted...');
        console.log(item);
    });
    await Invoices.recalculateTotals(deletedItem.Invoice);
    res.json({ success: true, message: 'closed' });
});



router.get("/test", async(req,res) => {

    let xml = getInvoiceXML({});
    console.log(xml);
   
    //res.setHeader('Content-Type',"text/xml");
    //res.send(xml);
    res.header("Content-Type", "text/html");
    let html = "<html><body><textarea width ='100%' style=\"width:100% !important; height:90vh !important\">" + xmlFormat(xml) + "</textarea></body></html>"

    res.status(200).send(html);
});








module.exports = router;