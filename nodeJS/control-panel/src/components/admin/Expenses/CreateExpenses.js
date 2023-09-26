import React, { useState, useEffect } from "react";
import { Link,useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThreeDots } from  'react-loader-spinner';
import {  MdClose, MdCollections, MdContacts, MdPayment } from "react-icons/md";
import "react-datepicker/dist/react-datepicker.css";
import { CSSTransition } from 'react-transition-group';
import  {createExpense} from './ExpensesAPI'
import { use } from "i18next";

const CreateExpenses = (props) => {

  const [wasValidated, setWasValidated] = useState(false);

  const [Expense , setExpense] = useState( { 
    deleted: false,
    companyID: localStorage.getItem("companyId"),
    company: localStorage.getItem("company"), 
    totalAmount: 0.00,

  }) ;  
  
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const [months, setMonths] = useState([ 1,2,3,4,5,6,7,8,9,10,11,12]) ;
  const [years, setYears] = useState([]) ;

useEffect(() => {
  let currentYear = new Date().getFullYear() ;
  setYears([currentYear-1,currentYear,currentYear+1]) ;
}, []);




  const setNote = (event) => {
    let cloned =JSON.parse(JSON.stringify(Expense)) ;
    cloned.note = event.target.value; 
    setExpense(cloned)
  };

  const setYear = (event) => {
    console.log("year:"+ event.target.value) ;
    let cloned =JSON.parse(JSON.stringify(Expense)) ;
    cloned.year = event.target.value;
    setExpense(cloned)
    console.log("year:"+ cloned.year) ;
  };

  const setMonth = (event) => {
    console.log("month:"+ event.target.value) ;
    let cloned =JSON.parse(JSON.stringify(Expense)) ;
    cloned.month = event.target.value;
    setExpense(cloned); 
  };


  const fieldClass = (value, minQuantity) => {
    if (!wasValidated) return "form-control";
    //console.log("minQuantity:"+ minQuantity) ;
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
      createExpense(Expense).then((res)=> {
        toast("success!") ;
         window.location.href = "/admin/Expenses/view/" + res._id;
  
      }).catch((err)=> { console.log(err)}) ;
    }
    setLoading(false) ; 
  }
 
function checkData() 
{
  console.log( "insert checkdata ...") 
  let isValid= true;

 if (isBlank(Expense.year)) 
 {
  viewItemValidMessage("Fill the Year") 
  isValid = false ; 
 }

 if ( isBlank(Expense.month)) 
 {
  viewItemValidMessage("Fill the Month") 
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
          <h5 className="card-title"> <MdPayment size= {20} />   {t("Expense.createExpense")}</h5>
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
                {t("Expense.expenseInformation")}{" "}
              </div>
              <div className="col">
                <hr />
              </div>
            </div>

            <div className="mb-3 row">
                
            <div className="mb-3 col ">
                <div className="col col-auto">{t("Expense.year")}</div>
                <div className="col col-auto">
                <select
                    type="text"
                    className= {selectFieldClass(Expense.year)}
                    id="year"
                    name="year"
                    placeholder={t("Expense.year")}
                    value={
                      Expense.year
                    }
                    onChange={ (e) => setYear (e)}
                    >
                    <option value=""> اخنر </option>
                    {years.map((item) => (
                      <option value={item}>{item}</option>
                    ))}
                    


                  </select>
                </div>
              </div>


              <div className="mb-3 col ">
                <div className="col col-auto">{t("Expense.month")} {Expense.month}</div>
                <div className="col col-auto">
      

                    <select
                    type="text"
                    className={selectFieldClass(Expense.month)}
                    id="nonth"
                    name="nonth"
                    value={ Expense.nonth}
                    onChange={(e) => setMonth(e)}
                  >
                    <option value=""> اخنر </option>
                    {months.map((item) => (
                      <option value={item}>{item}</option>
                    ))}


                  </select>
                    

                </div>
              </div>


            

              <div className="mb-3 col ">
                <div className="col col-auto mb-2">{t("Expense.note")}</div>
                <div className="col col-auto">
                 
                <textarea
                    className="form-control"
                    id="note"
                    name="note"
                    onChange={setNote}
                    placeholder={t("Expense.note")}
                  >
                    {Expense.note}
                  </textarea>

                </div>
              </div>

              

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

export default CreateExpenses;
