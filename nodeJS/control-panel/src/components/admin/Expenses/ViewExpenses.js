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
  MdContacts,
  MdPhone,
  MdCollections,
  MdMoney
} from "react-icons/md";
import { ThreeDots } from 'react-loader-spinner';
import { useTranslation } from "react-i18next";
import ConfirmButton from "react-confirmation-button";
import { MdAdd, MdDelete , MdCategory } from "react-icons/md";
import { RiRefund2Fill } from "react-icons/ri";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getExpense , removeExpense } from "./ExpensesAPI"
import ExpCatNew from './ExpCatNew';
import { Modal } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
const ViewExpenses = (props) => {


  let navigate = useNavigate();
  const { expenseId } = useParams();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const [Expense, setExpense] = useState({});
  const [show, setShow] = useState(false);
  const [popUpEvent, setPopUpEvent] = useState("");
  const handleClose = () => setShow(false);

  useEffect(() => {
    setLoading(true);
    console.log("expenseId:" + expenseId);
    getExpense(expenseId).then(
      (res) => {
        setExpense(res)
        console.log("res:" + res) ;
      }
    ).catch((error) => { console.log(error) })
    setLoading(false);
  }, []);

  
  const clickNew = () => {
    console.log("clicknew ....");
    setShow(true);
    setPopUpEvent("new");
  };


  return (
    (Expense ? (<>

      <div className="card">
        <h5 className="card-header">
          <MdPayment /> {t("Expense.expenseInformation")}   <span className="text-info px-1">  {Expense.seqNumber}  <MdMoney size={20} />  {"  " + Expense.totalAmount}</span>
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

          <div className="row">
          <div class="col-md-12 text-right">
          <Button
            variant="primary"
            onClick={clickNew}
            className="btn btn-success  btn-lg mt-3 mb-3 shadow "
          >
             <MdCategory size={30} /> &nbsp;
            {t("Expense.New")}
           
          </Button>
          </div>
         

          </div>

          <div className="row">

            <div className="mb-3 col ">
              <div className="col col-auto"> {t("Expense.sequanceNumber")}</div>

              <div className="col">
                {Expense.seqNumber}
              </div>
            </div>

            <div className="mb-3 col ">
              <div className="col col-auto"> {t("Expense.year")}</div>

              <div className="col">
                {Expense.year}
              </div>
            </div>

            <div className="mb-3 col ">
              <div className="col col-auto"> {t("Expense.month")}</div>

              <div className="col">
                {Expense.month}
              </div>
            </div>

         

          </div>

          <div className="row">

          
          <div className="mb-3 col ">
              <div className="col col-auto"> {t("Expense.totalAmount")}</div>

              <div className="col">
                {Expense.totalAmount}
              </div>
            </div>

            <div className="mb-3 col ">
              <div className="col col-auto"> {t("Expense.note")}</div>

              <div className="col">
                {Expense.note}
              </div>
            </div>

           
            <div className="mb-3 col "></div>

          </div>

          <div className="mb-3 row ">
              <div className="col col-auto text-info">
                {t("Expense.ExpenseDetails")}{" "}
              </div>
              <div className="col">
                <hr />
              </div>
            </div>


          <div className="row action-bar">
            <div className="row ">
              <div className="col ">
                <ConfirmButton
                  onConfirm={() => { removeExpense(expenseId); navigate("/admin/expenses/", { replace: true }); }}
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
                <Link className="btn btn-secondary btn-lg mx-2" to={"/admin/Expense"}>
                  <MdClose size={20} /> &nbsp; {t("close")}
                </Link>
                &nbsp;



                <Link className="btn btn-primary btn-lg" to={"/admin/Expense/edit/" + Expense._id}>
                  <MdEdit size={20} />
                  &nbsp; {t("dashboard.edit")}
                </Link>
              </div>
            </div>
          </div>


   
        </div>
      </div>

      <Modal show={show} onHide={handleClose}   size="lg" >
        <Modal.Header closeButton>
          <div className="row">
            <div className="col">
              {popUpEvent == "new" ? (
                <Modal.Title >{t("Expense.New")}</Modal.Title>
              ) : (
                ""
              )}
              {popUpEvent == "edit" ? (
                <Modal.Title>{t("Expense.Edit")}</Modal.Title>
              ) : (
                ""
              )}
            </div>
          </div>
        </Modal.Header>
        <Modal.Body>
          {popUpEvent == "new" ? (
            <ExpCatNew
              onSave={handleClose}
             Expense={Expense}

            />
          ) : (
            ""
          )}

          {/* {popUpEvent == "edit" ? (
            <FullCalendarEdit
              onSave={handleClose}
              updateFullCalendar={reloadData}
              getfullCalendarObj={fullCalendarObj}
            />
          ) : (
            ""
          )} */}
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>


    </>) : "No Data Found"));


};

export default ViewExpenses