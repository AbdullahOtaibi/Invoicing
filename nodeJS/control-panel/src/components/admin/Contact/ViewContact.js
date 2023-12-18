import { CSSTransition } from "react-transition-group";
import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { hasPermission } from "../utils/auth";
import {
  getContact,
  removeContact,
  getContractsByContactId,
} from "./ContactAPI";
import { Helmet } from "react-helmet";
import {
  MdOutlineReceiptLong,
  MdEdit,
  MdClose,
  MdHistoryToggleOff,
  MdPayment,
  MdLocalShipping,
  MdOutlineCancel,
  MdContacts,
  MdPhone,
  MdAddTask,
  MdReceipt,
} from "react-icons/md";
import { ThreeDots } from "react-loader-spinner";
import { useTranslation } from "react-i18next";
import ConfirmButton from "react-confirmation-button";
import { MdAdd, MdDelete } from "react-icons/md";
import { RiRefund2Fill } from "react-icons/ri";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Tabs, Tab } from "react-bootstrap";
import ContactInvoices from "./ContactInvoices";
import ContactAppointments from "./ContactAppointments";
import AppointmentLst from "../FullCalendar/AppointmentLst";
import FullCalendarNew from "../FullCalendar/FullCalendarNew";
import FullCalendarEdit from "../FullCalendar/FullCalendarEdit";
import Modal from "react-bootstrap/Modal";
import CreateReceipt from "../Receipt/CreateReceipt";
import EditReceipt from "../Receipt/EditReceipt";
import ReceiptListControl from "../Receipt/ReceiptListControl";

const ViewContact = (props) => {
  let navigate = useNavigate();

  /*
  let navigate = useNavigate();
  if (!hasPermission('invoice.view')) {
      navigate("/admin", { replace: true });
  }
  */

  const { contactId } = useParams();
  const [contact, setContact] = useState();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { t, i18n } = useTranslation();
  const [fullCalendarObj, setFullCalendarObj] = useState(0);
  const [popUpEvent, setPopUpEvent] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [showDeleteButton, setShowDeleteButton] = useState(true);
  useEffect(() => {
    console.log("contactId:" + contactId);
    console.log("props.onSave:" + props.onSave);
    setLoading(true);
     console.log("contactId:" +contactId) ;
    getContact(contactId)
      .then((data) => {
        console.log("test ........");
        console.log(data);
        setLoading(true);
        setContact(data);
        console.log(data);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    getContractsByContactId(contactId)
      .then((data) => {
        console.log("test ........");
        console.log(data);
        setLoading(true);
        setContracts(data);
        console.log(data);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    countAppointementsList();
    countInvoicesList();
  }, [props]);

  function getCreatedDate() {
    let x = contact.createdDate.toString();
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

  const handleAppoinmentSelected = (item) => {
    setPopUpEvent("edit");
    setFullCalendarObj(item);
    setShow(true);
  };

  const countAppointementsList = (count) => {
    if (parseInt(count) > 0) setShowDeleteButton(false);
  };

  const countInvoicesList = (count) => {
    if (parseInt(count) > 0) setShowDeleteButton(false);
  };

  const clickNew = () => {
    console.log("clicknew ....");
    //setPopUpEvent("new") ;
    setShow(true);
    setPopUpEvent("new");
  };

  const handleReceiptSelected = (item) => {
    setPopUpEvent("edit");
    setSelectedReceiptObj(item);
    setshowReceipt(true);
  };

  const [showReceipt, setshowReceipt] = useState(false);
  const handleCloseReceipt = () => {
    setshowReceipt(false);
   // if (_contact) setContact(_contact);
  };
  // const handleShowReceipt = () => {
  //   setshowReceipt(true);
  //  // if (_contact) setContact(_contact);
  // };

  const [selectedReceiptObj, setSelectedReceiptObj] = useState(0);

  const clickNewReceipt = () => {
    console.log("clicknew Receipt ....");
    setshowReceipt(true);
    setPopUpEvent("new");
  };

  return (
    <>
      {contact?.contactName ? (
        <div className="card">
          <h5 className="card-header">
            <MdContacts /> {t("contact.ContactInformation")}{" "}
            <span className="text-info px-1">
              {" "}
              {contact.contactName} <MdPhone size={20} /> {contact.mobile}{" "}
            </span>
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

            <form>
              {contact ? (
                <Tabs
                  defaultActiveKey={"info"}
                  transition={false}
                  id="noanim-tab-example"
                  className="mb-3 "
                >
                  <Tab
                    eventKey="info"
                    title={t("contact.ContactInformation")}
                    tabClassName="tab-item"
                  >
                    <br />
                    <div className="mb-3 row ">
                      <div className="col col-auto text-info">
                        {t("contact.ContactInformation")}{" "}
                      </div>
                      <div className="col">
                        <hr />
                      </div>
                    </div>
                    <div className="row">
                      <div className="mb-3 col ">
                        <div className="col col-auto">
                          {" "}
                          {t("contact.contactType")}
                        </div>

                        <div className="col">{contact.contactType}</div>
                      </div>

                      <div className="mb-3 col ">
                        <div className="col col-auto">
                          {" "}
                          {t("contact.contactName")}{" "}
                        </div>
                        <div className="col">{contact.contactName}</div>
                      </div>

                      <div className="mb-3 col ">
                        <div className="col col-auto">
                          {" "}
                          {t("contact.mobile")}
                        </div>

                        <div className="col">{contact.mobile}</div>
                      </div>

                      <div className="mb-3 col "></div>
                    </div>

                    {contact.contactType != "Employee" &&
                    contact.contactType != "Insurance" ? (
                      <>
                        <div className="row">
                          <div className="mb-3 col ">
                            <div className="col col-auto">
                              {" "}
                              {t("contact.identificationType")}
                            </div>
                            <div className="col">
                              {contact.identificationType}
                            </div>
                          </div>

                          <div className="mb-3 col ">
                            <div className="col col-auto">
                              {" "}
                              {t("contact.identificationValue")}
                            </div>

                            <div className="col">
                              {contact.identificationValue}
                            </div>
                          </div>

                          <div className="mb-3 col ">
                            <div className="col col-auto">
                              {" "}
                              {t("contact.email")}
                            </div>

                            <div className="col">{contact.email}</div>
                          </div>

                          <div className="mb-3 col "></div>
                        </div>
                        <div className="mb-3 row ">
                          <div className="col col-auto text-info">
                            {t("contact.subContactInformation")}
                          </div>
                          <div className="col">
                            <hr />
                          </div>
                        </div>
                        <div className="row">
                          <div className="mb-3 col ">
                            <div className="col col-auto">
                              {" "}
                              {t("contact.subContactName")}
                            </div>
                            <div className="col">{contact.subContactName}</div>
                          </div>

                          <div className="mb-3 col ">
                            <div className="col col-auto">
                              {" "}
                              {t("contact.subContactMobile")}
                            </div>

                            <div className="col">
                              {contact.subContactMobile}
                            </div>
                          </div>

                          <div className="mb-3 col ">
                            <div className="col col-auto">
                              {" "}
                              {t("contact.subContactEmail")}
                            </div>

                            <div className="col">{contact.subContactEmail}</div>
                          </div>

                          <div className="mb-3 col "></div>
                        </div>
                      </>
                    ) : (
                      ""
                    )}

                    <div className="row">
                      <div className="mb-3 col ">
                        <div className="col col-auto"> {t("contact.note")}</div>
                        <div className="col">{contact.note}</div>
                      </div>

                      <div className="mb-3 col ">
                        <div className="col col-auto">
                          {" "}
                          {t("contact.createdDate")}
                        </div>
                        <div className="col">{getCreatedDate()}</div>
                      </div>
                      <div className="mb-3 col "></div>
                      <div className="mb-3 col "></div>
                    </div>

                    <div className="mb-3 row ">
                      <div className="col col-auto text-info">
                        {t("contact.FinanceInformation")}
                      </div>
                      <div className="col">
                        <hr />
                      </div>
                    </div>

                    <div className="row">
                      <div className="mb-3 col ">
                        <div className="col col-auto">
                          {" "}
                          {t("contact.contactTotalReceipt")}
                        </div>
                        <div className="col">{contact.contactTotalReceipt ? contact.contactTotalReceipt : 0}</div>
                      </div>

                      <div className="mb-3 col ">
                        <div className="col col-auto">
                          {" "}
                          {t("contact.contactTotalInvoiced")}
                        </div>
                        <div className="col">{contact.contactTotalInvoiced?contact.contactTotalInvoiced: 0}</div>
                      </div>

                      <div className="mb-3 col ">
                        <div className="col col-auto">
                          {" "}
                          {t("contact.contactTotalBalance")}
                        </div>
                        <div className="col">{contact.contactTotalBalance?contact.contactTotalBalance:0}</div>
                      </div>

                    </div>

                    <div className="row action-bar">
                      <div className="row ">
                        <div className="col ">
                          <ConfirmButton
                            onConfirm={() => {
                              removeContact(contactId);
                              navigate("/admin/Contact/", { replace: true });
                            }}
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
                        <div className="mb-3  col text-end">
                          <Link
                            className="btn btn-secondary btn-lg mx-2 w-25"
                            to={"/admin/Contact"}
                          >
                            <MdClose size={20} /> &nbsp; {t("close")}
                          </Link>
                          &nbsp;
                          <Link
                            className="btn btn-primary btn-lg w-25"
                            to={"/admin/Contact/edit/" + contact._id}
                          >
                            <MdEdit size={20} />
                            &nbsp; {t("dashboard.edit")}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Tab>

                  {contact.contactType != "Employee" && (
                    <Tab
                      eventKey="invoices"
                      title={t("sidebar.invoices")}
                      tabClassName="tab-item"
                    >
                      <ContactInvoices contactId={contactId} />
                    </Tab>
                  )}
                  {contact.contactType != "Insurance" && (
                    <Tab
                      eventKey="appointments"
                      title={
                        contact.contactType != "Employee"
                          ? t("Appointments")
                          : t("contact.employeeAppointments")
                      }
                      tabClassName="tab-item"
                    >
                      <>
                        <div className="row text-right">
                          <div className="mb-3  col justify-content-end">
                            <Link
                              className="btn btn-success btn-lg"
                              onClick={clickNew}
                            >
                              <MdAddTask size={20} /> &nbsp;{" "}
                              {t("contracts.createAppointment")}
                            </Link>{" "}
                          </div>
                        </div>

                        <AppointmentLst
                          clientId={
                            contact.contactType != "Employee"
                              ? contact._id
                              : null
                          }
                          employeeId={
                            contact.contactType == "Employee"
                              ? contact._id
                              : null
                          }
                          handleAppoinmentSelected={handleAppoinmentSelected}
                        />
                      </>
                    </Tab>
                  )}
                  <Tab
                    eventKey="contracts"
                    title={t("Contracts")}
                    tabClassName="tab-item"
                  >
                    <table className="table table-striped table-hover">
                      <thead>
                        <tr>
                          <th scope="col"> {t("contracts.seqNumber")}</th>
                          <th scope="col">{t("contracts.contactName")}</th>
                          <th scope="col">{t("contracts.contractAmount")}</th>

                          <th scope="col">
                            {t("contracts.contractTotalReceipts")}
                          </th>
                          <th> {t("contracts.contractTotalInvoiced")}</th>
                          <th scope="col">{t("contracts.packageName")}</th>
                          <th scope="col">{t("contracts.packagePrice")}</th>

                          <th scope="col"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {contracts.map((contract) => (
                          <tr key={contract._id}>
                            <td>
                              <Link
                                to={"/admin/Contract/view/" + contract._id}
                                className="text-info"
                              >
                                {contract.seqNumber}
                              </Link>
                            </td>
                            <td>{contract.contact?.contactName}</td>
                            <td>{contract.contractAmount}</td>
                            <td>{contract.contractTotalReceipts}</td>
                            <td>
                              {contract.contractTotalInvoiced
                                ? contract.contractTotalInvoiced
                                : "0.00"}
                            </td>
                            <td>{contract.package?.packageName}</td>
                            <td>{contract.packagePrice}</td>

                            {/* <td>
                              <Link

                                className="btn btn-primary btn-sm"
                                to={"/admin/Contract/view/" + contract._id}
                              >
                                <MdEdit size={20} />
                              </Link>
                              &nbsp;
                              <Link
                                className="btn btn-danger btn-sm"
                                to={"/admin/Contract/view/" + contract._id}
                              >
                                <MdDelete size={20} />
                              </Link>
                            </td> */}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Tab>

                  <Tab
                    eventKey="Receipts"
                    title={t("Receipts")}
                    tabClassName="tab-item"
                  >
                    {contact && contact.contactType=="Insurance"?(<Link
                      className="btn btn-secondary btn-lg"
                      onClick={clickNewReceipt}
                    >
                      <MdReceipt size={20} /> &nbsp;{" "}
                      {t("contracts.createReceipt")}
                    </Link>):null}
                    
                    <ReceiptListControl
                      contactId={contact._id}
                      handleReceiptSelected={handleReceiptSelected}
                    />
                  </Tab>
                </Tabs>
              ) : (
                "Not Found"
              )}
            </form>
          </div>
        </div>
      ) : (
        <>No Data Found contactId: {contactId}</>
      )}

      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <div className="row">
            <div className="col">
              {popUpEvent == "new" ? (
                <Modal.Title>{t("FullCalendar.newAppintement")}</Modal.Title>
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
              //updateFullCalendar={reloadData}
              contactObj={contact}
            />
          ) : (
            ""
          )}

          {popUpEvent == "edit" ? (
            <FullCalendarEdit
              onSave={handleClose}
              //  updateFullCalendar={reloadData}
              getfullCalendarObj={fullCalendarObj}
            />
          ) : (
            ""
          )}
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>

      <Modal show={showReceipt} onHide={handleCloseReceipt} size="lg">
        <Modal.Header closeButton>
          <div className="row">
            <div className="col">
              {popUpEvent == "new" ? (
                <Modal.Title>{t("receipt.createReceipt")}</Modal.Title>
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
              // onSave={(cont) => {
              //   handleCloseReceipt(cont);
              // }}
              onSave={handleCloseReceipt}
              contactObj={contact}
            />
          ) : (
            ""
          )}

          {popUpEvent == "edit" ? (
            <EditReceipt
              // onSave={(cont) => {
              //   handleCloseReceipt(cont);
              // }}
              onSave={handleCloseReceipt}
              selectedReceiptObj={selectedReceiptObj}
            />
          ) : (
            ""
          )}
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  );
};

export default ViewContact;