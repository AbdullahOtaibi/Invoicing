import { CSSTransition } from 'react-transition-group';
import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { hasPermission } from "../utils/auth";
import { getInvoice, removeInvoice, updateInvoice, postToTax } from "./InvoicesAPI";
import { Helmet } from "react-helmet";
import {
  MdOutlineReceiptLong,
  MdEdit,
  MdClose,
  MdHistoryToggleOff,
  MdPayment,
  MdLocalShipping,
  MdOutlineCancel,
} from "react-icons/md";
import Loader from "react-loader-spinner";
import { useTranslation } from "react-i18next";
import Moment from "react-moment";
import { getLocalizedText } from "../utils/utils";
import ConfirmButton from "react-confirmation-button";
import { MdAdd, MdDelete } from "react-icons/md";
import { RiRefund2Fill } from "react-icons/ri";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";




//const ViewOrder = (props) => {

const ViewInvoice = (props) => {
  
    let navigate = useNavigate();

    /*
    let navigate = useNavigate();
    if (!hasPermission('invoice.view')) {
        navigate("/admin", { replace: true });
    }
    */
    
  const { invoiceId } = useParams();
  const [invoice, setInvoice] = useState();
  const [loading, setLoading] = useState(false);
  const { t, i18n } = useTranslation();



  useEffect(() => {
    setLoading(true);
    getInvoice(invoiceId)
      .then((data) => {
        console.log("test ........");
        console.log(data);
        setLoading(true);
        setInvoice(data);
        console.log(data);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  }, []);

  function getInvoiceType() {
    if (invoice.invoiceType == "011") return "انشاء فاتورة جديدة نقدية";
    else if (invoice.invoiceType == "021") return "أنشاء فاتورة ذمم";
    return "";
  }

  function getInvoiceDate() {
    let x = invoice.issuedDate.toString();
    let d = new Date(x);
    let str =
      d.getFullYear() +
      "/" +
      (d.getMonth().length == 2
        ? parseInt(d.getMonth()) + 1
        : "0" + (parseInt(d.getMonth()) + 1)) +
      "/" +
      d.getDate();
    return str;
  }

  function getIdentificationType() {
    let type = invoice.accountingCustomerParty.partyIdentification.schemeID;
    if (type == "NIN") return "National ID";
    else if (type == "PN") return "Passport";
    else if (type == "TN") return "Tax Identification No,";

    return "";
  }
  

  const doPostToTax = (data) => {
    setLoading(true);
    postToTax(invoice._id).then(res => {
      setLoading(false);
      setInvoice({...invoice, status:'posted'});
      console.log("success invoice ......") ;
      // window.location.href = "/admin/invoices/ViewInvoice/" + res._id;
     // window.location.href =  "/admin/invoices/ViewInvoice/" +invoice._id;
      //console.log(res.data);
    }).catch(e => {
      console.log("error post to tax") ;
      console.log( e) ;
      setLoading(false);
    });
    console.log(invoice);
    console.log(data);
  };

  const [showXML, setShowXML] = useState(false);

  function numericFormat(val)
{
    return ! isNaN (val)? val.toFixed(3): val ; 
}

  return (
    <>
      {invoice ? (
        <div className="card">
          <h5 className="card-header">
            <MdOutlineReceiptLong /> {t("invoice.InvoiceDetails")}   <span className="text-info px-1">  ({  invoice.seqNumber} ) </span>
          
          </h5>
          <div className="card-body">
            <div className="container text-center">
              <Loader
                type="ThreeDots"
                color="#00BFFF"
                height={100}
                width={100}
                visible={loading}
              />
            </div>
            <br />

            <form>

          
            <div className="row text-right">
       
       <div class = "mb-3  col justify-content-end">


              {
               (invoice.status != "posted") &&
               <button
                  type="button"
                  className="btn btn-success btn-lg mx-2"
                  onClick={doPostToTax}
                >
                    <MdPayment size={25} /> &nbsp;
                    {t("invoice.postToTax")}
                </button>
}

{
               (invoice.status == "posted") &&
               <button
                  type="button"
                  className="btn btn-success btn-lg mx-2"
                  onClick={()=>{console.log('reverted ....')}}
                >
                    <RiRefund2Fill size={20} />
                    {t("invoice.revertInvoice")}
                </button>
}
  
            
          
       </div>
              
                </div>
              

              <div className="mb-3 row ">
                <div className="col col-auto text-info">{t("invoice.InvoiceSummery")}</div>
                <div className="col">
                  <hr />
                </div>
              </div>

              

              <div className="row">
              <div className="mb-3 col ">
                  <div className="col col-auto"> {t("invoice.seqNumber")}</div>
                  <div className="col">
                     {invoice.seqNumber}
                  </div>
                </div>

                <div className="mb-3 col ">
                  <div className="col col-auto"> {t("invoice.status")}</div>

                  <div className="col">
                  {invoice.status}
                  </div>
                </div>

                <div className="mb-3 col "></div>
                <div className="mb-3 col "></div>
              </div>

              <div className="row">
                <div className="mb-3 col ">
                  <div className="col col-auto"> {t("invoice.TaxExclusiveAmount")}</div>

                  <div className="col">
                    JOD {invoice.legalMonetaryTotal.taxExclusiveAmount.toFixed(3)}
                  </div>
                </div>

                <div className="mb-3 col ">
                  <div className="col col-auto"> {t("invoice.AllowanceTotalAmount")}</div>

                  <div className="col">
                    JOD {invoice.legalMonetaryTotal.allowanceTotalAmount.toFixed(3)}
                  </div>
                </div>

                <div className="mb-3 col ">
                  <div className="col col-auto"> {t("invoice.TaxInclusiveAmount")}</div>

                  <div className="col">
                    JOD {invoice.legalMonetaryTotal.taxInclusiveAmount.toFixed(3)}
                  </div>
                </div>

              

                <div className="mb-3 col ">
                  <div className="col col-auto"> {t("invoice.PayableAmount")}</div>

                  <div className="col">
                    JOD {invoice.legalMonetaryTotal.payableAmount.toFixed(3)}
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="mb-3 col ">
                  <div className="col col-auto"> {t("invoice.Type")}</div>
                  <div className="col">{getInvoiceType()}</div>
                </div>

                <div className="mb-3 col ">
                  <div className="col col-auto">{t("invoice.invoiceDate")}</div>

                  <div className="col"> {getInvoiceDate()}</div>
                </div>

                <div className="mb-3 col ">
            <div className="col col-auto">{t("invoice.note")} </div>

            <div className="col">
            {invoice.note}
            </div>
            </div>
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
                  <div className="col col-auto">{t("invoice.fullName")}</div>
                  <div className="col">
                    {invoice.accountingCustomerParty.registrationName}
                  </div>
                </div>
                
                <div className="mb-3 col ">
                  <div className="col col-auto"> {t("invoice.IdentificationType")} </div>
                  <div className="col col-auto">{getIdentificationType()}</div>
                </div>

                <div className="mb-3 col ">
                  <div className="col col-auto"> {t("invoice.IdentificationValue")}  </div>
                  <div className="col col">
                    {invoice.accountingCustomerParty.partyIdentification.value}
                  </div>
                </div>

           
                <div className="mb-3 col ">
                  <div className="col col-auto">{t("invoice.PhoneNumber")}</div>
                  <div className="col">
                    {invoice.accountingCustomerParty.telephone}
                  </div>
                </div>
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
                    <th width ="5%">#</th>
                    <th width ="20%" >{t("Name")}</th>
                    <th width ="15%"> {t("Price")} </th>
                    <th width ="15%">{t("Qty")}</th>
                    <th width ="15%">{t("Allowance")}</th>
                    <th width ="15%">{t("Subtotal")}</th>
                    <th width ="15%">{t("Net")}</th>
                  
                  </tr>
                </thead>

                <tbody>
       {  invoice.items.map((item)=>(
          <tr>
                      <td> {item.sequance} </td>
                      <td>{item.itemName}</td>
                      <td>{numericFormat(item.unitPrice)} </td>
                      <td>{item.qty} </td>
                      <td>{numericFormat(item.allowance)}  </td>
                      <td> { numericFormat(parseFloat(item.unitPrice) * parseFloat(item.qty))   }</td>
                      <td> {numericFormat(item.lineExtensionAmount)}</td>

          </tr>

       )) }

                 
                </tbody>
                <tfoot className="table-light">
                    <td></td>
                    <td colSpan= "4" className="text-info" > Grand Total</td>
                    
                    <td className="text-info" > {numericFormat(invoice.legalMonetaryTotal.taxExclusiveAmount)}</td>
                    <td className="text-info" > {numericFormat(invoice.legalMonetaryTotal.taxInclusiveAmount)} </td>
                </tfoot>
              </table>
            </div>
          </div>

     

{ invoice.status == "stuck" ?


<div> 

<button  type="button"  onClick={() => {console.log("click div"); setShowXML(!showXML)}} class="btn btn-primary btn-lg mt-3">{!showXML? 'View Transaction Dateils' : 'Hide Transaction Dateils'}</button>

<CSSTransition
        in={showXML}
        timeout={700}
        classNames="list-transition"
        unmountOnExit
      >
        <div className='list-transition'>
          <div className="mb-3 row alert">
                <div className="col col-auto text-danger">{t("invoice.XMLTransactionError")}</div>
                <div className="col">
                  <hr />
                </div>
         </div>

         <div className="row">
                <div className="mb-6 col ">
                  <div className="col col-auto  text-danger"> {t("invoice.xmlRequest")}</div>

                  <div className="col mb-6"><textarea  className="col mb-6" style={{border:'3px solid #eee'}} value={invoice.postedXML}> </textarea> </div>
                </div>

                <div className="mb-6 col ">
                  <div className="col col-auto  text-danger">{t("invoice.xmlResponse")}</div>

                  <div className="col mb-6"> <textarea  className="col mb-6" style={{border:'3px solid #eee'}}  value={invoice.responseXML} > </textarea>  </div>
                </div>
          </div>
          <div className="row">

          <div className="mb- col ">
                  <div className="col col-auto  text-danger"> {t("invoice.developerCommnet")}</div>

                  <div className="col mb-12"><textarea  className="col mb-6" style={{border:'3px solid #eee'}} value={invoice.developerCommnet}> </textarea> </div>
                </div>

          </div>

          

      </div> 
    
      </CSSTransition>
      </div>       
           : 
           ""}
       
              <div className="row">
             
                {invoice.actions &&
                localStorage.getItem("role") == "Administrator" ? (
                  <table className="table table-sm border table-striped border-1 mt-5">
                    <thead>
                      <tr className="table-dark">
                        <th colSpan={3}>
                          <MdHistoryToggleOff size={20} /> History
                        </th>
                      </tr>
                      <tr>
                        <th className="px-4">Date/Time</th>
                        <th>User</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="px-4" style={{ fontSize: "12px" }}>
                          <Moment
                            date={invoice.dateAdded}
                            format="DD/MM/YYYY"
                          />
                          <br />
                          <Moment date={invoice.dateAdded} format="HH:mm a" />
                        </td>
                        <td>
                          {invoice.client.firstName} {invoice.client.surName}
                        </td>
                        <td>Order Created</td>
                      </tr>
                      {invoice.actions.map((oa) => (
                        <tr key={oa._id}>
                          <td className="px-4" style={{ fontSize: "12px" }}>
                            <Moment date={oa.date} format="DD/MM/YYYY" />
                            <br />
                            <Moment date={oa.date} format="HH:mm a" />
                          </td>
                          <td>
                            {oa.createdBy.firstName} {oa.createdBy.surName}
                          </td>
                          <td>{oa.message}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : null}
                 
                 <div className = "row text-right">
                <div className="mb-3  col justify-content-end">
                  <Link className="btn btn-secondary btn-lg mx-2" to= {"/admin/invoices?status=" + invoice.status}>
                    <MdClose size={20} /> &nbsp; {t("close")}
                  </Link>
                  &nbsp;
      
                 

                {invoice.status != "posted" ?    <Link className="btn btn-primary btn-lg"   to={"/admin/Invoices/edit/" + invoice._id}>
                  <MdEdit size={20} />
                  &nbsp; {t("dashboard.edit")}
                  </Link> : ""}
                   
                  </div>
                
                  {invoice.status != "posted" ?   
                            <ConfirmButton
                              onConfirm={() =>{removeInvoice(invoiceId) ; navigate("/admin/invoices/", { replace: true });   } }
                              onCancel={() => console.log("cancel")}
                              buttonText= {t("dashboard.delete")}
                              confirmText={t("invoice.confirmDelete")}
                              cancelText={t("invoice.cancelDelete")}
                              loadingText={t("invoice.BeingDeleteingTheInvoice")}
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
                           : ""}
</div>
                
              </div>


            </form>
          </div>
        </div>
      ) : (
        <>No Data Found</>
      )}
    </>
  );
};

export default ViewInvoice;
