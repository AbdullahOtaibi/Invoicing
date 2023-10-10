import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThreeDots } from 'react-loader-spinner';
import { MdClose, MdCollections, MdContacts, MdTurnedInNot , MdCategory } from "react-icons/md";
import "react-datepicker/dist/react-datepicker.css";
import { CSSTransition } from 'react-transition-group';

import { getExpenseCategory , updateExpenseCategory } from "./ExpensesCategoryAPI"



const EditExpensesCategory = (props) => {


    const [wasValidated, setWasValidated] = useState(false);
    const [ExpenseCategory , setExpenseCategory] = useState( {   }) ;  
    const { expenseCategoryId } = useParams();
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

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


    const setCategoryName = (event) => {
      console.log("categoryName:"+ event.target.value) ;
      let cloned =JSON.parse(JSON.stringify(ExpenseCategory)) ;
      cloned.categoryName = event.target.value; 
      setExpenseCategory(cloned)
  
    };
  
    const setDefaultAmount = (event) => {
      let cloned =JSON.parse(JSON.stringify(ExpenseCategory)) ;
      cloned.defaultAmount = event.target.value; 
      setExpenseCategory(cloned)
    };
  
  
    const fieldClass = (value, minQuantity) => {
      if (!wasValidated) return "form-control";
      if (isNaN(minQuantity))
        return value ? "form-control is-valid" : "form-control is-invalid";
      else
        return parseFloat(value) >= parseFloat(minQuantity)
          ? "form-control is-valid"
          : "form-control is-invalid";
    };
  
    const selectFieldClass = (value) => {
      if (!wasValidated) return "form-select";
  
        return value ? "form-select is-valid" : "form-select is-invalid";
     
  /*
        return parseFloat(value) >= parseFloat(minQuantity)
          ? "form-select is-valid"
          : "form-select is-invalid";
          */
    };
  
  
    function isBlank(str) {
      return !str || /^\s*$/.test(str);
    }
  
    const doPost = (event) => {
      setWasValidated(true) ;
      setLoading(true) ;
  
      if(checkData()) {
        updateExpenseCategory(ExpenseCategory).then((res)=> {
          toast("success!") ;
          window.location.href = "/admin/expenseCategories/view/" + res._id;
    
        }).catch((err)=> { console.log(err)}) ;
      }
      setLoading(false) ; 
    }
   
  function checkData() 
  {
    console.log( "insert checkdata ...") 
    let isValid= true;
  
   if (isBlank(ExpenseCategory.categoryName)) 
   {
    viewItemValidMessage("Fill the Category Name") 
    isValid = false ; 
   }
  
  
  
    return isValid; 
  };
  
  const viewItemValidMessage = (message) => {
    toast.warning(message, {
      position: toast.POSITION.TOP_RIGHT,
    });
  };
  
    return (
      <>
        <div className="card">
          <div className="card-body">
            <h5 className="card-title"> <MdCategory size= {20} />   {t("ExpenseCategory.editExpenseCategory")}</h5>
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
                  {t("ExpenseCategory.expenseInformation")}{" "}
                </div>
                <div className="col">
                  <hr />
                </div>
              </div>
  
              <div className="mb-3 row">
                  
              <div className="mb-3 col ">
                  <div className="col col-auto">{t("ExpenseCategory.categoryName")}</div>
                  <div className="col col-auto">
                  <input
                      type="text"
                      className= {fieldClass(ExpenseCategory.categoryName)}
                      id="year"
                      name="year"
                      placeholder={t("ExpenseCategory.categoryName")}
                      value={
                        ExpenseCategory.categoryName
                      }
                      onChange={ (e) => setCategoryName (e)}
                     
                    />
                  </div>
                </div>
  
  
                <div className="mb-3 col ">
                  <div className="col col-auto">{t("ExpenseCategory.defaultAmount")} </div>
                  <div className="col col-auto">
        
  
                      <input
                      type="text"
                      className="form-control"
                      id="defaultAmount"
                      name="defaultAmount"
                      value={ ExpenseCategory.defaultAmount}
                      onChange={(e) => setDefaultAmount(e)}
                   />  
                      
                  </div>
                </div>
  
                <div className="mb-3 col "></div>
              
  
           
  
                
  
              </div>
  
         
              <div class="row text-right action-bar">
                <div className="mb-3  col justify-content-end">
                  <Link className="btn btn-secondary btn-lg" to="/admin/Package">
                    <MdClose size={20} /> &nbsp; {t("Cancel")}
                  </Link>{" "}
                  &nbsp;
                  <button
                    type="button"
                    className="btn btn-primary btn-lg"
                    onClick={doPost}
                  >
                    {t("dashboard.submit")}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </>
    );
    

};

export default EditExpensesCategory;
