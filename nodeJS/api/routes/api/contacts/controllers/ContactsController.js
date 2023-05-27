const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const verifyToken = require("../../utils/auth");

const Contact = require("../models/Contact");


const { query } = require("express");
const Contacts = require("../data-access/Contacts");
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
    let InvoiceBy = filters.InvoiceBy || "_idDesc";
    let primaryName = filters.primaryName || null;
    let primaryPhone = filters.primaryPhone || null;
    let secondaryName = filters.secondaryName || null;
    let secondaryPhone = filters.secondaryPhone || null;

    result.page = page;
    console.log("result.page:" + result.page);
    let queryParams = {
      $and: [],
    };
    let sortParams = {
      _id: -1,
    };
    let ContactId = filters.ContactId || null;

    if (deleted) {
      queryParams["$and"].push({ deleted: { $eq: true } });
    } else {
      queryParams["$and"].push({ deleted: { $ne: true } });
    }

    if (ContactId && ContactId.length > 0) {
      queryParams["$and"].push({ _id: ContactId });
    }

    if (primaryName) {
      queryParams["$and"].push({ contactName: { $regex: primaryName, $options: "i" } });
    }
    if (primaryPhone) {
      queryParams["$and"].push({ mobile: { $regex: primaryPhone, $options: "i" } });
    }
    if (secondaryName) {
      queryParams["$and"].push({ subContactName: { $regex: secondaryName, $options: "i" } });
    }
    if (secondaryPhone) {
      queryParams["$and"].push({ subContactMobile: { $regex: secondaryPhone, $options: "i" } });
    }

    if (status) {
      queryParams["$and"].push({ status: status });
    }

    queryParams["$and"].push({
      "companyID": {
        $eq: req.user.companyId,
      },
    });



    console.log("queryParams:" + queryParams);
    console.log(JSON.stringify(queryParams["$and"]));
    console.log("abd:before find");
    let query = Contact.find(queryParams)
      .populate("user", "-password")
      .sort({ contactName: 1 });
    console.log("abd:after find");
    countQuery = Contact.find(queryParams);

    console.log(JSON.stringify(queryParams["$and"]));

    var count = await countQuery.countDocuments();
    result.count = count;
    result.pages = Math.ceil(count / pageSize);

    console.log("getting data from db");
    result.items = await query
      .sort({ contactName: 1 })
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
    countQuery = Contact.find(queryParams);
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
  console.log("before get Contact  info. ID: " + req.params.id);
  //ReferenceError: Cannot access 'Contact' before initialization
  //let contact = await Contacts.getContactById(req.params.id);

  //let contact = await Contact.findOne({ _id:  req.params.id, deleted: false }).populate("user", "-password") 
  let contact = await Contact.findOne({ _id: req.params.id, deleted: false }).populate("user", "-password")
  console.log("get Contact  info.");
  res.json(contact);
});



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

  const newObject = new Contact({
    user: req.user.id,
    company: req.user.company,
    companyId: req.user.companyId,
    ...req.body
  });
  console.log("after create");
  newObject.deleted = false;
  newObject._id = new mongoose.Types.ObjectId();
  let savedContact = await newObject.save();
  console.log("savedContact:" + savedContact);
  res.json(savedContact);
  next();
});

router.post("/update/", verifyToken, async (req, res) => {
  if (req.user.role != "Administrator" && req.user.role != "Company") {
    res.json({ success: false, message: "Unauthorized" });
  }

  //TODO: if user is vendor check if item product belongs to the same vendor
  Contact.findOneAndUpdate(
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
  console.log("delete Contact id:" + req.params.id);
  await Contact.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "deleted" });

});


router.get("/remove/:id", verifyToken, async (req, res) => {
  if (req.user.role != "Administrator" && req.user.role != "Company") {
    res.json({ success: false, message: "Unauthorized" });
  }
  console.log("Soft Delete: remove Contact id:" + req.params.id);
  Contact.findByIdAndUpdate(
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
      $or: [
        { contactName: { $regex: val, $options: "i" } },
        { subContactName: { $regex: val, $options: "i" } },
        { mobile: { $regex: val, $options: "i" } },
        { subContactMobile: { $regex: val, $options: "i" } },
      ],
    };
    let query = Contact.find(queryParams)
      .populate("user", "-password")
      .sort(sortParams);
    result.items = await query.exec("find");
    res.json(result);
  } catch (ex) {
    console.log(ex);
    result.error = ex.message;
    res.json(result);
  }
});

module.exports = router;
