// import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/App.css';
import 'react-toastify/dist/ReactToastify.css'
import { languages } from './globals';
import { getEnabledLanguages } from './services/TranslationsService'
import './assets/css/bootstrap.min.css'





import React,{ lazy, Suspense, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { useTranslation } from "react-i18next";



const Dashboard = lazy(() => import(/* webpackChunkName: "Dashboard" */'./components/admin/Layout/Dashboard'));

 const SignIn = lazy(() => import(/* webpackChunkName: "SignIn" */'./components/SignIn/SignIn'));




function App() {

  const { i18n } = useTranslation();

  useEffect(() => {
    getEnabledLanguages().then(res => {
      languages = res.data.items;
      Object.freeze(languages)
      console.log(res.data.items);
    }).catch(e => {
      console.error("Cannot load enabled languages.")
    });
  }, []);
  
  const loadingView = (<div style={{ position: 'fixed', top: '0', left: '0', width: '100%', height: '100vh', backgroundColor: '#fff' }}>
    <div className="loader">
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
    </div>
  </div>);
  return (
    <div dir={i18n.language === "ar" ? "rtl" : "ltr"} style={i18n.language === "ar" ?{fontFamily:'jazeera'}:{}} className="page-wrapper">
      <Suspense fallback={loadingView} >
        <Router>
          <Routes>
          <Route path="/admin/sign-in" element={<SignIn />}   />
          <Route path="/admin/*" element={<Dashboard />} />
          <Route path="/*" element={<Dashboard />} />
          {/* <Route path="ar/*" element={<HomePage lang='ar' />} />
          <Route path="*" element={<HomePage lang='en' />} /> */}


          </Routes>
        </Router>
      </Suspense>
    </div>
  );
}

export default App;
