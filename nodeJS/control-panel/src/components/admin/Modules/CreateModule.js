import React, { useState, useEffect } from 'react'
import { useTranslation } from "react-i18next"
import { toast } from 'react-toastify'
import { ThreeDots } from  'react-loader-spinner'
import { MdCollectionsBookmark, MdClose, MdSave } from "react-icons/md"
import { createModule } from './ModulesAPI'
import { Link, useNavigate } from 'react-router-dom'
import LocalizedTextEditor from '../Shared/LocalizedTextEditor'
import { Helmet } from "react-helmet";
import { hasPermission } from '../utils/auth';

const CreateModule = (props) => {

    let navigate = useNavigate();
    if (!hasPermission('products.modify')) {
        navigate("/admin/products", { replace: true });
    }

    const [contentLocale, setContentLocale] = useState('en');
    const [module, setModule] = useState({ name: { arabic: "", english: "" }, enabled: true });
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

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

    const updateModuleName = (newValue, locale) => {
        setContentLocale(locale);

        let cloned = JSON.parse(JSON.stringify(module));
        setLocalTextValue(cloned.name, newValue);
        setModule(cloned);
    }



    const updateCode = (event) => {
        let cloned = JSON.parse(JSON.stringify(module));
        cloned.code = event.target.value;
        setModule(cloned);
    }

    const updateRoute = (event) => {
        let cloned = JSON.parse(JSON.stringify(module));
        cloned.route = event.target.value;
        setModule(cloned);
    }

    

    const updateControllerPath = (event) => {
        let cloned = JSON.parse(JSON.stringify(module));
        cloned.controllerPath = event.target.value;
        setModule(cloned);
    }



    const updateCategory = (event) => {
        let cloned = JSON.parse(JSON.stringify(module));
        cloned.category = event.target.value;
        setModule(cloned);
    }

    const doPost = () => {
        setLoading(true);
        createModule(module).then(res => {
            setLoading(false);
            toast.success(t("succeed"));
            window.location.href = "/admin/modules";
        }).catch(e => {
            setLoading(false);
            toast.error(t(e.message));
        })
    }






    return (
        <div className="card">
            <Helmet>
                <title>{'Invoicing | Admin | Create Module'} </title>
            </Helmet>
            <div className="card-body">
                <h5 className="card-title"><MdCollectionsBookmark /> {t("module.addModule")}</h5>
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
                        <label htmlFor="code" className="form-label">{t("dashboard.alias")} </label>
                        <input type="text" className="form-control" id="code" value={module.code} onChange={updateCode} />

                    </div>


                    <div className="mb-3">
                        <label htmlFor="controllerPath" className="form-label">{t("module.controllerPath")} </label>
                        <input type="text" className="form-control" id="controllerPath" value={module.controllerPath} onChange={updateControllerPath} />

                    </div>

                    <div className="mb-3">
                        <label htmlFor="route" className="form-label">{t("module.route")} </label>
                        <input type="text" className="form-control" id="route" value={module.route} onChange={updateRoute} />

                    </div>



                    


                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">{t("module.moduleName")} </label>
                        <LocalizedTextEditor placeholder={t("module.moduleName")} locale={contentLocale} textObject={module.name}
                            onLocalChanged={changeLocale} onChange={updateModuleName} />
                    </div>



                    <div className=" row col justify-content-end" >
                        <Link className="add-btn btn-warning" to='/admin/modules' >
                            <MdClose /> &nbsp;&nbsp;
                            {t("close")}
                        </Link> &nbsp;
                        <button type="button" className="add-btn btn-primary" onClick={doPost}>
                            <MdSave /> &nbsp;&nbsp;
                            {t("dashboard.submit")}
                        </button>
                    </div>
                </form>
            </div>

        </div>

    )
}

export default CreateModule;