import React, { useState, useEffect } from "react";
import { Link,useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThreeDots } from  'react-loader-spinner';
import {  MdClose, MdCollections, MdContacts, MdReceipt } from "react-icons/md";
import "react-datepicker/dist/react-datepicker.css";
import { CSSTransition } from 'react-transition-group';
import  {createReceipt} from './ReceiptAPI'
import ContactSearchControl from "../Contact/ContactSearchControl";

const CreateReceipt = (props) => {

  const [wasValidated, setWasValidated] = useState(false);

  const [receipt , setReceipt] = useState( { 
    deleted: false,
    companyID: localStorage.getItem("companyId"),
    company: localStorage.getItem("company"), 
    status: "Active"
  }) ;  
  
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();


  const setConatct = (item) => {
    if (item) {
      let cloned =JSON.parse(JSON.stringify(receipt)) ;
      cloned.contactName = item.contactName;
      cloned.contact = item._id;
      cloned.contactMobile = item.mobile; 
      setReceipt(cloned);
      
    }
  };

  
  const setPackageName = (event) => {

     let cloned =JSON.parse(JSON.stringify(receipt)) ;
     cloned.packageName = event.target.value; 
     setReceipt(cloned)

  } ;

  const setStatus = (event) => {

    let cloned =JSON.parse(JSON.stringify(receipt)) ;
    cloned.status = event.target.value; 
    setReceipt(cloned)

 } ;

  const setPrice = (event) => {
    let cloned =JSON.parse(JSON.stringify(receipt)) ;
    cloned.price = event.target.value; 
    setReceipt(cloned)
  };

  const setNumberOfSet = (event) => {
    let cloned =JSON.parse(JSON.stringify(receipt)) ;
    cloned.numberOfSet = event.target.value; 
    setReceipt(cloned)
  };

  const setNote = (event) => {
    let cloned =JSON.parse(JSON.stringify(receipt)) ;
    cloned.note = event.target.value; 
    setReceipt(cloned)
  };

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

  const doPost = (event) => {
    setWasValidated(true) ;
    setLoading(true) ;

    if(checkData()) {
      createReceipt(receipt).then((res)=> {
        toast("success!") ;
         window.location.href = "/admin/Receipt/ViewPackage/" + res._id;
  
      }).catch((err)=> { console.log(err)}) ;
    }
    setLoading(false) ; 
  }
 

function checkData() 
{
  console.log( "insert checkdata ...") 
  let isValid= true;

 if (isBlank(receipt.packageName)) 
 {
  viewItemValidMessage("Fill the package Name") 
  isValid = false ; 
 }

 if ( isBlank(receipt.status)) 
 {
  viewItemValidMessage("Fill the package status") 
  isValid = false ; 
 }

 if ( isBlank(receipt.price)) 
 {
  viewItemValidMessage("Fill the package price") 
  isValid = false ; 
 }
 
 if ( isBlank(receipt.numberOfSet)) 
 {
  viewItemValidMessage("Fill the Number Of Set") 
  isValid = false ; 
 }

  return isValid; 
};

const viewItemValidMessage = (message) => {
  toast.warning(message, {
    position: toast.POSITION.TOP_RIGHT,
  });
};


  return (
    <>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title"> <MdReceipt size= {20} />   {t("receipt.createReceipt")}</h5>
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
                    handleSelectContact={setConatct}
                    wasValidated={wasValidated}
                    value = {receipt.contactName}
                    contactType = {["Client" , "Vendor"]}

                  />
                    </div>
                  </div>
    
    
                  <div className="mb-3 col ">
                    <div className="col col-auto">{t("receipt.contactMobile")}</div>
                    <div className="col col-auto">
          
                    <input
                        type="text"
                        className= {fieldClass(receipt.contactMobile)}
                        id="price"
                        name="price"
                        placeholder={t("receipt.contactMobile")}
                        value={
                          receipt.contactMobile
                        }
                      />
                    
    
                    </div>
                  </div>
    
    
                  <div className="mb-3 col ">
                    <div className="col col-auto"></div>
                    <div className="col col-auto">
                 
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
                {t("receipt.packageInformation")}{" "}
              </div>
              <div className="col">
                <hr />
              </div>
            </div>    
            <div className="mb-3 row">
                
            <div className="mb-3 col ">
                <div className="col col-auto">{t("receipt.packageName")}</div>
                <div className="col col-auto">
                <input
                    type="text"
                    className= {fieldClass(receipt.packageName)}
                    id="packageName"
                    name="packageName"
                    placeholder={t("receipt.packageName")}
                    onChange={setPackageName}
                    value={
                      receipt.packageName
                    }
                  />
                </div>
              </div>


              <div className="mb-3 col ">
                <div className="col col-auto">{t("receipt.status")}</div>
                <div className="col col-auto">
      

                    <select
                    type="text"
                    className={selectFieldClass( receipt.status)}
                    id="status"
                    name="status"
                    onChange={setStatus}
                    value={ receipt.status}
                  >
                    <option value=""> اخنر </option>
                    <option value="Active">Active</option>
                    <option value="In Active">In Active</option>
                   
                  </select>

                </div>
              </div>


              <div className="mb-3 col ">
                <div className="col col-auto">{t("receipt.price")}</div>
                <div className="col col-auto">
                <input
                    type="text"
                    className= {fieldClass(receipt.price)}
                    id="price"
                    name="price"
                    placeholder={t("receipt.price")}
                    onChange={setPrice}
                    value={
                      receipt.price
                    }
                  />
                </div>
              </div>


              <div className="mb-3 col ">
                <div className="col col-auto">{t("receipt.numberOfSet")}</div>
                <div className="col col-auto">
                <input
                    type="text"
                    className= {fieldClass(receipt.numberOfSet)}
                    id="numberOfSet"
                    name="numberOfSet"
                    placeholder={t("receipt.numberOfSet")}
                    onChange={setNumberOfSet}
                    value={
                      receipt.numberOfSet
                    }
                  />
                </div>
              </div>

              

            </div>
              

          

            <div className="mb-3 row ">
              <div className="col col-auto text-info">
                {t("receipt.newInstallment")}{" "}
              </div>
              <div className="col">
                <hr />
              </div>
            </div>    
            <div className="mb-3 row">
                
            <div className="mb-3 col ">
                <div className="col col-auto">{t("receipt.packageName")}</div>
                <div className="col col-auto">
                <input
                    type="text"
                    className= {fieldClass(receipt.packageName)}
                    id="packageName"
                    name="packageName"
                    placeholder={t("receipt.packageName")}
                    onChange={setPackageName}
                    value={
                      receipt.packageName
                    }
                  />
                </div>
              </div>


              <div className="mb-3 col ">
                <div className="col col-auto">{t("receipt.status")}</div>
                <div className="col col-auto">
      

                    <select
                    type="text"
                    className={selectFieldClass( receipt.status)}
                    id="status"
                    name="status"
                    onChange={setStatus}
                   // value={ receipt.status}
                  >
                    <option value=""> اخنر </option>
                    <option value="Active">Active</option>
                    <option value="In Active">In Active</option>
                   
                  </select>

                </div>
              </div>


              <div className="mb-3 col ">
                <div className="col col-auto">{t("receipt.price")}</div>
                <div className="col col-auto">
                <input
                    type="text"
                    className= {fieldClass(receipt.price)}
                    id="price"
                    name="price"
                    placeholder={t("receipt.price")}
                    onChange={setPrice}
                    value={
                      receipt.price
                    }
                  />
                </div>
              </div>


              <div className="mb-3 col ">
                <div className="col col-auto">{t("receipt.numberOfSet")}</div>
                <div className="col col-auto">
                <input
                    type="text"
                    className= {fieldClass(receipt.numberOfSet)}
                    id="numberOfSet"
                    name="numberOfSet"
                    placeholder={t("receipt.numberOfSet")}
                    onChange={setNumberOfSet}
                    value={
                      receipt.numberOfSet
                    }
                  />
                </div>
              </div>

              

            </div>


            <div className="mb-3 row ">

<div className="mb-3 col ">
    <div className="col col-auto">{t("receipt.note")}</div>
    <div className="col col-auto">
     
    <textarea
        className="form-control"
        id="note"
        name="note"
        onChange={setNote}
        placeholder={t("receipt.note")}
      >
        {receipt.note}
      </textarea>

    </div>
  </div>

  <div className="mb-3 col "></div>
  <div className="mb-3 col "></div>
  <div className="mb-3 col "></div>
</div>

            <div class="row text-right">
              <div className="mb-3  col justify-content-end">
                <Link className="btn btn-secondary btn-lg" to="/admin/Package">
                  <MdClose size={20} /> &nbsp; {t("Cancel")}
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
    </>
  );
  
                  
};

export default CreateReceipt;
