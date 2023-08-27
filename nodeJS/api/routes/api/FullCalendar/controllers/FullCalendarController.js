const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const verifyToken = require("../../utils/auth");

const FullCalendar = require("../models/FullCalendar");


const { query } = require("express");
const CalendarEvents = require("../data-access/FullCalendar");
const { json } = require("body-parser");

router.post("/filter", verifyToken, async (req, res) => {
  console.log("fullCalendar: in.....");
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
    let pageSize = filters.pageSize || 10000;
    let vendorId = filters.vendorId || null;
    let clientId = filters.clientId || null;
    let deleted = filters.deleted || false;
    let status = filters.status || null;
    let employeeId = filters.employeeId || null;
    let contractId = filters.contractId || null;
    console.log("contractId:" + contractId);
    let InvoiceBy = filters.InvoiceBy || "_idDesc";
    result.page = page;
    console.log("result.page:" + result.page);
    let queryParams = {
      $and: [],
    };
    let sortParams = {
      _id: -1,
    };
    let FullCalendarId = filters.FullCalendarId || null;

    if (deleted) {
      queryParams["$and"].push({ deleted: { $eq: true } });
    } else {
      queryParams["$and"].push({ deleted: { $ne: true } });
    }

    if (FullCalendarId && FullCalendarId.length > 0) {
      queryParams["$and"].push({ _id: FullCalendarId });
    }

    if (status) {
      queryParams["$and"].push({ status: status });
    }

    if (clientId) {
      queryParams["$and"].push({ contact: clientId });

    }
    if (contractId) {
      queryParams["$and"].push({ contract: contractId });
    }
    if (employeeId) {
      queryParams["$and"].push({ employee: employeeId });
    }

    queryParams["$and"].push({
      "companyID": {
        $eq: req.user.companyId,
      },
    });

    console.log("filter contact req.user.company:" + req.user.company.toString())

    queryParams["$and"].push({
      "company": {
        $eq: req.user.company,
      },
    });



    console.log("queryParams:" + queryParams);
    console.log(JSON.stringify(queryParams["$and"]));
    console.log("abd:before find");
    console.log("Full Calendar type filter:");
    console.log(JSON.stringify(queryParams));

    let query = FullCalendar.find(queryParams)
      .populate("user", "-password")
      .populate("employee")
      .populate("contract")
      .sort(sortParams);
    console.log("abd:after find");
    console.log(JSON.stringify(queryParams));
    countQuery = FullCalendar.find(queryParams)
      .populate("user", "-password")
      .populate("employee")
      .populate("contract")
      .sort(sortParams);

    //console.log(JSON.stringify(queryParams["$and"]));

    var count = await countQuery.countDocuments();
    result.count = count;
    result.pages = Math.ceil(count / pageSize);

    console.log("fullCalendar: getting data from db ....");
    result.items = await query
      .skip(page * pageSize)
      .limit(pageSize)
      .exec("find");

    res.json(result);
    console.log(JSON.stringify(result))
    console.log("fullCalendar: out.....");
  } catch (ex) {
    console.log(ex);
    result.error = ex.message;
    res.json(result);
  }
});

router.post("/checkForIntersection", verifyToken, async (req, res) => {
  console.log("checkForIntersection: in.....");
  if (!req.user) {
    res.json({ message: "unauthorized access" });
  }
  if (req.user.role != "Administrator" && req.user.role != "Company") {
    res.json({ success: false, message: "Unauthorized" });
  }
  var result = {};
  try {
    let filters = req.body || {};
    let contactId = filters.contactId || null;
    let startDate = filters.startDate || null;
    let endDate = filters.endDate || null;
    let query = {
      $and: [],
    };
    if (contactId) {
      query["$and"].push({ contact: contactId });
    } 
    if (startDate && endDate) {
      query["$and"].push({
        $or: [
          { start: { $lte: startDate }, end: { $gte: startDate } },
          { start: { $lte: endDate }, end: { $gte: endDate } },
          { start: { $gte: startDate }, end: { $lte: endDate } }
        ]
      });
    }
    //execute query
    FullCalendar.findOne(query, function (err, doc) {
      if (err) {
        console.log(err);
        result.error = err;
        res.json(result);
      }
      result.data = doc;
      result.exists = doc != null?true:false;
      res.json(result);
    });

    //execute the query to find if any match exists
   

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
    //let status = count.status || "new";

    if (status) {
      queryParams["$and"].push({ status: status });
    }

    queryParams["$and"].push({
      "companyID": {
        $eq: req.user.companyId,
      },
    });
    console.log("queryParams:" + queryParams);
    countQuery = FullCalendar.find(queryParams);
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
  let FullCalendar = await FullCalendars.getFullCalendarById(req.params.id);
  console.log("get FullCalendar  info.");
  res.json(FullCalendar);
});





router.post("/create", verifyToken, async (req, res, next) => {
  // console.log(req.user);
  if (!req.user) {
    res.json({ message: "unauthorized access" });
  }
  if (req.user.role != "Administrator" && req.user.role != "Company") {
    res.json({ success: false, message: "Unauthorized" });
  }

  const newObject = new FullCalendar({
    user: req.user.id,
    company: req.user.company,
    companyId: req.user.companyId,
    ...req.body
  });

  newObject.deleted = false;
  newObject._id = new mongoose.Types.ObjectId();
  let savedFullCalendar = await newObject.save();
  res.json(savedFullCalendar);

  next();
});



router.post("/update/", verifyToken, async (req, res) => {
  if (req.user.role != "Administrator" && req.user.role != "Company") {
    res.json({ success: false, message: "Unauthorized" });
  }

  //TODO: if user is vendor check if item product belongs to the same vendor
  FullCalendar.findOneAndUpdate(
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
  console.log("delete FullCalendar id:" + req.params.id);
  await FullCalendar.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "deleted" });

});




module.exports = router;
