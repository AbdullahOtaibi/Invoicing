import React,{ useState, useEffect, useReducer } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createUserRole } from './UsersAPI'
import { useTranslation } from "react-i18next"
import { toast } from 'react-toastify'
import { ThreeDots } from  'react-loader-spinner'
import { MdPerson } from "react-icons/md";
import LocalizedTextEditor from '../Shared/LocalizedTextEditor'
import { hasPermission } from '../utils/auth';

const CreateRole = (props) => {

    let navigate = useNavigate();
    if(!hasPermission('users.modify')){
        navigate("/admin/users", { replace: true });
    }

    const [role, setRole] = useState({ name: {} });
    const [contentLocale, setContentLocale] = useState('en');
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

    const updateRoleName = (newValue, locale) => {
        setContentLocale(locale);
        console.log("EditProduct - newValue: " + newValue + ", locale: " + locale);
        let cloned = JSON.parse(JSON.stringify(role));
        setLocalTextValue(cloned.name, newValue);
        setRole(cloned);
    }

    const setLocalTextValue = (textObject, newValue) => {
        let result = '';
        if (contentLocale == 'en') {
            textObject.english = newValue;
        } else if (contentLocale == 'ar') {
            textObject.arabic = newValue;
        } else if (contentLocale == 'tr') {
            textObject.turkish = newValue;
        }
    }

    const changeLocale = (newLocale) => {
        setContentLocale(newLocale);
    }


    useEffect(() => {
        //setLoading(true);

    }, []);

    const doPost = data => {
        setLoading(true);
        createUserRole(role).then(res => {
            setLoading(false);
            toast.success(t("succeed"));
            window.location.href = "/admin/users/roles";
        }).catch(e => {
            setLoading(false);
        })
        console.log(role);
        console.log(data);
    }


    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title"><MdPerson /> {t("users.createRole")}</h5>
                <div className="container text-center">
                    <ThreeDots
                        type="ThreeDots"
                        color="#00BFFF"
                        height={100}
                        width={100}
                        visible={loading}

                    />
                </div>
                <br />

                <form>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">{t("users.role")}</label>
                        <LocalizedTextEditor placeholder={t("role.name")} locale={contentLocale} textObject={role.name}
                            onLocalChanged={changeLocale} onChange={updateRoleName} />
                    </div>



                    <div className="mb-3 row col justify-content-end" >
                        <Link className="btn btn-warning" to='/admin/users' >{t("dashboard.cancel")}</Link> &nbsp;
                        <button type="button" className="btn btn-primary" onClick={doPost}>{t("dashboard.submit")}</button>
                    </div>
                </form>
            </div>


        </div>
    )
}


export default CreateRole;