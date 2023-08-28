import React, { useState, useEffect } from "react";
import { Link,useParams } from "react-router-dom";
import { createContact } from "./ContactAPI";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThreeDots } from  'react-loader-spinner';
import {  MdClose, MdContacts } from "react-icons/md";
import "react-datepicker/dist/react-datepicker.css";
import { CSSTransition } from 'react-transition-group';

const CreateContact = (props) => {

  const[showSubContactInfo, setShowSubContactInfo] =useState(true) ; 
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const [contact, setContact] = useState({
    contactType: "Client",
    deleted: false, 
    companyID: localStorage.getItem("companyId") ,
    company: localStorage.getItem("company") 
  });
  const [wasValidated, setWasValidated] = useState(false);

  const setIdentificationType = (event) => {
    let cloned = JSON.parse(JSON.stringify(contact));
    cloned.identificationType = event.target.value;
    setContact(cloned);
  };

  const setIdentificationValue = (event) => {
    let cloned = JSON.parse(JSON.stringify(contact));
    cloned.identificationValue = event.target.value;
    setContact(cloned);
  };

  const setContactName = (event) => {
    let cloned = JSON.parse(JSON.stringify(contact));
    cloned.contactName = event.target.value;
    setContact(cloned);
  };

  const setMobile = (event) => {
    let cloned = JSON.parse(JSON.stringify(contact));
    cloned.mobile = event.target.value;
    setContact(cloned);
  };

  const setEmail = (event) => {
    let cloned = JSON.parse(JSON.stringify(contact));
    cloned.email = event.target.value;
    setContact(cloned);
  };


  const setNote = (event) => {
    let cloned = JSON.parse(JSON.stringify(contact));
    cloned.note = event.target.value;
    setContact(cloned);
  };

  const setContactType = (event) => {
    let cloned = JSON.parse(JSON.stringify(contact));
    cloned.contactType = event.target.value;
    setContact(cloned);
    (event.target.value=="Employee" || event.target.value=="Insurance"  ? setShowSubContactInfo(false) : setShowSubContactInfo(true) )
  };


  
  const setSubContactName = (event) => {
    let cloned = JSON.parse(JSON.stringify(contact));
    cloned.subContactName = event.target.value;
    setContact(cloned);
  };


  const setSubContactMobile = (event) => {
    let cloned = JSON.parse(JSON.stringify(contact));
    cloned.subContactMobile = event.target.value;
    setContact(cloned);
  };

  
  const setSubContactEmail = (event) => {
    let cloned = JSON.parse(JSON.stringify(contact));
    cloned.subContactEmail = event.target.value;
    setContact(cloned);
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

  const [PlaceHolderIdentificationType, updatePlaceHolderIdentificationType] =
    useState("National ID");

  useEffect(() => {
    if (contact.identificationType === "NIN")
      updatePlaceHolderIdentificationType("National ID");
    else if (contact.identificationType ==="PN")
      updatePlaceHolderIdentificationType("Passport");
    else if (contact.identificationType === "TN")
      updatePlaceHolderIdentificationType("Tax Identification No,");
    else updatePlaceHolderIdentificationType("");
  }, [setIdentificationType]);
  
  function isBlank(str) {
    return !str || /^\s*$/.test(str);
  };

const viewItemValidMessage = (message) =>{
  toast.warning( message , 
  {
    position: toast.POSITION.TOP_RIGHT
  }
  );
};


function checkContact()
{
  let isValid =true ;
  if(isBlank(contact.contactName))
  {
    isValid= false ;
    viewItemValidMessage("Fill The Contact Name.") ;
  }

if(isBlank(contact.contactType))
{
  isValid= false ;
  viewItemValidMessage("Fill The Contact Type.") ;
}

if(isBlank(contact.mobile))
{
  isValid= false ;
  viewItemValidMessage("Fill The Contact Mobile.") ;
}
return isValid
}

  const doPost = (event)=> {
    setLoading(true);
    setWasValidated(true);
    if (checkContact()) 
    {
      createContact(contact).then( 
        (res) => { 
          setLoading(false);
          toast.success(t("succeed"));
          window.location.href = "/admin/Contact/view/" + res._id;
        }
      ).catch(
(e) => { console.log(e) ; setLoading(false) ;}

      ) ;
    }
    else 
    {
      setLoading(false);
    }


  } ;
  return (
    <div className="card">
      <div className="card-body">
        
        <h5 className="card-title"> <MdContacts size = {25}  /> &#160;  {t("contact.newContact")} </h5>
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
        <form>
          <div className="mb-3 row ">
            <div className="col col-auto text-info">
              {t("contact.ContactInformation")}{" "}
            </div>
            <div className="col">
              <hr />
            </div>
          </div>

          <div className="mb-3 row">

          <div className="mb-3 col ">
              <div className="col col-auto">
                {t("contact.contactType")}
              </div>
              <div className="col col-auto">
                <select
                  type="text"
                  className= {selectFieldClass(contact.contactType)}
                  id="contactType"
                  name="contactType"
                  value={contact.contactType}
                  onChange={setContactType}
                >
                  <option value=""> أختر </option>
                  <option value="Client">Client</option>
                  <option value="Employee">Employee</option>
                  <option value="Insurance"> Insurance </option>
                  <option value="Vendor">Vendor</option>

                
                </select>
              </div>
            </div>

            <div className="mb-3 col ">
              <div className="col col-auto">{t("contact.contactName")}</div>
              <div className="col">
                <input
                  type="text"
                  className={fieldClass(contact.contactName)}
                  id="fullName"
                  name="fullName"
                  onChange={setContactName}
                  placeholder={t("contact.contactName")}
                />
              </div>
            </div>
           
            <div className="mb-3 col ">
              <div className="col col-auto">{t("contact.mobile")} </div>
              <div className="col">
                <input
                  type="text"
                  className= {fieldClass(contact.mobile)}
                  id="mobile"
                  name="mobile"
                  value={contact.mobile}
                  placeholder="Phone Number"
                  onChange={setMobile}
                />
              </div>
            </div>

         
          
          
            <div className="mb-3 col "></div>
          </div>

          <CSSTransition
                    in={showSubContactInfo}
                    timeout={700}
                    classNames="list-transition"
                    unmountOnExit
                  >
<>
          <div className="mb-3 row" >
          <div className="mb-3 col ">
              <div className="col col-auto">
                {t("contact.identificationType")}
              </div>
              <div className="col col-auto">
                <select
                  type="text"
                  className="form-control"
                  id="IdentificationType"
                  name="IdentificationType"
                  value={contact.identificationType}
                  onChange={setIdentificationType}
                >
                  <option value=""> أختر </option>
                  <option value="NIN">National ID</option>
                  <option value="PN">Passport</option>
                  <option value="TN">Tax Identification No,</option>
                </select>
              </div>
            </div>

            <div className="mb-3 col ">
              <div className="col col-auto">
                {t("contact.identificationValue")}
              </div>
              <div className="col col">
                <input
                  type="text"
                  className="form-control"
                  id="identificationValue"
                  name="identificationValue"
                  placeholder={PlaceHolderIdentificationType}
                  onChange={setIdentificationValue}
                />
              </div>
            </div>

            <div className="mb-3 col ">
              <div className="col col-auto">{t("contact.email")}</div>
              <div className="col">
                <input
                  type="text"
                  className= "form-control"
                  id="fullName"
                  name="fullName"
                  onChange={setEmail}
                  placeholder={t("contact.email")}
                />
              </div>
            </div>
            <div className="mb-3 col "></div>

          </div>

         
      


<div className="mb-3 row ">
            <div className="col col-auto text-info">
              {t("contact.subContactInformation")}{" "}
            </div>
            <div className="col">
              <hr />
            </div>
          </div>

          <div className="mb-3 row">
            <div className="mb-3 col ">
              <div className="col col-auto">{t("contact.subContactName")}</div>
              <div className="col">
                <input
                  type="text"
                  className= "form-control"
                  id="subContactName"
                  name="subContactName"
                  onChange={setSubContactName}
                  placeholder={t("contact.subContactName")}
                />
              </div>
            </div>
            <div className="mb-3 col ">
              <div className="col col-auto">{t("contact.subContactMobile")} </div>
              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  id="subContactMobile"
                  name="subContactMobile"
                  value={contact.subContactMobile}
                  placeholder={t("contact.subContactMobile")}
                  onChange={setSubContactMobile}
                />
              </div>
            </div>
            <div className="mb-3 col ">
              <div className="col col-auto">{t("contact.subContactEmail")}</div>
              <div className="col">
                <input
                  type="text"
                  className= "form-control"
                  id="subContactEmail"
                  name="subContactEmail"
                  onChange={setSubContactEmail}
                  placeholder={t("contact.subContactEmail")}
                />
              </div>
            </div>
            <div className="mb-3 col "></div>
            </div>

</>
                  </CSSTransition>
      

      
            <div className="mb-3 row">
  
  <div className="mb-3 col ">
    <div className="col col-auto">{t("contact.note")} </div>
    <div className="col">
<textarea
className="form-control"
id="note"
name="note"
placeholder= "weewwewe"
value={contact.note}
onChange={setNote}>  </textarea>

  </div>
  </div>
  <div className="mb-3 col "></div>
  <div className="mb-3 col "></div>
  <div className="mb-3 col "></div>
  </div>

          
  <div class = "row text-right">
          <div className="mb-3  col justify-content-end">
            <Link className="btn btn-secondary btn-lg" to="/admin/contact">
            <MdClose size={20} /> &nbsp; {t("Cancel")}
            </Link>{" "}
            &nbsp;
            <button type="button" className="btn btn-primary btn-lg" onClick={doPost}>
              {t("dashboard.submit")}
            </button>
          </div>
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default CreateContact;
