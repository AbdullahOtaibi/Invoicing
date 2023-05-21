import React,{ useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getTestimonial, updateTestimonial } from './TestimonialsAPI'
import { useTranslation } from "react-i18next"
import { toast } from 'react-toastify'
import { ThreeDots } from  'react-loader-spinner'
import ListImages from '../Images/ListImages'
import { MdFormatQuote } from "react-icons/md";

const EditTestimonial = (props) => {

    const [model, setModel] = useState({});
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const {modelId} = useParams();
    useEffect(() => {
        getTestimonial(modelId).then(res => {
            setModel(res.data);
        });
    }, []);



    const updateTitle = (event) => {
        let cloned = JSON.parse(JSON.stringify(model));
        cloned.title = event.target.value;
        setModel(cloned);
    }
    const updateTitleArabic = (event) => {
        let cloned = JSON.parse(JSON.stringify(model));
        cloned.titleArabic = event.target.value;
        setModel(cloned);
    }


    const updatePublished = (event) => {
        let cloned = JSON.parse(JSON.stringify(model));
        cloned.published = event.target.checked;
        setModel(cloned);
    }

    const updateBrief = (event) => {
        let cloned = JSON.parse(JSON.stringify(model));
        cloned.brief = event.target.value;
        setModel(cloned);
    }


    const updateBriefArabic = (event) => {
        let cloned = JSON.parse(JSON.stringify(model));
        cloned.briefArabic = event.target.value;
        setModel(cloned);
    }

    const imagesUpdated = imgs => {
        console.log(imgs);
        let cloned = JSON.parse(JSON.stringify(model));
        cloned.images = imgs;
        setModel(cloned);
    }


    const doPost = data => {
        setLoading(true);
        updateTestimonial(model).then(res => {
            setLoading(false);
            toast.success(t("succeed"));
            window.location.href = "/admin/testimonials";
        }).catch(e => {
            setLoading(false);
        })
        console.log(model);
        console.log(data);
    }


    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title"><MdFormatQuote /> {t("dashboard.editTestimonial")}</h5>
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
                        <label htmlFor="title" className="form-label">{t("dashboard.title")} ({t("dashboard.english")})</label>
                        <input type="text" className="form-control" id="title" name="title" value={model.title} onChange={updateTitle} />

                    </div>
                    <div className="mb-3">
                        <label htmlFor="titleArabic" className="form-label">{t("dashboard.title")} ({t("dashboard.arabic")})</label>
                        <input type="text" className="form-control" id="titleArabic" name="titleArabic" value={model.titleArabic} onChange={updateTitleArabic} />

                    </div>

                    <div className="mb-3">
                        <label htmlFor="brief" className="form-label">{t("dashboard.testimonialText")} ({t("dashboard.english")} )</label>
                        <textarea type="text" className="form-control" id="brief" value={model.brief} onChange={updateBrief} ></textarea>

                    </div>
                    <div className="mb-3">
                        <label htmlFor="brief" className="form-label">{t("dashboard.testimonialText")}  ({t("dashboard.arabic")} )</label>
                        <textarea type="text" className="form-control" id="briefArabic" value={model.briefArabic} onChange={updateBriefArabic} ></textarea>

                    </div>

                    <div className="mb-3 form-check">
                        <div className="custom-control custom-checkbox">
                            <input type="checkbox" className="custom-control-input" id="publishedCheck" checked={model.published} onChange={updatePublished} />
                            <label className="custom-control-label" htmlFor="publishedCheck">{t("dashboard.published")}</label>
                        </div>
                    </div>

                    <div className="mb-3">
                        <hr />
                        <ListImages handleChange={imagesUpdated} images={model.images} />
                    </div>


                    <div className="mb-3 row col justify-content-end" >
                        <Link className="btn btn-warning" to='/admin/testimonials' >{t("dashboard.cancel")}</Link> &nbsp;
                        <button type="button" className="btn btn-primary" onClick={doPost}>{t("dashboard.submit")}</button>
                    </div>
                </form>
            </div>


        </div>
    )
}


export default EditTestimonial
