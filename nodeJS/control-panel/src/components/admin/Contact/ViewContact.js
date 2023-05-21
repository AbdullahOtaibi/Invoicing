import { CSSTransition } from 'react-transition-group';
import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { hasPermission } from "../utils/auth";
import { getContact, removeContact } from "./ContactAPI"
import { Helmet } from "react-helmet";
import {
  MdOutlineReceiptLong,
  MdEdit,
  MdClose,
  MdHistoryToggleOff,
  MdPayment,
  MdLocalShipping,
  MdOutlineCancel,
  MdContacts
} from "react-icons/md";
import { ThreeDots } from 'react-loader-spinner';
import { useTranslation } from "react-i18next";
import ConfirmButton from "react-confirmation-button";
import { MdAdd, MdDelete } from "react-icons/md";
import { RiRefund2Fill } from "react-icons/ri";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Tabs, Tab } from 'react-bootstrap'
import ContactInvoices from './ContactInvoices';
import ContactAppointments from './ContactAppointments'
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
  const [loading, setLoading] = useState(false);
  const { t, i18n } = useTranslation();


  useEffect(() => {
    setLoading(true);
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

  return (
    <>
      {contact ? (
        <div className="card">
          <h5 className="card-header">
            <MdContacts /> {t("contact.ContactInformation")}   <span className="text-info px-1">  ( {contact.contactName} ) </span>

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

              <Tabs
                defaultActiveKey={"info"}
                transition={false}
                id="noanim-tab-example"
                className="mb-3 " >
                <Tab eventKey="info" title={t("contact.ContactInformation")} tabClassName="tab-item">
                  <br />
                  <div className="mb-3 row ">
                    <div className="col col-auto text-info">{t("contact.ContactInformation")}</div>
                    <div className="col">
                      <hr />
                    </div>
                  </div>
                  <div className="row">
                    <div className="mb-3 col ">
                      <div className="col col-auto"> {t("contact.contactName")}</div>
                      <div className="col">
                        {contact.contactName}
                      </div>
                    </div>

                    <div className="mb-3 col ">
                      <div className="col col-auto"> {t("contact.contactType")}</div>

                      <div className="col">
                        {contact.contactType}
                      </div>
                    </div>

                    <div className="mb-3 col ">
                      <div className="col col-auto"> {t("contact.mobile")}</div>

                      <div className="col">
                        {contact.contactType}
                      </div>
                    </div>

                    <div className="mb-3 col "></div>
                  </div>
                  <div className="row">
                    <div className="mb-3 col ">
                      <div className="col col-auto"> {t("contact.identificationType")}</div>
                      <div className="col">
                        {contact.identificationType}
                      </div>
                    </div>

                    <div className="mb-3 col ">
                      <div className="col col-auto"> {t("contact.identificationValue")}</div>

                      <div className="col">
                        {contact.identificationValue}
                      </div>
                    </div>

                    <div className="mb-3 col ">
                      <div className="col col-auto"> {t("contact.email")}</div>

                      <div className="col">
                        {contact.email}
                      </div>
                    </div>

                    <div className="mb-3 col "></div>
                  </div>
                  <div className="mb-3 row ">
                    <div className="col col-auto text-info">{t("contact.subContactInformation")}</div>
                    <div className="col">
                      <hr />
                    </div>
                  </div>
                  <div className="row">
                    <div className="mb-3 col ">
                      <div className="col col-auto"> {t("contact.subContactName")}</div>
                      <div className="col">
                        {contact.subContactName}
                      </div>
                    </div>

                    <div className="mb-3 col ">
                      <div className="col col-auto"> {t("contact.subContactMobile")}</div>

                      <div className="col">
                        {contact.subContactMobile}
                      </div>
                    </div>

                    <div className="mb-3 col ">
                      <div className="col col-auto"> {t("contact.subContactEmail")}</div>

                      <div className="col">
                        {contact.subContactEmail}
                      </div>
                    </div>

                    <div className="mb-3 col "></div>
                  </div>
                  <div className="row">
                    <div className="mb-3 col ">
                      <div className="col col-auto"> {t("contact.note")}</div>
                      <div className="col">
                        {contact.note}
                      </div>
                    </div>


                    <div className="mb-3 col ">
                      <div className="col col-auto"> {t("contact.createdDate")}</div>
                      <div className="col">
                        {getCreatedDate()}
                      </div>
                    </div>
                    <div className="mb-3 col "></div>
                    <div className="mb-3 col "></div>

                  </div>
                </Tab>

                <Tab eventKey="invoices" title={t("sidebar.invoices")} tabClassName="tab-item">
                  <ContactInvoices contactId={contactId} />
                </Tab>

                <Tab eventKey="appointments" title={t("Appointments")} tabClassName="tab-item">
                  <ContactAppointments contactId={contactId} />
                </Tab>

              </Tabs>






              <div className="row">



                <div className="row text-right">
                  <div className="mb-3  col justify-content-end">
                    <Link className="btn btn-secondary btn-lg mx-2" to={"/admin/Contact"}>
                      <MdClose size={20} /> &nbsp; {t("close")}
                    </Link>
                    &nbsp;



                    <Link className="btn btn-primary btn-lg" to={"/admin/Contact/edit/" + contact._id}>
                      <MdEdit size={20} />
                      &nbsp; {t("dashboard.edit")}
                    </Link>

                  </div>


                  <ConfirmButton
                    onConfirm={() => { removeContact(contactId); navigate("/admin/Contact/", { replace: true }); }}
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




            </form>
          </div>
        </div>
      ) : (
        <>No Data Found contactId: {contactId}</>
      )}
    </>
  );

};

export default ViewContact 