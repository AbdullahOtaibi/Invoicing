import React,{ useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getSlide, updateSlide } from './SliderAPI'
import { useTranslation } from "react-i18next"
import { toast } from 'react-toastify'
import Loader from "react-loader-spinner"
import ListImages from '../Images/ListImages'
import { MdBurstMode } from "react-icons/md";
import LocalizedTextEditor from '../Shared/LocalizedTextEditor'


const EditSlide = (props) => {
    const [contentLocale, setContentLocale] = useState('en');
    const [slide, setSlide] = useState({ title: {} });
    const [loading, setLoading] = useState(false);
    const { t, i18n } = useTranslation();
    const { slideId } = useParams();

    useEffect(() => {
        getSlide(slideId).then(res => {
            if (!res.data.title) {
                res.data.title = {}
            }
            console.log(res.data);
            setSlide(res.data);
        })
    }, []);

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

    const updateTitle = (newValue, locale) => {
        setContentLocale(locale);

        let cloned = JSON.parse(JSON.stringify(slide));
        setLocalTextValue(cloned.title, newValue);
        setSlide(cloned);
    }



    const updatePublished = (event) => {
        let cloned = JSON.parse(JSON.stringify(slide));
        cloned.published = event.target.checked;
        setSlide(cloned);
    }



    const imagesUpdated = imgs => {
        console.log(imgs);
        let cloned = JSON.parse(JSON.stringify(slide));
        if (imgs != null && imgs.length > 0) {
            cloned.imageUrl = imgs[0].url;
        } else {
            cloned.imageUrl = null;
        }
        setSlide(cloned);
    }


    const doPost = data => {
        setLoading(true);
        updateSlide(slide).then(res => {
            setLoading(false);
            toast.success(t("succeed"));
            window.location.href = "/admin/slider";
        }).catch(e => {
            setLoading(false);
        })
        console.log(slide);
        console.log(data);
    }


    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title"><MdBurstMode /> {t("dashboard.editSlide")}</h5>
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
                        <label htmlFor="title" className="form-label">{t("dashboard.title")}</label>
                        <LocalizedTextEditor placeholder={t("dashboard.title")} locale={contentLocale} textObject={slide.title}
                            onLocalChanged={changeLocale} onChange={updateTitle} />
                    </div>






                    <div className="mb-3 form-check">
                        <div className="custom-control custom-checkbox">
                            <input type="checkbox" className="custom-control-input" id="publishedCheck" checked={slide.published} onChange={updatePublished} />
                            <label className="custom-control-label" htmlFor="publishedCheck">{t("dashboard.published")}</label>
                        </div>
                    </div>

                    <div className="mb-3">
                        <hr />
                        <ListImages handleChange={imagesUpdated} images={slide.imageUrl != null ? [{ url: slide.imageUrl }] : []} />
                    </div>


                    <div className="mb-3 row col justify-content-end" >
                        <Link className="btn btn-warning" to='/admin/slider' >{t("dashboard.cancel")}</Link> &nbsp;
                        <button type="button" className="btn btn-primary" onClick={doPost}>{t("dashboard.submit")}</button>
                    </div>
                </form>
            </div>


        </div>
    )
}


export default EditSlide;