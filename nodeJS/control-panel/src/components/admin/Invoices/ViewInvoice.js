
import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { hasPermission } from "../utils/auth";
import { getInvoice, removeInvoice } from "./InvoicesAPI";
import { Helmet } from "react-helmet";
import {
  MdOutlineReceiptLong,
  MdEdit,
  MdClose,
  MdHistoryToggleOff,
  MdPayment,
  MdLocalShipping,
} from "react-icons/md";
import Loader from "react-loader-spinner";
import { useTranslation } from "react-i18next";
import Moment from "react-moment";
import { getLocalizedText } from "../utils/utils";
import ConfirmButton from "react-confirmation-button";
import { MdAdd, MdDelete } from "react-icons/md";


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
              <div className="mb-3 row ">
                <div className="col col-auto text-info">{t("invoice.InvoiceSummery")}</div>
                <div className="col">
                  <hr />
                </div>
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
                  <div className="col col-auto">Invoice Date:</div>

                  <div className="col"> {getInvoiceDate()}</div>
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
                  <div className="col col-auto">{t("invoice.fullName")}</div>
                  <div className="col">
                    {invoice.accountingCustomerParty.registrationName}
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
                      <td>{item.unitPrice} </td>
                      <td>{item.qty} </td>
                      <td>{item.allowance}  </td>
                      <td> { parseFloat(item.unitPrice) * parseFloat(item.qty)   }</td>
                      <td> {item.lineExtensionAmount}</td>

          </tr>

       )) }

                 
                </tbody>
                <tfoot className="table-light">
                    <td></td>
                    <td colSpan= "4" className="text-info" > Grand Total</td>
                    
                    <td className="text-info" > {invoice.legalMonetaryTotal.taxExclusiveAmount}</td>
                    <td className="text-info" > {invoice.legalMonetaryTotal.taxInclusiveAmount} </td>
                </tfoot>
              </table>
            </div>
          </div>

{ invoice.status = "stuck" ?
<>
          <div className="mb-3 row ">
                <div className="col col-auto text-danger">{t("invoice.XMLTransactionError")}</div>
                <div className="col">
                  <hr />
                </div>
         </div>

         <div className="row">
                <div className="mb-6 col ">
                  <div className="col col-auto  text-danger"> {t("invoice.xmlRequest")}</div>

                  <div className="col mb-6"><textarea  className="col mb-6" style={{border:'3px solid #eee'}}> </textarea> </div>
                </div>

                <div className="mb-6 col ">
                  <div className="col col-auto  text-danger">{t("invoice.xmlResponse")}</div>

                  <div className="col mb-6"> <textarea  className="col mb-6" style={{border:'3px solid #eee'}} > </textarea>  </div>
                </div>
          </div>
          </>
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

                <div className="mb-3 row col justify-content-end">
                  <Link className="btn btn-secondary btn-lg mx-2" to="/admin/invoices">
                    <MdClose size={20} /> &nbsp; {t("close")}
                  </Link>
                  &nbsp;
      
                 

                {invoice.status != "posted" ?    <Link className="btn btn-primary btn-lg"   to={"/admin/Invoices/edit/" + invoice._id}>
                  <MdEdit size={20} />
                  &nbsp; {t("dashboard.edit")}
                  </Link> : ""}
                   
                  {invoice.status != "posted" ?   
                            <ConfirmButton
                              onConfirm={() =>{removeInvoice(invoiceId) ; navigate("/admin/invoices/", { replace: true });   } }
                              onCancel={() => console.log("cancel")}
                              buttonText= {t("dashboard.delete")}
                              confirmText={t("invoice.confirmDelete")}
                              cancelText={t("invoice.cancelDelete")}
                              loadingText={t("invoice.BeingDeleteingTheInvoice")}
                              wrapClass=""
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
