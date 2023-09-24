exports = async function (changeEvent) {
    // A Database Trigger will always call a function with a changeEvent.
    // Documentation on ChangeEvents: https://docs.mongodb.com/manual/reference/change-events/

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
            await collection.deleteOne({ "_id": docId });
        }

        // If this is an "insert" event, insert the document into the other collection
        else if (changeEvent.operationType === "insert") {
            await collection.insertOne(changeEvent.fullDocument);
        }

        // If this is an "update" or "replace" event, then replace the document in the other collection
        else if (changeEvent.operationType === "update" || changeEvent.operationType === "replace") {
            await collection.replaceOne({ "_id": docId }, changeEvent.fullDocument);
        }
    } catch (err) {
        console.log("error performing mongodb write: ", err.message);
    }


    if (changeEvent.operationType === "insert" || changeEvent.operationType === "delete" || changeEvent.operationType === "update" || changeEvent.operationType === "replace") {

        const contactId = changeEvent.fullDocument.contact;
        console.log('contactId : ' + contactId);
        const contractId = changeEvent.fullDocument.contract;
        console.log('contractId : ' + contractId);
        const invoiceId = changeEvent.fullDocument._id;
        console.log('invoiceId : ' + invoiceId);
        //console.log('================================> 1');
        //update the contact totalInvoicedAmount in the contacts collection
        const contactsCollection = context.services.get(serviceName).db(database).collection("Contacts");
        const invoicesCollection = context.services.get(serviceName).db(database).collection("Invoices");
        const receiptsCollection = context.services.get(serviceName).db(database).collection("Receipts");
        //console.log('================================> 2');
        const contact = await contactsCollection.findOne({ "_id": contactId });
        //console.log('================================> 3');
        if (contact) {
            //get the sum of all invoices for this contact
            let contactInvoices = await invoicesCollection.find({ "contact": contactId, "deleted": false }).toArray();
            //console.log('================================> 4');
            let clientReceipts = await receiptsCollection.find({ "contact": contactId, "deleted": false }).toArray();
            //console.log('================================> 5');
            let totalInvoicedAmount = 0;
            let totalPaidAmount = 0;
            for (let i = 0; i < contactInvoices.length; i++) {
                totalInvoicedAmount += contactInvoices[i].legalMonetaryTotal.payableAmount;
            }
            //console.log('================================> 6');
            for (let i = 0; i < clientReceipts.length; i++) {
                totalPaidAmount += clientReceipts[i].receiptAmount;
            }
            //console.log('================================> 7');

            //update the contact totalInvoicedAmount
            //contact.contactTotalBalance = sum(invoice.legalMonetaryTotal.payableAmount) - sum(receipt.receiptAmount)
            await contactsCollection.updateOne({ "_id": contactId }, { "$set": { "totalInvoicedAmount": totalInvoicedAmount, "contactTotalReceipt": totalPaidAmount, "contactTotalBalance": totalInvoicedAmount - totalPaidAmount } });
            //console.log('================================> 7');
        }

        if (contractId && contractId != "" && contractId != null && contractId != undefined) {
            //get the sum of all invoices for this contract
            //console.log('================================> 9');
            const contractsCollection = context.services.get(serviceName).db(database).collection("Contracts");
            //console.log('================================> 10');
            const contract = await contractsCollection.findOne({ "_id": contractId });
            //console.log('================================> 11');
            if (contract) {
                let contractInvoices = await invoicesCollection.find({ "contract": contractId, "deleted": false }).toArray();
                //console.log('================================> 12');
                let contractReceipts = await receiptsCollection.find({ "contract": contractId, "deleted": false }).toArray();
                //console.log('================================> 13');
                let totalInvoicedAmount = 0;
                let totalPaidAmount = 0;
                for (let i = 0; i < contractInvoices.length; i++) {
                    totalInvoicedAmount += contractInvoices[i].legalMonetaryTotal.payableAmount;
                }
                //console.log('================================> 14');
                for (let i = 0; i < contractReceipts.length; i++) {
                    totalPaidAmount += contractReceipts[i].receiptAmount;
                }
                //console.log('================================> 15');
                //-----update the contract invoicedAmount
                //contractAmount
                //contractBalance ??
                //contractReminingAmount ??
                //contractTotalReceipts
                //contractTotalInvoiced
                let contractReminingAmount = contract.contractAmount - totalPaidAmount;
                let contractBalance = totalInvoicedAmount - totalPaidAmount;
                await contractsCollection.updateOne({ "_id": contractId }, { "$set": { "contractTotalInvoiced": totalInvoicedAmount, "contractTotalReceipts": totalPaidAmount, "contractReminingAmount": contractReminingAmount, "contractBalance": contractBalance } });
            }
        }
    }


};



