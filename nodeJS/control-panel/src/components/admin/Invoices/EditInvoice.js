import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { createInvoice, getInvoice, updateInvoice , getSumInvoicesByContractId } from "./InvoicesAPI";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThreeDots } from  'react-loader-spinner';
import { Editor } from "@tinymce/tinymce-react";
import { MdAdd, MdDelete , MdEdit , MdWarning} from "react-icons/md";
import { v4 as uuidv4 } from "uuid";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { event } from "jquery";
import ConfirmButton from "react-confirmation-button";
import ContactSearchControl from "../Contact/ContactSearchControl";
import ContractSearchControl from "../Contracts/ContractSearchControl";
import { getContract ,updateContract } from "../Contracts/ContractsAPI";
import { getContact } from "../Contact/ContactAPI";

const EditInvoice = (props) => {
  const [loading, setLoading] = useState(false);
  const [invoice, setInvoice] = useState({});
  const [originalInvoiceAmount, setOriginalInvoiceAmount ] =useState(0) 
  const { invoiceId } = useParams();
  useEffect(() => {
    getInvoice(invoiceId)
      .then((data) => {
        setLoading(true);
       setInvoice(data);
       setOriginalInvoiceAmount(data.legalMonetaryTotal.payableAmount); 
        setLoading(false);
        console.log("find invoice");
        console.log(data);
        let invoiceContractObj= data.contract ; 
        console.log("invoiceContractObj=" +invoiceContractObj); 
        console.log(JSON.stringify(invoiceContractObj))
         
        if( !isBlank(invoiceContractObj) && !isBlank(invoiceContractObj._id) ) 
        {
          getContract(invoiceContractObj._id).then((data)=> {
            setLoading(true);
            setContract(data);
            console.log("contract obj:") ;
            console.log(data) ;
             setLoading(false);
          }) .catch((ex) => {
            setLoading(false);
            console.log("Error: trying fetch contract info" + ex);
          });
        }

        let invoiceInsuranceObj= data.insurance ; 
        console.log("invoiceInsuranceObj=" +invoiceInsuranceObj); 
        console.log(JSON.stringify(invoiceInsuranceObj))
         
        if( !isBlank(invoiceInsuranceObj) && !isBlank(invoiceInsuranceObj._id) ) 
        {
          getContact(invoiceInsuranceObj._id).then((data)=> {
            setLoading(true);
            setInsurance(data);
            console.log("insurance obj:") ;
            console.log(data) ;
             setLoading(false);
          }) .catch((ex) => {
            setLoading(false);
            console.log("Error: trying fetch insurance info" + ex);
          });
        }


      })
      .catch((ex) => {
        setLoading(false);

        console.log(ex);
      });
    },
    []
  );

  const [contract, setContract] = useState({});
  const [insurance, setInsurance] = useState({});
  const[showWarningContractBalance ,setShowWarningContractBalance] =useState(false);

  useEffect(()=>{
    if(invoice.contract && contract) 
    {
      let contractAmount = contract.contractAmount ; 
      let contractBalance = contract.contractBalance ;
      let payableAmount = totalPayableAmount() ; 
      let balanceWithoutCurrentInvoice = (parseFloat(contractBalance) + parseFloat(originalInvoiceAmount))
      console.log("contractBalance:" +contractBalance) ;
      console.log("originalInvoiceAmountL::" + originalInvoiceAmount)
      console.log("balanceWithoutCurrentInvoice :::" +balanceWithoutCurrentInvoice) ;
      console.log("new payableAmount::::" +payableAmount) 
      if(  parseFloat(balanceWithoutCurrentInvoice) < parseFloat(payableAmount)   )
      {
        setShowWarningContractBalance(true);
      }
      else
      
      { setShowWarningContractBalance(false); }
    }

  } , [invoice])

  //#region useState

  const [PlaceHolderIdentificationType, updatePlaceHolderIdentificationType] =
    useState("National ID");
  const [wasValidated, setWasValidated] = useState(false);
  const [checkCustomerNameIsRequired, setCheckCustomerNameIsRequired] =
    useState(false);
  const { t } = useTranslation();
  let seq = 1;
  const [currentEditableItem, setCurrentEditableItem] = useState({
    unitPrice: 0,
    allowance: 0,
  });

  //#endregion

  //#region const

  const setPaymentMethod = (event) => {
    let cloned = JSON.parse(JSON.stringify(invoice));
    cloned.paymentMethod = event.target.value;
    setInvoice(cloned);
  };
  
  const selectedConatct = (item) => {
    // alert(item);
    if (item) {
      console.log(JSON.stringify(item));
      let cloned = JSON.parse(JSON.stringify(invoice));
      cloned.accountingCustomerParty.partyIdentification.schemeID = item.identificationType;
      cloned.accountingCustomerParty.partyIdentification.value = item.identificationValue
      cloned.accountingCustomerParty.registrationName = item.contactName;
      cloned.accountingCustomerParty.telephone = item.mobile;
      cloned.contact  = item._id 
      setInvoice(cloned);
    }
  };

  const selectedInsurance =   (item) => {
    // alert(item);
    if (item) {
      try {
        console.log(JSON.stringify(item));
        let cloned = JSON.parse(JSON.stringify(invoice));
        cloned.insurance = item._id
        setInvoice(cloned);
        setInsurance(item)
      }
    catch (e) {
      console.log(e);
  
    }
  }
  
  };


  const updateItemName = (event) => {
    let cloned = JSON.parse(JSON.stringify(currentEditableItem));
    cloned.itemName = event.target.value;
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
    if (cloned.invoiceType == "021" || taxInclusiveAmount() > 1000)
      setCheckCustomerNameIsRequired(true);
    else setCheckCustomerNameIsRequired(false);
  };

  const setTemplateNo = (event) => {
    let cloned = JSON.parse(JSON.stringify(invoice));
    cloned.invoiceType = event.target.value;
    setInvoice(cloned);
  };
  
  const setPercentageOfCover = (event) => {
    let cloned = JSON.parse(JSON.stringify(invoice));
    cloned.invoiceType = event.target.value;
    setInvoice(cloned);
  };

  const updateCustomerName = (event) => {
    let cloned = JSON.parse(JSON.stringify(invoice));
    cloned.accountingCustomerParty.registrationName = event.target.value;
    setInvoice(cloned);
  };

  const updateAccountingCustomerParty_schemeID = (event) => {
    let cloned = JSON.parse(JSON.stringify(invoice));
    cloned.accountingCustomerParty.partyIdentification.schemeID =
      event.target.value;
    setInvoice(cloned);
  };

  const setPhoneNumber = (event) => {
    let cloned = JSON.parse(JSON.stringify(invoice));
    cloned.accountingCustomerParty.telephone = event.target.value;
    setInvoice(cloned);
  };

  const updateAccountingCustomerParty_value = (event) => {
    let cloned = JSON.parse(JSON.stringify(invoice));
    cloned.accountingCustomerParty.partyIdentification.value =
      event.target.value;
    setInvoice(cloned);
  };

  const updateIssuedDate = (date) => {
    let cloned = JSON.parse(JSON.stringify(invoice));
    cloned.issuedDate = date;
    setInvoice(cloned);
  };

  const updateNote = (event) =>{
 let cloned = JSON.parse( JSON.stringify(invoice)) ;
 cloned.note = event.target.value ;
 setInvoice(cloned) ;

  }
  //#endregion

  //#region useEffect

  useEffect(() => {
    try {
      if (
        invoice &&
        invoice.accountingCustomerParty.partyIdentification.schemeID == "NIN"
      )
        updatePlaceHolderIdentificationType("National ID");
      else if (
        invoice &&
        invoice.accountingCustomerParty.partyIdentification.schemeID == "PN"
      )
        updatePlaceHolderIdentificationType("Passport");
      else if (
        invoice &&
        invoice.accountingCustomerParty.partyIdentification.schemeID == "TN"
      )
        updatePlaceHolderIdentificationType("Tax Identification No,");
      else updatePlaceHolderIdentificationType("");
    } catch (e) {}
  }, [updateAccountingCustomerParty_schemeID]);

  useEffect(() => {
    console.log(JSON.stringify(invoice));
  }, [invoice]);

  useEffect(() => {
    if (taxInclusiveAmount() > 1000) {
      setCheckCustomerNameIsRequired(true);
    }
  }, invoice);

  //#endregion

  //#region Total function Function

  function taxInclusiveAmount() {
    return totalTaxExclusiveAmount() - totalAllowance();
  }

  function totalPayableAmount() {
    return totalTaxExclusiveAmount() - totalAllowance();
  }

  function numericFormat(val)
{

  //console.log("before:" + val ) ;
  //console.log('after:' + val.toFixed(3))
    return ! isNaN (val)? val.toFixed(3): val ; 
}

  const totalAllowance = () => {
    let totalAllowance = 0;
    if (!invoice || !invoice.items) return 0;

    invoice.items.forEach((item) => {
      totalAllowance += parseFloat(item.allowance);
    });
    return totalAllowance;
  };

  const totalTaxExclusiveAmount = () => {
    if (!invoice || !invoice.items) return 0;
    let amount = 0;
    invoice.items.forEach((item) => {
      amount += parseFloat(item.unitPrice * item.qty);
    });
    return amount;
  };

  //#endregion

  //#region Function
  const fieldClass = (value, minQuantity) => {
    if (!wasValidated) return "form-control";
    //console.log("minQuantity:"+ minQuantity) ;
    if (isNaN(minQuantity))
      return value ? "form-control is-valid" : "form-control is-invalid";
    else
      return parseFloat(value) >= parseFloat(minQuantity)
        ? "form-control is-valid"
        : "form-control is-invalid";
  };

  const selectFieldClass = (value, minQuantity) => {
    if (!wasValidated) return "form-select";
    //console.log("minQuantity:"+ minQuantity) ;
    if (isNaN(minQuantity))
      return value ? "form-select is-valid" : "form-select is-invalid";
    else
      return parseFloat(value) >= parseFloat(minQuantity)
        ? "form-select is-valid"
        : "form-select is-invalid";
  };

  function isBlank(str) {
    return !str || /^\s*$/.test(str);
  }

  const viewItemValidMessage = (message) => {
    toast.warning(message, {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  const addItem = (event) => {
    //setWasValidated(true);

    if (!checkItemIsValid()) {
      console.log("invoice item is not valid...");
      return false;
    }

    let cloned = JSON.parse(JSON.stringify(invoice));
    cloned.items.push({
      id: new Date().getTime(),
      sequance: cloned.items.length + 1,
      chargeIndicator: currentEditableItem.allowance > 0 ? true : false,
      lineExtensionAmount:
      numericFormat((currentEditableItem.unitPrice * currentEditableItem.qty) - currentEditableItem.allowance),
      ...currentEditableItem,
    });

    setCurrentEditableItem({
      itemName: "",
      unitPrice: 0,
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

    if (!checkInvoice()) {
      //|| !checkItemIsValid())
      return false;
    }

    setLoading(true);
    invoice.legalMonetaryTotal = {
      taxExclusiveAmount: totalTaxExclusiveAmount(),
      taxInclusiveAmount: taxInclusiveAmount(),
      allowanceTotalAmount: totalAllowance(),
      payableAmount: totalPayableAmount(),
    };

    invoice.allowanceCharge.value = totalAllowance();

    updateInvoice(invoice)
      .then((res) => {
        setLoading(false);
        toast.success(t("succeed"));
      //update contract balance
      updateContractBalance(); 
    window.location.href = "/admin/invoices/ViewInvoice/" + res._id;

      })
      .catch((e) => {
        setLoading(false);
      });
    console.log(invoice);
    console.log(data);
  };

  function updateContractBalance()
{

  console.log("updateContractBalance ......") ;
  console.log(invoice.contract) 
  //return false ; 
  if(isBlank(invoice.contract) )
  {return false;}
  let parms = {} 
  parms.contractId = invoice.contract._id 
  parms.ignoreInvoiceId = "" 
  console.log("parms:" ); 
  console.log(parms) ;
  
  getSumInvoicesByContractId(parms) .then((data) => {
     
      console.log("getSumInvoicesByContractId success ");
      console.log("data: " );
      console.log(data) ;
      let sumInvoices = 0 ;
      if(data.length >0) 
      {
        console.log("sum:" +data[0].sum_val)
         sumInvoices= data[0].sum_val;
      }
      else
      {
        sumInvoices = 0 ;
        console.log("sum equals 0")
      }
        let cloned = JSON.parse(JSON.stringify(contract));
        cloned.contractTotalInvoiced = parseFloat(sumInvoices);
        cloned.contractBalance = parseFloat(cloned.contractTotalReceipts) - parseFloat(sumInvoices)
        setContract(cloned);
        //use cloned obj rather than contract obj because the setContract method need extra time. 
        updateContract(cloned).then((res)=> {
         console.log("res") 
         console.log(res) ;
        }).catch((err)=> { console.log(err)}) ;
      }
    
  
    ) 
    .catch((ex) => {
      console.log("getSumInvoicesByContractId not  success ");
      console.log(ex);
    });
     
}
  function checkItemIsValid() {
    let itemIsValid = true;

    if (isBlank(currentEditableItem.itemName)) {
      viewItemValidMessage("Fill the item description");
      itemIsValid = false;
    }



    if (
      isBlank(currentEditableItem.unitPrice) ||
      currentEditableItem.unitPrice <= 0
    ) {
      viewItemValidMessage("Item unit price must be greater than 0.01 JOD.");
      itemIsValid = false;
    }
    if (isBlank(currentEditableItem.qty) || currentEditableItem.qty < 1) {
      viewItemValidMessage("Item quantity must be greater than zero.");
      itemIsValid = false;
    }

    if (currentEditableItem.allowance < 0) {
      viewItemValidMessage(
        "Item alowance value must be greater than or equal zero."
      );
      itemIsValid = false;
    }

    if (
      currentEditableItem.unitPrice * currentEditableItem.qty -
        currentEditableItem.allowance <=
      0
    ) {
      viewItemValidMessage("Invoice amount must be greater than zero.");
      itemIsValid = false;
    }

    return itemIsValid;
  }

  function checkInvoice() {
    let invoiceIsValid = true;

    if (
      invoice.accountingCustomerParty.registrationName.trim().length == 0 &&
      (invoice.invoiceType == "021" || totalTaxExclusiveAmount() >= 10000)
    ) {
      viewItemValidMessage("FullName is required.");
      invoiceIsValid = false;
    }

    if (invoice.items.length == 0) {
      viewItemValidMessage("Add the invoice line item.");
      invoiceIsValid = false;
    }

    if (isBlank(invoice.invoiceType)) {
      viewItemValidMessage("Select the invoice type.");
      invoiceIsValid = false;
    }

    return invoiceIsValid;
  }

  const handleSelectContract = (selectedContract) => {
    console.log("insert handleSelectContract method: " + selectedContract)
    if( isBlank(selectedContract))
    { return false}
    console.log("selectedContract:" +selectedContract + " " + JSON.stringify(selectedContract)  );
     let cloned = JSON.parse(JSON.stringify(invoice));
      cloned.contract = selectedContract._id;
      cloned.package = selectedConatct.package ;
      setInvoice(cloned);
      setContract(selectedContract);
      
    }

  //#endregion
  function isKeyInJSONAndNotNull(jsonObject, keyToCheck) {
    return jsonObject.hasOwnProperty(keyToCheck) && jsonObject[keyToCheck] !== null;
  }
  return (
    <>
      {invoice.items ? (
        <div style={isKeyInJSONAndNotNull(invoice, "ObjectIdReceipt")==false?{display:''}:{display:'none'}} className="card">
          <div className="card-body">
            <h5 className="card-header" >   <MdEdit />  {t("invoice.editInvoice")}    <span className="text-info px-2">  ({  invoice.seqNumber} ) </span> </h5>
            <div className="container text-center">
              <ThreeDots
                type="ThreeDots"
                color="#00BFFF"
                height={100}
                width={100}
                visible={loading}
              />
            </div>
            <br />
            <form className="needs-validation">
            
            { showWarningContractBalance && 
            <div className="row">  <div class="alert alert-warning  fs-6" role="alert">
            <MdWarning size={40}/>
              The Invoice Amount is greater than  contract balance!
            </div>
             </div>
            } 


              <div className="mb-3 row ">
                <div className="col col-auto text-info">{t("invoice.InvoiceSummery")}</div>
                <div className="col">
                  <hr />
                </div>
              </div>

              <div className="row totals">
                <div className="mb-3 col ">
                  <div className="col col-auto">{t("invoice.TaxExclusiveAmount")}</div>

                  <div className="col">
                    JOD {totalTaxExclusiveAmount().toFixed(3)}
                  </div>
                </div>

                <div className="mb-3 col ">
                  <div className="col col-auto">{t("invoice.AllowanceTotalAmount")}</div>

                  <div className="col">JOD {totalAllowance().toFixed(3)}</div>
                </div>


                <div className="mb-3 col ">
                  <div className="col col-auto">{t("invoice.TaxInclusiveAmount")}</div>

                  <div className="col">
                    JOD {taxInclusiveAmount().toFixed(3)}
                  </div>
                </div>

               

                <div className="mb-3 col ">
                  <div className="col col-auto">{t("invoice.PayableAmount")}</div>

                  <div className="col">
                    JOD {totalPayableAmount().toFixed(3)}
                  </div>
                </div>
              </div>

              <div className="mb-3 row ">
                <div className="mb-3 col ">
                  <div className="col col-auto">{t("invoice.Type")} </div>

                  <div className="col col-auto">
                    <select
                      type="text"
                      className={selectFieldClass(invoice.invoiceType)}
                      id="invoiceType"
                      name="title"
                      onChange={updateInvoiceType}
                      
                      value = { invoice.invoiceType}
                      
                    >
                      <option value=""> اخنر </option>
                      <option value="011">انشاء فاتورة جديدة نقدية</option>
                      <option value="021"  >أنشاء فاتورة ذمم</option>
                    </select>
                  </div>
                </div>

                <div className="mb-3 col ">
                  <div className="col col-auto">{t("invoice.invoiceDate")}</div>

                  <div className="col">
                    <DatePicker
                      className={fieldClass(invoice.issuedDate)}
                      dateFormat="dd/MM/yyyy"
                      selected={new Date(invoice.issuedDate)}
                      onChange={(date) => updateIssuedDate(date)}
                    />
                  </div>
                </div>

                <div className="mb-3 col ">
                  <div className="col col-auto">{t("invoice.note")}</div>

                  <div className="col">
                  <textarea  className="form-control"  id = "note" name = "note"    onChange= {updateNote} placeholder = {t("invoice.note")}   >
               {invoice.note}
               </textarea>
                  </div>
                </div>
                <div className="mb-3 col "></div>
                <div className="mb-3 col "></div>
              </div>
              <div className="mb-3 row ">
                <div className="col col-auto text-info">{t("invoice.CustomerDetails")} </div>
                <div className="col">
                  <hr />
                </div>
              </div>

              <div className="mb-3 row">

              <div className="mb-3 col ">
                <div className="col col-auto">{t("invoice.fullName")} </div>
                <div className="col col-auto">
                  <ContactSearchControl
                    handleSelectContact={selectedConatct}
                    wasValidated={wasValidated}
                    value = {invoice.accountingCustomerParty.registrationName}
                  />
                </div>
              </div>

                <div className="mb-3 col ">
                  <div className="col col-auto">{t("invoice.IdentificationType")}</div>
                  <div className="col col-auto">
                    <select
                      type="text"
                      className="form-select"
                      id="accountingCustomerParty_schemeID"
                      name="accountingCustomerParty_schemeID"
                      value={
                        invoice.accountingCustomerParty.partyIdentification
                          .schemeID
                      }
                      onChange={updateAccountingCustomerParty_schemeID}
                    >
                      <option value=""> أختر </option>
                      <option value="NIN">National ID</option>
                      <option value="PN">Passport</option>
                      <option value="TN">Tax Identification No,</option>
                    </select>
                  </div>
                </div>

                <div className="mb-3 col ">
                  <div className="col col-auto">{t("invoice.IdentificationValue")}</div>
                  <div className="col col">
                    <input
                      type="text"
                      className="form-control"
                      id="accountingCustomerParty_schemaValue"
                      name="accountingCustomerParty_schemaValue"
                      placeholder={PlaceHolderIdentificationType}
                      onChange={updateAccountingCustomerParty_value}
                      value= {invoice.accountingCustomerParty.partyIdentification.value }
                    />
                  </div>
                </div>

                {/* <div className="mb-3 col ">
                  <div className="col col-auto">{t("invoice.fullName")}</div>
                  <div className="col">
                    <input
                      type="text"
                      className={
                        checkCustomerNameIsRequired
                          ? fieldClass(
                              invoice.accountingCustomerParty.registrationName
                            )
                          : "form-control"
                      }
                      id="customerName"
                      name="customerName"
                      onChange={updateCustomerName}
                      placeholder="Full Name"
                      value={invoice.accountingCustomerParty.registrationName}
                    />
                  </div>
                </div> */}
                <div className="mb-3 col ">
                  <div className="col col-auto">{t("invoice.PhoneNumber")}</div>
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
            <div className="col col-auto text-info">
              {t("invoice.contractInformation")}{" "}
            </div>
            <div className="col">
              <hr />
            </div>
          </div>

          <div className="mb-3 row ">
            <div className="mb-3 col-2 ">
              <div className="col col-auto">
                {t("invoice.contract")}  
              </div>
              <div className="col col-auto">
                <ContractSearchControl handleSelectContract={handleSelectContract} clientId={invoice.contact} 
               value = {invoice.contract?.seqNumber}
               readOnly= { invoice.contract?true :false}
                />
              </div>
            </div>

             <div className="mb-3 col ">
                <div className="col col-auto">{t("contracts.packageName")}  </div>
                <div className="col">
                  <input
                    type="text"
                    className="form-control"
                    placeholder={t("contracts.packageName")}
                    value={contract?.package?.packageName}
                    readOnly={true}
                  />
                </div>
              </div> 

           
              <div className="mb-3 col ">
                <div className="col col-auto">{t("contracts.contractAmount")} </div>
                <div className="col">
                  <input
                    type="text"
                    className="form-control"
                    placeholder={t("contracts.contractAmount")}
                    value={contract.contractAmount?contract.contractAmount: ""}
                    readOnly={true}
                  />
                </div>
              </div> 

               <div className="mb-3 col ">
                <div className="col col-auto">{t("contracts.contractBalance")} </div>
                <div className="col">
                  <input
                    type="text"
                    className="form-control"
                    value={contract.contractBalance?contract.contractBalance : ""}
                    placeholder={t("contracts.contractBalance")}
                    readOnly={true}
                  />
                </div>
              </div> 
               
          </div>

          <div className="mb-3 row ">
            <div className="col col-auto text-info">
              {t("invoice.PaymentMethod")}{" "}
            </div>
            <div className="col">
              <hr />
            </div>
          </div>

          <div className="mb-3 row ">
            <div className="mb-3 col ">
              <div className="col col-auto">{t("invoice.paymentMethod")}</div>

              <div className="col col-auto">
                <select
                  type="text"
                  className={selectFieldClass(invoice.paymentMethod)}
                  id="paymentMethod"
                  name="paymentMethod"
                  onChange={setPaymentMethod}
                  value={invoice.paymentMethod}
                >
                  <option value="Cash"> Cash </option>
                  <option value="Visa">Visa </option>
                  <option value="Insurance"> Insurance </option>
                </select>
              </div>
            </div>
            
            {invoice.paymentMethod == "Insurance" ?
            <>
            <div className="mb-3 col ">
              <div className="col col-auto">{t("invoice.insurance")}</div>
              <div className="col col-auto">

              <ContactSearchControl
                  handleSelectContact={selectedInsurance}
                  wasValidated={ invoice.paymentMethod =="Insurance" ? wasValidated : false}  
                  value = {insurance?.contactName}
                    contactType = {["Insurance" ]}
                />

              </div>
            </div>
            
            <div className="mb-3 col ">
                <div className="col col-auto">{t("invoice.templateNo")} </div>
                <div className="col">
                  <input
                    type="text"
                    className="form-control"
                    value={invoice.templateNo}
                    placeholder={t("invoice.templateNo")}
                    onChange={setTemplateNo}
                  
                  />
                </div>
              </div> 

              <div className="mb-3 col ">
                <div className="col col-auto">{t("invoice.percentageOfCover")} </div>
                <div className="col">
                  <input
                    type="text"
                    className="form-control"
                    value={invoice.percentageOfCover}
                    placeholder={t("invoice.percentageOfCover")}
                    onChange={setPercentageOfCover
                    }
                  
                  />
                </div>
              </div> 
              </>
              :<>
              <div className="mb-3 col "></div>
              <div className="mb-3 col "></div>
              <div className="mb-3 col "></div>
              </>
}


            </div>

              <div className="mb-3 row ">
                <div className="col col-auto text-info">{t("invoice.Items")}</div>
                <div className="col">
                  <hr />
                </div>
              </div>

              <div className="row">
                <div className="col table-responsive">
                  <table className="table table-sm needs-validation ">
                    <thead>
                      <tr className="table-light">
                        <th width="5%">#</th>
                        <th width="20%">{t("invoice.Name")}</th>
                        <th width="10%"> {t("invoice.Price")} </th>
                        <th width="10%">{t("invoice.Qty")}</th>
                        <th width="12%">{t("invoice.Allowance")}</th>
                        <th width="13%">{t("invoice.Subtotal")}</th>
                        <th width="15%">{t("invoice.Net")}</th>
                        <th width="15%"></th>
                      </tr>
                    </thead>

                    <tbody>
                      {invoice.items.map((item) => (
                        <tr>
                          <td> {item.sequance} </td>
                          <td>{item.itemName}</td>
                          <td>{item.unitPrice} </td>
                          <td>{item.qty} </td>
                          <td>{item.allowance} </td>
                          <td>{numericFormat(item.unitPrice * item.qty)} </td>
                          <td>{numericFormat( (item.unitPrice * item.qty) - item.allowance)} </td>
                          <td>
                            <ConfirmButton
                              onConfirm={() => removeItem(item.id)}
                              onCancel={() => console.log("cancel")}
                              buttonText={t("dashboard.delete")}
                              confirmText={t("invoice.confirm")}
                              cancelText={t("invoice.cancel")}
                              loadingText={t("invoice.deleteingItem")}
                              wrapClass=""
                              buttonClass="btn d-print-none"
                              mainClass="btn-danger"
                              confirmClass="btn-warning"
                              cancelClass=" btn-success"
                              loadingClass="visually-hidden"
                              disabledClass=""
                              once
                            >
                              {"Delete "}
                              <MdDelete />
                            </ConfirmButton>
                          </td>
                        </tr>
                      ))}

                      <tr className="d-print-none">
                        <td>{invoice.items.length + 1}</td>
                        <td>
                          <input
                            type="text"
                            className={fieldClass(currentEditableItem.itemName)}
                            value={currentEditableItem.itemName}
                            onChange={updateItemName}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className={fieldClass(
                              currentEditableItem.unitPrice,
                              0.01
                            )}
                            value={currentEditableItem.unitPrice}
                            onChange={updateUnitPrice}
                            required={true}
                            min={0.01}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className={fieldClass(currentEditableItem.qty, 1)}
                            value={currentEditableItem.qty}
                            onChange={updateQty}
                            min={1}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={currentEditableItem.allowance}
                            onChange={updateAllowance}
                            className={fieldClass(
                              currentEditableItem.allowance,
                              0
                            )}
                            min={0}
                          />
                        </td>
                        <td>
                          {!isNaN(
                            currentEditableItem.unitPrice *
                              currentEditableItem.qty
                          )
                            ? currentEditableItem.unitPrice *
                              currentEditableItem.qty
                            : 0}{" "}
                          JOD
                        </td>
                        <td>
                          {!isNaN(
                            currentEditableItem.unitPrice *
                              currentEditableItem.qty -
                              currentEditableItem.allowance
                          )
                            ? numericFormat( currentEditableItem.unitPrice *
                                currentEditableItem.qty -
                              currentEditableItem.allowance
                            )
                            : 0}{" "}
                          JOD
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn  btn-success d-print-none "
                            onClick={addItem}
                          >
                          {t("invoice.add")}
                          </button>
                        </td>
                      </tr>
                    </tbody>
                    <tfoot></tfoot>
                  </table>
                </div>
              </div>
              <div class = "row text-right">
              <div className="mb-3  col justify-content-end">
                <Link className="btn btn-secondary btn-lg" to={"#"} onClick={() => window.history.back()}>
                  {t("dashboard.cancel")}
                </Link>{" "}
                &nbsp;
                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  onClick={doPost}
                >
                  {t("dashboard.submit")}
                </button>
              </div>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div> data not found ....</div>
      )}
    </>
  );
};

export default EditInvoice;
