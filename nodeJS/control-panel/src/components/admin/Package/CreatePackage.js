import React, { useState, useEffect } from "react";
import { Link,useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThreeDots } from  'react-loader-spinner';
import {  MdClose, MdCollections, MdContacts } from "react-icons/md";
import "react-datepicker/dist/react-datepicker.css";
import { CSSTransition } from 'react-transition-group';
import  {createPackage} from './PackageAPI'

const CreatePackage = (props) => {

  const [wasValidated, setWasValidated] = useState(false);

  const [Package , setPackage] = useState( { 
    deleted: false,
    companyID: localStorage.getItem("companyId"),
    company: localStorage.getItem("company"), 
    status: "Active",
    "frequency": "monthly",
  }) ;  
  
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const setPackageName = (event) => {

     let cloned =JSON.parse(JSON.stringify(Package)) ;
     cloned.packageName = event.target.value; 
     setPackage(cloned)

  } ;

  const setStatus = (event) => {

    let cloned =JSON.parse(JSON.stringify(Package)) ;
    cloned.status = event.target.value; 
    setPackage(cloned)

 } ;

  const setPrice = (event) => {
    let cloned =JSON.parse(JSON.stringify(Package)) ;
    cloned.price = event.target.value; 
    setPackage(cloned)
  };

  const setNumberOfSet = (event) => {
    let cloned =JSON.parse(JSON.stringify(Package)) ;
    cloned.numberOfSet = event.target.value; 
    setPackage(cloned)
  };

  const updateFrequency = (event) => {
    let cloned =JSON.parse(JSON.stringify(Package)) ;
    cloned.frequency = event.target.value; 
    setPackage(cloned)
  };

  const setNote = (event) => {
    let cloned =JSON.parse(JSON.stringify(Package)) ;
    cloned.note = event.target.value; 
    setPackage(cloned)
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
      createPackage(Package).then((res)=> {
        toast("success!") ;
         window.location.href = "/admin/Package/ViewPackage/" + res._id;
  
      }).catch((err)=> { console.log(err)}) ;
    }
    setLoading(false) ; 
  }
 

function checkData() 
{
  console.log( "insert checkdata ...") 
  let isValid= true;

 if (isBlank(Package.packageName)) 
 {
  viewItemValidMessage("Fill the package Name") 
  isValid = false ; 
 }

 if ( isBlank(Package.status)) 
 {
  viewItemValidMessage("Fill the package status") 
  isValid = false ; 
 }

 if ( isBlank(Package.price)) 
 {
  viewItemValidMessage("Fill the package price") 
  isValid = false ; 
 }
 
 if ( isBlank(Package.numberOfSet)) 
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
          <h5 className="card-title"> <MdCollections size= {20} />   {t("Package.createPackage")}</h5>
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
                {t("Package.packageInformation")}{" "}
              </div>
              <div className="col">
                <hr />
              </div>
            </div>

            <div className="mb-3 row">
                
            <div className="mb-3 col ">
                <div className="col col-auto">{t("Package.packageName")}</div>
                <div className="col col-auto">
                <input
                    type="text"
                    className= {fieldClass(Package.packageName)}
                    id="packageName"
                    name="packageName"
                    placeholder={t("Package.packageName")}
                    onChange={setPackageName}
                    value={
                      Package.packageName
                    }
                  />
                </div>
              </div>


              <div className="mb-3 col ">
                <div className="col col-auto">{t("Package.status")}</div>
                <div className="col col-auto">
      

                    <select
                    type="text"
                    className={selectFieldClass( Package.status)}
                    id="status"
                    name="status"
                    onChange={setStatus}
                    value={ Package.status}
                  >
                    <option value=""> اخنر </option>
                    <option value="Active">Active</option>
                    <option value="In Active">In Active</option>
                   
                  </select>

                </div>
              </div>


              <div className="mb-3 col ">
                <div className="col col-auto">{t("Package.price")}</div>
                <div className="col col-auto">
                <input
                    type="text"
                    className= {fieldClass(Package.price)}
                    id="price"
                    name="price"
                    placeholder={t("Package.price")}
                    onChange={setPrice}
                    value={
                      Package.price
                    }
                  />
                </div>
              </div>


              <div className="mb-3 col ">
                <div className="col col-auto">{t("Package.numberOfSet")}</div>
                <div className="col col-auto">
                <input
                    type="text"
                    className= {fieldClass(Package.numberOfSet)}
                    id="numberOfSet"
                    name="numberOfSet"
                    placeholder={t("Package.numberOfSet")}
                    onChange={setNumberOfSet}
                    value={
                      Package.numberOfSet
                    }
                  />
                </div>
              </div>

              

            </div>

            <div className="mb-3 row ">

            <div className="mb-3 col ">
                <div className="col col-auto mb-2">{t("Package.frequency")}</div>
                <div className="col col-auto">
                <select
                    onChanange={updateFrequency}
                    className="form-select"
                    placeholder={t("Package.frequency")}
                    value={
                      Package.frequency
                    }
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>



            

            <div className="mb-3 col ">
                <div className="col col-auto mb-2">{t("Package.note")}</div>
                <div className="col col-auto">
                 
                <textarea
                    className="form-control"
                    id="note"
                    name="note"
                    onChange={setNote}
                    placeholder={t("Package.note")}
                  >
                    {Package.note}
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

export default CreatePackage;
