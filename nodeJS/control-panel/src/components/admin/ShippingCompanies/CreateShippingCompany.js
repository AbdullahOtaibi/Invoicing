import React,{ useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { createShippingCompany } from './ShippingCompaniesAPI'
import { useTranslation } from "react-i18next"
import { toast } from 'react-toastify'
import { ThreeDots } from  'react-loader-spinner'
import ListImages from '../Images/ListImages'
import { MdLocalShipping } from "react-icons/md";
import LocalizedTextEditor from '../Shared/LocalizedTextEditor'

const CreateShippingCompany = (props) => {

    const [contentLocale, setContentLocale] = useState('en');
    const [shippingCompany, setShippingCompany] = useState({ name: {} });
    const [loading, setLoading] = useState(false);
    const { t, i18n } = useTranslation();

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

    const updateName = (newValue, locale) => {
        setContentLocale(locale);

        let cloned = JSON.parse(JSON.stringify(shippingCompany));
        setLocalTextValue(cloned.name, newValue);
        setShippingCompany(cloned);
    }


    const updatePublished = (event) => {
        let cloned = JSON.parse(JSON.stringify(shippingCompany));
        cloned.published = event.target.checked;
        setShippingCompany(cloned);
    }

  
  



    const doPost = data => {
        setLoading(true);
        createShippingCompany(shippingCompany).then(res => {
            setLoading(false);
            toast.success(t("succeed"));
            window.location.href = "/admin/shippingCompanies";
        }).catch(e => {
            setLoading(false);
        })
        console.log(shippingCompany);
        console.log(data);
    }


    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title"><MdLocalShipping /> {t("shipping.addNewCompany")}</h5>
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
                        <label htmlFor="title" className="form-label">{t("shipping.companyName")}</label>
                        <LocalizedTextEditor placeholder={t("shipping.companyName")} locale={contentLocale} textObject={shippingCompany.name}
                            onLocalChanged={changeLocale} onChange={updateName} />
                    </div>

                    <div className="mb-3 form-check">
                        <div className="custom-control custom-checkbox">
                            <input type="checkbox" className="custom-control-input" id="publishedCheck" checked={shippingCompany.published} onChange={updatePublished} />
                            <label className="custom-control-label" htmlFor="publishedCheck">{t("dashboard.published")}</label>
                        </div>
                    </div>

                   

                    <div className="mb-3 row col justify-content-end" >
                        <Link className="btn btn-warning" to='/admin/shippingCompanies' >{t("dashboard.cancel")}</Link> &nbsp;
                        <button type="button" className="btn btn-primary" onClick={doPost}>{t("dashboard.submit")}</button>
                    </div>
                </form>
            </div>


        </div>
    )
}


export default CreateShippingCompany;