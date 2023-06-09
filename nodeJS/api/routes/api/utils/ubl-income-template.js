var base64 = require("base-64");
const axios = require("axios");
const https = require("https");
var utf8 = require("utf8");
const { Console } = require("console");
const Invoice = require("../invoices/models/Invoice");

function getInvoiceDate(issuedDate) {
  let x = issuedDate.toString();
  let d = new Date(x);
  let str =
    d.getFullYear() +
    "-" +
    (d.getMonth().length == 2
      ? parseInt(d.getMonth()) + 1
      : "0" + (parseInt(d.getMonth()) + 1)) +
    "-" +
    (d.getDate().length == 2 ? d.getDate() : "0" + d.getDate());
  return str;
}

async function postToTax(invoice, user) {
  return new Promise((resolve, reject) => {

    if (invoice.status == "posted") {
      reject("Invoice already posted");
    }

    console.log("insert post to tax method .......");

    let xml = toXml(invoice);
    let req = toBase64(xml).trim();
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
    });

    let headers = {
      "Client-Id": user.companyClientId,
      "Secret-Key": user.companyClientSecret,
      "Content-Type": "application/json",
      Cookie:
        "stickounet=4fdb7136e666916d0e373058e9e5c44e|7480c8b0e4ce7933ee164081a50488f1",
    };
    //console.log(headers);
    axios
      .post("https://backend.jofotara.gov.jo/core/invoices/", req, {
        httpsAgent,
        headers: headers,
        crossdomain: true,
      })
      .then(async (res) => {
        console.log("=====> res data:");
        console.log(res.data);
        var result = res.data;
        var newStatus = "";
        newStatus = result.EINV_RESULTS.status == "PASS" ? "posted" : "stuck";
        let _postedXml = xml;
        let _encryptPostedXML = req;
        if (process.env.INCLUDE_REQUEST !== true) {
          _encryptPostedXML = "";
        }


        await Invoice.findOneAndUpdate(
          { _id: invoice._id },
          {
            status: newStatus,
            postedXML: _postedXml,
            encryptPostedXML: _encryptPostedXML,
            responseXML: JSON.stringify(result),
          }
        );

        console.log(
          "Saved Post invoice to Tax ........., result.EINV_RESULTS.status: " + result.EINV_RESULTS.status
        );
        resolve(result);

      })
      .catch((e) => {
        if (e.response && e.response.status === 403) {
          console.log("Unauthorized");
          reject("Unauthorized")
        } else {
          console.log("=====> catch");
          console.log(JSON.stringify(e.stack));
          reject(JSON.stringify(e.stack));
        }
      });

    console.log(xml);
    console.log(req);
  });
}

function checkJSONProperty(obj, path, defaultValue) {
  let lvl = obj;
  let levels = path.split(".");
  levels.forEach((l) => {
    lvl = lvl[l];
    if (!lvl) {
      return defaultValue;
    }
  });
  if (lvl) {
    return lvl;
  } else {
    return defaultValue;
  }
}

function toXml(invoice) {
  var id = checkJSONProperty(
    invoice,
    "sellerSupplierPartyIdentification.id",
    0
  ); // "14666120";
  console.log("id:" + id);
  var uuid = checkJSONProperty(invoice, "seqNumber", invoice.uuid); //"ba492a3e-f514-43ac-b572-b973f57fbaba";
  console.log("uuid:" + uuid);
  var issuedDate = getInvoiceDate(invoice.issuedDate); //"2023-03-06";
  console.log("issuedDate:" + issuedDate);
  var InvoiceTypeCode_name = checkJSONProperty(invoice, "invoiceType", "011"); //"011";
  console.log("InvoiceTypeCode_name:" + InvoiceTypeCode_name);
  var InvoiceTypeCode_type = checkJSONProperty(
    invoice,
    "invoiceTypeCode",
    "388"
  ); //"388";
  console.log("InvoiceTypeCode_type:" + InvoiceTypeCode_type);
  var currency = checkJSONProperty(invoice, "currencyCode", "JO"); // "JO";
  console.log("currency:" + currency);
  var AdditionalDocumentReference_id = checkJSONProperty(
    invoice,
    "additionalDocumentReference.id",
    "ICV"
  );
  console.log(
    "AdditionalDocumentReference_id::" + AdditionalDocumentReference_id
  );
  var AdditionalDocumentReference_uuid = checkJSONProperty(
    invoice,
    "additionalDocumentReference.uuid",
    "0"
  );
  console.log(
    "AdditionalDocumentReference_uuid:" + AdditionalDocumentReference_uuid
  );
  var companyId = checkJSONProperty(
    invoice,
    "accountingSupplierParty.partyTaxScheme.companyID",
    "0"
  );
  var registrationName = checkJSONProperty(
    invoice,
    "accountingSupplierParty.partyTaxScheme.registrationName",
    ""
  );
  //static value will removed after test
  //registrationName = "ثناء اسماعيل وعبد الله العتيبي";
  console.log("companyId:" + companyId);
  var PartyIdentification_schemeID_type = checkJSONProperty(
    invoice,
    "accountingCustomerParty.partyIdentification.schemeID",
    "NIN"
  );
  var PartyIdentification_schemeID_id = checkJSONProperty(
    invoice,
    "accountingCustomerParty.partyIdentification.value",
    ""
  ); //"9801026692";
  console.log(
    "PartyIdentification_schemeID_id:" + PartyIdentification_schemeID_id
  );
  var PostalZone = checkJSONProperty(
    invoice,
    "accountingCustomerParty.postalAddress.postalZone",
    ""
  ); // "33554";
  var Telephone = checkJSONProperty(
    invoice,
    "accountingCustomerParty.telephone",
    ""
  ); //"+962789129394";

  //static value needs to remove after test
  //Telephone = "+962789129394";
  var SellerSupplierParty_PartyIdentification_id = checkJSONProperty(
    invoice,
    "sellerSupplierPartyIdentification.id",
    ""
  ); // "14666120";
  var invoice_AllowanceCharge_value = checkJSONProperty(
    invoice,
    "legalMonetaryTotal.allowanceTotalAmount",
    0.0
  ); //"0.000"

  console.log("invoice_AllowanceCharge_value:" + invoice_AllowanceCharge_value);
  var TaxExclusiveAmount = checkJSONProperty(
    invoice,
    "legalMonetaryTotal.taxExclusiveAmount",
    0.0
  ); //"1.000";
  console.log("TaxExclusiveAmount:" + TaxExclusiveAmount);
  var TaxInclusiveAmount = checkJSONProperty(
    invoice,
    "legalMonetaryTotal.taxInclusiveAmount",
    0.0
  ); //"1.000";
  console.log("TaxInclusiveAmount:" + TaxInclusiveAmount);
  var AllowanceTotalAmount = checkJSONProperty(
    invoice,
    "legalMonetaryTotal.allowanceTotalAmount",
    0.0
  ); // "0.000";

  console.log("AllowanceTotalAmount:" + AllowanceTotalAmount);
  var PayableAmount = checkJSONProperty(
    invoice,
    "legalMonetaryTotal.payableAmount",
    0.0
  ); //"1.000";

  console.log("PayableAmount:" + PayableAmount);
  // description--> itemName ,  unitPrice-> unitPrice, qty -->qty allowance -->allowance

  var note = checkJSONProperty(
    invoice,
    "note",
    ""
  );

  var clientName = checkJSONProperty(invoice, "accountingCustomerParty.registrationName", "");

  console.log("note:::" + note);

  let invoiceLines = invoice.items
    .map((item) => {
      return `<cac:InvoiceLine>
<cbc:ID>${item.sequance}</cbc:ID>
<cbc:InvoicedQuantity unitCode="PCE">${item.qty}</cbc:InvoicedQuantity>
<cbc:LineExtensionAmount currencyID="${currency}">${item.lineExtensionAmount.toFixed(
        3
      )}</cbc:LineExtensionAmount>
<cac:Item>
  <cbc:Name>${item.itemName}</cbc:Name>
</cac:Item>
<cac:Price>
  <cbc:PriceAmount currencyID="${currency}">${item.unitPrice.toFixed(
        3
      )}</cbc:PriceAmount>
  <cac:AllowanceCharge>
    <cbc:ChargeIndicator>false</cbc:ChargeIndicator>
    <cbc:AllowanceChargeReason>DISCOUNT</cbc:AllowanceChargeReason>
    <cbc:Amount currencyID="${currency}">${item.allowance.toFixed(
        3
      )}</cbc:Amount>
  </cac:AllowanceCharge>
</cac:Price>
</cac:InvoiceLine>`;
    })
    .join("\n");

  var incomeInvoiceXML = `<?xml version="1.0" encoding="UTF-8"?>
  <Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2" xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2" xmlns:ext="urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2">
  <cbc:ProfileID>reporting:1.0</cbc:ProfileID>
  <cbc:ID>${id}</cbc:ID>
  <cbc:UUID>${uuid}</cbc:UUID>
  <cbc:IssueDate>${issuedDate}</cbc:IssueDate>
  <cbc:InvoiceTypeCode name="${InvoiceTypeCode_name}">${InvoiceTypeCode_type}</cbc:InvoiceTypeCode>
  <cbc:Note>${note}</cbc:Note>
  <cbc:DocumentCurrencyCode>${currency}</cbc:DocumentCurrencyCode>
  <cbc:TaxCurrencyCode>${currency}</cbc:TaxCurrencyCode>
  <cac:AdditionalDocumentReference>
    <cbc:ID>${AdditionalDocumentReference_id}</cbc:ID>
    <cbc:UUID>${AdditionalDocumentReference_uuid}</cbc:UUID>
  </cac:AdditionalDocumentReference>
  <cac:AccountingSupplierParty>
    <cac:Party>
      <cac:PostalAddress>
        <cac:Country>
       <cbc:IdentificationCode>${currency}</cbc:IdentificationCode>
        </cac:Country>
      </cac:PostalAddress>
      <cac:PartyTaxScheme>
        <cbc:CompanyID>${companyId}</cbc:CompanyID>
        <cac:TaxScheme>
          <cbc:ID>VAT</cbc:ID>
        </cac:TaxScheme>
      </cac:PartyTaxScheme>
      <cac:PartyLegalEntity>
        <cbc:RegistrationName>${registrationName}</cbc:RegistrationName>
      </cac:PartyLegalEntity>
    </cac:Party>
  </cac:AccountingSupplierParty>
  <cac:AccountingCustomerParty>
    <cac:Party>
      <cac:PartyIdentification>
        <cbc:ID schemeID="${PartyIdentification_schemeID_type}">${PartyIdentification_schemeID_id}</cbc:ID>
      </cac:PartyIdentification>
      <cac:PostalAddress>
        <cbc:PostalZone>${PostalZone}</cbc:PostalZone>
        <cac:Country>
        <cbc:IdentificationCode>JO</cbc:IdentificationCode>
        </cac:Country>
      </cac:PostalAddress>
      <cac:PartyTaxScheme>
        <cac:TaxScheme>
          <cbc:ID>VAT</cbc:ID>
        </cac:TaxScheme>
      </cac:PartyTaxScheme>
      <cac:PartyLegalEntity>
        <cbc:RegistrationName>${clientName}
        </cbc:RegistrationName>
      </cac:PartyLegalEntity>
    </cac:Party>
    <cac:AccountingContact>
      <cbc:Telephone>${Telephone}</cbc:Telephone>
    </cac:AccountingContact>
  </cac:AccountingCustomerParty>
  <cac:SellerSupplierParty>
    <cac:Party>
      <cac:PartyIdentification>
        <cbc:ID>${SellerSupplierParty_PartyIdentification_id}</cbc:ID>
      </cac:PartyIdentification>
    </cac:Party>
  </cac:SellerSupplierParty>
  <cac:AllowanceCharge>
    <cbc:ChargeIndicator>false</cbc:ChargeIndicator>
    <cbc:AllowanceChargeReason>discount</cbc:AllowanceChargeReason>
    <cbc:Amount currencyID="${currency}">${invoice_AllowanceCharge_value.toFixed(
    3
  )}</cbc:Amount>
  </cac:AllowanceCharge>
  <cac:LegalMonetaryTotal>
    <cbc:TaxExclusiveAmount currencyID="${currency}">${TaxExclusiveAmount.toFixed(
    3
  )}</cbc:TaxExclusiveAmount>
    <cbc:TaxInclusiveAmount currencyID="${currency}">${TaxInclusiveAmount.toFixed(
    3
  )}</cbc:TaxInclusiveAmount>
    <cbc:AllowanceTotalAmount currencyID="${currency}">${AllowanceTotalAmount.toFixed(
    3
  )}</cbc:AllowanceTotalAmount>
    <cbc:PayableAmount currencyID="${currency}">${PayableAmount.toFixed(
    3
  )}</cbc:PayableAmount>
  </cac:LegalMonetaryTotal>
${invoiceLines}
</Invoice>`;

  console.log(incomeInvoiceXML);
  return incomeInvoiceXML;
}

function toBase64(xml) {
  var bytes = utf8.encode(xml);
  var encoded = base64.encode(bytes);

  var req = '{"invoice": "' + encoded + '"}';
  //req.invoice = encodedData;
  //console.log(req);
  return req;
}

module.exports = postToTax;
