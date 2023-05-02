var base64 = require("base-64");
const axios = require("axios");
const  https = require("https");
var utf8 = require('utf8');
const { Console } = require("console");

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
    d.getDate();
  return str;
}

function postToTax(invoice, user) {
  //let testInvoiceString = `{"additionalDocumentReference":{"id":"ICV","uuid":"09cf860f-75d8-4b6a-b3c9-6f7362a6f603"},"accountingSupplierParty":{"postalAddress":{"identificationCode":"JO"},"partyTaxScheme":{"companyID":"22206140","taxSchemeId":"VAT","registrationName":"Brother company"}},"accountingCustomerParty":{"partyIdentification":{"schemeID":"NIN","value":""},"postalAddress":{"postalZone":"","countrySubentityCode":""},"taxSchemeId":"VAT","registrationName":"","telephone":""},"sellerSupplierPartyIdentification":{"id":"14666120"},"allowanceCharge":{"chargeIndicator":false,"allowanceChargeReason":"","amount":0},"legalMonetaryTotal":{"taxExclusiveAmount":0.25,"taxInclusiveAmount":0.2,"allowanceTotalAmount":0.05,"payableAmount":0.2},"_id":"644d9da78421836b8d9187f6","invoiceUUID":"f1027da3-e4e8-4a42-8095-a882db84186b","invoiceCategory":"Income","issuedDate":"2023-04-29T22:42:51.973Z","invoiceTypeCode":"388","invoiceType":"011","currencyCode":"JO","items":[{"id":1682808183483,"sequance":1,"unitPrice":0.1,"qty":1,"allowance":0,"lineExtensionAmount":0.1,"itemName":"item1","chargeIndicator":false,"allowanceChargeReason":"DISCOUNT","_id":"644d9da78421836b8d9187f4"},{"id":1682808198092,"sequance":2,"unitPrice":0.15,"qty":1,"allowance":0.05,"lineExtensionAmount":0.1,"itemName":"item2","chargeIndicator":true,"allowanceChargeReason":"DISCOUNT","_id":"644d9da78421836b8d9187f5"}],"deleted":false,"user":{"_id":"6233a6d646c9bd3e8bfb8dda","email":"osama.kofahi@gmail.com","registerDate":"2022-03-17T21:23:34.279Z","__v":0,"avatarUrl":"proff2.webp","roles":["62333be769abb5a35233feb1"],"active":true,"firstName":"Osama","surName":"Al Kofahi","phone":"+962 789 12 9394","countryCode":"TR","address":"Avcilar","otp":"dsdsadsf5ds6fsd5f6sd5f4sdf","emailConfirmed":true,"shippingCompany":null,"vendor":"63efff7a42de79c862bc2ef5","company":"64198cc7309971483879c665"},"invoicePosted":false,"postedXML":"","responseXML":"","serialNumber":8,"seqNumber":"INV-00008","status":"new","createdDate":"2023-04-29T22:43:51.334Z","__v":0}`;
  //let testInvoice = JSON.parse(testInvoiceString);
  //invoice = testInvoice;

  let xml = toXml(invoice);
  let req = toBase64(xml).trim();
  const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
  });

  let headers = {
    "Client-Id": user.companyClientId,
    "Secret-Key": user.companyClientSecret,
    "Content-Type":"application/json",
    "Cookie":"stickounet=4fdb7136e666916d0e373058e9e5c44e|7480c8b0e4ce7933ee164081a50488f1",

  };
  console.log(headers);
  axios
    .post("https://backend.jofotara.gov.jo/core/invoices/", req, {
      httpsAgent,
      headers: headers,
      crossdomain: true,
    })
    .then((res) => 
    {
      console.log('=====> res data');
      //console.log(res);

    })
    .catch((e) => {
      if (e.response && e.response.status === 403) {
        console.log('Unauthorized');
      } else {
        console.log('=====> catch');
       console.log(JSON.stringify(e.stack));
      }
    });

  console.log(xml);
  console.log(req);
}

function checkJSONProperty(obj, path, defaultValue) {
  let lvl = obj;
  let levels = path.split(".");
  //levels = levels.slice(1,levels.length);
  levels.forEach(l => {
      lvl = lvl[l];
      if(!lvl){
          return defaultValue;
      }
  })
  if (lvl) {
      return lvl;
  } else {
      return defaultValue;
  }
}


function toXml(invoice) {
 

  var id = checkJSONProperty(invoice, "sellerSupplierPartyIdentification.id", 0); // "14666120";
  console.log("id:" +id) ; 
  var uuid = checkJSONProperty(invoice,"invoiceUUID", "0"); //"ba492a3e-f514-43ac-b572-b973f57fbaba";
  console.log("uuid:" +uuid) ;
  var issuedDate = getInvoiceDate(invoice.issuedDate); //"2023-03-06";
  console.log("issuedDate:" +issuedDate) ;
  var InvoiceTypeCode_name = checkJSONProperty(invoice,"invoiceType", "011") ; //"011";
  console.log("InvoiceTypeCode_name:" +InvoiceTypeCode_name) ;
  var InvoiceTypeCode_type = checkJSONProperty(invoice,"invoiceTypeCode" ,"388") ; //"388";
  console.log("InvoiceTypeCode_type:" +InvoiceTypeCode_type) ;
  var currency = checkJSONProperty(invoice, "currencyCode", "JO") ; // "JO";
  console.log("currency:" +currency) ;
  var AdditionalDocumentReference_id = checkJSONProperty(invoice,
    "additionalDocumentReference.id",
    "ICV"
  );
  console.log("AdditionalDocumentReference_id::" +AdditionalDocumentReference_id) ;
  var AdditionalDocumentReference_uuid = checkJSONProperty(invoice,
    "additionalDocumentReference.uuid",
    "0"
  );
  console.log( "AdditionalDocumentReference_uuid:" +AdditionalDocumentReference_uuid)
  var companyId = checkJSONProperty(invoice,
    "accountingSupplierParty.partyTaxScheme.companyID",
    "0"
  );
  var registrationName = checkJSONProperty(invoice,
    "accountingSupplierParty.partyTaxScheme.registrationName",
    ""
  );
  console.log("companyId:" +companyId) ; 
  var PartyIdentification_schemeID_type = checkJSONProperty(invoice,
    "accountingCustomerParty.partyIdentification.schemeID",
    "NIN"
  );
  var PartyIdentification_schemeID_id = checkJSONProperty(invoice,
    "accountingCustomerParty.partyIdentification.value",
    ""
  ); //"9801026692";
  console.log("PartyIdentification_schemeID_id:" +PartyIdentification_schemeID_id) ;
  var PostalZone = checkJSONProperty(invoice,
    "accountingCustomerParty.postalAddress.postalZone",
    "33554"
  ); // "33554";
  var CountrySubentityCode = checkJSONProperty(invoice,
    "accountingCustomerParty.postalAddress.countrySubentityCode",
    "JO-AM"
  ); //"JO-AM";
  console.log("CountrySubentityCode:" +CountrySubentityCode
  )
  var Telephone = checkJSONProperty(invoice,
    "accountingCustomerParty.telephone",
    ""
  ); //"+962789129394";
  var SellerSupplierParty_PartyIdentification_id = checkJSONProperty(invoice,
    "sellerSupplierPartyIdentification.id",
    ""
  ); // "14666120";
  var invoice_AllowanceCharge_value = checkJSONProperty(invoice,
    "legalMonetaryTotal.allowanceTotalAmount",
    0.000
  ); //"0.000"

  console.log("invoice_AllowanceCharge_value:" +invoice_AllowanceCharge_value) ;
  var TaxExclusiveAmount = checkJSONProperty(invoice,
    "legalMonetaryTotal.taxExclusiveAmount",
    0.000
  ); //"1.000";
  console.log("TaxExclusiveAmount:" +TaxExclusiveAmount) ;
  var TaxInclusiveAmount = checkJSONProperty(invoice,
    "legalMonetaryTotal.taxInclusiveAmount",
    0.000
  ); //"1.000";
  console.log("TaxInclusiveAmount:" +TaxInclusiveAmount) ;
  var AllowanceTotalAmount = checkJSONProperty(invoice,
    "legalMonetaryTotal.allowanceTotalAmount",
    0.000
  ); // "0.000";

  console.log("AllowanceTotalAmount:" +AllowanceTotalAmount)
  var PayableAmount = checkJSONProperty(invoice,
    "legalMonetaryTotal.payableAmount",
    0.000
  ); //"1.000";

  console.log("PayableAmount:" +PayableAmount) ;
  // description--> itemName ,  unitPrice-> unitPrice, qty -->qty allowance -->allowance


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

  var incomeInvoiceXML = `
<Invoice xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" 
xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2"
 xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2">
  <cbc:ProfileID>reporting:1.0</cbc:ProfileID>
  <cbc:ID>${id}</cbc:ID>
  <cbc:UUID>${uuid}</cbc:UUID>
  <cbc:IssueDate>${issuedDate}</cbc:IssueDate>
  <cbc:InvoiceTypeCode name="${InvoiceTypeCode_name}">${InvoiceTypeCode_type}</cbc:InvoiceTypeCode>
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
        <cbc:CountrySubentityCode>${CountrySubentityCode}</cbc:CountrySubentityCode>
      </cac:PostalAddress>
      <cac:PartyTaxScheme>
        <cac:TaxScheme>
          <cbc:ID>VAT</cbc:ID>
        </cac:TaxScheme>
      </cac:PartyTaxScheme>
      <cac:PartyLegalEntity />
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


  var req = "{\"invoice\": \"" + encoded + "\"}";
  //req.invoice = encodedData;
  //console.log(req);
  return req;
}

module.exports = postToTax;
