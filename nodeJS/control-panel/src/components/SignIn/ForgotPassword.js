import React, { useState } from 'react'
import './signin.css'
import userImage from '../../images/user.svg';
import { sendResetEmail } from '../../services/AuthService'
import { useTranslation } from "react-i18next";
import { ThreeDots } from 'react-loader-spinner';

const ForgotPassword = () => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({});
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const doPost = (event) => {
        event.preventDefault();
        setLoading(true);
        sendResetEmail(formData.email).then((res => {
            setLoading(false);
            if (res.data.success == false) {
                setMessage(res.data.message);
            } else {
                setSent(true);
                setSuccessMessage('Please Check your email for reset link');
            }
        })).catch((e) => {
            setLoading(false);

            setMessage(e.message);
        })
    }

    const handleUpdateEmail = (event) => {
        setFormData({ ...formData, email: event.target.value })
    }



    return (
        <div className='container'>
            <div className="form-signin" >
                <div className="col text-center">
                    <img className="mb-4" src={userImage} alt="Avatar" width="72" height="57" />
                    <h1 className="h3 mb-3 fw-normal">{t("users.forgotPassword")} </h1>
                </div>
                <div className="col text-center">
                    <label className='text-danger'>{message}</label> <br />
                    <label className='text-success'>{successMessage}</label> <br />
                </div>
                {!sent ? (<> <div className="mb-3" style={{ position: "relative", display: "flex" }}>
                    <label htmlFor="inputEmail" className="visually-hidden">{t("users.email")}</label>
                    <input type="email" id="inputEmail" className="form-control" placeholder={t("users.email")} required autoFocus value={formData.email} onChange={handleUpdateEmail} />
                </div>

                    <div className="mb-3" style={{ position: "relative", display: "flex" }}>
                        <button className="w-100 btn btn-lg btn-primary" type="submit" onClick={doPost}>{t("continue")}</button>
                    </div>
                    <div className="mb-3" style={{ position: "relative", display: "flex" }}>
                        <ThreeDots
                            type="ThreeDots"
                            color="#00BFFF"
                            height={100}
                            width={100}
                            visible={loading}
                        />
                    </div>

                    <div className="mb-3" style={{ position: "relative", display: "flex" }}>
                        <a href="/admin/sign-in">{t("users.signIn")}</a>
                    </div> </>) : (<></>)}
            </div>
        </div>
    )
}

export default ForgotPassword;