import { React, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { creatFullCalendar, checkForIntersection } from "./FullCalendarAPI";
import ContactSearchControl from "../Contact/ContactSearchControl";
import ContractSearchControl from "../Contracts/ContractSearchControl";
import { MdWarning } from "react-icons/md";

let startDate = new Date();
if (startDate.getMinutes() > 0 && startDate.getMinutes() < 30) {
  startDate.setMinutes(0)
}
else {
  startDate.setMinutes(30)
}

let endDate = new Date();
if (endDate.getMinutes() < 30) {
  endDate.setMinutes(30)
}
else {
  endDate.setMinutes(60)
}





const FullCalendarNew = (props) => {

  const [intersection, setIntersection] = useState(false);
  const [fullCalendar, setFullCalendar] = useState({
    deleted: false,
    companyID: localStorage.getItem("companyId"),
    company: localStorage.getItem("company"),
    // status: "Scheduled" ,
    start: startDate,
    end: endDate,
    allDay: false,
  });

  useEffect(() => {
    if (fullCalendar && fullCalendar.contact && fullCalendar.start && fullCalendar.end) {
      checkForIntersection({ startDate: fullCalendar.start, endDate: fullCalendar.end, employeeId: fullCalendar.employee }).then((res) => {
        console.log("checkForIntersection ....");
        console.log(res);
        setIntersection(res.exists);
       
      });
    }

  }, [ fullCalendar.contact, fullCalendar.start, fullCalendar.end]);

  useEffect(() => {
    if (props.contractObj) {
      console.log("insert props.contractObj condition");
      console.log(props.contractObj)
      let contractObj = props.contractObj;
      let cloned = JSON.parse(JSON.stringify(fullCalendar));
      cloned.contactName = contractObj.contact.contactName;
      cloned.contact = contractObj.contact._id;
      cloned.contract = contractObj._id;
      cloned.contractSequanceNumber = contractObj.seqNumber;
      cloned.title = contractObj.contact.contactName;
      cloned.mobile = contractObj.contact.mobile;
      setFullCalendar(cloned);
    }
    if (props.contactObj) {
      console.log("insert props.contractObj condition");
      console.log(props.contractObj)
      let contactObj = props.contactObj;
      let cloned = JSON.parse(JSON.stringify(fullCalendar));
      if(contactObj.contactType == "Employee")
      {
        cloned.employeeName = contactObj.contactName;
        cloned.employee = contactObj._id; 
      }
      else
      {
        cloned.contactName = contactObj.contactName;
        cloned.contact = contactObj._id; 
    
      }
      cloned.title = contactObj.contactName;
      cloned.mobile = contactObj.mobile;
      setFullCalendar(cloned);
      
    }


  }, [])

  const selectFieldClass = (value, minQuantity) => {
    if (!wasValidated) return "form-select";
    if (isNaN(minQuantity))
      return value ? "form-select is-valid" : "form-select is-invalid";
    else
      return parseFloat(value) >= parseFloat(minQuantity)
        ? "form-select is-valid"
        : "form-select is-invalid";
  };

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

  //const [contract, setContract] = useState({});
  const handleSelectContract = (selectedContract) => {
    console.log("insert handleSelectContract method");
    let cloned = JSON.parse(JSON.stringify(fullCalendar));
    cloned.contract = selectedContract._id;
    setFullCalendar(cloned);
  }
  const setMobile = (event) => {
    let cloned = JSON.parse(JSON.stringify(fullCalendar));
    cloned.mobile = event.target.value;
    setFullCalendar(cloned);
  };

  const setStatus = (event) => {
    let cloned = JSON.parse(JSON.stringify(fullCalendar));
    cloned.status = event.target.value;
    setFullCalendar(cloned);
  }

  const setNote = (event) => {
    let cloned = JSON.parse(JSON.stringify(fullCalendar));
    cloned.note = event.target.value;
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
      console.log("ready to add new calendar ...");
      creatFullCalendar(fullCalendar)
        .then((res) => {

          console.log("fullCalendar has been created ....");
          if (props.onSave) {
            props.onSave();
          }
          if (props.updateFullCalendar) {
            props.updateFullCalendar();
          }
          //setShow(false);
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
      console.log("selectedConatct ....");
      let cloned = JSON.parse(JSON.stringify(fullCalendar));
      cloned.contactName = item.contactName;
      cloned.contact = item._id;
      cloned.title = item.contactName;
      cloned.mobile = item.mobile;
      cloned.contract = "";
      setFullCalendar(cloned);
      // handleSelectContract(null)

    }
  };


  const selectedEmployee = (item) => {
    if (item) {
      let cloned = JSON.parse(JSON.stringify(fullCalendar));
      cloned.employeeName = item.contactName;
      cloned.employee = item._id;
      setFullCalendar(cloned);
    }
  };


  return (
    <>
      <form>
        {intersection == true ? (<div className="row">
          <div className="col">
            <div className="alert alert-warning" role="alert">
              <MdWarning size={40} />
              User already has an appointment in the selected time range
            </div>
          </div>
        </div>) : null}



        <div className="row">
          <div className="mb-3 col ">
            <div className="col col-auto">{t("FullCalendar.contactName")} </div>

            <div className="col">
              <ContactSearchControl
                handleSelectContact={selectedConatct}
                wasValidated={wasValidated}
                value={fullCalendar.contactName}
                contactType={["Client", "Vendor"]}
                readOnly={props.contractObj ? true : false}
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
            <div className="col col-auto">{t("FullCalendar.contract")} {fullCalendar.contractSeqNumber}  </div>

            <div className="col">
              <ContractSearchControl handleSelectContract={handleSelectContract}
                clientId={fullCalendar.contact}
                value={fullCalendar.contractSequanceNumber}
                readOnly={props.contractObj ? true : false}
              />

            </div>
          </div>
        </div>

        <div className="row">
          <div className="mb-3 col col-6">
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

          <div className="mb-3 col col-6">
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
            <div className="col col-auto">{t("FullCalendar.employeeName")} </div>

            <div className="col">
              <ContactSearchControl
                handleSelectContact={selectedEmployee}
                wasValidated={false}
                value={fullCalendar.employeeName}
                contactType={["Employee"]}
              />

            </div>
          </div>
        </div>


        <div className="row">
          <div className="mb-3 col ">
            <div className="col col-auto">{t("FullCalendar.status")} </div>
            <div className="col">
              <select
                type="text"
                className={selectFieldClass(fullCalendar.status)}
                id="status"
                name="title"
                onChange={setStatus}
              >
                <option value="Scheduled"> Scheduled </option>
                <option value="Completed">Completed</option>
                <option value="In Complete">In Complete</option>
              </select>


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

export default FullCalendarNew;