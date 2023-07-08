import React, { useState } from 'react'
import './signin.css'
import userImage from '../../images/user.svg';
import { sendResetEmail } from '../../services/AuthService'
import { Link, Navigate } from 'react-router-dom'
import { useTranslation } from "react-i18next";
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'

const ForgotPassword = () => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({});
    const [message, setMessage] = useState('');


    const doPost = (event) => {
        event.preventDefault();
        sendResetEmail(formData.email).then((res => {
            if (res.data.success == false) {
                setMessage(res.data.message);
            } else {
            }
        })).catch((e) => {

        })
    }

    const handleUpdateEmail = (event) => {
        setFormData({ ...formData, email: event.target.value })
    }


 
    return (
        <div className="form-signin" >
            <div className="col text-center">
                <img className="mb-4" src={userImage} alt="Avatar" width="72" height="57" />
                <h1 className="h3 mb-3 fw-normal">{t("users.forgotPassword")} </h1>
            </div>

            <label className='text-danger'>{message}</label> <br />

            <div className="mb-3" style={{ position: "relative", display: "flex" }}>
                <label htmlFor="inputEmail" className="visually-hidden">{t("users.email")}</label>
                <input type="email" id="inputEmail" className="form-control" placeholder={t("users.email")} required autoFocus value={formData.email} onChange={handleUpdateEmail} />
            </div>

          



            <div className="mb-3" style={{ position: "relative", display: "flex" }}>
                <button className="w-100 btn btn-lg btn-primary" type="submit" onClick={doPost}>{t("continue")}</button>
            </div>
            <div className="mb-3" style={{ position: "relative", display: "flex" }}>
                <a href="/admin/sign-in">{t("users.signIn")}</a>
            </div>


        </div>
    )
}

export default ForgotPassword;