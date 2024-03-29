const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const verifyToken = require("../../utils/auth");

const Contract = require("../models/Contract");
const FullCalendar = require("../../FullCalendar/models/FullCalendar");

const { query } = require("express");
const Contracts = require("../data-access/Contracts");
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

    if(minValue  ){
      queryParams["$and"].push({ contractBalance: { $gte: minValue } });
    }
    if(package  ){
      queryParams["$and"].push({ package: { $eq: package } });
    }
    if(contact  ){
      queryParams["$and"].push({ contact: { $eq: contact } });
    }
    
    
      console.log(filters);
    if(maxValue ){
      queryParams["$and"].push({ contractBalance: { $lte: maxValue } });
    }
    if(seqNumber && seqNumber.length > 0){
      queryParams["$and"].push({ seqNumber: { $regex: seqNumber, $options: "i" } });
    }



    if (deleted) {
      queryParams["$and"].push({ deleted: { $eq: true } });
    } else {
      queryParams["$and"].push({ deleted: { $ne: true } });
    }
    let contractId = filters.contractId || null;
    if (contractId && contractId.length > 0) {
      queryParams["$and"].push({ _id: contractId });
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
    let query = Contract.find(queryParams)
      .populate("contact", "-password")
      .populate("package")
      .sort({ name: 1 });
    console.log("abd:after find");
    countQuery = Contract.find(queryParams);

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
    countQuery = Contract.find(queryParams);
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
router.get("/getContractsByContactId/:id", async (req, res) => {
  console.log("before get Client Contracts  info. ID: " + req.params.id);
  //ReferenceError: Cannot access 'Subscription' before initialization
  let contracts = await Contract.
    find({ contact: req.params.id, deleted: false })
    .populate("contact", "-password")
    .populate("package")
  console.log("get Contract  info.");
  res.json(contracts);
});

router.get("/get/:id", async (req, res) => {
  console.log("before get Contract  info. ID: ****" + req.params.id);
  let contract = await Contracts.getContractById(req.params.id);
  console.log("get Contract  info.");
  res.json(contract);
});


function newSeq(x) {
  //d =new Date()
  //return d.getFullYear() + '-' +parseInt(d.getMonth() + 1) + "-" +d.getDate() + '-'+"0000".substring(0,4-x.toString().length)+x.toString()
  return "CON-" + "00000".substring(0, 5 - x.toString().length) + x.toString();
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


  let count = await Contract.countDocuments({
    "companyID": {
      $eq: req.user.companyId,
    },
    "company": { $eq: req.user.company, },
  });
  let newSerial = count + 1;
  const newObject = new Contract({
    user: req.user.id,
    company: req.user.company,
    companyId: req.user.companyId,
    seqNumber: newSeq(newSerial),
    ...req.body
  });
  console.log("after create");
  newObject.deleted = false;
  newObject._id = new mongoose.Types.ObjectId();
  let savedContract = await newObject.save();


  /*
   let setsCount = newObject.numberOfSet;
   let startDate =  new Date(newObject.contractDate);


   for (let index = 0; index < setsCount; index++) {
     let setDate = new Date(startDate);
     let setEndDate = new Date(startDate);
     if(newObject.frequency == "Monthly"){
       setDate =  new Date(newObject.contractDate);
       setDate.setMonth(setDate.getMonth() + index);
     }else if(newObject.frequency == "Weekly"){
       setDate =  new Date(newObject.contractDate);
       setDate.setDate(setDate.getDate() + (index*7));   
     }else if(newObject.frequency == "Daily"){
       setDate =  new Date(newObject.contractDate);
       setDate.setDate(setDate.getDate() + index);   
     }else if(newObject.frequency == "Yearly"){
       setDate =  new Date(newObject.contractDate);
       setDate.setFullYear(setDate.getFullYear() + index);   
     }
     setEndDate = new Date(setDate);
     setEndDate.setHours(setEndDate.getHours() + 1);   

     let appointment = new FullCalendar({
       contract: savedContract._id,
       companyId: req.user.companyId,
       start: setDate,
       end: setEndDate,
       contact: newObject.contact,
       user: req.user.id,
       title: "Testing Contracts",
     });
     appointment._id = new mongoose.Types.ObjectId();
     await appointment.save();
    
   }
 
*/

  console.log("savedContract:" + savedContract);
  res.json(savedContract);
  next();

});

router.post("/update", verifyToken, async (req, res) => {
  if (req.user.role != "Administrator" && req.user.role != "Company") {
    res.json({ success: false, message: "Unauthorized" });
  }

  //TODO: if user is vendor check if item product belongs to the same vendor
  Contract.findOneAndUpdate(
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
  console.log("delete Contract id:" + req.params.id);
  await Contract.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "deleted" });

});


router.get("/remove/:id", verifyToken, async (req, res) => {
  if (req.user.role != "Administrator" && req.user.role != "Company") {
    res.json({ success: false, message: "Unauthorized" });
  }
  console.log("Soft Delete: remove Contract id:" + req.params.id);
  Contract.findByIdAndUpdate(
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





    let query = Contract.find(queryParams)
      .populate("contact", "-password")
      .populate("package")
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

    let val = req.body.val;

    let queryParams = {
      deleted: false,
      company: req.user.company,
      companyID: req.user.companyId,
     // contact: req.body.clientId
     $or: [
      { seqNumber: { $regex: val, $options: "i" } },
      /*
      { subContactName: { $regex: val, $options: "i" } },
      { mobile: { $regex: val, $options: "i" } },
      { subContactMobile: { $regex: val, $options: "i" } },
      */
    ],

    };
    if(req.body.clientId) 
    {
      queryParams.contact = req.body.clientId;
    }
  



    console.log(queryParams);
    let query = Contract.find(queryParams)
      .populate("contact", "-password")
      .populate("package")
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
