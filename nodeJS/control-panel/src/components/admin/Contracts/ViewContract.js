import { CSSTransition } from 'react-transition-group';
import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { hasPermission } from "../utils/auth";

import { Helmet } from "react-helmet";
import { MdEdit, MdClose, MdAddTask, MdCollectionsBookmark, MdOutlineLocalPrintshop } from "react-icons/md";
import { ThreeDots } from 'react-loader-spinner';
import { useTranslation } from "react-i18next";
import ConfirmButton from "react-confirmation-button";
import { MdAdd, MdDelete, MdReceipt } from "react-icons/md";
import { RiRefund2Fill } from "react-icons/ri";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getContract, removeContract } from "./ContractsAPI"
import moment from "moment";
import Listinv from "../Invoices/ListInv"
import FullCalendarNew from "../FullCalendar/FullCalendarNew";
import FullCalendarEdit from "../FullCalendar/FullCalendarEdit";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import AppointmentLst from "../FullCalendar/AppointmentLst"
import CreateReceipt from "../Receipt/CreateReceipt"
import EditReceipt from "../Receipt/EditReceipt"
import ReceiptListControl from "../Receipt/ReceiptListControl"


const ViewContract = (props) => {




  let navigate = useNavigate();
  const { contractId } = useParams();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const [contract, setContract] = useState({});
  const [filterInvoice, setFilterInvoice] = useState({})
  const [popUpEvent, setPopUpEvent] = useState("");
  const [showOppo, setShowOppo] = useState(false);
  const handleCloseOppo = () => {  setShowOppo(false);}

const handleShowOppo = () => { setShowOppo(true); } 

const clickNewOppo = () => {
  console.log("clicknew oppo ....");
  setShowOppo(true);
  setPopUpEvent("new");
};


const [showReceipt, setshowReceipt] = useState(false);
  const handleCloseReceipt = (con) => { setshowReceipt(false); if (con) setContract(con) } 
  const handleShowReceipt = (con) => { setshowReceipt(true); if (con) setContract(con)} 

const clickNewReceipt = () => {
  console.log("clicknew Receipt ....");
  setshowReceipt(true);
  setPopUpEvent("new");
};



const [fullCalendarObj, setFullCalendarObj] = useState(0);
const [selectedReceiptObj, setSelectedReceiptObj] = useState(0);
useEffect(() => {
  setLoading(true);
  console.log("...... abdullah load contract .......:" + contractId);
  console.log("contractId:" + contractId);
  getContract(contractId).then(
    (res) => {
      console.log("pass ..." + JSON.stringify(res));
      setContract(res)
      console.log("contract:")
      console.log(JSON.stringify(res));
      let filterData = {}
      filterData.contractId = res._id;
      setFilterInvoice(filterData)
      console.log("setFilterInvoice Data")
      console.log(filterData)
    }
  ).catch((error) => { console.log( "fail fetch contract: error= " + error) })
  setLoading(false);
}, [props, props.onSave, showReceipt , showOppo ]);

const getTotalInstallments = () => {
  let total = 0;
  contract.installments.forEach((installment) => {
    total += parseFloat(installment.installmentAmount);
  });
  return total;
}
const handleAppoinmentSelected = (item) => {

  setPopUpEvent('edit');
  setFullCalendarObj(item);
  setShowOppo(true);
}

const handleReceiptSelected = (item) => {
  setPopUpEvent('edit');
  setSelectedReceiptObj(item);
  setshowReceipt(true);
}






moment.locale("en-GB");
return (
  (contract ? (
    <>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title"> <MdReceipt size={20} />   {t("contracts.ContractInformation")} <span className='text-info'>({contract.seqNumber})</span></h5>
          <div className="container text-center">
            <ThreeDots
              type="ThreeDots"
              color="#00BFFF"
              height={100}
              width={100}
              visible={loading}
            />
          </div>
          <div className="row text-right">
            <div className="mb-3  col justify-content-end">

              <Link className="btn btn-secondary btn-lg d-print-none" onClick={clickNewReceipt}>
                <MdReceipt size={20} /> &nbsp; {t("contracts.createReceipt")}
              </Link>{" "}
              &nbsp;

              <Link className="btn btn-success btn-lg d-print-none" onClick={clickNewOppo}>
                <MdAddTask size={20} /> &nbsp; {t("contracts.createAppointment")}
              </Link>{" "}
              &nbsp;

              <Link className="btn btn-info btn-lg mx-1 d-print-none" to={"/invoices/createForContract/" + contract._id}>
                <MdCollectionsBookmark size={20} />
                &nbsp; {t("invoice.createInvoice")}
              </Link>

              <a href="#" className="btn btn-dark btn-lg mx-1 d-print-none" onClick={() => { window.print(); }}>
                <MdOutlineLocalPrintshop size={20} />

              </a>




            </div>



          </div>
          <br />
          <form className="needs-validation">


            <div className="mb-3 row ">
              <div className="col col-auto text-info">
                {t("contracts.contactInformation")}{" "}
              </div>
              <div className="col">
                <hr />
              </div>
            </div>

            <div className="mb-3 row">

              <div className="mb-3 col ">
                <div className="col col-auto">{t("contracts.contactName")}</div>
                <div className="col col-auto">
                  {contract.contact?.contactName}
                </div>
              </div>


              <div className="mb-3 col ">
                <div className="col col-auto">{t("contracts.contactMobile")}</div>
                <div className="col col-auto">
                  {contract.contact?.mobile}


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
                {t("contracts.packageInformation")}{" "}
              </div>
              <div className="col">
                <hr />
              </div>
            </div>
            <div className="mb-3 row">

              <div className="mb-3 col ">
                <div className="col col-auto">{t("contracts.packageName")}</div>
                <div className="col col-auto">
                  {contract.package?.packageName}
                </div>
              </div>





              <div className="mb-3 col ">
                <div className="col col-auto">{t("contracts.packagePrice")}</div>
                <div className="col col-auto">
                  {
                    contract.packagePrice ? contract.packagePrice.toFixed(3) : contract.packagePrice
                  }
                </div>
              </div>


              <div className="mb-3 col ">
                <div className="col col-auto">{t("contracts.packageNumberOfSet")}</div>
                <div className="col col-auto">
                  {contract.numberOfSet}
                </div>
              </div>



            </div>


            <div className="mb-3 row ">
              <div className="col col-auto text-info">
                {t("contracts.ContractInformation")}{" "}
              </div>
              <div className="col">
                <hr />
              </div>
            </div>

            <div className="mb-3 row">

              <div className="mb-3 col ">
                <div className="col col-auto">{t("contracts.contractDate")}</div>
                <div className="col">
                  {contract.contractDate ? moment(contract.contractDate).format("DD/MM/yyyy") : "Not Set"}
                </div>
              </div>





              <div className="mb-3 col   ">
                <div className="col col-auto">{t("contracts.contractAmount")}</div>
                <div className="col col-auto">
                  {contract.contractAmount ? contract.contractAmount.toFixed(3) : contract.contractAmount}
                </div>
              </div>



              <div className="mb-3 col ">
                <div className="col col-auto">{t("contracts.note")}</div>
                <div className="col col-auto">

                  {contract.note}

                </div>
              </div>




            </div>

            <div className="mb-3 row">

              <div className="mb-3 col   ">
                <div className="col col-auto">{t("contracts.contractTotalReceipts")}</div>
                <div className="col col-auto">
                  JOD {contract.contractTotalReceipts ? contract.contractTotalReceipts.toFixed(3) : '0.00'}
                </div>
              </div>



              <div className="mb-3 col   ">
                <div className="col col-auto">{t("contracts.contractTotalInvoiced")}</div>
                <div className="col col-auto">
                  JOD {contract.contractTotalInvoiced ? contract.contractTotalInvoiced.toFixed(3) : contract.contractTotalInvoiced} 
                </div>
              </div>

              <div className={contract.contractBalance > 0 ? "mb-3 col  text-success" : "mb-3 col  text-warning"}>
                <div className="col col-auto">{t("contracts.contractBalance")}</div>
                <div className="col col-auto">
                  JOD {contract.contractBalance ? contract.contractBalance.toFixed(3) : '0.00'}
                </div>
              </div>

            </div>

            <div className="mb-3 row">

              <div className="mb-3 col   ">
                <div className="col col-auto">{t("contracts.contractReminingAmount")}</div>
                <div className="col col-auto">
                  JOD {contract.contractReminingAmount ? contract.contractReminingAmount.toFixed(3) : '0.00'}
                </div>
              </div>
            </div>


            <div className="mb-3 row ">
              <div className="col col-auto text-info">
                {t("contracts.receipts")}{" "}
              </div>
              <div className="col">
                <hr />
              </div>
            </div>
            {contract && contract._id ? (
              <ReceiptListControl contractId={contract._id} handleReceiptSelected={handleReceiptSelected} />
            ) : null}




            <div className="mb-3 row ">
              <div className="col col-auto text-info">
                {t("contracts.invoices")}{" "}
              </div>
              <div className="col">
                <hr />
              </div>
            </div>

            <div className='row'>
              {filterInvoice.contractId ? <Listinv status="all" filter={filterInvoice} /> : ""}
            </div>

            <div className="mb-3 row ">
              <div className="col col-auto text-info">
                {t("contracts.appointments")}{" "}
              </div>
              <div className="col">
                <hr />
              </div>
            </div>

            <div className="row">
              {contract && contract._id ? (
                <AppointmentLst contractId={contract._id} handleAppoinmentSelected={handleAppoinmentSelected} />
              ) : null}
            </div>
            <div className="row action-bar">
              <div className="col ">



                 { (contract.contractTotalReceipts == 0  && contract.contractTotalInvoiced == 0  )  ? (

                  <ConfirmButton
                    onConfirm={() => { removeContract(contract._id) ; navigate("/admin/Contract/", { replace: true });}}
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
                ) : null}
              </div>
              <div className="col text-end">
                <Link className="btn btn-secondary btn-lg d-print-none" to="/admin/Contract">
                  <MdClose size={20} /> &nbsp; {t("Cancel")}
                </Link>{" "}
                &nbsp;


                <Link className="btn btn-primary btn-lg d-print-none" to={"/admin/Contract/edit/" + contract._id}>
                  <MdEdit size={20} />
                  &nbsp; {t("dashboard.edit")}
                </Link>

              </div>

            </div>


          </form>
        </div>
      </div>

      <Modal show={showOppo} onHide={handleCloseOppo} size="lg" >
        <Modal.Header closeButton>
          <div className="row">
            <div className="col">
              {popUpEvent == "new" ? (
                <Modal.Title >{t("FullCalendar.newAppintement")}</Modal.Title>
              ) : (
                ""
              )}
              {popUpEvent == "edit" ? (
                <Modal.Title>{t("FullCalendar.editAppintement")}</Modal.Title>
              ) : (
                ""
              )}


            </div>

          </div>
        </Modal.Header>
        <Modal.Body>
          {popUpEvent == "new" ? (
            <FullCalendarNew
              onSave={(e) => handleCloseOppo(e)}
              // updateFullCalendar={reloadData}
              contractObj={contract}
            />
          ) : (
            ""
          )}

          {popUpEvent == "edit" ? (
            <FullCalendarEdit
              onSave={handleCloseOppo}
              //updateFullCalendar={reloadData}
              getfullCalendarObj={fullCalendarObj}
            />
          ) : (
            ""
          )}
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>


      <Modal show={showReceipt} onHide={handleCloseReceipt} size="lg" >
        <Modal.Header closeButton>
          <div className="row">
            <div className="col">
              {popUpEvent == "new" ? (
                <Modal.Title >{t("receipt.createReceipt")}</Modal.Title>
              ) : (
                ""
              )}
              {popUpEvent == "edit" ? (
                <Modal.Title>{t("receipt.editReceipt")}</Modal.Title>
              ) : (
                ""
              )}


            </div>

          </div>
        </Modal.Header>
        <Modal.Body>
          {popUpEvent == "new" ? (
            <CreateReceipt
              onSave={(con) => { handleCloseReceipt(con) }}
              contractObj={contract}

            />
          ) : (
            ""
          )}

          {popUpEvent == "edit" ? (
            <EditReceipt
              onSave={(con) => {  handleCloseReceipt(con) }}
              selectedReceiptObj={selectedReceiptObj}
            />
          ) : (
            ""
          )}
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    
    </>




  ) : "No Data Found"));

function numericFormat(val) {
  return !isNaN(val) ? val.toFixed(3) : val;
}
};

export default ViewContract