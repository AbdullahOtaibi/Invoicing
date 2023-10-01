import { React, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MdWarning } from "react-icons/md";
import { useDebugValue } from "react";
import { updateExpense } from "./ExpensesAPI";
import { ThreeDots } from 'react-loader-spinner';
import  {getExpensesCategory}  from "../ExpensesCategory/ExpensesCategoryAPI";
const ExpCatNew = (props) => {

  const[loading, setLoading] = useState(false);

   const [Expense, setExpense] = useState({});
  const [ExpensesCategory, setExpensesCategory] = useState({});

  useEffect(() => {
setExpense(props.Expense);  

console.log("props.Expense:" + JSON.stringify(props.Expense)) ;

console.log("expenseId:" + props.Expense._id);
    let filters= {} 

    getExpensesCategory(filters).then(
      (res) => {
        setExpensesCategory(JSON.stringify(res.items) )
        console.log("ExpensesCategory:" + JSON.stringify(res.items)) ;
      }
    ).catch((error) => { console.log(error) })


   }, [ props.Expense]);       

  
useEffect(() => {
 // console.log("ExpensesCategory:" + JSON.stringify(ExpensesCategory)) ;
 //console.log("ExpensesCategory.length:" + ExpensesCategory.length) ;
 //console.log("ExpensesCategory[0]:" + ExpensesCategory[0]) ;

 let arr = ExpensesCategory //JSON.parse(ExpensesCategory); 
  console.log("arr:" + arr) ;
  console.log("arr.length:" + arr.length) ;
  console.log("arr[0]:" + arr[0]) ;

  console.log( "typeof arr" + typeof arr)
  arr = JSON.parse(arr);
  console.log( "typeof arr" + typeof arr)
  console.log("arr.length:" + arr.length) ;
  console.log("arr[0]:" + arr[0]) ;
  
  if(Array.isArray(arr))
  {
    arr.map((item) => (
      console.log("item:" + item._id) 
    ))
  }
  else
  {
    console.log("ExpensesCategory is not an array") ;
  }



}, [ExpensesCategory]);

 
  const { t, i18n } = useTranslation();

  const [wasValidated, setWasValidated] = useState(false);

 

  // const setContactName = (event) => {
  //   let cloned = JSON.parse(JSON.stringify(fullCalendar));
  //   cloned.contactName = event.target.value;
  //   setFullCalendar(cloned);
  // };


  
  const dopost = (event) => {
    console.log("dopost ....");
    //console.log(event);
    setWasValidated(true);
    if (checkDataIsValid()) {
      console.log("ready to add new calendar ...");
      updateExpense(Expense._id, Expense)
        .then((res) => {

          console.log("fullCalendar has been created ....");
          if (props.onSave) {
            props.onSave();
          }
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      console.log("false");
    }
  };

  function isBlank(str) {
    return !str || /^\s*$/.test(str);
  }

  function checkDataIsValid() {
    
    return true;
  }


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
  
  const selectFieldClass = (value, minQuantity) => {
    if (!wasValidated) return "form-select";
    //console.log("minQuantity:"+ minQuantity) ;
    if (isNaN(minQuantity))
      return value ? "form-select is-valid" : "form-select is-invalid";
    else
      return parseFloat(value) >= parseFloat(minQuantity)
        ? "form-select is-valid"
        : "form-select is-invalid";
  };
  





  return (
    <>
      <form>

      <div className="container text-center">
          <ThreeDots
            type="ThreeDots"
            color="#00BFFF"
            height={100}
            width={100}
            visible={loading}
          />
        </div>
      
        <div className="row">
          <div className="mb-3 col ">
            <div className="col col-auto">{t("Expense.expensesCategory")} </div>
            <div className="col">
         {  ExpensesCategory.length >0 && <select className="form-control" id="expensesCategory" name="expensesCategory" 
           //onChange={setExpensesCategory}
           >
             <option value="">أختر</option>
             {Array.isArray(ExpensesCategory) ? ExpensesCategory.map((item) => (
  <option key={item._id} value={item._id}>
    {item._id}
  </option>
)
) : console.log("ExpensesCategory is not an array")}
              
              </select>
}
</div>
            </div>
          </div>
    


        <div className="row">
          <div className="mb-3 col ">
            <div className="col col-auto">{t("Expense.amount")} </div>

            <div className="col">
              <input
                type="text"
                //className={fieldClass(fullCalendar.title)}
                className="form-control"
               // className= {fieldClass(amount)}
                id="amount"
                name="amount"
                placeholder={t("Expense.amount")}
                min={0.01}
                type="number"
               // onChange={setTitle}
              ></input>
            </div>
          </div>
        </div>



      

       

  








     

        <div className="mb-3 row ">
          <div className="col">
            <button
              type="button"
              className="btn btn-primary btn-lg w-100"
              onClick={dopost}
            >
              {t("dashboard.submit")}
            </button>
          </div>
        </div>
      </form>
    </>
  );

};

export default ExpCatNew;
