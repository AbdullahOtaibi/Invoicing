const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const verifyToken = require("../../utils/auth");
var ObjectId = mongoose.Types.ObjectId;
const Receipt = require("../models/Receipt");
const Invoices = require("../../invoices/data-access/Invoices");
const Invoice = require("../../invoices/models/Invoice");
const Contracts = require("../../contracts/data-access/Contracts");


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
    let contactId = filters.contactId || null;
    //abd
    let seqNumber  = filters.seqNumber || null;

    result.page = page;
    console.log("result.page:" + result.page);
    let queryParams = {
      $and: [],
     // $or: [],
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

    if(contactId)
    {
      queryParams["$and"].push({ contact: contactId });
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

    if(seqNumber)
    queryParams["$and"].push({

      "seqNumber": { $regex: seqNumber, $options: "i" },
     }) 
     console.log( queryParams);

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
router.post("/generateReport", verifyToken, async (req, res) => {
  try {
    // Initial queryParams
    let queryParams = {
      deleted: false,
      company: req.user.company,
      companyID: req.user.companyId,
    };

    // Extract filters from the request body
    const { paymentMethod, startDate, endDate } = req.body;
    
    console.log(req.body)
    // Add filters to queryParams if they exist
    if (paymentMethod) {
      queryParams.paymentMethod = paymentMethod;
    }

    if (startDate) {
      // Accumulate conditions in an array
      queryParams.receiptDate = {
        $gte: new Date(startDate + "T00:00:00.000Z"),
      };
    }

    if (endDate) {
      // Check if queryParams.dateCreated already exists
      queryParams.receiptDate = {
        
       
        $lte: new Date(endDate + "T23:59:59.999Z"),
      };
    }

    console.log("start ...generate");

    // Find the receipts by applying the queryParams
    const receipts = await Receipt.find(queryParams);
    var receiptli = [];
    var invoiceli = [];
    var contractli = [];

    // Extract the invoice and contract information for each receipt
    for (const receipt of receipts) {
      receiptli.push(receipt);

      if (receipt.ObjectIdinvoice != null) {
        invoiceli.push(await Invoices.getInvoiceById(receipt.ObjectIdinvoice));
      } else if (receipt.listOfAppliedInvoices != null) {
        // Use a for...of loop with the 'async' keyword inside an async function
        for (const element of receipt.listOfAppliedInvoices) {
          invoiceli.push(await Invoices.getInvoiceById(element.key1));
        }
      } else {
        invoiceli.push(null);
      }

      if (receipt.contract != null) {
        contractli.push(await Contracts.getContractById(receipt.contract));
      } else {
        contractli.push(null);
      }
    }

    // Return the result
    const result = {
      receipts: receiptli,
      invoices: invoiceli,
      contract: contractli,
    };
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
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
    companyID: req.user.companyId,
    seqNumber: newSeq(newSerial),
    

    ...req.body
  });
  console.log("after create");
  
  newObject.deleted = false;
  newObject._id = new mongoose.Types.ObjectId();
  newObject.ObjectIdinvoice=null;
  newObject.receiptBalance=newObject.receiptAmount;

  let savedReceipt = await newObject.save();
  console.log("savedReceipt:" + savedReceipt);
  console.log()
  res.json( {
      success: true,
      receipt: savedReceipt,
      updatedGrandTotal : await Receipts.updateGrandTotalForReletedCollections(savedReceipt._id)

  });

  next();

});


router.post("/update/", verifyToken, async (req, res) => {

  if (req.user.role != "Administrator" && req.user.role != "Company") {
    res.json({ success: false, message: "Unauthorized" });
  }

  // call the findOneAndUpdate 
  //and then call the updateGrandTotalForReletedCollections with return the result of the updateGrandTotalForReletedCollections


   Receipt.findOneAndUpdate(
    { _id: req.body._id },
    req.body, 
     async function (err, item) {
      console.log("marked  updated...");
      
      res.json({
        success: true,
        message: "updated successfully ....",
        _id: req.body._id,
        updatedGrandTotal:  await Receipts.updateGrandTotalForReletedCollections(req.body._id),
      });
    }


    //console.log("marked  updated..."  + res)
  
  );
 // let x=   Receipts.updateGrandTotalForReletedCollections(req.body._id);
   
// return x as result of updateGrandTotalForReletedCollections

});
function isKeyInJSONAndNotNull(userDocument, keyToCheck) {
  const userObject = userDocument.toObject();

  // Check if the key exists and is not null
  return userObject.hasOwnProperty(keyToCheck) && userObject[keyToCheck] !== null;
}
router.get("/deleteItem/:id", verifyToken, async (req, res) => {
  if (req.user.role != "Administrator" && req.user.role != "Company") {
    res.json({ success: false, message: "Unauthorized" });
  }
  console.log("delete Receipt id:" + req.params.id);
  let rece=await Receipt.findByIdAndDelete( req.params.id,
    { status: { deleted: true } },
    function (err, item) {
      console.log("marked as deleted...");
      console.log(item);
    }
    
  
    );
    console(rece.ObjectIdinvoice)
 

 let  updatedGrandTotal = await Receipts.updateGrandTotalForReletedCollections(req.params.id); 
  res.json({ success: true, message: "deleted" , updatedGrandTotal: updatedGrandTotal});


});


router.get("/remove/:id", verifyToken, async (req, res) => {
  if (req.user.role != "Administrator" && req.user.role != "Company") {
    res.json({ success: false, message: "Unauthorized" });
  }
  console.log("Soft Delete: remove Receipt id:" + req.params.id);
  let rece= await Receipt.findOne({ _id: req.params.id, deleted: false })

 Receipt.findByIdAndUpdate(
    req.params.id,
    { deleted: true },
    async function (err, model) {
      if (err) {
        console.log("error remove item:" + e)
      }
      else if (model) {
        console.log("marked as deleted..." + model);
        res.json({ success: true, message: "deleted" , 
        updatedGrandTotal : await Receipts.updateGrandTotalForReletedCollections(req.params.id)});
      }

    }
    
  );
  console.log(rece.ObjectIdinvoice)

  if(isKeyInJSONAndNotNull(rece, "ObjectIdinvoice")){  
   let INV= Invoice.findByIdAndUpdate(
      rece.ObjectIdinvoice,
      { deleted: true },
      function (err, item) {
        console.log("marked as deleted...");
      }
    );
    await Invoices.recalculateTotals(INV.Invoice);

  }
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

router.post("/getSumReceiptByContractId", verifyToken, async (req, res) => {

  console.log(JSON.stringify(req.body));
  var contractId = req.body.filter.contractId; 
  console.log("contractId:" +contractId) ;
  
  let arrQ= [] ;
  arrQ = [
    {
      '$match': {
        'contract': {
          '$eq': new ObjectId(contractId),
        }
      }
    },
    
    {
      '$group': {
        '_id': '$contract',
        'total': {
          '$sum': '$receiptAmount'
        }
      }
    }
  ]

  console.log("arrQ:" + JSON.stringify(arrQ));

  let result = await Receipt.aggregate (
    arrQ
  );
      console.log("getSumReceiptByContractId:" );
      console.log(result) ;  
  res.json(result);
});




module.exports = router;
