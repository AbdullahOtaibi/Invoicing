import React,{ useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import {  createPartner } from './PartnersAPI'
import { useTranslation } from "react-i18next"
import { toast } from 'react-toastify'
import Loader from "react-loader-spinner"
import ListImages from '../Images/ListImages'


const CreatePartner = (props) => {

    const [article, setArticle] = useState({images:[]});
    const [loading, setLoading] = useState(false);
    const {articleId} = useParams();
    const { t } = useTranslation();

 

    const imagesUpdated = imgs => {
        console.log("editarticle");
        console.log(imgs);
        let cloned = JSON.parse(JSON.stringify(article));
        cloned.images = imgs;
        setArticle(cloned);
    }

    const updateTitle = (event) => {
        let cloned = JSON.parse(JSON.stringify(article));
        cloned.title = event.target.value;
        setArticle(cloned);
    }
    const updateTitleArabic = (event) => {
        let cloned = JSON.parse(JSON.stringify(article));
        cloned.titleArabic = event.target.value;
        setArticle(cloned);
    }

    

    const updateAlias = (event) => {
        let cloned = JSON.parse(JSON.stringify(article));
        cloned.alias = event.target.value;
        setArticle(cloned);
    }

    

    const updatePublished = (event) => {
        let cloned = JSON.parse(JSON.stringify(article));
        cloned.published = event.target.checked;
        setArticle(cloned);
    }




    const updateBrief = (event) => {
        let cloned = JSON.parse(JSON.stringify(article));
        cloned.brief = event.target.value;
        setArticle(cloned);
    }


    const updateBriefArabic = (event) => {
        let cloned = JSON.parse(JSON.stringify(article));
        cloned.briefArabic = event.target.value;
        setArticle(cloned);
    }


    const doPost = data => {
        setLoading(true);
        createPartner(article).then(res => {
            setLoading(false);
            toast.success(t("succeed"));
            //setArticle(res.data);
            window.location.href = "/admin/partners";
        }).catch(e => {
            setLoading(false);
        })
        console.log(article);
        console.log(data);
    }


    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">{t("dashboard.createPartner")}</h5>
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
                        <label htmlFor="title" className="form-label">{t("dashboard.title")} ({t("dashboard.english")})</label>
                        <input type="text" className="form-control" id="title" name="title" value={article.title} onChange={updateTitle} />

                    </div>
                    <div className="mb-3">
                        <label htmlFor="titleArabic" className="form-label">{t("dashboard.title")} ({t("dashboard.arabic")})</label>
                        <input type="text" className="form-control" id="titleArabic" name="titleArabic" value={article.titleArabic} onChange={updateTitleArabic} />

                    </div>

                    <div className="mb-3">
                        <label htmlFor="alias" className="form-label">{t("dashboard.alias")} </label>
                        <input type="text" className="form-control" id="alias"  value={article.alias} onChange={updateAlias} />

                    </div>


                  

                    <div className="mb-3">
                        <label htmlFor="brief" className="form-label">{t("dashboard.brief")} ({t("dashboard.english")} )</label>
                        <textarea type="text" className="form-control" id="brief" value={article.brief} onChange={updateBrief} ></textarea>

                    </div>
                    <div className="mb-3">
                        <label htmlFor="brief" className="form-label">{t("dashboard.brief")}  ({t("dashboard.arabic")} )</label>
                        <textarea type="text" className="form-control" id="briefArabic" value={article.briefArabic} onChange={updateBriefArabic} ></textarea>

                    </div>

                    <div className="mb-3 form-check">
                        <div className="custom-control custom-checkbox">
                            <input type="checkbox" className="custom-control-input" id="publishedCheck" checked={article.published} onChange={updatePublished} />
                            <label className="custom-control-label" htmlFor="publishedCheck">{t("dashboard.published")}</label>
                        </div>
                    </div>
                    
                    <ListImages handleChange={imagesUpdated} images={article.images} />
                    

                    <div className="mb-3 row col justify-content-end" >
                        <Link  className="btn btn-warning" to='/admin/partners' >{t("dashboard.cancel")}</Link> &nbsp;
                        <button type="button" className="btn btn-primary" onClick={doPost}>{t("dashboard.submit")}</button>
                    </div>
                </form>
            </div>


        </div>
    )
}


export default CreatePartner;