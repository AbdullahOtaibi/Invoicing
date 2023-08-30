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
const ViewContract = (props) => {

  let navigate = useNavigate();
  const { contractId } = useParams();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const [contract, setContract] = useState({});
  const [filterInvoice, setFilterInvoice] = useState({})
  const [popUpEvent, setPopUpEvent] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [fullCalendarObj, setFullCalendarObj] = useState(0);

  useEffect(() => {
    setLoading(true);
    console.log("contractId:" + contractId);
    getContract(contractId).then(
      (res) => {
        setContract(res)
        console.log("contract:")
        console.log(JSON.stringify(res));
        let filterData = {}
        filterData.contractId = res._id;
        setFilterInvoice(filterData)
        console.log("setFilterInvoice Data")
        console.log(filterData)
      }
    ).catch((error) => { console.log(error) })
    setLoading(false);
  }, []);

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
    setShow(true);
  }

  const clickNew = () => {
    console.log("clicknew ....");
    //setPopUpEvent("new") ;
    setShow(true);
    setPopUpEvent("new");
  };






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
                <Link className="btn btn-success btn-lg" onClick={clickNew}>
                  <MdAddTask size={20} /> &nbsp; {t("contracts.createAppointment")}
                </Link>{" "}
                &nbsp;

                <Link className="btn btn-info btn-lg mx-1" to={"/invoices/createForContract/" + contract._id}>
                  <MdCollectionsBookmark size={20} />
                  &nbsp; {t("invoice.createInvoice")}
                </Link>

                <a href="#" className="btn btn-dark btn-lg mx-1" onClick={() => { window.print(); }}>
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
                    JOD {contract.installments ? getTotalInstallments().toFixed(3) : '0.00'}
                  </div>
                </div>



                <div className="mb-3 col   ">
                  <div className="col col-auto">{t("contracts.contractTotalInvoiced")}</div>
                  <div className="col col-auto">
                    JOD {contract.packagePrice ? contract.packagePrice.toFixed(3) : contract.packagePrice}
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

              <div className="row">
                <div className="col table-responsive">
                  <table className="table   table-hover ">


                    <thead>
                      <tr className="table-light">
                        <th width="20%">#</th>

                        <th width="20%">{t("contracts.receiptAmount")} </th>
                        <th width="20%">{t("contracts.receiptDate")} </th>
                        <th width="40%">{t("contracts.receiptNote")}</th>


                      </tr>
                    </thead>

                    <tbody>
                      {
                        contract.receipts ? contract.receipts.map((item) => (
                          <tr key={item.receiptSequance} >
                            <td> {item.receiptSequance} </td>
                            <td>{numericFormat(item.receiptAmount)}</td>
                            {<td>{item.receiptDate ? moment(item.receiptDate).format("DD/MM/yyyy") : "Not Set"} </td>}

                            <td>{item.receiptNote} </td>


                          </tr>
                        )) : <tr></tr>}


                    </tbody>
                    <tfoot className="table-light">
                      <tr>
                        <td className="text-info" > Grand Total</td>
                        <td>{numericFormat(contract.contractTotalReceipts)}</td>
                        <td colSpan="2"></td>

                      </tr>

                    </tfoot>
                  </table>

                </div>
              </div>



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
                {/* {(contract.receipts == null || contract.receipts.length == 0)&& (contract.invoices == null || contract.invoices.length == 0)? ( */}
            
                <ConfirmButton
                  onConfirm={() => {removeContract(contract._id)}}
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
             // ):null}
          </div>
             <div className="col ">
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

        <Modal show={show} onHide={handleClose} size="lg" >
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
                onSave={handleClose}
               // updateFullCalendar={reloadData}
                contractObj={contract}
              />
            ) : (
              ""
            )}

            {popUpEvent == "edit" ? (
              <FullCalendarEdit
                onSave={handleClose}
                //updateFullCalendar={reloadData}
                getfullCalendarObj={fullCalendarObj}
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