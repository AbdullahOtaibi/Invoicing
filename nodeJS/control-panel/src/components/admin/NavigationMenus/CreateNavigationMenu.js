import React,{ useState, useEffect } from 'react'
import { createNavigationMenu } from './NavigationMenusAPI'
import { useTranslation } from "react-i18next"
import { toast } from 'react-toastify'
import Loader from "react-loader-spinner"
import LocalizedTextEditor from '../Shared/LocalizedTextEditor'



const CreateNavigationMenu = () => {

    const [menu, setMenu] = useState({title:{}});
    const [loading, setLoading] = useState(false);
    const { t, i18n } = useTranslation();
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

    const updateTitle = (newValue, locale) => {
        setContentLocale(locale);
        let cloned = JSON.parse(JSON.stringify(menu));
        setLocalTextValue(cloned.title, newValue);
        setMenu(cloned);
    }

    const updateCode = (event) => {
        let cloned = JSON.parse(JSON.stringify(menu));
        cloned.code = event.target.value;
        setMenu(cloned);
    }

    const updateCssClass = (event) => {
        let cloned = JSON.parse(JSON.stringify(menu));
        cloned.cssClassName = event.target.value;
        setMenu(cloned);
    }

    
    const updatePublished = (event) => {
        let cloned = JSON.parse(JSON.stringify(menu));
        cloned.published = event.target.checked;
        setMenu(cloned);
    }


    const doPost = data => {
        setLoading(true);
        createNavigationMenu(menu).then(res => {
            setLoading(false);
            toast.success(t("succeed"));
            //setArticle(res.data);
            window.location.href = "/admin/navigation-menus/edit/" + res.id;
        }).catch(e => {
            setLoading(false);
        })
        console.log(menu);
        console.log(data);
    }



    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">{t("dashboard.createMenu")}</h5>
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
                        <label htmlFor="code" className="form-label">{t("dashboard.code")} </label>
                        <input type="text" className="form-control" id="code"  value={menu.code} onChange={updateCode} />
                    </div>


                    <div className="mb-3">
                        <label htmlFor="cssClassName" className="form-label"> CSS Class </label>
                        <input type="text" className="form-control" id="cssClassName"  value={menu.cssClassName} onChange={updateCssClass} />
                    </div>


           
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">{t("dashboard.title")} </label>

                        <LocalizedTextEditor placeholder={t("dashboard.title")} locale={contentLocale} textObject={menu.title}
                            onLocalChanged={changeLocale} onChange={updateTitle} />
                    </div>


                    <div className="mb-3 form-check mt-4 mx-0 px-0">
                        <div className="custom-control custom-checkbox">
                            <input type="checkbox" className="custom-control-input" id="publishedCheck" checked={menu.published} onChange={updatePublished} />
                            <label className="custom-control-label" htmlFor="publishedCheck">{t("dashboard.published")}</label>
                        </div>
                    </div>

                    <div className="mb-3 row col justify-content-end" >
                        <button type="button" className="btn btn-primary" onClick={doPost}>{t("dashboard.submit")}</button>
                    </div>
                </form>
            </div>


        </div>
    )
}


export default CreateNavigationMenu;
