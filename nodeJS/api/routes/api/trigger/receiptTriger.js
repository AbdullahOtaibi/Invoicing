exports = async function(changeEvent) {
  // A Database Trigger will always call a function with a changeEvent.
  // Documentation on ChangeEvents: https://docs.mongodb.com/manual/reference/change-events/
console.log(JSON.stringify(changeEvent.fullDocument));
  // This sample function will listen for events and replicate them to a collection in a different Database

  // Access the _id of the changed document:
  const docId = changeEvent.documentKey._id;

  // Get the MongoDB service you want to use (see "Linked Data Sources" tab)
  // Note: In Atlas Triggers, the service name is defaulted to the cluster name.
  const serviceName = "InvoicingCluster";
  const database = "InvoicingDB";
  const collection = context.services.get(serviceName).db(database).collection(changeEvent.ns.coll);

  // Get the "FullDocument" present in the Insert/Replace/Update ChangeEvents
  try {
    // If this is a "delete" event, delete the document in the other collection
    if (changeEvent.operationType === "delete") {
      await collection.deleteOne({"_id": docId});
      
    }

    // If this is an "insert" event, insert the document into the other collection
    else if (changeEvent.operationType === "insert") {
      await collection.insertOne(changeEvent.fullDocument);
      
    }

    // If this is an "update" or "replace" event, then replace the document in the other collection
    else if (changeEvent.operationType === "update" || changeEvent.operationType === "replace") {
      await collection.replaceOne({"_id": docId}, changeEvent.fullDocument);
      
    }

    if ( changeEvent.operationType === "insert" || changeEvent.operationType === "delete" || changeEvent.operationType === "update" || changeEvent.operationType === "replace" ) 
    {

  const receiptAmount = changeEvent.fullDocument.receiptAmount;
  const contactId = changeEvent.fullDocument.contact;
  //fetch total receipts for trhis contact
  const totalReceipts = await collection.aggregate([
    { $match: { contact: contactId } },
    { $match : { deleted : {$ne:true} } },
    { $group: { _id: contactId, total: { $sum: "$receiptAmount" } } }
  ]).toArray();
  const contactCollection = context.services.get(serviceName).db(database).collection("Contacts");

 let contactObj =  await contactCollection.findOne(
    { _id: contactId }
    
    
  );

  //update the contact with the total receipts
  await contactCollection.updateOne(
    { _id: contactId },
    { $set: { contactTotalReceipt: totalReceipts[0].total ,
      //contactTotalBalance:  totalReceipts[0].total  //- '$contactTotalInvoiced' 
      contactTotalBalance:   totalReceipts[0].total  -  contactObj.contactTotalInvoiced 
   
    }  } 
    
  );



  const contract = changeEvent.fullDocument.contract;
  //get sum receipts for this contract
  const totalReceiptsContract = await collection.aggregate([
    { $match: { contract: contract } },
   { $match : { deleted : {$ne:true} } },
    { $group: { _id: contract, total: { $sum: "$receiptAmount" } } }
  ]).toArray();
  const contractCollection = context.services.get(serviceName).db(database).collection("Contracts");

  //update the contract with the total receipts

  let contractObj =  await contractCollection.findOne(
    { _id: contract });

  await contractCollection.updateOne(
    { _id: contract },
    { $set: { contractTotalReceipts: totalReceiptsContract[0].total ,
      contractBalance : totalReceiptsContract[0].total  - contractObj.contractTotalInvoiced  // - '$contractTotalInvoiced'
    } } ,
    
  );
    } 
  } catch(err) {
    console.log("error performing mongodb write: ", err.message);
  }
};
