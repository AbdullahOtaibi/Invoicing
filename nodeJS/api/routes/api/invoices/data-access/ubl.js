//import { Invoice } from 'ubl-builder';
const { Invoice, UdtTypes } = require("ubl-builder");
const { AccountingSupplierParty, Party, PartyIdentification } = require("ubl-builder/lib/ubl21/CommonAggregateComponents");
const { UdtCode } = require("ubl-builder/lib/ubl21/types/UnqualifiedDataTypes");
const { v4: uuidv4 } = require('uuid');


function getInvoiceXML(invoiceModel) {
    const invoice = new Invoice('123456789', {});
    invoice.addProperty('xmlns', 'urn:oasis:names:specification:ubl:schema:xsd:Invoice-2');

    invoice.addProperty('cac', 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2');
    invoice.addProperty('cbc', 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2');
    
    invoice.addTaxTotal({});
    invoice.setID("14666120");
    invoice.setUUID(uuidv4());
    invoice.setProfileID("reporting:1.0");
    
    invoice.setIssueDate('2023-03-06');
    
    invoice.setInvoiceTypeCode('388',{name:'011'});
    invoice.setDocumentCurrencyCode('JO');
    invoice.setTaxCurrencyCode('JO');
    invoice.addAdditionalDocumentReference({id:'ICV', uuid:uuidv4()});


    const accountingSupplierParty = new AccountingSupplierParty();
    
    //p.setPostalAddress({});
    // var p =   accountingSupplierParty.getParty() 
     let p = new Party();
    
     //p.assignContent("PotsalAddress")
     accountingSupplierParty.setParty(p);
    

    invoice.setAccountingSupplierParty(accountingSupplierParty);
    


    //**************************************** */



   

    //********************************************** */
    
    console.log(invoice.getXml());
    return invoice.getXml();

};

module.exports = getInvoiceXML;



