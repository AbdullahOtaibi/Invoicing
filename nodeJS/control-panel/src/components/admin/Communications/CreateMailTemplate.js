import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createMailTemplate } from './CommunicationsAPI'
import { useTranslation } from "react-i18next"
import { toast } from 'react-toastify'
import Loader from "react-loader-spinner"
import LocalizedTextEditor from '../Shared/LocalizedTextEditor'
import LocalizedTextAreaEditor from '../Shared/LocalizedTextAreaEditor'
import { hasPermission } from '../utils/auth';
import { Helmet } from 'react-helmet'


const CreateMailTemplate = (props) => {
    let navigate = useNavigate();
    if (!hasPermission('articles.modify')) {
        navigate("/admin/articles", { replace: true });
    }
    const [mailTemplate, setMailTemplate] = useState({ subject: {}, content: {} });
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const [contentLocale, setContentLocale] = useState('en');

    const setLocalTextValue = (textObject, newValue) => {
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


    const updateCode = (event) => {
        let cloned = JSON.parse(JSON.stringify(mailTemplate));
        cloned.code = event.target.value;
        setMailTemplate(cloned);
    }



    const updatePublished = (event) => {
        let cloned = JSON.parse(JSON.stringify(mailTemplate));
        cloned.published = event.target.checked;
        setMailTemplate(cloned);
    }

    const updateSubject = (newValue, locale) => {
        setContentLocale(locale);
        let cloned = JSON.parse(JSON.stringify(mailTemplate));
        setLocalTextValue(cloned.subject, newValue);
        setMailTemplate(cloned);
    }

    const updateContent = (newValue, locale) => {
        setContentLocale(locale);
        let cloned = JSON.parse(JSON.stringify(mailTemplate));
        setLocalTextValue(cloned.content, newValue);
        setMailTemplate(cloned);
    }

    



    const doPost = data => {
        setLoading(true);
        createMailTemplate(mailTemplate).then(res => {
            setLoading(false);
            toast.success(t("succeed"));
            //setMailTemplate(res.data);
            window.location.href = "/admin/communications";
        }).catch(e => {
            setLoading(false);
        })
        console.log(mailTemplate);
        console.log(data);
    }


    return (
        <div className="card">
            <Helmet>
                <title> Invoicing | Admin | {t("communications.addNewTemplate")}</title>
            </Helmet>

            <div className="card-body">
                <h5 className="card-title">{t("communications.addNewTemplate")}</h5>
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
                        <label htmlFor="code" className="form-label">{t("dashboard.alias")} </label>
                        <input type="text" className="form-control" id="code" value={mailTemplate.code} onChange={updateCode} />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="subject" className="form-label">{t("communications.subject")} </label>

                        <LocalizedTextEditor placeholder={t("communications.subject")} locale={contentLocale} textObject={mailTemplate.subject}
                            onLocalChanged={changeLocale} onChange={updateSubject} />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="content" className="form-label">{t("communications.templateContent")} </label>

                        <LocalizedTextAreaEditor placeholder={t("communications.templateContent")} locale={contentLocale} textObject={mailTemplate.content}
                            onLocalChanged={changeLocale} onChange={updateContent} rows={15} />
                    </div>


                    

                    <div className="mb-3 row col justify-content-end" >
                        <Link className="btn btn-warning" to='/admin/communications' >{t("dashboard.cancel")}</Link> &nbsp;
                        <button type="button" className="btn btn-primary" onClick={doPost}>{t("dashboard.submit")}</button>
                    </div>
                </form>
            </div>


        </div>
    )
}


export default CreateMailTemplate;