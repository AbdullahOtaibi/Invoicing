import React,{ useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { createCountry } from './CountriesAPI'
import { useTranslation } from "react-i18next"
import { toast } from 'react-toastify'
import Loader from "react-loader-spinner"
import LocalizedTextEditor from '../Shared/LocalizedTextEditor'


const CreateCountry = (props) => {

    const [country, setCountry] = useState({ name: { arabic: "", english: "" } });
    const [contentLocale, setContentLocale] = useState('en');
    const [loading, setLoading] = useState(false);
    
    const { t } = useTranslation();
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

    const updateCountryName = (newValue, locale) => {
        setContentLocale(locale);
        console.log("EditProduct - newValue: " + newValue + ", locale: " + locale);
        let cloned = JSON.parse(JSON.stringify(country));
        setLocalTextValue(cloned.name, newValue);
        setCountry(cloned);
    }

    const updateCountryCode = (event) => {
        let cloned = JSON.parse(JSON.stringify(country));
        cloned.code = event.target.value;
        setCountry(cloned);
    }



   



    const doPost = data => {
        setLoading(true);
        createCountry(country).then(res => {
            setLoading(false);
            toast.success(t("succeed"));
            //setArticle(res.data);
            window.location.href = "/admin/countries";
        }).catch(e => {
            setLoading(false);
        })
        console.log(country);
        console.log(data);
    }


    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">{t("dashboard.createcompany")}</h5>
                <div className="container text-center">
                    <Loader
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
                        <label htmlFor="name" className="form-label">{t("company.name")}</label>
                        <LocalizedTextEditor placeholder={t("country.name")} locale={contentLocale} textObject={country.name}
                            onLocalChanged={changeLocale} onChange={updateCountryName} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="titleArabic" className="form-label">{t("dashboard.code")} </label>
                        <input type="text" className="form-control" id="code" name="code" value={country.code} onChange={updateCountryCode} />

                    </div>

                    

                    <div className="mb-3 row col justify-content-end" >
                        <Link className="btn btn-warning" to='/admin/partners' >{t("dashboard.cancel")}</Link> &nbsp;
                        <button type="button" className="btn btn-primary" onClick={doPost}>{t("dashboard.submit")}</button>
                    </div>
                </form>
            </div>


        </div>
    )
}


export default CreateCountry;