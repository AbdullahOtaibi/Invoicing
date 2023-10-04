import { React, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MdWarning } from "react-icons/md";
import { useDebugValue } from "react";
import { updateExpense } from "./ExpensesAPI";
import { ThreeDots } from "react-loader-spinner";
import { getExpensesCategory } from "../ExpensesCategory/ExpensesCategoryAPI";
import { toast } from "react-toastify";

const ExpCatNew = (props) => {
  const [loading, setLoading] = useState(false);

  const [Expense, setExpense] = useState({});
  const [ExpensesCategory, setExpensesCategory] = useState([]);
  const [categoryObj, setCategoryObj] = useState({
    expensesCategory: "",
    category: "",
    amount: 0,
  });
  //const [amount, setAmount] = useState(0);

  useEffect(() => {
    setExpense(props.Expense);

    console.log("props.Expense:" + JSON.stringify(props.Expense));

    console.log("expenseId:" + props.Expense._id);
    let filters = {};

    getExpensesCategory(filters)
      .then((res) => {
        setExpensesCategory(res.items);
        console.log("ExpensesCategory:" + JSON.stringify(res.items));
      })
      .catch((error) => {
        console.log(error);
      });
  }, [props.Expense]);

  const selectedExpensesCategory = (event) => {
    
    console.log("selectedExpensesCategory:" + event.target.value);
    let value = event.target.value;

    let filtered = ExpensesCategory.filter((item) => item._id === value);

    console.log("filtered:" + JSON.stringify(filtered));

    if (filtered.length > 0) {
      console.log("inside if ...");
      let obj = {};
      obj.expensesCategory = filtered[0]._id;
      obj.category = filtered[0].categoryName;
      obj.amount = filtered[0].defaultAmount;
      setCategoryObj(obj);
      console.log("obj:" + JSON.stringify(obj));

    }

  };

  const changeAmount = (event) => {

    console.log("changeAmount:" + event.target.value);
    let value = event.target.value;
    categoryObj.amount = value;
    setCategoryObj(categoryObj);
    console.log("categoryObj after edit amount :" + JSON.stringify(categoryObj));
    console.log("new  amount :" + JSON.stringify(categoryObj.amount));

  };

  useEffect(() => { 

    console.log("useEffect categoryObj:" + JSON.stringify(categoryObj));

  }, [setCategoryObj , categoryObj]);

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
      let details = Expense.details;
      console.log(" before fill details:" + JSON.stringify(details));
      details.push(categoryObj);
      Expense.details = details;
      let total = 0;
      for (let obj in Expense.details) {
        console.log("Expense.details:" + JSON.stringify(obj));
        total = total + obj.amount;
      }
      Expense.totalAmount = total;
      console.log(" after fill details:" + JSON.stringify(details));
      console.log(" before save Expense:" + JSON.stringify(Expense));
      updateExpense( Expense)
        .then((res) => {
          console.log("Expense details has been added ....");
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

  const viewItemValidMessage = (message) => {
    toast.warning(message, {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  function checkDataIsValid() {

    let isValid =true ; 
    if (isBlank(categoryObj.expensesCategory)) {
        isValid = false;
        viewItemValidMessage("Please select the category");
      

    }
    if (isBlank(categoryObj.amount) || categoryObj.amount <= 0 ) {
        isValid = false;
        viewItemValidMessage("Please enter the amount");

    }

    return isValid;
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
              {ExpensesCategory.length > 0 && (
                <select
                  className="form-control"
                  id="expensesCategory"
                  name="expensesCategory"
                  onChange={selectedExpensesCategory}
                >
                  <option value="">أختر</option>
                  {Array.isArray(ExpensesCategory)
                    ? ExpensesCategory.map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.categoryName}
                        </option>
                      ))
                    : console.log("ExpensesCategory is not an array")}
                </select>
              )}
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
                onChange={changeAmount}
               value={categoryObj?.amount}
              ></input>
            </div>
          </div>
        </div>



        {/* <DatePicker
                  className={fieldClass(invoice.issuedDate)}
                  dateFormat="dd/MM/yyyy"
                  selected={new Date(invoice.issuedDate)}
                  onChange={(date) => updateIssuedDate(date)}
                /> */}

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
