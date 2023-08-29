import React, { useState, useEffect } from "react";
import { getFullCalendars } from "../FullCalendar/FullCalendarAPI"
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { MdEdit, MdLocalShipping } from "react-icons/md";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const AppointmentLst = (props) => {
  const { t, i18n } = useTranslation();
  const [appointments, setAppointments] = useState([]);
  const [pages, setPages] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const [show, setShow] = useState(false);
  const [popUpEvent, setPopUpEvent] = useState("");
  const [fullCalendarObj, setFullCalendarObj] = useState(0);
  const [fullCalenders, setFullCalenders] = useState({})
  const handleEventSelection = (e) => {
    if (e) {
      console.log(e, "Event data");
      setFullCalendarObj(e);

      setPopUpEvent("edit");
      setShow(true);
      // value not updated yet, but when you call the edit component returns the correct value.
      // console.log("FullCalendarId:" + fullCalendarId) ;
    }
  };
  const handleAppoinmentSelected = (item) => {
    if(props.handleAppoinmentSelected){
      props.handleAppoinmentSelected(item);
    }
    return true;
  };

 const countAppointementsList = () =>
 {
  if(props.countAppointementsList){
    console.log("appointments.length=" +appointments.length);
    props.countAppointementsList( appointments? appointments.length : 0);
  }
 }
  useEffect(() => {
    loadNewPage(0);
    countAppointementsList();
  }, [props]);

  useEffect(() => {
    countAppointementsList();
  }, [appointments]);

  const loadNewPage = (newPage) => {
    if (newPage < 0 || (newPage >= pages && pages > 0)) {
      return;
    }

    console.log("newPage:" + newPage);
    setLoading(true);

    setPage(newPage);
    let filter =
    {
      page: newPage
    }

    if (props && props.clientId) {
      filter.clientId = props.clientId
    }

    if (props && props.contractId) {
      filter.contractId = props.contractId
    }

    if(props && props.employeeId)
    {
      filter.employeeId = props.employeeId
    }

    //****************************/
    console.log("filter appointment list: filter.contractId" + filter.contractId + "props.contracctId:" + props.contractId);
    console.log(filter);

    getFullCalendars(filter)
      .then((data) => {
        console.log("Full calendar Data:");
        console.log(data);
        setAppointments(data.items || []);

        /*
             setFullCalenders(
               data.items.map((item) => {
                 return {
                   _id: item._id,
                   start: new Date(item.start),
                   end: new Date(item.end),
                   title: item.title ,
                   note: item.note,
                   contactName: item.contactName,
                   allDay: item.allDay,
                   mobile: item.mobile,
                   employeeName: item.employeeName ,
                   status:  item.status ,
                   contract: item.contract ,
                  contractSequanceNumber : item.contract ? item.contract.seqNumber : "" ,
                 contact: item.contact
               
               }}
               ) 
             );*/
        //console.log(data);
        setLoading(false);
      }
      ).catch((e) => {
        console.log("Error fetch appointements: " + e);
        setLoading(false);
      });


    //**************************** */

  };


  moment.locale("en-GB");
  const localizer = momentLocalizer(moment);

  return (
    <>
      <div style={{ }}>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Mobile</th>
              <th>Start</th>
              <th>End</th>
              <th> Remining Time </th>
              <th>Note</th>
              <th>Employee</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments && appointments.length > 0 ? (<>{
              appointments.map(a => (<tr key={a._id}>
                <td>
                  <a href="#" onClick={(e) => {e.preventDefault();handleAppoinmentSelected(a);return true;}}>{a.title}</a></td>
                <td>{a.mobile}</td>
                <td>{moment(a.start).format("DD/MM/yyyy hh:mm A")}</td>
                <td>{moment(a.end).format("DD/MM/yyyy hh:mm A")}</td>
                <td>{moment(a.start).fromNow()}  </td>
                <td>{a.note}</td>
                <td> {a.employee ? a.employee.contactName : ""} </td>
                <td className={getStyleStatus(a.status)}>{a.status} </td>
              </tr>))
            }</>) : (<></>)}
          </tbody>
        </table>
      </div>
    </>
  );

  function getStyleStatus(val) {
    if (val == "Completed")
      return "text-success"
    else if (val == "Scheduled")
      return "text-info"
    else
      return "text-danger"

  }
};

export default AppointmentLst;
