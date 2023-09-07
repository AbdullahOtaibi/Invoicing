const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const verifyToken = require("../../utils/auth");

const Receipt = require("../models/Receipt");


const { query } = require("express");
const Receipts = require("../data-access/Receipt");
const { json } = require("body-parser");

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
    let contractId = filters.contractId || null;
    result.page = page;
    console.log("result.page:" + result.page);
    let queryParams = {
      $and: [],
    };
    let sortParams = {
      _id: -1,
    };
  
    if (deleted) {
      queryParams["$and"].push({ deleted: { $eq: true } });
    } else {
      queryParams["$and"].push({ deleted: { $ne: true } });
    }
    let receiptId = filters.receiptId || null;
    if (receiptId && receiptId.length > 0) {
      queryParams["$and"].push({ _id: receiptId });
    }

    if (status) {
      queryParams["$and"].push({ status: status });
    }

    if( contractId ){
      queryParams["$and"].push({ contract: contractId });
    }

    queryParams["$and"].push({
      "companyID": {
        $eq: req.user.companyId,
      },
    });

    queryParams["$and"].push({
      "company": {
      $eq: req.user.company,
      },
    });


    console.log("queryParams:" + queryParams);
    console.log(JSON.stringify(queryParams["$and"]));
    console.log("abd:before find");
    let query = Receipt.find(queryParams)
      .populate("user", "-password")
      .populate("contact")
      .populate("contract")
      .sort({ name: 1 });
    console.log("abd:after find");
    countQuery = Receipt.find(queryParams);

    //console.log(JSON.stringify(queryParams["$and"]));

    var count = await countQuery.countDocuments();
    result.count = count;
    result.pages = Math.ceil(count / pageSize);

    console.log("getting data from db");
    result.items = await query
      .sort({ name: 1 })
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


    if (status) {
      queryParams["$and"].push({ status: status });
    }

    queryParams["$and"].push({
      "companyID": {
        $eq: req.user.companyId,
      },
    });
    console.log("queryParams:" + queryParams);
    countQuery = Receipt.find(queryParams);
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

router.get("/get/:id", async (req, res) => {
  console.log("before get Receipt  info. ID: " + req.params.id);
  //ReferenceError: Cannot access 'Receipt' before initialization
    let receipt = await Receipt.findOne({ _id: req.params.id, deleted: false })
    .populate("user", "-password")
    .populate("contact")
    .populate("contract");
  console.log("get receipt  info.");
  res.json(receipt);
});


function newSeq(x) {
  //d =new Date()
  //return d.getFullYear() + '-' +parseInt(d.getMonth() + 1) + "-" +d.getDate() + '-'+"0000".substring(0,4-x.toString().length)+x.toString()
  return "RCP-" + "00000".substring(0, 5 - x.toString().length) + x.toString();
}

router.post("/create", verifyToken, async (req, res, next) => {
  // console.log(req.user);
  if (!req.user) {
    res.json({ message: "unauthorized access" });
  }
  if (req.user.role != "Administrator" && req.user.role != "Company") {
    res.json({ success: false, message: "Unauthorized" });
  }
  console.log("before create");
  console.log(req.body)


  
  let count = await Receipt.countDocuments({
    "companyID": {
      $eq: req.user.companyId,
    },
    "company" : { $eq: req.user.company,} ,
  });
  let newSerial = count + 1;
  const newObject = new Receipt({
    user: req.user.id,
    company: req.user.company,
    companyId: req.user.companyId,
    seqNumber: newSeq(newSerial),
    ...req.body
  });
  console.log("after create");
  newObject.deleted = false;
  newObject._id = new mongoose.Types.ObjectId();
  let savedReceipt = await newObject.save();
  console.log("savedReceipt:" + savedReceipt);
  res.json(savedReceipt);
  next();

});

router.post("/update/", verifyToken, async (req, res) => {
  if (req.user.role != "Administrator" && req.user.role != "Company") {
    res.json({ success: false, message: "Unauthorized" });
  }

  
  //TODO: if user is vendor check if item product belongs to the same vendor
  Receipt.findOneAndUpdate(
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
  console.log("delete Receipt id:" + req.params.id);
  await Receipt.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "deleted" });

});


router.get("/remove/:id", verifyToken, async (req, res) => {
  if (req.user.role != "Administrator" && req.user.role != "Company") {
    res.json({ success: false, message: "Unauthorized" });
  }
  console.log("Soft Delete: remove Receipt id:" + req.params.id);
  Receipt.findByIdAndUpdate(
    req.params.id,
    { deleted: true },
    function (err, model) {
      if (err) {
        console.log("error remove item:" + e)
      }
      else if (model) {
        console.log("marked as deleted..." + model);
        res.json({ success: true, message: "deleted" });
      }

    }
  );

});


router.get("/search/:val", verifyToken, async (req, res) => {
  let val = req.params.val;
  console.log("val:" + val);
  if (!req.user) {
    res.json({ message: "unauthorized access" });
  }
  if (req.user.role != "Administrator" && req.user.role != "Company") {
    res.json({ success: false, message: "Unauthorized" });
  }
  var result = {};
  try {
    let sortParams = {
      _id: -1,
    };

    let queryParams = {
      deleted: false,
      company: req.user.company,
      companyID: req.user.companyId
    }
    
    
    
  
      
    let query = Receipt.find(queryParams)
      .populate("user", "-password")
      .populate("package")
      .sort( {"Sequance" : 1});
    result.items = await query.exec("find");
    res.json(result);
  } catch (ex) {
    console.log(ex);
    result.error = ex.message;
    res.json(result);
  }
});


router.post("/search/", verifyToken, async (req, res) => {
  
  if (req.user.role != "Administrator" && req.user.role != "Company") {
    res.json({ success: false, message: "Unauthorized" });
  }

  var result = {};
  try {
    let sortParams = {
      _id: -1,
    };
   

    let queryParams = {
      deleted: false,
      company: req.user.company,
      companyID: req.user.companyId,
      contact: req.body.clientId
    };
    console.log(queryParams);
    let query = Receipt.find(queryParams)
      .populate("user", "-password")
      .sort( {"Sequance" : 1});
    result.items = await query.exec("find");
    res.json(result);
  } catch (ex) {
    console.log(ex);
    result.error = ex.message;
    res.json(result);
  }

  

});

module.exports = router;
