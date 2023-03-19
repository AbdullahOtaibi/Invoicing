import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getMailTemplate, updateMailTemplate } from './CommunicationsAPI'
import { useTranslation } from "react-i18next"
import { toast } from 'react-toastify'
import Loader from "react-loader-spinner"
import LocalizedTextEditor from '../Shared/LocalizedTextEditor'
import LocalizedTextAreaEditor from '../Shared/LocalizedTextAreaEditor'
import { hasPermission } from '../utils/auth';
import { Helmet } from 'react-helmet'


const EditMailTemplate = (props) => {

    let navigate = useNavigate();
    if (!hasPermission('articles.modify')) {
        navigate("/admin/articles", { replace: true });
    }
    const [mailTemplate, setMailTemplate] = useState({ title: {}, content: {}, parameters: [] });
    const [mailTemplateParam, setMailTemplateParam] = useState({ path: {} });
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const [contentLocale, setContentLocale] = useState('en');
    const { id } = useParams();
    useEffect(() => {
        getMailTemplate(id).then(res => {
            if (!res.data.subject) {
                res.data.subject = {};
            }
            if (!res.data.content) {
                res.data.content = {};
            }

            setMailTemplate(res.data);
        }).catch(e => {
            console.log(e);
        });
    }, []);
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


    const updateParamName = (event) => {
        let cloned = JSON.parse(JSON.stringify(mailTemplateParam));
        cloned.name = event.target.value;
        setMailTemplateParam(cloned);
    }



    const updateParamPath = (newValue, locale) => {
        setContentLocale(locale);
        let cloned = JSON.parse(JSON.stringify(mailTemplateParam));
        setLocalTextValue(cloned.path, newValue);
        setMailTemplateParam(cloned);
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
        updateMailTemplate(mailTemplate).then(res => {
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

    const saveParam = () => {
        let cloned = JSON.parse(JSON.stringify(mailTemplate));
        if (mailTemplateParam.name) {
            if (!cloned.parameters) {
                cloned.parameters = [];
            }
            cloned.parameters.push(mailTemplateParam);
            setMailTemplate(cloned);
            setMailTemplateParam({ name: '', path: {} });

        }


    }

    const formatMessage = (sample) => {
       // sample = sample.replaceAll("\n","<br />");
        return sample;
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
                    <div className='row'>
                        <div className='col-6'>


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

                                <LocalizedTextAreaEditor placeholder={t("communications.templateContent")} locale={contentLocale}
                                    textObject={mailTemplate.content} onLocalChanged={changeLocale} onChange={updateContent} rows={15} />
                            </div>
                            <h5>Preview</h5>
                            <div className="mb-3" style={styles.box}>
                               
                                <p dangerouslySetInnerHTML={{ __html: formatMessage(""+mailTemplate.content.english) }}>

                                </p>
                            </div>
                        </div>
                        <div className='col-auto' style={{ borderRight: 'dashed 2px #eee' }}></div>
                        <div className='col-5'>
                            <h5> Parameters</h5>
                            <hr />
                            <div className="mb-3">
                                <label htmlFor="paramName" className="form-label">{t("communications.paramName")}: </label>
                                <input type="text" className="form-control" placeholder={t("communications.paramName")} id="paramName" value={mailTemplateParam.name}
                                    onChange={updateParamName} />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="paramPath" className="form-label">{t("communications.paramPath")} </label>

                                <LocalizedTextEditor placeholder={t("communications.paramPath")} locale={contentLocale} textObject={mailTemplateParam.path}
                                    onLocalChanged={changeLocale} onChange={updateParamPath} />
                            </div>

                            <div className="mb-3 text-end">
                                <button type='button' className='btn btn-success' onClick={saveParam}>
                                    {t("dashboard.save")}
                                </button>
                            </div>

                            {mailTemplate && mailTemplate.parameters ? (<table className='table'>
                                <thead>
                                    <tr>
                                        <th>
                                            Name
                                        </th>
                                        <th>
                                            Path
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mailTemplate.parameters.map(p => (
                                        <tr key={p.name}>
                                            <td>
                                                {p.name}
                                            </td>
                                            <td>
                                                {p.path.english}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>) : null}


                        </div>


                    </div>
                    <div className='row'>
                        <div className='col-12'>
                            <div className="mb-3 row col justify-content-end" >
                                <Link className="btn btn-warning" to='/admin/communications' >{t("dashboard.cancel")}</Link> &nbsp;
                                <button type="button" className="btn btn-primary" onClick={doPost}>{t("dashboard.submit")}</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>


        </div>
    )
}

const styles = {
    box: {
        padding: '1em',
        border: '16px solid transparent',
        borderImage: '16 repeating-linear-gradient(-45deg, red 0, red 1em, transparent 0, transparent 2em, #58a 0, #58a 3em, transparent 0, transparent 4em)',
        maxWidth: '100%',
        font: '100%/1.6 Baskerville, Palatino, serif'
    }
}
export default EditMailTemplate;