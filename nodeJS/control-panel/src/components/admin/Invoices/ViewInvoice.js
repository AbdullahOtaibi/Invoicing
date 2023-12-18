import { CSSTransition } from 'react-transition-group';
import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { hasPermission } from "../utils/auth";
import { getInvoice, removeInvoice, updateInvoice, postToTaxTypeIncome, postToTaxTypeRevertedIncome, getSumInvoicesByContractId } from "./InvoicesAPI";
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
import { ThreeDots } from 'react-loader-spinner';
import { useTranslation } from "react-i18next";
import Moment from "react-moment";
import { getLocalizedText } from "../utils/utils";
import ConfirmButton from "react-confirmation-button";
import { MdAdd, MdDelete, MdPrint } from "react-icons/md";
import { RiRefund2Fill } from "react-icons/ri";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import QRCode from 'react-qr-code';
import { getContract, updateContract } from "../Contracts/ContractsAPI";




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
  const [contract, setContract] = useState({});


  useEffect(() => {
    setLoading(true);
    getInvoice(invoiceId)
      .then((data) => {
        console.log("test ........");
        console.log(data);
        setLoading(true);
        setInvoice(data);
        console.log(JSON.stringify(data));
        setLoading(false);
        //***************************8 */

        let invoiceContractObj = data.contract;
        console.log("invoiceContractObj=" + invoiceContractObj);
        console.log(JSON.stringify(invoiceContractObj))

        if (!isBlank(invoiceContractObj) && !isBlank(invoiceContractObj._id)) {
          getContract(invoiceContractObj._id).then((data) => {
            setLoading(true);
            setContract(data);
            console.log("contract obj:");
            console.log(data);
            setLoading(false);
          }).catch((ex) => {
            setLoading(false);
            console.log("Error: trying fetch contract info" + ex);
          });
        }

        //**************************** */

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
    postToTaxTypeIncome(invoice._id).then(res => {
      setLoading(false);
      //  setInvoice({ ...invoice, status: 'posted' });
      console.log("success invoice ......");
      // window.location.href = "/admin/invoices/ViewInvoice/" + res._id;
      window.location.href = "/admin/invoices/ViewInvoice/" + invoice._id;
      //console.log(res.data);
    }).catch(e => {
      console.log("error post to tax");
      console.log(e);
      setLoading(false);
    });
    console.log(invoice);
    console.log(data);
  };


  const doPostRevertedInvoice = (data) => {
    setLoading(true);
    postToTaxTypeRevertedIncome(invoice._id).then(res => {
      setLoading(false);
      //setInvoice({ ...invoice, reverted_Status: 'posted' });
      console.log("success invoice ......");
      // window.location.href = "/admin/invoices/ViewInvoice/" + res._id;
      window.location.href = "/admin/invoices/ViewInvoice/" + invoice._id;
      //console.log(res.data);
    }).catch(e => {
      console.log("error post to tax");
      console.log(e);
      setLoading(false);
    });
    console.log(invoice);
    console.log(data);
  };

  const [showXML, setShowXML] = useState(false);

  function numericFormat(val) {
    return !isNaN(val) ? val.toFixed(3) : val;
  }

  function updateContractBalance() {

    console.log("updateContractBalance ......");
    if (isBlank(invoice.contract)) { return false; }

    let parms = {}
    //parms.contractId = "64dfc9d09ce91056e7ba9fc7" 
    parms.contractId = contract._id
    parms.ignoreInvoiceId = ""
    console.log("parms")
    console.log(parms);
    getSumInvoicesByContractId(parms).then((data) => {

      console.log("getSumInvoicesByContractId success ! ");
      console.log("data: ");
      console.log(data);
      let sumInvoices = 0;
      if (data.length > 0) {
        console.log("sum:" + data[0].sum_val)
        sumInvoices = data[0].sum_val;
      }
      else {
        console.log("sum equals 0")
        sumInvoices = 0;
      }

      let cloned = JSON.parse(JSON.stringify(contract));
      console.log("updated contract before ")
      console.log(cloned)

      cloned.contractTotalInvoiced = parseFloat(sumInvoices);
      cloned.contractBalance = parseFloat(cloned.contractTotalReceipts) - parseFloat(sumInvoices)
      setContract(cloned);
      console.log("updated contract after")
      console.log(cloned);
      updateContract(cloned).then((res) => {
        console.log("success  update contract!");
        window.location.href = "/admin/Contract/view/" + res._id;

      }).catch((err) => { console.log("error update contract:" + err) });
    }

    )
      .catch((ex) => {
        console.log("getSumInvoicesByContractId not  success ");
        console.log(ex);
      });

  }

  function isBlank(str) {
    return !str || /^\s*$/.test(str);
  }

  const doPost = (data) => {
    removeInvoice(invoiceId).then(
      (res) => {
        updateContractBalance();
        //navigate("/admin/invoices/", { replace: true }); 
      }
    ).catch((ex) => { console.log("Error:" + ex); })

  };

  const isKeyInJSONAndNotNull = (jsonObject, keyToCheck) =>
  jsonObject.hasOwnProperty(keyToCheck) && jsonObject[keyToCheck] !== null;
  console.log("----------------------------")
  console.log(invoice)
  const renderContent = () => {
    if (isKeyInJSONAndNotNull(invoice,"ObjectIdReceipt")) {
       
      return (<Link style={{display: 'none'}} className="btn btn-primary btn-lg d-print-none" to={"/admin/Invoices/notfound/" + invoice._id}>
           <MdEdit size={20} />
           &nbsp; {t("dashboard.edit")}
         </Link> );
    } else {
       
      return(<Link className="btn btn-primary btn-lg d-print-none" to={"/admin/Invoices/edit/" + invoice._id}>
           <MdEdit size={20} />
           &nbsp; {t("dashboard.edit")}
         </Link> )
    }
  };
  return (
    <>
      {invoice ? (
        <div className="card">
          <h5 className="card-header">
            <MdOutlineReceiptLong /> {t("invoice.InvoiceDetails")} {invoice.seqNumber!=null? ( <span className="text-info px-1">  ({invoice.seqNumber} ) </span>):(<span className="text-info px-1"> {invoice.docNumber} </span>)}

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

            <form>

              <div className='row p-3 d-none d-print-flex'>
                <div className='col col-auto'>
                  {/* <img src='https://www.tailorbrands.com/wp-content/uploads/2020/07/mcdonalds-logo.jpg' style={{width:'100px'}} /> */}
                  <img src={process.env.REACT_APP_MEDIA_BASE_URL + '/uploads/' + localStorage.getItem("logoUrl")} style={{ width: '100px' }} />
                </div>
                <div className='col'>
                  <h5>
                    {localStorage.getItem("companyName")}
                    <br />
                    {t("invoice.incomeInvoice")}
                  </h5>

                </div>

                <div className='col col-auto text-center'>
                  {invoice && invoice.responseXML ? (<>
                    <QRCode
                      title="GeeksForGeeks"
                      value={'' + JSON.parse(invoice.responseXML).EINV_QR}
                      bgColor={'white'}
                      fgColor={'#18bc9c'}
                      size={100}
                    />
                    <div className="pt-3"> {t("invoice.PostedInvoiceQRCode")}</div>
                  </>) : null}
                </div>


                <div className='col col-auto text-center'>
                  {invoice && invoice.revertedXMLResponse ? (<>
                    <QRCode
                      title="GeeksForGeeks"
                      value={'' + JSON.parse(invoice.revertedXMLResponse).EINV_QR}
                      bgColor={'white'}
                      fgColor={'#e74c3c'}
                      size={100}
                    />
                    <div className="pt-3"> {t("invoice.RevertedInvoiceQRCode")}</div>
                  </>) : null}
                </div>

              </div>

              <div className="row text-right d-print-none">

                <div className='col text-start mb-3 text-center'>
                  {/* <span> test : {JSON.parse(invoice.responseXML).EINV_QR}</span> */}
                  {invoice && invoice.responseXML ? (<>
                    <QRCode
                      title="GeeksForGeeks"
                      value={'' + JSON.parse(invoice.responseXML).EINV_QR}
                      bgColor={'white'}
                      fgColor={'#18bc9c'}
                      size={150}
                    />

                    <div className="pt-3"> {t("invoice.PostedInvoiceQRCode")}</div>
                  </>) : null}


                </div>

                <div className='col text-start mb-3 text-center'>
                  {invoice && invoice.revertedXMLResponse ? (<>
                    <QRCode
                      title="GeeksForGeeks"
                      value={'' + JSON.parse(invoice.revertedXMLResponse).EINV_QR}
                      bgColor={'white'}
                      fgColor={'#e74c3c'}
                      size={150}
                    />
                    <div className="pt-3">  {t("invoice.RevertedInvoiceQRCode")} </div>
                  </>) : null}


                </div>

                <div class="mb-3  col justify-content-end">
                  {invoice.status == "posted" || invoice.status == "reverted" ? (<button type='button' className='btn btn-lg btn-dark d-print-none' onClick={() => { window.print() }}>
                    <MdPrint size={28} />
                  </button>):null}
                  


                  {
                    (invoice.status != "posted" && invoice.reverted_Status != 'posted') &&
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
                    (<>
                      <button
                        type="button"
                        className="btn btn-danger btn-lg mx-2 d-print-none"
                        onClick={doPostRevertedInvoice}
                      >
                        <RiRefund2Fill size={20} />
                        {t("invoice.revertInvoice")}
                      </button></>)
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
                    {invoice.isPosted ? 'posted' : invoice.status}
                  </div>
                </div>

                <div className="mb-3 col ">
                  <div className="col col-auto"> {t("invoice.revertStatus")}</div>

                  <div className="col">
                    {invoice.status}
                  </div>
                </div>



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
                <div className="col col-auto text-info">
                  {t("invoice.contractInformation")}{" "}
                </div>
                <div className="col">
                  <hr />
                </div>
              </div>

              <div className="mb-3 row ">
                <div className="mb-3 col-2 ">
                  <div className="col col-auto">
                    {t("invoice.contract")}
                  </div>
                  <div className="col col-auto">
                    {invoice.contract?.seqNumber}
                  </div>
                </div>

                <div className="mb-3 col ">
                  <div className="col col-auto">{t("contracts.packageName")}  </div>
                  <div className="col">
                    {invoice.package?.packageName}
                  </div>
                </div>


                <div className="mb-3 col ">
                  <div className="col col-auto">{t("contracts.contractAmount")} </div>
                  <div className="col">
                    {invoice.contract?.contractAmount}
                  </div>
                </div>



                <div className="mb-3 col ">
                  <div className="col col-auto">{t("contracts.contractBalance")} </div>
                  <div className="col">
                    {invoice.contract?.contractBalance}
                  </div>
                </div>
              </div>

              <div className="mb-3 row ">
                <div className="col col-auto text-info">
                  {t("invoice.PaymentMethod")}{" "}
                </div>
                <div className="col">
                  <hr />
                </div>
              </div>

              <div className="mb-3 row ">
                <div className="mb-3 col ">
                  <div className="col col-auto">{t("invoice.paymentMethod")}</div>

                  <div className="col col-auto">
                    {invoice.paymentMethod}
                  </div>
                </div>

                {invoice.paymentMethod == "Insurance" ?
                  <>
                    <div className="mb-3 col ">
                      <div className="col col-auto">{t("invoice.insurance")}</div>
                      <div className="col col-auto">
                        {invoice.insurance.contactName}
                      </div>
                    </div>

                    <div className="mb-3 col ">
                      <div className="col col-auto">{t("invoice.templateNo")} </div>
                      <div className="col">
                        {invoice.templateNo}
                      </div>
                    </div>

                    <div className="mb-3 col ">
                      <div className="col col-auto">{t("invoice.percentageOfCover")} </div>
                      <div className="col">
                        {invoice.percentageOfCover}
                      </div>
                    </div>
                  </>
                  : <>
                    <div className="mb-3 col "></div>
                    <div className="mb-3 col "></div>
                    <div className="mb-3 col "></div>
                  </>
                }


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
                        <th width="5%">#</th>
                        <th width="20%" >{t("Name")}</th>
                        <th width="15%"> {t("Price")} </th>
                        <th width="15%">{t("Qty")}</th>
                        <th width="15%">{t("Allowance")}</th>
                        <th width="15%">{t("Subtotal")}</th>
                        <th width="15%">{t("Net")}</th>

                      </tr>
                    </thead>

                    <tbody>
                      {invoice.items.map((item) => (
                        <tr>
                          <td> {item.sequance} </td>
                          <td>{item.itemName}</td>
                          <td>{numericFormat(item.unitPrice)} </td>
                          <td>{item.qty} </td>
                          <td>{numericFormat(item.allowance)}  </td>
                          <td> {numericFormat(parseFloat(item.unitPrice) * parseFloat(item.qty))}</td>
                          <td> {numericFormat(item.lineExtensionAmount)}</td>

                        </tr>

                      ))}


                    </tbody>
                    <tfoot className="table-light">
                      <td></td>
                      <td colSpan="4" className="text-info" > Grand Total</td>

                      <td className="text-info" > {numericFormat(invoice.legalMonetaryTotal.taxExclusiveAmount)}</td>
                      <td className="text-info" > {numericFormat(invoice.legalMonetaryTotal.taxInclusiveAmount)} </td>
                    </tfoot>
                  </table>
                </div>
              </div>



              {invoice.status == "stuck" ?


                <div>

                  <button type="button" onClick={() => { console.log("click div"); setShowXML(!showXML) }} class="btn btn-primary btn-lg mt-3">{!showXML ? 'View Transaction Dateils' : 'Hide Transaction Dateils'}</button>

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

                          <div className="col mb-6"><textarea className="col mb-6" style={{ border: '3px solid #eee' }} value={invoice.postedXML}> </textarea> </div>
                        </div>

                        <div className="mb-6 col ">
                          <div className="col col-auto  text-danger">{t("invoice.xmlResponse")}</div>

                          <div className="col mb-6"> <textarea className="col mb-6" style={{ border: '3px solid #eee' }} value={invoice.responseXML} > </textarea>  </div>
                        </div>
                      </div>
                      <div className="row">

                        <div className="mb- col ">
                          <div className="col col-auto  text-danger"> {t("invoice.developerCommnet")}</div>

                          <div className="col mb-12"><textarea className="col mb-6" style={{ border: '3px solid #eee' }} value={invoice.developerCommnet}> </textarea> </div>
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


                <div className="row action-bar">
                  <div className="row text-right">

                    {!(invoice.status == "posted" || invoice.reverted_Status == 'posted')  ?
                      <div className="col d-print-none">
                        <ConfirmButton
                          onConfirm={doPost}
                          onCancel={() => console.log("cancel")}
                          buttonText={t("dashboard.delete")}
                          confirmText={t("invoice.confirmDelete")}
                          cancelText={t("invoice.cancelDelete")}
                          loadingText={t("contact.BeingDeleteingTheContact")}
                          wrapClass="row"
                          buttonClass="btn btn-lg w-25"
                          mainClass="btn-warning mx-2"
                          confirmClass="btn-danger mx-2 col col-auto order-2 w-25"
                          cancelClass=" btn-success col col-auto order-1 w-25"
                          loadingClass="visually-hidden"
                          disabledClass=""
                          once
                        >
                          {"Delete "}
                          <MdDelete />
                        </ConfirmButton>
                      </div>
                      : ""}

                    <div className="mb-3  col justify-content-end">
                      <Link className="btn btn-secondary btn-lg mx-2 d-print-none" to={"/admin/invoices?status=" + invoice.status}>
                        <MdClose size={20} /> &nbsp; {t("close")}
                      </Link>
                      &nbsp;

                   { !(invoice.status == "posted" || invoice.reverted_Status == 'posted')  ? 
                    renderContent(): ""}
          
                   

                    </div>


                  </div>
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
