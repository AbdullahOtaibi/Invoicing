const express = require("express");
const mongoose = require("mongoose");
const verifyToken = require("../../utils/auth");

const Receipt = require("../models/Receipt");
const Contact = require("../../contacts/models/Contact");
const Contract = require("../../contracts/models/Contract");

const { query } = require("express");
const { json } = require("body-parser");

function Receipts() {
  this.getReceiptById = async function (receiptId) {
    let receipt = await Contact.findOne({
      _id: receiptId,
      deleted: false,
    }).populate("user", "-password");
    return receipt;
  };

  this.updateGrandTotalForReletedCollections = async function (receiptId) {
    
    return new Promise(async function (resolve, reject) {

      try {
        var  res = {} 
        let receipt = await Receipt.findOne({
          _id: receiptId,
          deleted: false,
        });
        if (receipt) {
          
          console.log("receipt found" + receipt);
          let contactId = receipt.contact;
          if (contactId) {
            //fetch total receipts for trhis contact
            let totalReceipts = await Receipt
            .aggregate([
              { $match: { contact: contactId } },
              { $match: { deleted: { $ne: true } } },
              { $group: { _id: contactId, total: { $sum: "$receiptAmount" } } },
            ])
    
            console.log("****************totalReceipts" + JSON.stringify(totalReceipts));
    
            let totalReceiptsContact = 0.0;
            if (totalReceipts && totalReceipts.length > 0) {
              totalReceiptsContact = totalReceipts[0].total;
              console.log("ZZ-totalReceiptsContact:" + totalReceiptsContact + " contactId:" + contactId);
            }
    
            let contactObj = await Contact.findOne({ _id: contactId });
            let contactTotalInvoiced = 0.0;
            if (contactObj && contactObj.contactTotalInvoiced) {
              contactTotalInvoiced = contactObj.contactTotalInvoiced;
            }
    
           let resUpdateContact = await Contact.updateOne(
              { _id: contactId },
              {
                $set: {
                  contactTotalReceipt: totalReceiptsContact,
                  //contactTotalBalance:  totalReceipts[0].total  //- '$contactTotalInvoiced'
                  contactTotalBalance: totalReceiptsContact - contactTotalInvoiced,
                },
              }
            );
    
            res.contactUpdatedData= { contactTotalReceipt: totalReceiptsContact, contactTotalBalance: totalReceiptsContact - contactTotalInvoiced}
          
          }
          
          
          let contractId= receipt.contract; 
          if(contractId)
          {
    let contractObj = await Contract.findOne({ _id: contractId });
    let contractTotalInvoiced = 0.0;
    let contractAmount = 0.0; 
    let contractReminingAmount = 0.0;
    if (contractObj && contractObj.contractTotalInvoiced) {
      contractTotalInvoiced = contractObj.contractTotalInvoiced;
    }
    
    if (contractObj && contractObj.contractAmount) {
      contractAmount = contractObj.contractAmount;
    }

    //get sum receipts for this contract
    let totalReceiptsContract = await Receipt
      .aggregate([
        { $match: { contract: contractId } },
        { $match: { deleted: { $ne: true } } },
        { $group: { _id: { contract: contractId }, total: { $sum: "$receiptAmount" } } },
      ])
     // .toArray();
    
    let totalReceiptsContractAmount = 0.0;
    if (totalReceiptsContract && totalReceiptsContract.length > 0) {
      totalReceiptsContractAmount = totalReceiptsContract[0].total;
    }
    contractReminingAmount = contractAmount - totalReceiptsContractAmount;
    let resUpdateContract = await Contract.updateOne(
      { _id: contractId },
      {
        $set: {
          contractTotalReceipts: totalReceiptsContractAmount,
          contractBalance:
            totalReceiptsContractAmount - contractTotalInvoiced, // - '$contractTotalInvoiced'
            contractReminingAmount: contractReminingAmount
        }
      }
    );
    
    //res.contactUpdatedData= { contactTotalReceipt: totalReceiptsContact, contactTotalBalance: totalReceiptsContact - contactTotalInvoiced}
    
    res.contractUpdatedData= { contractTotalReceipts: totalReceiptsContractAmount, contractBalance: totalReceiptsContractAmount - contractTotalInvoiced}
    
    console.log("resUpdateContract:" + JSON.stringify(resUpdateContract));
          
          }
    
        }
    
        console.log("updateGrandTotalForReletedCollections:" + JSON.stringify(res));
       // return res;
       resolve(res); 
      }
      catch (err) {
        console.log("updateGrandTotalForReletedCollections error:" + err);
        reject(err);
      }
  });
  };
}
module.exports = new Receipts();
