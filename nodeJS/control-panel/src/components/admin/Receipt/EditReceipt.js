import React, { useState, useEffect } from "react";
import { Link,useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThreeDots } from  'react-loader-spinner';
import {  MdClose, MdCollections, MdContacts, MdReceipt , MdDelete} from "react-icons/md";
import  {getReceipt, updateReceipt , removeReceipt} from './ReceiptAPI'
import ContactSearchControl from "../Contact/ContactSearchControl";
import ContractSearchControl from "../Contracts/ContractSearchControl";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ConfirmButton from "react-confirmation-button";

//import { updateContractCalculation } from "./utils";

const EditReceipt = (props) => {

  const [wasValidated, setWasValidated] = useState(false);
  const [receipt , setReceipt] = useState( {}) ;  
  const[contactItem, setContactItem] = useState({}) ;
  const[contractItem, setContractItem] = useState({}) ;

  
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
 const { receiptId } = useParams();

  useEffect( () => {
  if(receiptId )  {
    setLoading(true) ;
    console.log("start") 
  console.log("receiptId:" +receiptId) ; 
  getReceipt(receiptId).then(
    (res) =>{ 
      setReceipt(res)
      setContactItem(res.contact);
      setContractItem(res.contract)
      console.log("receipt:" )
      console.log( JSON.stringify(res)) ;
    }
  ).catch((error) =>{ console.log(error)}) 
  setLoading(false) ; 
  } 
}
  , []) ; 

  useEffect( () => { 
    setLoading(true) ;
    if(props.selectedReceiptObj)
    {
      setReceipt(props.selectedReceiptObj) ;
      setContactItem(props.selectedReceiptObj.contact);
      console.log("props.selectedReceiptObj.contact"+ props.selectedReceiptObj.contact) ;
      setContractItem(props.selectedReceiptObj.contract)   
    }
    setLoading(false) ;
  } , [props.selectedReceiptObj]) ;

  function numericFormat(val) {

    return !isNaN(val) ? val.toFixed(3) : val;
  }



  const setContact = (item) => {
    if (item) {
      let cloned =JSON.parse(JSON.stringify(receipt)) ;
      cloned.contact = item._id;
      setReceipt(cloned);
      setContactItem(item);
     // console.log("contact item:" +item.mobile) ;
     // console.log("contact item:" +JSON.stringify(item)) ;
    }
  };

 
  const setContract = (item) => {  
    if (item) {
      console.log("set contract ...");
      let cloned =JSON.parse(JSON.stringify(receipt)) ;
      cloned.contract = item._id;
      setContractItem(item);
 
      setReceipt(cloned);
     
    }
  };




  const setReceiptAmount = (event)=> {
    console.log( "setReceiptAmount " +event.target.value) ;
   let cloned =JSON.parse(JSON.stringify(receipt)) ;
     cloned.receiptAmount = parseFloat(event.target.value); 
    setReceipt(cloned)

  }

  const setReceiptDate = (date) => {
    let cloned = JSON.parse(JSON.stringify(receipt));
    cloned.receiptDate = date;
    setReceipt(cloned);
  };


  const setNote = (event) => {
    let cloned =JSON.parse(JSON.stringify(receipt)) ;
    cloned.note = event.target.value; 
    setReceipt(cloned)
  };

  const fieldClass = (value, minQuantity) => {
    if (!wasValidated) return "form-control";
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

  const doPost = (event) => {
    setWasValidated(true) ;
    setLoading(true) ;
    if(checkData()) {
      updateReceipt(receipt).then(async (res) => {

        console.log("ABD: updated res :" + JSON.stringify(res)) ;
        /*
        let updatedContract = {} 
        if (receipt.contract) {
          updatedContract = await updateContractCalculation(receipt.contract);
         
        }*/

        viewItemValidMessage("success!") ;
        if(props.onSave == null )
        {
          window.location.href = "/admin/Receipt/view/" + res._id;
        }
        else 
        {
         
        //  props.onSave(updatedContract);
        props.onSave();

        }
     
  
      }).catch((err)=> { console.log(err)}) ;
    }
    setLoading(false) ; 
  }
 

function checkData() 
{
  console.log( "insert checkdata ...") 
  let isValid= true;

 if (isBlank(receipt.contact)) 
 {
  viewItemValidMessage("Fill the contact name.") 
  isValid = false ; 
 }

 if ( isBlank(receipt.receiptAmount) ||  parseFloat(receipt.receiptAmount) <=0) 
 {
  viewItemValidMessage("Fill the receipt amount.") 
  isValid = false ; 
 }

  return isValid; 
};

const viewItemValidMessage = (message) => {
  toast.warning(message, {
    position: toast.POSITION.TOP_RIGHT,
  });
};

function isKeyInJSONAndNotNull(jsonObject, keyToCheck) {
  return jsonObject.hasOwnProperty(keyToCheck) && jsonObject[keyToCheck] !== null;
}

  return (
    <>
      <div style={isKeyInJSONAndNotNull(receipt, "ObjectIdinvoice")==false?{display:''}:{display:'none'}} className= { props.selectedReceiptObj == null 
         ? "card" : ""  } >
        <div   className="card-body">
          <h5 className="card-title"> <MdReceipt size= {20} />   {props.selectedReceiptObj ==null? t("receipt.editReceipt") : ""}  <span className='text-info'>({receipt.seqNumber})</span></h5>
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
          

          <div className="mb-3 row ">
              <div className="col col-auto text-info">
                {t("receipt.contactInformation")}{" "}
              </div>
              <div className="col">
                <hr />
              </div>
            </div>

            <div className="mb-3 row">
                
                <div className="mb-3 col ">
                    <div className="col col-auto">{t("receipt.contactName")}</div>
                    <div className="col col-auto">
                    <ContactSearchControl
                    handleSelectContact={setContact}
                    wasValidated={ props.selectedReceiptObj? false: wasValidated}
                    value = {contactItem?.contactName}
                    contactType = {["Client" , "Vendor"]}
                    readOnly = {props.selectedReceiptObj? true :false}
                  
                  />
                    </div>
                  </div>
    
    
                  <div className="mb-3 col ">
                    <div className="col col-auto">{t("receipt.contactMobile")}</div>
                    <div className="col col-auto">
          
                    <input
                        type="text"
                        className= {fieldClass(contactItem.mobile)}
                        id="contactMobile"
                        name="contactMobile"
                        placeholder={t("receipt.contactMobile")}
                        value={
                          contactItem?.mobile
                        }
                      />
                    
    
                    </div>
                  </div>
    
    
                  <div className="mb-3 col ">
                    <div className="col col-auto"></div>
                    <div className="col col-auto">
                 
                    </div>
                  </div>
    
    

                  
    
                </div>

              <div className="mb-3 row ">
              <div className="col col-auto text-info">
                {t("receipt.contractInformation")}{" "}
              </div>
              <div className="col">
                <hr />
              </div>
            </div>
    
            <div className="mb-3 row">
                
                <div className="mb-3 col ">
                    <div className="col col-auto">{t("receipt.contract")}     </div>
                    <div className="col col-auto">
                    <ContractSearchControl
                    handleSelectContract={setContract}
                    wasValidated={ props.selectedReceiptObj?false: wasValidated}
                    value = {contractItem?.seqNumber}
                    clientId={contactItem?._id} 
                    readOnly = {props.selectedReceiptObj? true:false}
                  />
                    </div>
                  </div>

                  <div className="mb-3 col "></div>
                  <div className="mb-3 col "></div>
                  </div>

            <div className="mb-3 row ">
              <div className="col col-auto text-info">
                {t("receipt.ReceiptInformation")}{" "}
              </div>
              <div className="col">
                <hr />
              </div>
            </div>

            <div className="mb-3 row">
                
                <div className="mb-3 col ">
                    <div className="col col-auto">{t("receipt.receiptDate")} </div>
                    <div className="col">
                  { <DatePicker
                    className={fieldClass(receipt.receiptDate)}
                    dateFormat="dd/MM/yyyy"
                     selected={(receipt.receiptDate) ? new Date(receipt.receiptDate): null}
                     onChange={(date) => setReceiptDate(date)}
                  /> }
                </div>
                  </div>
    
    
                
    
    
                  <div className="mb-3 col ">
                    <div className="col col-auto">{t("receipt.receiptAmount")}</div>
                    <div className="col col-auto">
                    <input
                        type="number"
                        className= {fieldClass(receipt.receiptAmount,0.01)}
                        id="receiptAmount"
                        name="receiptAmount"
                        placeholder={t("receipt.receiptAmount")}
                        onChange={setReceiptAmount}

                        value={
                          receipt.receiptAmount
                        }
                        min= {0}

                        
                      />
                    </div>
                  </div>
    
    
    
                  <div className="mb-3 col ">
    <div className="col col-auto">{t("receipt.note")}  </div>
    <div className="col col-auto">
     
    <textarea
        className="form-control"
        id="note"
        name="note"
        onChange={setNote}
        placeholder={t("receipt.note")}
        value={ receipt.note}
      >
       
      </textarea>

    </div>
  </div>
                 
  
                </div>

            <div class ={ props.selectedReceiptObj ? "row text-right " : "row text-right action-bar" } >
              <div className="mb-3  col justify-content-end">
               { !props.selectedReceiptObj &&  <Link className="btn btn-secondary btn-lg" to="/admin/Receipt">
                  <MdClose size={20} /> &nbsp; {t("Cancel")}
                </Link> }
                &nbsp;
                <button
                  type="button"
                  className= {!props.selectedReceiptObj? "btn btn-primary btn-lg" : "btn btn-primary btn-lg w-100" }
                  onClick={doPost}
                >
                  {t("dashboard.submit")}
                </button>

                { props.selectedReceiptObj &&  <ConfirmButton
                  
                  onConfirm={() => { removeReceipt(receipt._id).then((res) => { console.log("delete"); console.log(res); props.onSave(); }) }} 
                    onCancel={() => console.log("cancel")}
                    buttonText={t("dashboard.delete")}
                    confirmText={t("invoice.confirmDelete")}
                    cancelText={t("invoice.cancelDelete")}
                    loadingText={t("contact.BeingDeleteingTheContact")}
                    wrapClass="py-2 text-center"
                    buttonClass="btn btn-lg"
                    mainClass="btn-warning  w-100  "
                    confirmClass="btn-danger mx-2 col col-auto order-2  w-25"
                    cancelClass=" btn-success col col-auto order-1 w-25"
                    loadingClass="visually-hidden"
                    disabledClass=""
                    once
                  >
                    {"Delete "}
                    <MdDelete />
                  </ConfirmButton>
}
              </div>
            </div>


          </form>
        </div>
      </div>
    </>
  );
  
                  
};

export default EditReceipt;
