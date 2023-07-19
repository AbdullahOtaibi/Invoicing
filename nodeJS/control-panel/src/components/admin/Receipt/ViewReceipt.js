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
import { MdAdd, MdDelete, MdReceipt } from "react-icons/md";
import { RiRefund2Fill } from "react-icons/ri";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {getReceipt , removeReceipt} from "./ReceiptAPI"
import moment from "moment";

const ViewReceipt = (props) => {

  let navigate = useNavigate(); 
  const { receiptId } = useParams();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const [receipt , setReceipt] = useState( { }) ;
  useEffect( () => {
    setLoading(true) ; 
  console.log("receiptId:" +receiptId) ; 
  getReceipt(receiptId).then(
    (res) =>{ 
      setReceipt(res)
      console.log("receipt:" )
      console.log( JSON.stringify(res)) ;
    }
  ).catch((error) =>{ console.log(error)}) 
  setLoading(false) ; 
  } , []) ; 





  moment.locale("en-GB");
  return (
   (receipt ?  (
      <>
        <div className="card">
          <div className="card-body">
            <h5 className="card-title"> <MdReceipt size= {20} />   {t("receipt.ReceiptInformation")}</h5>
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
              {receipt.contactName}
                      </div>
                    </div>
      
      
                    <div className="mb-3 col ">
                      <div className="col col-auto">{t("receipt.contactMobile")}</div>
                      <div className="col col-auto">
            {receipt.contactMobile}
                      
      
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
             {receipt.packageName}
                  </div>
                </div>
  
  
              
  
  
                <div className="mb-3 col ">
                  <div className="col col-auto">{t("receipt.packagePrice")}</div>
                  <div className="col col-auto">
                  {
                        receipt.packagePrice? receipt.packagePrice.toFixed(2) : receipt.packagePrice
                      }
                  </div>
                </div>
  
  
                <div className="mb-3 col ">
                  <div className="col col-auto">{t("receipt.packageNumberOfSet")}</div>
                  <div className="col col-auto">
         { receipt.packageNumberOfSet}
                  </div>
                </div>
  
                
  
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
                      <div className="col col-auto">{t("receipt.receiptDate")}</div>
                      <div className="col">
                   {receipt.receiptDate? moment(receipt.receiptDate).format("DD/MM/yyyy") : "Not Set"}
                  </div>
                    </div>
      
      
                  
      
      
                    <div className="mb-3 col   ">
                      <div className="col col-auto">{t("receipt.receiptAmount")}</div>
                      <div className="col col-auto">
                     {receipt.receiptAmount? receipt.receiptAmount.toFixed(2) : receipt.receiptAmount}
                      </div>
                    </div>
      
      
      
                    <div className="mb-3 col ">
      <div className="col col-auto">{t("receipt.note")}</div>
      <div className="col col-auto">
       
      {receipt.note}
  
      </div>
    </div>
                   
      
                    
      
                  </div>
            
                  <div className="mb-3 row">
  
                  <div className="mb-3 col   ">
                      <div className="col col-auto">{t("receipt.receiptTotalInstallments")}</div>
                      <div className="col col-auto">
                         JOD {receipt.receiptTotalInstallments? receipt.receiptTotalInstallments.toFixed(2) : receipt.receiptTotalInstallments} 
                      </div>
                    </div>
                  
                  
  
                  <div className="mb-3 col   ">
                      <div className="col col-auto">{t("receipt.receiptTotalInvoice")}</div>
                      <div className="col col-auto">
                         JOD {receipt.receiptTotalInvoice? receipt.receiptTotalInvoice.toFixed(2) : receipt.receiptTotalInvoice} 
                      </div>
                    </div>
  
                    <div className="mb-3 col    ">
                      <div className="col col-auto">{t("receipt.receiptBalance")}</div>
                      <div className="col col-auto">
                         JOD {receipt.receiptBalance ? receipt.receiptBalance.toFixed(2) : receipt.receiptBalance } 
                      </div>
                    </div>
      
                  </div>
  
                  <div className="mb-3 row">
  
  <div className="mb-3 col   ">
      <div className="col col-auto">{t("receipt.receiptReminingAmount")}</div>
      <div className="col col-auto">
         JOD {receipt.receiptReminingAmount? receipt.receiptReminingAmount.toFixed(2) : receipt.receiptReminingAmount } 
      </div>
    </div>
    </div>
  
                  
              <div className="mb-3 row ">
                <div className="col col-auto text-info">
                  {t("receipt.installments")}{" "}
                </div>
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
                     
                        <th width="20%">{t("receipt.installmentAmount") +  "  (JOD)"} </th>
                        <th width="20%">{t("receipt.installmentDate")} </th>
                        <th width="35%">{t("receipt.installmentNote")}</th>
                       
                    
                      </tr>
                    </thead>
  
                    <tbody>
                      { receipt.installments? receipt.installments.map((item) => (
                        <tr>
                          <td> {item.installmentSequance} </td>
                          <td>{item.installmentAmount}</td>
                          <td>{item.installmentDate ? moment(item.installmentDate).format("DD/MM/yyyy") : "Not Set"} </td>
                          <td>{item.installmentNote} </td>
      
                          
                        </tr>
                      )) : <tr></tr>}
  

                    </tbody>
                    <tfoot></tfoot>
                  </table>
                  
                </div>
              </div>
  
            
  
  
  
  
              <div class="row text-right">
                <div className="mb-3  col justify-content-end">
                  <Link className="btn btn-secondary btn-lg" to="/admin/Receipt">
                    <MdClose size={20} /> &nbsp; {t("Cancel")}
                  </Link>{" "}
                  &nbsp;
             
                  <Link className="btn btn-primary btn-lg" to={"/admin/Receipt/edit/" + receipt._id}>
                      <MdEdit size={20} />
                      &nbsp; {t("dashboard.edit")}
                    </Link> 
                </div>
              </div>
            </form>
          </div>
        </div>
      </>
    
   
    ): "No Data Found") );
  

};

export default ViewReceipt