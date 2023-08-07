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
import {getSubscription , removeSubscription} from "./SubscriptionsAPI"
import moment from "moment";

const ViewSubscription = (props) => {

  let navigate = useNavigate(); 
  const { subscriptionId } = useParams();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const [subscription , setSubscription] = useState( { }) ;
  useEffect( () => {
    setLoading(true) ; 
  console.log("subscriptionId:" +subscriptionId) ; 
  getSubscription(subscriptionId).then(
    (res) =>{ 
      setSubscription(res)
      console.log("subscription:" )
      console.log( JSON.stringify(res)) ;
    }
  ).catch((error) =>{ console.log(error)}) 
  setLoading(false) ; 
  } , []) ; 





  moment.locale("en-GB");
  return (
   (subscription ?  (
      <>
        <div className="card">
          <div className="card-body">
            <h5 className="card-title"> <MdReceipt size= {20} />   {t("subscriptions.SubscriptionInformation")} ({subscription.seqNumber})</h5>
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
                  {t("subscriptions.contactInformation")}{" "}
                </div>
                <div className="col">
                  <hr />
                </div>
              </div>
  
              <div className="mb-3 row">
                  
                  <div className="mb-3 col ">
                      <div className="col col-auto">{t("subscriptions.contactName")}</div>
                      <div className="col col-auto">
              {subscription.contactName}
                      </div>
                    </div>
      
      
                    <div className="mb-3 col ">
                      <div className="col col-auto">{t("subscriptions.contactMobile")}</div>
                      <div className="col col-auto">
            {subscription.contactMobile}
                      
      
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
                  {t("subscriptions.packageInformation")}{" "}
                </div>
                <div className="col">
                  <hr />
                </div>
              </div>    
              <div className="mb-3 row">
                  
              <div className="mb-3 col ">
                  <div className="col col-auto">{t("subscriptions.packageName")}</div>
                  <div className="col col-auto">
             {subscription.packageName}
                  </div>
                </div>
  
  
              
  
  
                <div className="mb-3 col ">
                  <div className="col col-auto">{t("subscriptions.packagePrice")}</div>
                  <div className="col col-auto">
                  {
                        subscription.packagePrice? subscription.packagePrice.toFixed(2) : subscription.packagePrice
                      }
                  </div>
                </div>
  
  
                <div className="mb-3 col ">
                  <div className="col col-auto">{t("subscriptions.packageNumberOfSet")}</div>
                  <div className="col col-auto">
         { subscription.packageNumberOfSet}
                  </div>
                </div>
  
                
  
              </div>
                
  
              <div className="mb-3 row ">
                <div className="col col-auto text-info">
                  {t("subscriptions.SubscriptionInformation")}{" "}
                </div>
                <div className="col">
                  <hr />
                </div>
              </div>
  
              <div className="mb-3 row">
                  
                  <div className="mb-3 col ">
                      <div className="col col-auto">{t("subscriptions.subscriptionDate")}</div>
                      <div className="col">
                   {subscription.subscriptionDate? moment(subscription.subscriptionDate).format("DD/MM/yyyy") : "Not Set"}
                  </div>
                    </div>
      
      
                  
      
      
                    <div className="mb-3 col   ">
                      <div className="col col-auto">{t("subscriptions.subscriptionAmount")}</div>
                      <div className="col col-auto">
                     {subscription.subscriptionAmount? subscription.subscriptionAmount.toFixed(2) : subscription.subscriptionAmount}
                      </div>
                    </div>
      
      
      
                    <div className="mb-3 col ">
      <div className="col col-auto">{t("subscriptions.note")}</div>
      <div className="col col-auto">
       
      {subscription.note}
  
      </div>
    </div>
                   
      
                    
      
                  </div>
            
                  <div className="mb-3 row">
  
                  <div className="mb-3 col   ">
                      <div className="col col-auto">{t("subscriptions.subscriptionTotalInstallments")}</div>
                      <div className="col col-auto">
                         JOD {subscription.subscriptionTotalInstallments? subscription.subscriptionTotalInstallments.toFixed(2) : subscription.subscriptionTotalInstallments} 
                      </div>
                    </div>
                  
                  
  
                  <div className="mb-3 col   ">
                      <div className="col col-auto">{t("subscriptions.subscriptionTotalInvoice")}</div>
                      <div className="col col-auto">
                         JOD {subscription.subscriptionTotalInvoice? subscription.subscriptionTotalInvoice.toFixed(2) : subscription.subscriptionTotalInvoice} 
                      </div>
                    </div>
  
                    <div className="mb-3 col    ">
                      <div className="col col-auto">{t("subscriptions.subscriptionBalance")}</div>
                      <div className="col col-auto">
                         JOD {subscription.subscriptionBalance ? subscription.subscriptionBalance.toFixed(2) : subscription.subscriptionBalance } 
                      </div>
                    </div>
      
                  </div>
  
                  <div className="mb-3 row">
  
  <div className="mb-3 col   ">
      <div className="col col-auto">{t("subscriptions.subscriptionReminingAmount")}</div>
      <div className="col col-auto">
         JOD {subscription.subscriptionReminingAmount? subscription.subscriptionReminingAmount.toFixed(2) : subscription.subscriptionReminingAmount } 
      </div>
    </div>
    </div>
  
                  
              <div className="mb-3 row ">
                <div className="col col-auto text-info">
                  {t("subscriptions.installments")}{" "}
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
                     
                        <th width="20%">{t("subscriptions.installmentAmount") +  "  (JOD)"} </th>
                        <th width="20%">{t("subscriptions.installmentDate")} </th>
                        <th width="35%">{t("subscriptions.installmentNote")}</th>
                       
                    
                      </tr>
                    </thead>
  
                    <tbody>
                      { subscription.installments? subscription.installments.map((item) => (
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
                  <Link className="btn btn-secondary btn-lg" to="/admin/Subscription">
                    <MdClose size={20} /> &nbsp; {t("Cancel")}
                  </Link>{" "}
                  &nbsp;
             
                  <Link className="btn btn-primary btn-lg" to={"/admin/Subscription/edit/" + subscription._id}>
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

export default ViewSubscription