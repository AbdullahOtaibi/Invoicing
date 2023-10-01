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
  MdMoney,
  MdCategory
} from "react-icons/md";
import { ThreeDots } from 'react-loader-spinner';
import { useTranslation } from "react-i18next";
import ConfirmButton from "react-confirmation-button";
import { MdAdd, MdDelete } from "react-icons/md";
import { RiRefund2Fill } from "react-icons/ri";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getExpenseCategory , removeExpenseCategory ,  } from "./ExpensesCategoryAPI"

const ViewExpenseCategorysCategory = (props) => {


  let navigate = useNavigate();
  const { expenseCategoryId } = useParams();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const [ExpenseCategory, setExpenseCategory] = useState({});
  useEffect(() => {
    setLoading(true);
    console.log("expenseCategoryId:" + expenseCategoryId);
    getExpenseCategory(expenseCategoryId).then(
      (res) => {
        setExpenseCategory(res)
        console.log("res:" +  JSON.stringify(res)) ;
      }
    ).catch((error) => { console.log(error) })
    setLoading(false);
  }, []);


  return (
    (ExpenseCategory ? (<>

      <div className="card">
        <h5 className="card-header">
        <MdCategory size={20} />  {ExpenseCategory.categoryName}     <span className="text-info px-1">    {"  " + ExpenseCategory.defaultAmount}</span>
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

            <div className="mb-3 col ">
              <div className="col col-auto"> {t("ExpenseCategory.categoryName")}</div>

              <div className="col">
                {ExpenseCategory.categoryName}
              </div>
            </div>

            <div className="mb-3 col ">
              <div className="col col-auto"> {t("ExpenseCategory.defaultAmount")}</div>

              <div className="col">
                {ExpenseCategory.defaultAmount}
              </div>
            </div>

            <div className="mb-3 col ">
             
            </div>

         

          </div>


   


          <div className="row action-bar">
            <div className="row ">
              <div className="col ">
                <ConfirmButton
                  onConfirm={() => { removeExpenseCategory(expenseCategoryId); navigate("/admin/expensesCategory/", { replace: true }); }}
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
                <Link className="btn btn-secondary btn-lg mx-2" to={"/admin/ExpenseCategory"}>
                  <MdClose size={20} /> &nbsp; {t("close")}
                </Link>
                &nbsp;



                <Link className="btn btn-primary btn-lg" to={"/admin/expensesCategory/edit/" + ExpenseCategory._id}>
                  <MdEdit size={20} />
                  &nbsp; {t("dashboard.edit")}
                </Link>
              </div>
            </div>
          </div>


   
        </div>
      </div>


    </>) : "No Data Found"));


};

export default ViewExpenseCategorysCategory