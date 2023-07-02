import { CSSTransition } from 'react-transition-group';
import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { hasPermission } from "../utils/auth";

import { Helmet } from "react-helmet";
import {
  MdOutlineReceiptLong,
  MdEdit,
  MdClose,
  MdHistoryToggleOff,
  MdPayment,
  MdLocalShipping,
  MdOutlineCancel,
  MdContacts ,
  MdPhone,
  MdCollections,
  MdMoney
} from "react-icons/md";
import { ThreeDots } from 'react-loader-spinner';
import { useTranslation } from "react-i18next";
import ConfirmButton from "react-confirmation-button";
import { MdAdd, MdDelete } from "react-icons/md";
import { RiRefund2Fill } from "react-icons/ri";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {getPackage , removePackage} from "./PackageAPI"

const ViewPackage = (props) => {

  let navigate = useNavigate(); 
  const { packageId } = useParams();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const [Package , setPackage] = useState( { }) ;
  useEffect( () => {
    setLoading(true) ; 
  console.log("packageId:" +packageId) ; 
  getPackage(packageId).then(
    (res) =>{ 
      setPackage(res)
    }
  ).catch((error) =>{ console.log(error)}) 
  setLoading(false) ; 
  } , []) ; 


  return (
   (Package ? (  <>
      
    <div className="card">
        <h5 className="card-header">
          <MdCollections /> {t("Package.packageInformation")}   <span className="text-info px-1">  {Package.packageName  }  <MdMoney size={20}/>  { "  "  +Package.price}</span>
        </h5>
        <div className="card-body">

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

        <div className="row">

<div className="mb-3 col ">
    <div className="col col-auto"> {t("Package.packageName")  }</div>

    <div className="col">
      {Package.packageName}
    </div>
  </div>

  <div className="mb-3 col ">
    <div className="col col-auto"> {t("Package.status")  }</div>

    <div className="col">
      {Package.status}
    </div>
  </div>

  <div className="mb-3 col ">
    <div className="col col-auto"> {t("Package.price")  }</div>

    <div className="col">
      {Package.price}
    </div>
  </div>

  <div className="mb-3 col ">
    <div className="col col-auto"> {t("Package.numberOfSet")  }</div>

    <div className="col">
      {Package.numberOfSet}
    </div>
  </div>
  
  </div>

  <div className="row">

  <div className="mb-3 col ">
    <div className="col col-auto"> {t("Package.note")  }</div>

    <div className="col">
      {Package.note}
    </div>
  </div>

  </div>


  <div className="row text-right">
  <div className="mb-3  col justify-content-end">
    <Link className="btn btn-secondary btn-lg mx-2" to={"/admin/Package"}>
      <MdClose size={20} /> &nbsp; {t("close")}
    </Link>
    &nbsp;



    <Link className="btn btn-primary btn-lg" to={"/admin/Package/edit/" + Package._id}>
      <MdEdit size={20} />
      &nbsp; {t("dashboard.edit")}
    </Link>

  </div>


   <ConfirmButton
    onConfirm={() => { removePackage(packageId); navigate("/admin/Package/", { replace: true }); }}
    onCancel={() => console.log("cancel")}
    buttonText={t("dashboard.delete")}
    confirmText={t("invoice.confirmDelete")}
    cancelText={t("invoice.cancelDelete")}
    loadingText={t("contact.BeingDeleteingTheContact")}
    wrapClass="fdfdf"
    buttonClass="btn btn-lg"
    mainClass="btn-warning mx-2"
    confirmClass="btn-danger mx-2"
    cancelClass=" btn-success "
    loadingClass="visually-hidden"
    disabledClass=""
    once
  >
    {"Delete "}
    <MdDelete />
  </ConfirmButton> 

</div>
        </div>
        </div>

    
  </> ): "No Data Found") );
  

};

export default ViewPackage 