import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { createInvoice } from "./InvoicesAPI";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Loader from "react-loader-spinner";
import { Editor } from "@tinymce/tinymce-react";
import { MdAdd, MdDelete } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { event } from "jquery";

const CreateInvoice = (props) => {
  const [invoice, setInvoice] = useState({
    items: [],
    invoiceCategory: "Income",
    invoiceType: "", 
    invoiceTypeCode: "388",
    currencyCode: "JO",
    issuedDate: new Date() ,
    invoiceUUID: uuidv4(),
    AdditionalDocumentReference: { id: "ICV", uuid: uuidv4() },
    postalAddress: { identificationCode: "JO" },
    AccountingSupplierParty: {
      postalAddress: { identificationCode: "JO" },
      partyTaxScheme: {
        companyID: "22206140",
        taxSchemeId: "VAT",
        registrationName: "registrationName comp",
      } 
    }, 
    accountingCustomerParty: {
      partyIdentification: { schemeID: "NIN", value: "" },
      //sample date: postalZone: "33554", countrySubentityCode: "JO-AM"
      postalAddress: { postalZone: "", countrySubentityCode: "" },
      taxSchemeId: "VAT",
      registrationName: "", 
      telephone: "",
    },
    sellerSupplierPartyIdentification: { id: "14666120" },
    allowanceCharge: {
      chargeIndicator: false,
      allowanceChargeReason: "",
      amount: 0.0,
    },
  });

  const [loading, setLoading] = useState(false);
  const { invoiceId } = useParams();
  const[PlaceHolderIdentificationType, updatePlaceHolderIdentificationType ] =useState('National ID');
  const[wasValidated, setWasValidated] = useState(false) ; 
  const[checkCustomerNameIsRequired,setCheckCustomerNameIsRequired] =useState(false); 
  const { t } = useTranslation();
  let seq = 1;

  const [currentEditableItem, setCurrentEditableItem] = useState({
    unitPrice: 0,
    allowance: 0,
  });

  const updateDescription = (event) => {
    let cloned = JSON.parse(JSON.stringify(currentEditableItem));
    cloned.description = event.target.value;
    setCurrentEditableItem(cloned);
  };

  const updateUnitPrice = (event) => {
    let cloned = JSON.parse(JSON.stringify(currentEditableItem));
    cloned.unitPrice = event.target.value;
    setCurrentEditableItem(cloned);
  };

  const updateQty = (event) => {
    let cloned = JSON.parse(JSON.stringify(currentEditableItem));
    cloned.qty = event.target.value;
    setCurrentEditableItem(cloned);
  };

  const updateAllowance = (event) => {
    let cloned = JSON.parse(JSON.stringify(currentEditableItem));
    cloned.allowance = event.target.value;
    setCurrentEditableItem(cloned);
  };

  const updateInvoiceType = (event) => {
  let cloned = JSON.parse(JSON.stringify(invoice));
    cloned.invoiceType = event.target.value;
   setInvoice(cloned);
   if(cloned.invoiceType == "021" || taxInclusiveAmount() > 1000 )
    setCheckCustomerNameIsRequired(true); 
   else
   setCheckCustomerNameIsRequired(false); 
   
  };

  

  const updateCustomerName = (event) => 
  {
    let cloned = JSON.parse(JSON.stringify(invoice));
    cloned.accountingCustomerParty.registrationName = event.target.value;
   setInvoice(cloned);
  };

  const updateAccountingCustomerParty_schemeID =(event) => {
    let cloned = JSON.parse(JSON.stringify(invoice));
    cloned.accountingCustomerParty.partyIdentification.schemeID  = event.target.value;
   setInvoice(cloned);  
  }

  const setPhoneNumber = (event) => {
   
    let cloned = JSON.parse( JSON.stringify(invoice));
    cloned.accountingCustomerParty.telephone = event.target.value;
    setInvoice(cloned) ;

  } 

  
  useEffect(() => {

    console.log( 'use effect' + invoice.accountingCustomerParty.partyIdentification.schemeID + "xyz")
    if(invoice.accountingCustomerParty.partyIdentification.schemeID == 'NIN')
     updatePlaceHolderIdentificationType("National ID");
      else if(invoice.accountingCustomerParty.partyIdentification.schemeID == 'PN')
      updatePlaceHolderIdentificationType("Passport")
      else if(invoice.accountingCustomerParty.partyIdentification.schemeID == 'TN')
      updatePlaceHolderIdentificationType("Tax Identification No,")
      else 
      updatePlaceHolderIdentificationType("")

  }, [updateAccountingCustomerParty_schemeID]);
  

  const updateAccountingCustomerParty_value = (event) => 
  {
    let cloned = JSON.parse(JSON.stringify(invoice));
    cloned.accountingCustomerParty.partyIdentification.value  = event.target.value;
   setInvoice(cloned); 
  }

  const updateIssuedDate = (date) => {
    let cloned = JSON.parse(JSON.stringify(invoice)) ;
    cloned.issuedDate =date; 
    setInvoice(cloned) ;

  }

  const fieldClass = (value) => {
    if(!wasValidated)
    return 'form-control';
    return value?'form-control is-valid':'form-control is-invalid';
}



useEffect(() => {
  console.log(JSON.stringify(invoice)) ;
},[invoice])


useEffect( ()=> {
    if(taxInclusiveAmount() > 1000  )
    {
     setCheckCustomerNameIsRequired(true); 
    }

} , invoice);




  function isBlank(str) {
    return !str || /^\s*$/.test(str);
  }

  const addItem = (event) => {
    // if (!event.target.parent.checkValidity()) {
    //     event.preventDefault()
    //     event.stopPropagation()
    //   }

    if (isBlank(currentEditableItem.description)) {
      toast.error("fill the  description");
      return;
    }

    if (
      isBlank(currentEditableItem.unitPrice) ||
      currentEditableItem.unitPrice <= 0
    ) {
      toast.error("check unit price");
      return;
    }
    if (isBlank(currentEditableItem.qty) || currentEditableItem.qty <= 0) {
      toast.error("check unit quantity");
      return;
    }

    let cloned = JSON.parse(JSON.stringify(invoice));
    cloned.items.push({ id: new Date().getTime(), ...currentEditableItem });
    setCurrentEditableItem({
      description: "",
      unitPrice: null,
      qty: 1,
      allowance: 0,
    });
    setInvoice(cloned);
  };

  const removeItem = (id) => {
    let cloned = JSON.parse(JSON.stringify(invoice));
    cloned.items = cloned.items.filter((item) => item.id != id);
    setInvoice(cloned);
  };

  const doPost = (data) => {
    setWasValidated(true);
    return; 
    if (invoice.items.length == 0) {
      return;
    }

    if (isBlank(invoice.invoiceType)) {
      toast.error("fill the invoice type");
      return;
    }

    setLoading(true);
    invoice.legalMonetaryTotal = {
      taxExclusiveAmount: totalTaxExclusiveAmount(),
      taxInclusiveAmount: taxInclusiveAmount(),
      allowanceTotalAmount: totalAllowance(),
      payableAmount: totalPayableAmount(),
    };
    
    

    createInvoice(invoice)
      .then((res) => {
        setLoading(false);
        toast.success(t("succeed"));
        //setInvoice(res.data);
        window.location.href = "/admin/invoices/edit/" + res.id;
      })
      .catch((e) => {
        setLoading(false);
      });
    console.log(invoice);
    console.log(data);
  };

  const totalTaxExclusiveAmount = () => {
    let amount = 0;
    invoice.items.forEach((item) => {
      amount += parseFloat(item.unitPrice * item.qty);
    });
    return amount;
  };

  const taxInclusiveAmount = () => {
    let amount = 0;
    invoice.items.forEach((item) => {
      amount += parseFloat(item.unitPrice * item.qty);
    });
    return amount;
  };

  const totalPayableAmount = () => {
    let amount = 0;
    invoice.items.forEach((item) => {
      amount += parseFloat(item.unitPrice * item.qty);
    });
    return amount;
  };

  const totalAllowance = () => {
    let totalAllowance = 0;
    invoice.items.forEach((item) => {
      totalAllowance += parseFloat(item.allowance);
    });
    return totalAllowance;
  };

  useEffect(() => {
    "use strict";

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll(".needs-validation");

    // Loop over them and prevent submission
    Array.prototype.slice.call(forms).forEach(function (form) {
      form.addEventListener(
        "submit",
        function (event) {
          if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
          }

          form.classList.add("was-validated");
        },
        false
      );
    });
  }, []);

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">{t("dashboard.createInvoice")}</h5>
        <div className="container text-center">
          <Loader
            type="ThreeDots"
            color="#00BFFF"
            height={100}
            width={100}
            visible={loading}
          />
        </div>
 <br/>
        <form className="needs-validation">
           {/* <h1> checkCustomerNameIsRequired: { checkCustomerNameIsRequired? 'true': 'false'} </h1> */}

          <div className="mb-3 row ">
            <div className="col col-auto text-info">Invoice Summery</div>
            <div className="col">
              <hr />
            </div>
          </div>

          <div className="row totals">
            <div className="mb-3 col ">
              <div className="col col-auto">TaxExclusiveAmount:</div>

              <div className="col">
                JOD {totalTaxExclusiveAmount().toFixed(3)}
              </div>
            </div>

            <div className="mb-3 col ">
              <div className="col col-auto">TaxInclusiveAmount:</div>

              <div className="col">JOD {taxInclusiveAmount().toFixed(3)}</div>
            </div>

            <div className="mb-3 col ">
              <div className="col col-auto">AllowanceTotalAmount:</div>

              <div className="col">JOD {totalAllowance().toFixed(3)}</div>
            </div>

            <div className="mb-3 col ">
              <div className="col col-auto">PayableAmount:</div>

              <div className="col">JOD {totalPayableAmount().toFixed(3)}</div>
            </div>
          </div>

          <div className="mb-3 row ">
            
          <div className="mb-3 col ">
          <div className="col col-auto">Type:</div>


          <div className="col">
                  <select
                    type="text"
                    className={fieldClass(invoice.invoiceType)}
                    id="invoiceType"
                    name="title"
                    onChange={updateInvoiceType}
                  >
                    <option value=""> اخنر </option>
                    <option value="011">انشاء فاتورة جديدة نقدية</option>
                    <option value="021">أنشاء فاتورة ذمم</option>
                  </select>
                </div>
            </div>

        
            
            <div className="mb-3 col ">
              <div className="col col-auto">Invoice Date:</div>

              <div className="col">
             
              <DatePicker  className= {fieldClass(invoice.issuedDate)} dateFormat="dd/MM/yyyy" selected={new Date(invoice.issuedDate)} onChange={(date) => updateIssuedDate(date)} />
              </div>
            </div>


          </div>

          <div className="mb-3 row ">
            <div className="col col-auto text-info">Customer Details  </div>
            <div className="col">
              <hr />
            </div>
          </div>

          <div className="mb-3 row">

          <div className="mb-3 col ">
          <div className="col col-auto">Identification Type:</div>
            <div className="col col-auto">
              <select
                type="text"
                className="form-control"
                id="accountingCustomerParty_schemeID"
                name="accountingCustomerParty_schemeID"
                value={invoice.accountingCustomerParty.partyIdentification.schemeID}
                onChange= { updateAccountingCustomerParty_schemeID }
              >  
                <option value=""> أختر </option>
                <option value="NIN">National ID</option>
                <option value="PN">Passport</option>
                <option value="TN">Tax Identification No,</option>
              </select>
            </div>
          </div>

            <div className="mb-3 col ">
          <div className="col col-auto">Identification Value:</div>
            <div className="col col">
              <input
                type="text"
                className="form-control"
                id="accountingCustomerParty_schemaValue"
                name="accountingCustomerParty_schemaValue"
                placeholder={ PlaceHolderIdentificationType  }
                onChange= {updateAccountingCustomerParty_value}
                
              />
            </div>
            </div>

            <div className="mb-3 col ">
          <div className="col col-auto">Full Name:</div>
            <div className="col">
              <input
                type="text"
                className= { checkCustomerNameIsRequired ? fieldClass(invoice.accountingCustomerParty.registrationName ) : "form-control" }
                id="customerName"
                name="customerName"
                onChange={updateCustomerName}
                placeholder="Full Name"
              />
            </div>
            </div>
            <div className="mb-3 col ">
          <div className="col col-auto">Phone Number:</div>
            <div className="col">
              <input
                type="text"
                className="form-control"
                id="phoneNumber"
                name="phoneNumber"
                value={invoice.accountingCustomerParty.telephone}
                placeholder="Phone Number"
                onChange={setPhoneNumber}
              />
            </div>
            </div>

          </div>

          <div className="mb-3 row ">
            <div className="col col-auto text-info">Items</div>
            <div className="col">
              <hr />
            </div>
          </div>

          <div className="row">
            <div className="col table-responsive">
              <table className="table table-sm needs-validation">
                <thead>
                  <tr className="table-primary">
                    <th>#</th>
                    <th>Description</th>
                    <th>Unit Price</th>
                    <th>Qty.</th>
                    <th>Allowance</th>
                    <th>Subtotal</th>
                    <th>Net</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {invoice.items.map((item) => (
                    <tr>
                      <td> {seq++} </td>
                      <td>{item.description}</td>
                      <td>{item.unitPrice} JOD</td>
                      <td>{item.qty} </td>
                      <td>{item.allowance} JOD </td>
                      <td>{item.unitPrice * item.qty} JOD</td>
                      <td>{item.unitPrice * item.qty - item.allowance} JOD</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-sm btn-danger d-print-none"
                          onClick={() => {
                            removeItem(item.id);
                          }}
                        >
                          {" "}
                          <MdDelete />{" "}
                        </button>
                      </td>
                    </tr>
                  ))}

                  <tr className="d-print-none">
                    <td>{invoice.items.length + 1}</td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={currentEditableItem.description}
                        onChange={updateDescription}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={currentEditableItem.unitPrice}
                        onChange={updateUnitPrice}
                        required={true}
                        min={1}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={currentEditableItem.qty}
                        onChange={updateQty}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={currentEditableItem.allowance}
                        onChange={updateAllowance}
                      />
                    </td>
                    <td>
                      {currentEditableItem.unitPrice * currentEditableItem.qty}{" "}
                      JOD
                    </td>
                    <td>
                      {currentEditableItem.unitPrice * currentEditableItem.qty -
                        currentEditableItem.allowance}{" "}
                      JOD
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm mx-2 "
                        onClick={addItem}
                      >
                        <MdAdd size={30} />
                      </button>
                    </td>
                  </tr>
                </tbody>
                <tfoot></tfoot>
              </table>
            </div>
          </div>

          <div className="row d-none d-print-block">
            <div className="col text-end">
              <br />
              <br />
              <img
                src={
                  "https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=Test QR"
                }
              />
            </div>
          </div>
          <div className="mb-3 row col justify-content-end">
            <Link className="btn btn-warning" to="/admin/invoices">
              {t("dashboard.cancel")}
            </Link>{" "}
            &nbsp;
            <button type="button" className="btn btn-primary" onClick={doPost}>
              {t("dashboard.submit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInvoice;
