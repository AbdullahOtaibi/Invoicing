import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from "react-i18next";
import { getMyUnreadMessages } from './DashboardAPI';
import { MdMarkEmailUnread } from 'react-icons/md';

const MainHeader = ({ notification, onHandleNotification }) => {
  const { t, i18n } = useTranslation();

  const [lang, setLang] = useState(localStorage.getItem("i18nextLng") || 'en');
  const [messages, setMessages] = useState([]);



  const checkMyMessages = () => {
    getMyUnreadMessages().then(data => {
      setMessages(data.items);
      if (onHandleNotification) {
        onHandleNotification();
      }
    }).catch(e => {
      console.log(e);
      if (onHandleNotification) {
        onHandleNotification();
      }
    });
  }

  useEffect(() => {
    if (notification.code == 'messages') {
      checkMyMessages();
    }

  }, [notification]);


  useEffect(() => {
    i18n.changeLanguage(lang);
    checkMyMessages();
  }, [])

  const updateLanguage = (event) => {
    changeLanguage(event.target.value);
  }
  const switchLanguage = () => {

    let newLang = lang;
    if (lang === "ar") {
      newLang = "en";
    } else if (lang === "en") {
      newLang = "tr";
    } else {
      newLang = "ar";

    }
    // alert(lang);
    i18n.changeLanguage(newLang).then(() => {
      setLang(newLang);
    });
    //alert('language : ' + i18n.language)
  };

  const changeLanguage = (langCode) => {
    setLang(langCode);
    i18n.changeLanguage(langCode);

  };




  const signOut = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("email");
    localStorage.removeItem("permissions");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    localStorage.removeItem("companyId");
    window.location.href = "/admin/sign-in"
  }

  const toggleSidebar = () => {
    if (document.getElementById('sidebar').classList.contains('active')) {
      document.getElementById('sidebar').classList.remove('active');
    } else {
      document.getElementById('sidebar').classList.add('active');
    }
  }

  return (
    <div className="navbar navbar-dark sticky-top  flex-md-nowrap pt-1 pb-0 shadow" style={{ backgroundColor: '#2d3274' }}>

      <div className="menu-toggle-button pl-3 pr-3" style={{ lineHeight: '0' }}>
        <a className="nav-link" href="javascript:;" onClick={toggleSidebar} id="sidebarCollapse" data-bs-toggle="collapse" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
          <div className="my-toggl-icon">
            <span className="bar1"></span>
            <span className="bar2"></span>
            <span className="bar3"></span>
          </div>
        </a>
      </div>

<div lassNAme='col col-auto' style={{color:'white'}}>
  {localStorage.getItem("companyName")}  :الشركة
</div>

<div lassNAme='col col-auto' style={{color:'white'}}>
  الرقم الضريبي:  {localStorage.getItem("companyId")}
</div>


<div lassNAme='col col-auto' style={{color:'white'}}>
تسلسل مصدر الدخل:  {localStorage.getItem("incomeSourceSequence")}
</div>

 <div lassNAme='col col-auto' style={{color:'white'}}>
البريد الالكتروني:  {localStorage.getItem("email")}
</div> 


      {/* <input className="form-control form-control-light w-100" type="text" placeholder="Search" aria-label="Search" /> */}
      <div className="col-4">
        <div className='row d-flex flex-row-reverse' >
          <div className="col-auto pt-1">
            <select value={lang} onChange={updateLanguage} className="form-select"
              style={{
                padding: '5px 10px 10px 35px',
                width: '100%',
                borderRadius: '15px',
                cursor: 'pointer',
                backgroundImage: 'url("/images/' + i18n.language + '.png")',
                backgroundSize: '30px',
                backgroundRepeat: 'no-repeat',
                backgroundPositionY: '3px',
                backgroundPositionX: '3px',
                fontSize: i18n.language == 'ar' ? '13px' : '16px',
                direction: i18n.language == 'ar' ? 'rtl' : 'ltr'
              }}>
              <option value="en" >
                English
              </option>
              <option value="ar">
                عربي
              </option>
              <option value="tr">
                Türkçe
              </option>
            </select>


          </div>

          {/* <div className="col-auto">
            <Link className="nav-link" to="/admin/messages"> <MdMarkEmailUnread size={30} />
              {messages && messages.length > 0 ? (
                <span className="badge badge-danger" style={styles.messageCount}>
                  {messages.length}
                </span>) : null}  </Link>

          </div> */}

          <div className="col-auto">
            <Link className="nav-link" onClick={signOut} to="#"> {t("header.signout")}</Link>

          </div>


        </div>
      </div>
    </div>
  )
}
const styles = {
  messageCount: {
    position: 'absolute',
    fontSize: '100%',
    marginTop: '-6px',
    marginLeft: '-10px',
    marginRight: '-6px',
    backgroundColor: 'red',
    borderRadius: '50%',
    width: '25px',
    height: '25px',
    padding: '3px'
  }
}

export default MainHeader
