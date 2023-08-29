import React, { useEffect, useState } from "react";
import Secured from "./Secured";
import MainContent from "./MainContent";
import MainHeader from "./MainHeader";
import Sidebar from "./Sidebar";
import "./admin-bootstrap.css";
import "./dashboard.css";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

function Dashboard() {
  const { t, i18n } = useTranslation();
  const [notification, setNotification] = useState({});

  function connect() {
    return;
    // try {
    //     console.log('connectiing ws to :' + process.env.REACT_APP_WEBSOCKET_URL);
    //     let ws = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

    //     ws.onopen = () => {
    //         console.log('connected.');
    //         ws.send(JSON.stringify({ email: localStorage.getItem('email'), command: 'bind-user', message: '' }));
    //     }

    //     ws.onmessage = (msg) => {
    //         let msgObj = JSON.parse(msg.data);
    //         console.log(msgObj);
    //         try {
    //             if(msgObj.code === 'messages'){
    //                 console.log('condition true.');
    //                 if(msgObj.extra === 'new-message'){
    //                 toast("🖅 " + t("communications.youGotNewMessage"));
    //                 }

    //             }
    //             setNotification(msgObj);

    //         } catch (e) {
    //             console.error(e);
    //         }
    //     }

    //     ws.onclose = () => {
    //         console.log('websocket destroyed!');
    //         setTimeout(function() {
    //             console.log('reconnecting websocket.');
    //             connect();
    //           }, 1000);
    //     }
    // } catch (e) {
    //     console.error(e);
    // }
  }

  useEffect(() => {
    //Web Sockets.
    // connect();
  }, []);

  const notificationHandled = () => {
    setNotification({ code: "", extra: "" });
  };
  return (
    <>
      <Secured />
      <MainHeader
        notification={notification}
        onHandleNotification={notificationHandled}
      />
      <div
        className="container-fluid pl-0 pr-0"
        style={{ backgroundColor: "#f2f3f8" }}
      >
        <div className="wrapper">
          <Sidebar />
          <MainContent
            notification={notification}
            onHandleNotification={notificationHandled}
          />
        </div>
      </div>
      <div className='d-none'>
       
        <center className=" shadow" style={{backgroundColor: "rgb(45, 50, 116)"}} >
         
          <h3 style={{color: "#fff"} }> Powered by @Brothers ....</h3>
        </center>
      </div>
    </>
  );
}

export default Dashboard;
