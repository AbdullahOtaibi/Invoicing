const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const verifyToken = require("../../utils/auth");

const Invoice = require("../models/Invoice");
const InvoiceStatus = require("../models/InvoiceStatus");

const { query } = require("express");
const Invoices = require("../data-access/Invoices");
const { json } = require("body-parser");
const getInvoiceXML = require("../data-access/ubl");
const xmlFormat = require("xml-formatter");
const postToTaxTypeIncome = require("../../utils/ubl-income-template");
const postToTaxTypeRevertedIncome = require("../../utils/ubl-income-Reverted-template");
var json2xls = require('json2xls');
const fs = require('fs');

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
      item.status = {};
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
  } else if (partiallyAvaiable) {
    newStatusId = 4;
  } else {
    newStatusId = 1;
  }
  return newStatusId;
};

router.post("/filter", verifyToken, async (req, res) => {
  if (!req.user) {
    res.json({ message: "unauthorized access" });
  }
  if (req.user.role != "Administrator" && req.user.role != "Company") {
    res.json({ success: false, message: "Unauthorized" });
  }
  var result = {};
  try {
    let filters = req.body || {};
    let page = filters.page || 0;
    let pageSize = filters.pageSize || 20;
    let vendorId = filters.vendorId || null;
    let clientId = filters.clientId || null;
    let deleted = filters.deleted || false;
    let status = filters.status || null;
    let InvoiceBy = filters.InvoiceBy || "_idDesc";
    let startDate = filters.startDate || null;
    let endDate = filters.endDate || null;
    // companyID: localStorage.getItem("companyId"),
    //let companyId
    //pending, 1=new, 2=Partially Confirmed, 3=All Items Confirmed, 4=Partially Available, 5=All Items Available, 100=Closed
    //0-incomplete
    //req.user.companyId
    result.page = page;
    console.log("result.page:" + result.page);
    let queryParams = {
      $and: [],
    };
    let sortParams = {
      _id: -1,
    };
    let InvoiceNumber = filters.InvoiceNumber || null;

    if (deleted) {
      queryParams["$and"].push({ deleted: { $eq: true } });
    } else {
      queryParams["$and"].push({ deleted: { $ne: true } });
    }

    if (startDate) {
      queryParams["$and"].push({ createdDate: { $gte: startDate } });
    }

    if (endDate) {
      queryParams["$and"].push({ createdDate: { $lte: endDate } });
    }

    if (InvoiceNumber && InvoiceNumber.length > 0) {
      queryParams["$and"].push({ _id: InvoiceNumber });
    }


    if (clientId) {
      queryParams["$and"].push({ contact: clientId });
    }


    if (status) {
      queryParams["$and"].push({ status: status });
    }

    //read the company from the user session.
    queryParams["$and"].push({
      "accountingSupplierParty.partyTaxScheme.companyID": {
        $eq: req.user.companyId,
      },
    });

    queryParams["$and"].push({
      "company": {
      $eq: req.user.company,
      },
    });

    let query = Invoice.find({ deleted: false });
    let countQuery = Invoice.find({ deleted: false });

    if (InvoiceBy == "_id") {
      sortParams = {
        _id: 1,
      };
    } else if (InvoiceBy == "amount") {
      sortParams = {
        "totalAmount.amount": 1,
      };
    } else if (InvoiceBy == "amountDesc") {
      sortParams = {
        "totalAmount.amount": -1,
      };
    }

    console.log("queryParams:" + queryParams);
    query = Invoice.find(queryParams)
      .populate("user", "-password")
      .sort(sortParams);

    countQuery = Invoice.find(queryParams)
      .populate("user", "-password")
      .sort(sortParams);

    console.log(JSON.stringify(queryParams["$and"]));

    var count = await countQuery.countDocuments();
    result.count = count;
    result.pages = Math.ceil(count / pageSize);

    console.log("getting data from db");
    result.items = await query
      .skip(page * pageSize)
      .limit(pageSize)
      .exec("find");

    res.json(result);

    console.log("out.....");
  } catch (ex) {
    console.log(ex);
    result.error = ex.message;
    res.json(result);
  }
});

router.post("/filterExcel", verifyToken, async (req, res) => {
  if (!req.user) {
    res.json({ message: "unauthorized access" });
  }
  if (req.user.role != "Administrator" && req.user.role != "Company") {
    res.json({ success: false, message: "Unauthorized" });
  }
  var result = {};
  try {
    let filters = req.body || {};
    let page = filters.page || 0;
    let pageSize = filters.pageSize || 20;
    let vendorId = filters.vendorId || null;
    let clientId = filters.clientId || null;
    let deleted = filters.deleted || false;
    let status = filters.status || null;
    let InvoiceBy = filters.InvoiceBy || "_idDesc";
    let startDate = filters.startDate || null;
    let endDate = filters.endDate || null;
    // companyID: localStorage.getItem("companyId"),
    //let companyId
    //pending, 1=new, 2=Partially Confirmed, 3=All Items Confirmed, 4=Partially Available, 5=All Items Available, 100=Closed
    //0-incomplete
    //req.user.companyId
    result.page = page;
    console.log("result.page:" + result.page);
    let queryParams = {
      $and: [],
    };
    let sortParams = {
      _id: -1,
    };
    let InvoiceNumber = filters.InvoiceNumber || null;

    if (deleted) {
      queryParams["$and"].push({ deleted: { $eq: true } });
    } else {
      queryParams["$and"].push({ deleted: { $ne: true } });
    }

    if (startDate) {
      queryParams["$and"].push({ createdDate: { $gte: startDate } });
    }

    if (endDate) {
      queryParams["$and"].push({ createdDate: { $lte: endDate } });
    }

    if (InvoiceNumber && InvoiceNumber.length > 0) {
      queryParams["$and"].push({ _id: InvoiceNumber });
    }


    if (clientId) {
      queryParams["$and"].push({ contact: clientId });
    }


    if (status) {
      queryParams["$and"].push({ status: status });
    }

    //read the company from the user session.
    queryParams["$and"].push({
      "accountingSupplierParty.partyTaxScheme.companyID": {
        $eq: req.user.companyId,
      },
    });

    let query = Invoice.find({ deleted: false });
    let countQuery = Invoice.find({ deleted: false });

    if (InvoiceBy == "_id") {
      sortParams = {
        _id: 1,
      };
    } else if (InvoiceBy == "amount") {
      sortParams = {
        "totalAmount.amount": 1,
      };
    } else if (InvoiceBy == "amountDesc") {
      sortParams = {
        "totalAmount.amount": -1,
      };
    }

    console.log("queryParams:" + queryParams);
    query = Invoice.find(queryParams)
      .populate("user", "-password")
      .sort(sortParams);

    countQuery = Invoice.find(queryParams)
      .populate("user", "-password")
      .sort(sortParams);

    console.log(JSON.stringify(queryParams["$and"]));

    var count = await countQuery.countDocuments();
    result.count = count;
    result.pages = Math.ceil(count / pageSize);

    console.log("getting data from db");
    result.items = await query
      .skip(page * pageSize)
      .limit(pageSize)
      .exec("find");
    let jsonArray = result.items.map(item => { return { serial: ('' + item.seqNumber), allowance:item.legalMonetaryTotal.allowanceTotalAmount.toFixed(3),taxInclusive:item.legalMonetaryTotal.taxInclusiveAmount.toFixed(3), name:item.accountingCustomerParty.registrationName, date: item.issuedDate } });
    var xls = json2xls(jsonArray);
    let fileTime = Date.now();
    let fullDirectoryPath = process.env.UPLOAD_ROOT + 'excel';
    if (!fs.existsSync(fullDirectoryPath)) {
      fs.mkdirSync(fullDirectoryPath);
  }

    fs.writeFileSync(fullDirectoryPath + fileTime + '.xlsx', xls, 'binary');
    console.log(jsonArray);
    fs.writeFileSync('data.xlsx', xls, 'binary');

    result.fileUrl = fileTime + '.xlsx';
    result.items = [];
    //res.xls('data.xlsx', jsonArray);
     res.json(result);

    console.log("out.....");
  } catch (ex) {
    console.log(ex);
    result.items = [];
    result.error = ex.message;
    res.json(result);
  }
});

//*************** */

router.post("/count", verifyToken, async (req, res) => {
  if (!req.user) {
    res.json({ message: "unauthorized access" });
  }
  if (req.user.role != "Administrator" && req.user.role != "Company") {
    res.json({ success: false, message: "Unauthorized" });
  }
  var result = {};
  try {
    let queryParams = {
      $and: [],
    };
    let count = req.body || {};
    let status = count.status || "new";

    if (status) {
      queryParams["$and"].push({ status: status });
    }

    queryParams["$and"].push({
      "accountingSupplierParty.partyTaxScheme.companyID": {
        $eq: req.user.companyId,
      },
    });
    console.log("queryParams:" + queryParams);
    countQuery = Invoice.find(queryParams);
    count = await countQuery.countDocuments();
    result.count = count;
    result.status = status;
    res.json(result);

    console.log("out.....");
  } catch (ex) {
    console.log(ex);
    result.error = ex.message;
    res.json(result);
  }
});

router.post("/DachboardSummary", verifyToken, async (req, res) => {
  if (!req.user) {
    res.json({ message: "unauthorized access" });
  }
  if (req.user.role != "Administrator" && req.user.role != "Company") {
    res.json({ success: false, message: "Unauthorized" });
  }
  var result = {};
  try {
    console.log(JSON.stringify(req.body));
    var status1 = req.body.status || "new";
    console.log("status1:" + status1);

    let q = [
      {
        $match: {
          status: status1,
          "accountingSupplierParty.partyTaxScheme.companyID": {
            $eq: req.user.companyId,
          },
          deleted: false,
          deleted:false,
             /* "company": {
            $eq: req.user.company,
            },*/
               
            /*"company": {
            $eq: ObjectId('64198cc7309971483879c665'),
            },*/

         // company: ObjectId('64198cc7309971483879c66,5'),
         //company: '64198cc7309971483879c665',
         //status: "new" ,
         company:  req.user.company,
         //"company" : ObjectId('64198cc7309971483879c665'),
          //"company": ObjectId('64198cc7309971483879c665'),
          //company : ObjectId('64198cc7309971483879c665')
      
        },
      },
      {
        $group: {
          _id: {
            companyID: "$accountingSupplierParty.partyTaxScheme.companyID",
          },
          sumTaxInclusiveAmount: {
            $sum: "$legalMonetaryTotal.taxInclusiveAmount",
          },
          sumAllowanceTotalAmount: {
            $sum: "$legalMonetaryTotal.allowanceTotalAmount",
          },
          taxExclusiveAmount: {
            $sum: "$legalMonetaryTotal.taxExclusiveAmount",
          },
          count: {
            $sum: 1,
          },
        },
      },
    ];
    console.log(JSON.stringify(q));
    result = await Invoice.aggregate(q);

    /*
        countQuery = Invoice.find(queryParams);
        count = await countQuery.countDocuments();
        result.count = count;
        result.status = status;
        */
    if (!result || result.length == 0) {
      result = [{ "_id": { "companyID": req.user.companyId }, "sumTaxInclusiveAmount": 0, "sumAllowanceTotalAmount": 0, "taxExclusiveAmount": 0, "count": 0 }]
    }
    res.json(result);

    console.log("out.....");
  } catch (ex) {
    console.log(ex);
    result.error = ex.message;
    res.json(result);
  }
});

//****************** */

router.get("/clientInvoices", verifyToken, async (req, res) => {
  Invoice.find({ deleted: false, client: req.user.id })
    .populate("status")
    .populate({
      path: "items",
      populate: {
        path: "product",
        model: "Product",
      },
    })
    .sort({ dateAdded: -1 })
    .then((Invoices) => {
      res.json(Invoices);
    });
});

router.get("/get/:id", async (req, res) => {
  let invoice = await Invoices.getInvoiceById(req.params.id);
  console.log("get invoice info.");
  res.json(invoice);
});

router.get("/postToTaxTypeIncome/:id", verifyToken, async (req, res, next) => {

  let result = { success: false };
  console.log("req.params.id: " + req.params.id);
  let invoice = await Invoices.getInvoiceById(req.params.id);
  if (invoice) {

    let data = postToTaxTypeIncome(invoice, req.user).then(data => {
      result.success = true;
      console.log("data:" + data);
      result.data = data;
      res.json(result);
    }).catch(e => {
      result.message = e;
      console.log("data:" + data);
      res.json(result);
    });


  }

});


router.get("/postToTaxTypeRevertedIncome/:id", verifyToken, async (req, res, next) => {

  let result = { success: false };
  console.log("req.params.id: " + req.params.id);
  let invoice = await Invoices.getInvoiceById(req.params.id);
  if (invoice) {

    let data = postToTaxTypeRevertedIncome(invoice, req.user).then(data => {
      result.success = true;
      console.log("data:" + data);
      result.data = data;
      res.json(result);
    }).catch(e => {
      result.message = e;
      console.log("data:" + data);
      res.json(result);
    });


  }

});


function newSeq(x) {
  //d =new Date()
  //return d.getFullYear() + '-' +parseInt(d.getMonth() + 1) + "-" +d.getDate() + '-'+"0000".substring(0,4-x.toString().length)+x.toString()
  return "INV-" + "00000".substring(0, 5 - x.toString().length) + x.toString();
}

router.post("/create", verifyToken, async (req, res, next) => {
  // console.log(req.user);
  if (!req.user) {
    res.json({ message: "unauthorized access" });
  }
  if (req.user.role != "Administrator" && req.user.role != "Company") {
    res.json({ success: false, message: "Unauthorized" });
  }

  /*
    let lastInvoice = await Invoice.findOne({}).sort({ serialNumber: -1 });
    let newSerial = 1;
    if (lastInvoice && lastInvoice.serialNumber) {
        newSerial = lastInvoice.serialNumber + 1;
    }
    */

  let count = await Invoice.countDocuments({
    "accountingSupplierParty.partyTaxScheme.companyID": {
      $eq: req.user.companyId,
    },
    "company" : { $eq: req.user.company,} ,
  });
  let newSerial = count + 1;
  const newObject = new Invoice({
    user: req.user.id,
    company: req.user.company,
    //companyId: req.user.companyId,
    serialNumber: newSerial,
    seqNumber: newSeq(newSerial),
    ...req.body,
  });

  newObject.deleted = false;
  newObject._id = new mongoose.Types.ObjectId();
  //newObject.invoiceLines = req.body.items;
  let savedInvoice = await newObject.save();

  res.json(savedInvoice);

  next();
});

// "/v1/Invoices/addItem"
router.post("/addItem", verifyToken, async (req, res) => {
  let InvoiceId = req.body.InvoiceId;
  let productId = req.body.productId;
  let qty = req.body.qty;

  let result = await Invoices.addInvoiceItem(InvoiceId, productId, qty);
  res.json(result);
});

router.get("/remove/:id", verifyToken, async (req, res) => {
  if (req.user.role != "Administrator" && req.user.role != "Company") {
    res.json({ success: false, message: "Unauthorized" });
  }
  //TODO: if user is vendor check if item product belongs to the same vendor
  Invoice.findByIdAndUpdate(
    req.params.id,
    { deleted: true },
    function (err, item) {
      console.log("marked as deleted...");
      res.json({ success: true, message: "deleted" });
    }
  );
});

//updte invoice added by abdullah ......

router.post("/update/", verifyToken, async (req, res) => {
  if (req.user.role != "Administrator" && req.user.role != "Company") {
    res.json({ success: false, message: "Unauthorized" });
  }

  //TODO: if user is vendor check if item product belongs to the same vendor
  Invoice.findOneAndUpdate(
    { _id: req.body._id },
    req.body,
    function (err, item) {
      console.log("marked  updated...");
      res.json({
        success: true,
        message: "updated successfully ....",
        _id: req.body._id,
      });
    }
  );
});

router.get("/deleteItem/:id", verifyToken, async (req, res) => {
  if (req.user.role != "Administrator" && req.user.role != "Company") {
    res.json({ success: false, message: "Unauthorized" });
  }
  console.log("delete invoice id:" + req.params.id);
  //TODO: if user is vendor check if item product belongs to the same vendor
  let deletedItem = await InvoiceItem.findByIdAndUpdate(
    req.params.id,
    { status: { deleted: true } },
    function (err, item) {
      console.log("marked as deleted...");
      console.log(item);
    }
  );
  await Invoices.recalculateTotals(deletedItem.Invoice);
  res.json({ success: true, message: "closed" });
});

router.get("/test", async (req, res) => {
  let xml = getInvoiceXML({});
  console.log(xml);

  //res.setHeader('Content-Type',"text/xml");
  //res.send(xml);
  res.header("Content-Type", "text/html");
  let html =
    "<html><body><textarea width ='100%' style=\"width:100% !important; height:90vh !important\">" +
    xmlFormat(xml) +
    "</textarea></body></html>";

  res.status(200).send(html);
});

module.exports = router;
