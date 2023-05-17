import React, { useState } from 'react'
import './signin.css'
import userImage from '../../images/user.svg';
import { login, sendActivationEmail } from '../../services/AuthService'
import { Navigate } from 'react-router-dom'
import { useTranslation } from "react-i18next";

const SignIn = () => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({});
    const [loggedIn, setLoggedIn] = useState(false);
    const [message, setMessage] = useState('');
    const [confirmEmailAddress, setConfirmEmailAddress] = useState(false); 

    
    const doPost = (event) => {
        event.preventDefault();
        login(formData).then((res => {
            if (res.data.success == false) {
                setMessage(res.data.message);
                setConfirmEmailAddress(res.data.confirmEmailAddress);
            } else {
                //document.cookie = 'jwt=' + res.data.jwt;
                localStorage.setItem("jwt", res.data.jwt);
                localStorage.setItem("userName", res.data.user.name);
                localStorage.setItem("email", res.data.user.email);
                if (res.data.user.companyId) {
                    localStorage.setItem("companyId", res.data.user.companyId);
                }
                localStorage.setItem("permissions", res.data.user.permissions);
                localStorage.setItem("role", res.data.user.role);
                localStorage.setItem("companyName", res.data.user.companyName);
                localStorage.setItem("companyId", res.data.user.companyId);
                localStorage.setItem("incomeSourceSequence", res.data.user.incomeSourceSequence);
                localStorage.setItem("invoiceCategory", res.data.user.invoiceCategory);
                localStorage.setItem("company", res.data.user.company); 
                setLoggedIn(true);
            }



        })).catch((e) => {

        })
    }


    const sendVerificationEmail = () => {
        sendActivationEmail(formData.email).then(res => {
            //alert('email sent');
            setMessage('Please check your inbox to verify your email address')
        }).catch(e => {
            console.log(e);
        });
    }
    const handleUpdatePassword = (event) => {
        setFormData({ ...formData, password: event.target.value })
    }

    const handleUpdateEmail = (event) => {
        setFormData({ ...formData, email: event.target.value })
    }

    const handleSeqComapnyID= (event) => {
        setFormData ( {...formData , SeqCompanyID: event.target.value } )
    }
    if (loggedIn) {
        return <Navigate to="/admin" />;
    }
    return (
        <div className="form-signin" >
            <div className="col text-center">
                <img className="mb-4" src={userImage} alt="Avatar" width="72" height="57" />
                <h1 className="h3 mb-3 fw-normal">{t("users.pleaseSignIn")} </h1>
            </div>
             
            <label className='text-danger'>{message}</label> <br/>
            <label htmlFor="inputSeqCompany" className="visually-hidden">{t("invoice.SeqCompany")}</label>
            <input  id="inputSeqCompany" className="form-control" placeholder={t("invoice.SeqCompany")} required autoFocus value={formData.SeqCompanyID} onChange={handleSeqComapnyID} />

            <label htmlFor="inputEmail" className="visually-hidden">{t("users.email")}</label>
            <input type="email" id="inputEmail" className="form-control" placeholder={t("users.email")} required autoFocus value={formData.email} onChange={handleUpdateEmail} />
           
            <br />
            {confirmEmailAddress==true ? (
                <button type='button' className='w-100 btn btn-lg btn-dark' onClick={sendVerificationEmail}>Send Verification Email</button>
            ) : (null)}
            <label htmlFor="inputPassword" className="visually-hidden">{t("users.password")}</label>
            <input type="password" id="inputPassword" className="form-control" placeholder={t("users.password")} required value={formData.password} onChange={handleUpdatePassword} />
            <div className="checkbox mb-3">
                <label>
                    <input type="checkbox" value="remember-me" /> {t("users.rememberMe")}
                </label>
            </div>
            
            <button className="w-100 btn btn-lg btn-primary" type="submit" onClick={doPost}>{t("users.signIn")}</button>

        </div>
    )
}

export default SignIn;