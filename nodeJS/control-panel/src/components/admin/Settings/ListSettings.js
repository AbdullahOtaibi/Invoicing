import React, { useState, useEffect } from 'react'
import { useTranslation } from "react-i18next"
import { MdSettings, MdOutlineDeviceHub, MdSave } from "react-icons/md";
import { toast } from 'react-toastify'
import { getSettings, updateSettings, generateSiteMap } from './SettingsAPI'
import LocalizedTextEditor from '../Shared/LocalizedTextEditor'
import LocalizedTextAreaEditor from '../Shared/LocalizedTextAreaEditor'
import { hasPermission } from '../utils/auth';
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet';

const ListSettings = (props) => {

    let navigate = useNavigate();
    if(!hasPermission('settings.modify')){
        navigate("/admin", { replace: true });
    }

    const { t } = useTranslation();
    const [settings, setSettings] = useState({ title: {}, address: {}, keywords:{}, description:{}, exchangeRates: {} });
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

    const updateSiteMap = () => {
        generateSiteMap().then(res => {
            console.log(res);
            alert(res.totalUrls + " Urls generated.");
        })
    }


    useEffect(() => {
        getSettings().then(res => {

            if (res.data != null) {
                if (!res.data.title) {
                    res.data.title = {}
                }
                if (!res.data.address) {
                    res.data.address = {}
                }
                if(!res.data.keywords){
                    res.data.keywords = {};
                }
    
                if(!res.data.description){
                    res.data.description = {};
                }

                if(!res.data.exchangeRates){
                    res.data.exchangeRates = {};
                }
             
                

                setSettings(res.data);
            }
        });
    }, []);

    const doPost = () => {
        updateSettings(settings).then(res => {
            console.log(res.data);
            toast.success(t("succeed"));
        })
    }

    const updateTitle = (newValue, locale) => {
        setContentLocale(locale);
        let cloned = JSON.parse(JSON.stringify(settings));
        setLocalTextValue(cloned.title, newValue);
        setSettings(cloned);
    }

    
   

    const updateUsdToKwd = event => {
        let cloned = JSON.parse(JSON.stringify(settings));
        if(!cloned.exchangeRates){
            cloned.exchangeRates = {}
        }
        cloned.exchangeRates.usdToKwd = event.target.value;
        setSettings(cloned);
    }

    const updateTryToKwd = event => {
        let cloned = JSON.parse(JSON.stringify(settings));
        if(!cloned.exchangeRates){
            cloned.exchangeRates = {}
        }
        cloned.exchangeRates.tryToKwd = event.target.value;
        setSettings(cloned);
    }


    const updateKeywords = (newValue, locale) => {
        setContentLocale(locale);
        let cloned = JSON.parse(JSON.stringify(settings));
        setLocalTextValue(cloned.keywords, newValue);
        setSettings(cloned);
    }

    const updateDescription = (newValue, locale) => {
        setContentLocale(locale);
        let cloned = JSON.parse(JSON.stringify(settings));
        setLocalTextValue(cloned.description, newValue);
        setSettings(cloned);
    }



    const updateAddress = (newValue, locale) => {
        setContentLocale(locale);
        let cloned = JSON.parse(JSON.stringify(settings));
        setLocalTextValue(cloned.address, newValue);
        setSettings(cloned);
    }




    const updatePhone = event => {
        let cloned = JSON.parse(JSON.stringify(settings));
        cloned.phone = event.target.value;
        setSettings(cloned);
    }

    const updateMobile = event => {
        let cloned = JSON.parse(JSON.stringify(settings));
        cloned.mobile = event.target.value;
        setSettings(cloned);
    }

    const updateEmail = event => {
        let cloned = JSON.parse(JSON.stringify(settings));
        cloned.infoEmail = event.target.value;
        setSettings(cloned);
    }

    const updateFacebookUrl = event => {
        let cloned = JSON.parse(JSON.stringify(settings));
        cloned.facebookUrl = event.target.value;
        setSettings(cloned);
    }

    const updateTwitterUrl = event => {
        let cloned = JSON.parse(JSON.stringify(settings));
        cloned.twitterUrl = event.target.value;
        setSettings(cloned);
    }

    const updateInstagramUrl = event => {
        let cloned = JSON.parse(JSON.stringify(settings));
        cloned.instagramUrl = event.target.value;
        setSettings(cloned);
    }

    const updateBlogUrl = event => {
        let cloned = JSON.parse(JSON.stringify(settings));
        cloned.blogUrl = event.target.value;
        setSettings(cloned);
    }

    const updateYoutubeUrl = event => {
        let cloned = JSON.parse(JSON.stringify(settings));
        cloned.youtubeUrl = event.target.value;
        setSettings(cloned);
    }







    return (
        <div className="conatiner">
            <Helmet>
                <title> Invoicing | Admin | {t("sidebar.settings")}</title>
            </Helmet>
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title"><MdSettings /> {t("sidebar.settings")}</h5>
                    <br />
                    <form>
                        <div className="mb-3">
                            <label htmlFor="title" className="form-label">{t("titleText")} </label>
                            <LocalizedTextEditor placeholder={t("titleText")} locale={contentLocale} textObject={settings.title}
                                onLocalChanged={changeLocale} onChange={updateTitle} />


                        </div>

                        <div className="mb-3">
                            <label htmlFor="address" className="form-label">{t("address")} </label>
                            <LocalizedTextEditor placeholder={t("address")} locale={contentLocale} textObject={settings.address}
                                onLocalChanged={changeLocale} onChange={updateAddress} />


                        </div>


                        <div className="mb-3">
                            <label htmlFor="phone" className="form-label">{t("phone")} </label>
                            <input type="text" className="form-control" id="phone" value={settings.phone} onChange={updatePhone} />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="mobile" className="form-label">{t("mobile")} </label>
                            <input type="text" className="form-control" id="mobile" value={settings.mobile} onChange={updateMobile} />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">{t("email")} </label>
                            <input type="text" className="form-control" id="email" value={settings.infoEmail} onChange={updateEmail} />
                        </div>



                        <div className="mb-3">
                            <label htmlFor="facebookUrl" className="form-label">{t("facebookUrl")} </label>
                            <input type="text" className="form-control" id="facebookUrl" value={settings.facebookUrl} onChange={updateFacebookUrl} />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="twitterUrl" className="form-label">{t("twitterUrl")} </label>
                            <input type="text" className="form-control" id="twitterUrl" value={settings.twitterUrl} onChange={updateTwitterUrl} />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="instagramUrl" className="form-label">{t("instagramUrl")} </label>
                            <input type="text" className="form-control" id="instagramUrl" value={settings.instagramUrl} onChange={updateInstagramUrl} />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="youtubeUrl" className="form-label">{t("youtubeUrl")} </label>
                            <input type="text" className="form-control" id="youtubeUrl" value={settings.youtubeUrl} onChange={updateYoutubeUrl} />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="blogUrl" className="form-label">{t("blogUrl")} </label>
                            <input type="text" className="form-control" id="blogUrl" value={settings.blogUrl} onChange={updateBlogUrl} />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="keywords" className="form-label">{t("seo.keywords")}</label>
                            <LocalizedTextEditor placeholder={t("seo.keywords")} locale={contentLocale} textObject={settings.keywords}
                                onLocalChanged={changeLocale} onChange={updateKeywords} />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="description" className="form-label">{t("product.description")}</label>
                            <LocalizedTextAreaEditor placeholder={t("product.description")} locale={contentLocale} textObject={settings.description}
                                onLocalChanged={changeLocale} onChange={updateDescription} />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="usdToKwd" className="form-label">{t("usdToKwd")} </label>
                            <input type="text" className="form-control" id="usdToKwd" value={settings.exchangeRates.usdToKwd} onChange={updateUsdToKwd} />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="tryToKwd" className="form-label">{t("tryToKwd")} </label>
                            <input type="text" className="form-control" id="tryToKwd" value={settings.exchangeRates.tryToKwd} onChange={updateTryToKwd} />
                        </div>


                        <div className="row col justify-content-end" >
                        
                        <button type="button" className="btn btn-primary" onClick={updateSiteMap}><MdOutlineDeviceHub /> {t("generateSitemap")}</button>
                        &nbsp;
                            <button type="button" className="btn btn-primary" onClick={doPost}><MdSave /> {t("dashboard.save")}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ListSettings;