const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const verifyToken = require("../../utils/auth");

const Expense = require("../models/Expenses");
const FullCalendar = require("../../FullCalendar/models/FullCalendar");

const { query } = require("express");
const Expenses = require("../data-access/Expenses");
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
    let clientId = filters.clientId || null;
    let deleted = filters.deleted || false;
    let status = filters.status || null;
    let seqNumber = filters.seqNumber || null;
    let minValue = filters.minValue || null;
    let maxValue = filters.maxValue || null;
    let package = filters.package || null;
    let contact = filters.contact || null;

    result.page = page;
    console.log("result.page:" + result.page);
    let queryParams = {
      $and: [],
    };
    let sortParams = {
      _id: -1,
    };

   
    
    if(package  ){
      queryParams["$and"].push({ package: { $eq: package } });
    }
    if(contact  ){
      queryParams["$and"].push({ contact: { $eq: contact } });
    }
    
    
      console.log(filters);

    if(seqNumber && seqNumber.length > 0){
      queryParams["$and"].push({ seqNumber: { $regex: seqNumber, $options: "i" } });
    }



    if (deleted) {
      queryParams["$and"].push({ deleted: { $eq: true } });
    } else {
      queryParams["$and"].push({ deleted: { $ne: true } });
    }
  

    if (status) {
      queryParams["$and"].push({ status: status });
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
    let query = Expense.find(queryParams)
      .sort({ name: 1 });
    countQuery = Expense.find(queryParams);

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

//****************/

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
    countQuery = Expense.find(queryParams);
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

//
// router.get("/getContractsByContactId/:id", async (req, res) => {
//   console.log("before get Client Contracts  info. ID: " + req.params.id);
//   //ReferenceError: Cannot access 'Subscription' before initialization
//   let contracts = await Contract.
//     find({ contact: req.params.id, deleted: false })
//     .populate("contact", "-password")
//     .populate("package")
//   console.log("get Contract  info.");
//   res.json(contracts);
// });

router.get("/get/:id", async (req, res) => {
  console.log("before get Contract  info. ID: " + req.params.id);
  let expense = await Expenses.getExpenseById(req.params.id);
  console.log("get Contract  info.");
  res.json(expense);
});


function newSeq(x) {
   return "CON-" + "00000".substring(0, 5 - x.toString().length) + x.toString();
}

router.post("/create", verifyToken, async (req, res, next) => {
  if (!req.user) {
    res.json({ message: "unauthorized access" });
  }
  if (req.user.role != "Administrator" && req.user.role != "Company") {
    res.json({ success: false, message: "Unauthorized" });
  }
  console.log("before create");
  console.log(req.body)


  let count = await Expense.countDocuments({
    "companyID": {
      $eq: req.user.companyId,
    },
    "company": { $eq: req.user.company, },
  });
  let newSerial = count + 1;
  const newObject = new Expense({
    user: req.user.id,
    company: req.user.company,
    companyId: req.user.companyId,
    seqNumber: newSeq(newSerial),
    ...req.body
  });
  console.log("after create");
  newObject.deleted = false;
  newObject._id = new mongoose.Types.ObjectId();
  let savedExpense = await newObject.save();


  

  console.log("savedExpense:" + savedExpense);
  res.json(savedExpense);
  next();

});

router.post("/update", verifyToken, async (req, res) => {
  if (req.user.role != "Administrator" && req.user.role != "Company") {
    res.json({ success: false, message: "Unauthorized" });
  }

  //TODO: if user is vendor check if item product belongs to the same vendor
  Expense.findOneAndUpdate(
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
  console.log("delete Expense id:" + req.params.id);
  await Expense.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "deleted" });

});


router.get("/remove/:id", verifyToken, async (req, res) => {
  if (req.user.role != "Administrator" && req.user.role != "Company") {
    res.json({ success: false, message: "Unauthorized" });
  }
  console.log("Soft Delete: remove Expense id:" + req.params.id);
  Expense.findByIdAndUpdate(
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





    let query = Expense.find(queryParams)
      .sort({ "Sequance": 1 });
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
    let query = Contract.find(queryParams)
      .sort({ "Sequance": 1 });
    result.items = await query.exec("find");
   

    res.json(result);
  } catch (ex) {
    console.log(ex);
    result.error = ex.message;
    res.json(result);
  }

});
module.exports = router;
