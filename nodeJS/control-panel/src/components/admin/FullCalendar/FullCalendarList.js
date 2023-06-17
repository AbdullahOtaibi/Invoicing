import { React, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { render } from "react-dom";
import events from "./events";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import FullCalendarNew from "./FullCalendarNew";
import FullCalendarEdit from "./FullCalendarEdit";
import { getFullCalendars } from "./FullCalendarAPI";
import { ThreeDots } from  'react-loader-spinner';

import {
  MdOutlineReceiptLong,
  MdEdit,
  MdClose,
  MdHistoryToggleOff,
  MdPayment,
  MdLocalShipping,
  MdOutlineCancel,
  MdTask ,
  MdAddTask
} from "react-icons/md";

const FullCalenderList = (props) => {
  const [loading, setLoading] = useState(false);

  const { t, i18n } = useTranslation();
  const [popUpEvent, setPopUpEvent] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [fullCalendarObj, setFullCalendarObj] = useState(0);
  const [FullCalenders, setFullCalenders] = useState([]);
  // To view rge event
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

  const clickNew = () => {
    console.log("clicknew ....");
    //setPopUpEvent("new") ;
    setShow(true);
    setPopUpEvent("new");
  };

  useEffect(() => {
    reloadData();
  }, []);

  const reloadData = () => {
    getFullCalendars()
      .then((data) => {
        console.log("test ........");
        console.log(data);
        setFullCalenders(
          data.items.map((item) => {
            return {
              _id: item._id,
              start: new Date(item.start),
              end: new Date(item.end),
              title: item.title,
              note: item.note,
              contactName: item.contactName,
              allDay: item.allDay,
              mobile: item.mobile,
              employeeName: item.employeeName
            };
          })
        );
        console.log(data);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };

  moment.locale("en-GB");
  const localizer = momentLocalizer(moment);
  /*
  let evnts1 = [
    {
      title: "appointment 1",
      note: "note 1",
      allDay: false,
      start: new Date(2023, 4, 8, 9, 0, 0),
      end: new Date(2023, 4, 8, 9, 30, 0),
    },
    {
      title: "appointment 2",
      allDay: false,
      start: new Date(2023, 4, 8, 10, 0, 0),
      end: new Date(2023, 4, 8, 10, 30, 0),
    },
    {
      title: "appointment 3",
      allDay: false,
      start: new Date(2023, 4, 8, 10, 30, 0),
      end: new Date(2023, 4, 8, 11, 0, 0),
    },
    {
      title: "All Day Event very long title ....",
      allDay: true,
      start: new Date(2023, 4, 9),
      end: new Date(2023, 4, 9),
    },
  ];
  */

  return (
    <>
      <div class="row mb-3">
        <div class="col-md-12 text-right">
          <Button
            variant="primary"
            onClick={clickNew}
            className="btn btn-success  btn-lg mt-3 mb-3 shadow "
          >
             <MdAddTask size={30} /> &nbsp;
            {t("FullCalendar.newAppintement")}
           
          </Button>
        </div>
      </div>

      <div className="container text-center">
        <ThreeDots
          type="ThreeDots"
          color="#00BFFF"
          height={100}
          width={100}
          visible={loading}
        />
      </div>

      <div style={{ height: 700 }}>
        {
          <Calendar
            onSelectEvent={handleEventSelection}
            step={60}
            events={FullCalenders} // {evnts1}   //{FullCalenders}
            defaultDate={new Date()}
            popup={true}
            onShowMore={(events, date) =>
              this.setState({ showModal: true, FullCalenders })
            }
            showAllEvents={true}
            localizer={localizer}
          />
        }
      </div>

      <Modal show={show} onHide={handleClose}   size="lg" >
        <Modal.Header closeButton>
          <div className="row">
            <div className="col">
              {popUpEvent == "new" ? (
                <Modal.Title >{t("FullCalendar.newAppintement")}</Modal.Title>
              ) : (
                ""
              )}
              {popUpEvent == "edit" ? (
                <Modal.Title>{t("FullCalendar.editAppintement")}</Modal.Title>
              ) : (
                ""
              )}
            </div>
          </div>
        </Modal.Header>
        <Modal.Body>
          {popUpEvent == "new" ? (
            <FullCalendarNew
              onSave={handleClose}
              updateFullCalendar={reloadData}
            />
          ) : (
            ""
          )}

          {popUpEvent == "edit" ? (
            <FullCalendarEdit
              onSave={handleClose}
              updateFullCalendar={reloadData}
              getfullCalendarObj={fullCalendarObj}
            />
          ) : (
            ""
          )}
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  );
};

export default FullCalenderList;
