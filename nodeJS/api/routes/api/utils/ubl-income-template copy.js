var id = '14666120';
var uuid='ba492a3e-f514-43ac-b572-b973f57fbaba';
var issuedDate= '2023-03-06';
var InvoiceTypeCode_name = "011";
var InvoiceTypeCode_type="388";
var currency= "JO";
var AdditionalDocumentReference_id= "ICV";
var AdditionalDocumentReference_uuid = "c7340829-c3ef-410a-ba44-10f09c27c72e";
var companyId= "22206140";
var registrationName = "ثناء اسماعيل وعبد الله العتيب";
var PartyIdentification_schemeID_type= "NIN"; 
var PartyIdentification_schemeID_id= "9801026692"; 
var PostalZone = "33554"; 
var CountrySubentityCode = "JO-AM"; 
var Telephone = "+962789129394"; 
var SellerSupplierParty_PartyIdentification_id= "14666120"; 
var invoice_AllowanceCharge_value= "0.000";
var TaxExclusiveAmount = "1.000"; 
var TaxInclusiveAmount= "1.000";  
var AllowanceTotalAmount = "0.000"
var PayableAmount = "1.000";  



let items = [{ description: 'Jan Invoice', unitPrice: 68, qty: 1, allowance: 0 },
{ description: 'Feb Invoice', unitPrice: 100, qty: 1, allowance: 1 },
{ description: 'March Invoice', unitPrice: 80, qty: 1, allowance: 2 }];

let invoiceLines = items.map(item => {return `<cac:InvoiceLine>
<cbc:ID>1</cbc:ID>
<cbc:InvoicedQuantity unitCode="PCE">${item.qty}</cbc:InvoicedQuantity>
<cbc:LineExtensionAmount currencyID="${currency}">${(item.qty * item.unitPrice - item.allowance).toFixed(3)}</cbc:LineExtensionAmount>
<cac:Item>
  <cbc:Name>${item.description}</cbc:Name>
</cac:Item>
<cac:Price>
  <cbc:PriceAmount currencyID="${currency}">${item.unitPrice.toFixed(3)}</cbc:PriceAmount>
  <cac:AllowanceCharge>
    <cbc:ChargeIndicator>false</cbc:ChargeIndicator>
    <cbc:AllowanceChargeReason>DISCOUNT</cbc:AllowanceChargeReason>
    <cbc:Amount currencyID="${currency}">${item.allowance.toFixed(3)}</cbc:Amount>
  </cac:AllowanceCharge>
</cac:Price>
</cac:InvoiceLine>`}).join("\n");


var incomeInvoiceXML= `
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
      <cac:PostaslAddress>
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
    <cbc:Amount currencyID="${currency}">${invoice_AllowanceCharge_value.toFixed(3)}</cbc:Amount>
  </cac:AllowanceCharge>
  <cac:LegalMonetaryTotal>
  incomeSourceSequence
    <cbc:TaxExclusiveAmount currencyID="${currency}">${TaxExclusiveAmount.toFixed(3)}</cbc:TaxExclusiveAmount>
    <cbc:TaxInclusiveAmount currencyID="${currency}">${TaxInclusiveAmount.toFixed(3)}</cbc:TaxInclusiveAmount>
    <cbc:AllowanceTotalAmount currencyID="${currency}">${AllowanceTotalAmount.toFixed(3)}</cbc:AllowanceTotalAmount>
    <cbc:PayableAmount currencyID="${currency}">${PayableAmount.toFixed(3)}</cbc:PayableAmount>
  </cac:LegalMonetaryTotal>
${invoiceLines}
</Invoice>`;



console.log(incomeInvoiceXML);