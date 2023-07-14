import React, { useState } from 'react'
import './signin.css'
import userImage from '../../images/user.svg';
import { resetPassword } from '../../services/AuthService'
import { useParams } from 'react-router-dom'
import { useTranslation } from "react-i18next";
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'

const ResetPassword = () => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({});
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { token } = useParams();
    const doPost = (event) => {
        event.preventDefault();
        setFormData({ ...formData, otp: token })
        resetPassword(formData).then((res => {
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

    const handleUpdatePassword = (event) => {
        setFormData({ ...formData, newPassword: event.target.value })
    }




    return (
        <div className="form-signin" >
            <div className="col text-center">
                <img className="mb-4" src={userImage} alt="Avatar" width="72" height="57" />
                <h1 className="h4 mb-3 fw-normal">{t("users.resetPassword")} </h1>
            </div>

            <label className='text-danger'>{message}</label> <br />

            <div className="mb-3" style={{ position: "relative", display: "flex" }}>
                <label htmlFor="inputEmail" className="visually-hidden">{t("users.email")}</label>
                <input type="email" id="inputEmail" className="form-control" placeholder={t("users.email")} required autoFocus value={formData.email} onChange={handleUpdateEmail} />
            </div>


            <div className="mb-3" style={{ position: "relative", display: "flex" }}>
                <label htmlFor="newPassword" className="visually-hidden">{t("users.newPassword")}</label>
                <input type={showPassword ? 'text' : 'password'} id="newPassword" className="form-control" placeholder={t("users.newPassword")} required autoFocus value={formData.newPassword} onChange={handleUpdatePassword} />
                <button type="button" className='btn btn-default'>
                    {showPassword ? <AiOutlineEyeInvisible onClick={() => setShowPassword(!showPassword)} /> : <AiOutlineEye onClick={() => setShowPassword(!showPassword)} />
                    }
                </button>
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

export default ResetPassword;