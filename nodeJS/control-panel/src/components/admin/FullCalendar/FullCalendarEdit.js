import { React, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { updateFullCalendar, deleteFullCalendar} from "./FullCalendarAPI";
import ConfirmButton from "react-confirmation-button";
import {MdDelete} from  "react-icons/md"
import ContactSearchControl from "../Contact/ContactSearchControl";
let startDate = new Date() ;
if(startDate.getMinutes() >0 && startDate.getMinutes() < 30 ) 
{
startDate.setMinutes(0)
}
else
{
  startDate.setMinutes(30)
}

let endDate = new Date() ;
if(endDate.getMinutes() < 30 ) 
{
  endDate.setMinutes(30)
}
else
{
  endDate.setMinutes(60)
}


const FullCalendarEdit = (props) => {
 
    const [fullCalendar, setFullCalendar] = useState({});

   useEffect ( () => {
        setFullCalendar(props.getfullCalendarObj);
   }, []) 
  
 


  const { t, i18n } = useTranslation();

  const [wasValidated, setWasValidated] = useState(false);

  const setTitle = (event) => {
    let cloned = JSON.parse(JSON.stringify(fullCalendar));
    cloned.title = event.target.value;
    setFullCalendar(cloned);
  };

  const setContactName = (event) => {
    let cloned = JSON.parse(JSON.stringify(fullCalendar));
    cloned.contactName = event.target.value;
    setFullCalendar(cloned);
  };

  const setMobile = (event) => {
    let cloned = JSON.parse(JSON.stringify(fullCalendar));
    cloned.mobile = event.target.value;
    setFullCalendar(cloned);
  };

  const setNote = (event) => {
    let cloned = JSON.parse(JSON.stringify(fullCalendar));
    cloned.note = event.target.value;
    console.log("note value:" +event.target.value) 
    setFullCalendar(cloned);
  };

  const setAllDay = (event) => {
    let cloned = JSON.parse(JSON.stringify(fullCalendar));
    cloned.allDay = event.target.checked;
    setFullCalendar(cloned);
  };

  function setStartDate(date) {
    let cloned = JSON.parse(JSON.stringify(fullCalendar));
    cloned.start = date.toString();
    setFullCalendar(cloned);
  }

  function setEndDate(date) {
    let cloned = JSON.parse(JSON.stringify(fullCalendar));
    cloned.end = date.toString();
    setFullCalendar(cloned);
  }

  const fieldClass = (value, minQuantity) => {
    if (!wasValidated) return "form-control";
    if (isNaN(minQuantity))
      return value ? "form-control is-valid" : "form-control is-invalid";
    else
      return parseFloat(value) >= parseFloat(minQuantity)
        ? "form-control is-valid"
        : "form-control is-invalid";
  };

  const checkDate = (start, end) => {
    if (!wasValidated) return "form-control";
    if (new Date(start) >= new Date(end)) {
      return "form-control is-invalid";
    } else {
      return "form-control is-valid";
    }
  };

  const dopost = (event) => {
    console.log("dopost ....");
    //console.log(event);
    setWasValidated(true);
    if (checkFullCalendar()) {
      console.log("ready to update new calendar ...");
      updateFullCalendar(fullCalendar)
        .then((res) => {
          //setInvoice(res.data);
          // window.location.href = "/admin/invoices/ViewInvoice/" + res._id;
          console.log("fullCalendar has been updated ....");
          
          if(props.onSave){
            props.onSave();
          }
          if( props.updateFullCalendar) 
          {
            props.updateFullCalendar() ;
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

  function checkFullCalendar() {
    if (
      isBlank(fullCalendar.title) ||
      isBlank(fullCalendar.start) ||
      isBlank(fullCalendar.end)
    ) {
      console.log("checkFullCalendar, Some Data needs to fill ....");
      return false;
    }

    console.log(
      " ( new Date(fullCalendar.start) >= new Date(fullCalendar.end))" +
        (new Date(fullCalendar.start) >= new Date(fullCalendar.end))
    );
    if (new Date(fullCalendar.start) >= new Date(fullCalendar.end)) {
      console.log("End Date must be greater than Start Date");
      return false;
    }
    return true;
  }

  const selectedConatct = (item) => {
    if (item) {
      let cloned = JSON.parse(JSON.stringify(fullCalendar));
      cloned.contactName = item.contactName;
      cloned.contact = item._id;
      cloned.title = item.contactName;
      cloned.mobile = item.mobile; 
      setFullCalendar(cloned);
      
    }
  };

  return (
    <>
      <form>
         
      <div className="row">
          <div className="mb-3 col ">
            <div className="col col-auto">{t("FullCalendar.contactName")} </div>

            <div className="col">
              {/* <input
                type="text"
                className="form-control"
                id="contactName"
                name="contactName"
                placeholder={t("FullCalendar.contactName")}
                value={fullCalendar.contactName}
                onChange={setContactName}
              ></input> */}

<ContactSearchControl
                    handleSelectContact={selectedConatct}
                    wasValidated={wasValidated}
                    value = {fullCalendar.contactName}
                  />

            </div>
          </div>
        </div>

      <div className="row">
          <div className="mb-3 col ">
            <div className="col col-auto">{t("FullCalendar.title")} </div>

            <div className="col">
              <input
                type="text"
                className={fieldClass(fullCalendar.title)}
                id="title"
                name="title"
                placeholder={t("FullCalendar.title")}
                value={fullCalendar.title}
                onChange={setTitle}
              ></input>
            </div>
          </div>
        </div>

   
        <div className="row">
          <div className="mb-3 col ">
            <div className="col col-auto">{t("FullCalendar.mobile")} </div>

            <div className="col">
              <input
                type="text"
                className="form-control"
                id="mobile"
                name="mobile"
                placeholder={t("FullCalendar.mobile")}
                value={fullCalendar.mobile}
                onChange={setMobile}
              ></input>
            </div>
          </div>
        </div>


   

        <div className="row">
          <div className="mb-3 col ">
            <div className="col col-auto">{t("FullCalendar.start")} </div>

            <div className="col">
              <DatePicker
                className={fieldClass(fullCalendar.start)}
                showTimeSelect
                dateFormat="dd/MM/yyyy hh:mm a"
                selected={
                  fullCalendar.start ? new Date(fullCalendar.start) : new Date()
                }
                onChange={(date) => {
                  setStartDate(date);
                }}
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="mb-3 col ">
            <div className="col col-auto">{t("FullCalendar.end")} </div>

            <div className="col">
              <DatePicker
                className={checkDate(fullCalendar.start, fullCalendar.end)}
                showTimeSelect
                dateFormat="dd/MM/yyyy hh:mm a"
                selected={
                  fullCalendar.end ? new Date(fullCalendar.end) : new Date()
                }
                onChange={(date) => {
                  setEndDate(date);
                }}
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="mb-3 col ">
            <div className="col col-auto">{t("FullCalendar.note")} </div>

            <div className="col">
              <textarea
                className="form-control"
                id="note"
                name="note"
                placeholder={t("FullCalendar.note")}
                onChange={setNote}
                value={fullCalendar.note}
              >
                
                  {fullCalendar.note}
              </textarea>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="mb-3 col ">
            <div className="col col-auto">{t("FullCalendar.allDay")} </div>

            <div className="col">
              <input
                type="checkbox"
                id="allDay"
                name="allDay"
                placeholder={t("FullCalendar.allDay")}
                onChange={setAllDay}
                value={fullCalendar.allDay}
                defaultChecked={fullCalendar.allDay}
              ></input>
            </div>
          </div>
        </div>

        <div className="mb-3 row ">
          <div className="col">
            <button
              type="button"
              className="btn btn-primary btn-lg w-100 ml-2"
              onClick={dopost}
            >
              {t("dashboard.submit")}
            </button>
          </div>
        </div>
        <div className="mb-3 row ">
          <div className="col">
          <ConfirmButton
                              onConfirm={() =>{  deleteFullCalendar(fullCalendar._id) ;  console.log("delete") ;  props.onSave(); props.updateFullCalendar()  } }
                              onCancel={() => console.log("cancel")}
                              buttonText= {t("dashboard.delete")}
                              confirmText={t("invoice.confirmDelete")}
                              cancelText={t("invoice.cancelDelete")}
                              loadingText={t("FullCalendar.BeingDeleteingTheAppointment")}
                              wrapClass="d-grid gap-2"
                              buttonClass="btn btn-lg"
                              mainClass="btn-warning mx-2 w-100"
                              confirmClass="btn-danger "
                              cancelClass=" btn-success"
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
    </>
  );
};

export default FullCalendarEdit;
