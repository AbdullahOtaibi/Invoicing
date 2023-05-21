import React, { useState, useEffect } from "react";
import { getContactAppointments } from "./ContactAPI";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { MdEdit, MdLocalShipping } from "react-icons/md";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";


const ContactAppointments = (props) => {
    const { t, i18n } = useTranslation();
    const [appointments, setAppointments] = useState([]);
    const [pages, setPages] = useState(0);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);


    const [show, setShow] = useState(false);
    const [popUpEvent, setPopUpEvent] = useState("");
    const [fullCalendarObj, setFullCalendarObj] = useState(0);

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


    useEffect(() => {
        loadNewPage(0);
    }, []);

    const loadNewPage = (newPage) => {
        if (newPage < 0 || (newPage >= pages && pages > 0)) {
            return;
        }

        console.log("newPage:" + newPage);
        setLoading(true);


        setPage(newPage);
        getContactAppointments({
            page: newPage,
            clientId: props.contactId
        }).then(data => {
            setLoading(false);
            setAppointments(data.items || []);
            setPage(data.page);
            console.log("data.items:" + JSON.stringify(data.items));
            console.log("data.pages:" + data.pages);
            setPages(data.pages);
            if (props.updateCount) {
                props.updateCount(data.count);
            }
        }).catch(e => {
            setLoading(false);
            console.log(e);
        });

    }
    moment.locale("en-GB");
    const localizer = momentLocalizer(moment);

    return (<>
        <div style={{ height: 700 }}>
            <Calendar
                onSelectEvent={handleEventSelection}
                step={60}
                events={appointments} // {evnts1}   //{FullCalenders}
                defaultDate={new Date()}
                popup={true}
                onShowMore={(events, date) =>
                    this.setState({ showModal: true, appointments })
                }
                showAllEvents={true}
                localizer={localizer}
            />
        </div>

    </>);
}

export default ContactAppointments;