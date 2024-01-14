import { CSSTransition } from 'react-transition-group';
import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { hasPermission } from "../utils/auth";
import { getInvoices,updateInvoice}
    from '../Invoices/InvoicesAPI'
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
import  {getReceipt, updateReceipt ,getReceipts, removeReceipt} from './ReceiptAPI'
import moment from "moment";
 

/*const processReceipts = async (receipt) => {
  const invoices = await getInvoices({
    insuranceId: receipt.contact._id
  });
  let filter={
    seqNumber: "",
    contactId: receipt.contact._id,
    contractId: null,
};
// Call getReceipts to get the receipts data

const responseData = await getReceipts(filter);
// Extract the receipts array from the response data
const receiptslist = responseData.items;
  
  // Filter invoices where isApplied is false
  const filteredInvoices = invoices.items.filter(invoice => !invoice.isApplied);

  // Sort the filteredInvoices based on serialNumber
  filteredInvoices.sort((a, b) => {
    return a.serialNumber - b.serialNumber;
  });
  console.log("before:")

  console.log(receipt)
  console.log(filteredInvoices);

  // Loop through filteredInvoices and update values
  for (const invoice of filteredInvoices) {
  if(receipt.receiptBalance>invoice.legalMonetaryTotal.payableAmount){  invoice.isApplied = true;
    invoice.ObjectIdReceipt = receipt._id
    receipt.receiptBalance=receipt.receiptBalance-invoice.legalMonetaryTotal.payableAmount
    const newlistOfAppliedInvoicis={"INVID":invoice._id,"amount":invoice.legalMonetaryTotal.payableAmount};
    receipt.listOfAppliedInvoicis.push({newlistOfAppliedInvoicis})}
  else{
if(receiptslist.length>1){}

  }
  
  }
  console.log("after:")

  console.log(receipt)

  console.log(filteredInvoices);


};*/


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

  function isKeyInJSONAndNotNull(jsonObject, keyToCheck) {
    return jsonObject.hasOwnProperty(keyToCheck) && jsonObject[keyToCheck] !== null;
  }
  
  console.log("receipt:-------------------------------" )

  console.log(receipt)
  moment.locale("en-GB");
   
  return (
   (receipt ?  (
      <>
        <div className="card">
          <div className="card-body">
            <h5 className="card-title"> <MdReceipt size= {20} />   {t("receipt.ReceiptInformation")}  <span className='text-info'>({receipt.seqNumber})</span> </h5>
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
              {receipt.contact?.contactName}
                      </div>
                    </div>
      
      
                    <div className="mb-3 col ">
                      <div className="col col-auto">{t("receipt.contactMobile")}</div>
                      <div className="col col-auto">
            {receipt.contact?.mobile}
                      
      
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
                  <div className="col col-auto">{t("receipt.contract")}</div>
                  <div className="col col-auto">
             {receipt.contract?.seqNumber}
                  </div>
                </div>
  
  
              
  
  
                <div className="mb-3 col ">

                </div>
  
  
                <div className="mb-3 col ">

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
            
                  
              <div class="row text-right">
                <div className="mb-3  col justify-content-end">
                  <Link className="btn btn-secondary btn-lg d-print-none" to="/admin/Receipt">
                    <MdClose size={20} /> &nbsp; {t("Cancel")}
                  </Link>{" "}
                  &nbsp;

                  { isKeyInJSONAndNotNull(receipt, "ObjectIdinvoice") ? (
                    <Link style={{display: 'none'}}className="btn btn-primary btn-lg d-print-none" to={"/admin/Receipt/notfound/" + receipt._id}>
                    <MdEdit    size={20} />
                    &nbsp; {t("dashboard.edit")}
                  </Link> 
              
):(
  <Link className="btn btn-primary btn-lg d-print-none" to={"/admin/Receipt/edit/" + receipt._id}>
  <MdEdit size={20} />
  &nbsp; {t("dashboard.edit")}
</Link>  )}

{//receipt && receipt.contact && receipt.contact.contactType === "Insurance" && receipt.receiptBalance !== 0 && 
//(<td className="justify-content-end" style={{ textAlign: 'end', width: "20px", height: "5px" }}>
   // <Link href="#" onClick={() => processReceipts(receipt)} className="btn btn-primary btn-lg d-print-none" title="apply invoice">
     // Apply Invoice
    //</Link>
// </td>)
}
                    { !props.selectedReceiptObj && 
                
                <ConfirmButton
                onConfirm={() => { removeReceipt(receipt._id).then((res) => { console.log("delete") ;  console.log( res) ; navigate("/admin/Receipt/", { replace: true });   }) }} 
                onCancel={() => console.log("cancel")}
                buttonText={t("dashboard.delete")}
                confirmText={t("invoice.confirmDelete")}
                cancelText={t("invoice.cancelDelete")}
                loadingText={t("contact.BeingDeleteingTheContact")}
                wrapClass="pt-2"
                buttonClass="btn btn-lg d-print-none"
                mainClass="btn-warning"
                confirmClass="btn-danger mx-2 col col-auto order-2"
                cancelClass=" btn-success col col-auto order-1 "
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
    
   
    ): "No Data Found") );
  

};

export default ViewReceipt