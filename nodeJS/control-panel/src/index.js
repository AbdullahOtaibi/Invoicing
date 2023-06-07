import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import './assets/css/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import "./i18n";

const loadingView = (<div style={{ position: 'fixed', top: '0', left: '0', width: '100%', height: '100vh', backgroundColor: '#fff' }}>
<div className="loader">
  <div className="dot"></div>
  <div className="dot"></div>
  <div className="dot"></div>
  <div className="dot"></div>
  <div className="dot"></div>
</div>


</div>);

ReactDOM.render(
  <React.StrictMode>
    <Suspense fallback={loadingView}>
      <App />
    </Suspense>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
