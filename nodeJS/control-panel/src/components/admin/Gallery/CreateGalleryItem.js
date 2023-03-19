import React,{ useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {  createGalleryItem } from './GalleryAPI'
import { useTranslation } from "react-i18next"
import { toast } from 'react-toastify'
import Loader from "react-loader-spinner"
import ListImages from '../Images/ListImages'
import { MdCollections } from "react-icons/md";

const CreateGalleryItem = (props) => {

    const [galleryItem, setGalleryItem] = useState({});
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

    const updateTitle = (event) => {
        let cloned = JSON.parse(JSON.stringify(galleryItem));
        cloned.title = event.target.value;
        setGalleryItem(cloned);
    }
    const updateTitleArabic = (event) => {
        let cloned = JSON.parse(JSON.stringify(galleryItem));
        cloned.titleArabic = event.target.value;
        setGalleryItem(cloned);
    }


    const updatePublished = (event) => {
        let cloned = JSON.parse(JSON.stringify(galleryItem));
        cloned.published = event.target.checked;
        setGalleryItem(cloned);
    }

    const updateBrief = (event) => {
        let cloned = JSON.parse(JSON.stringify(galleryItem));
        cloned.brief = event.target.value;
        setGalleryItem(cloned);
    }


    const updateBriefArabic = (event) => {
        let cloned = JSON.parse(JSON.stringify(galleryItem));
        cloned.briefArabic = event.target.value;
        setGalleryItem(cloned);
    }

    const imagesUpdated = imgs => {
        console.log(imgs);
        let cloned = JSON.parse(JSON.stringify(galleryItem));
        if(imgs != null && imgs.length > 0){
            cloned.url = imgs[0].url;
        }else{
            cloned.url = null;
        }
        setGalleryItem(cloned);
    }


    const doPost = data => {
        setLoading(true);
        createGalleryItem(galleryItem).then(res => {
            setLoading(false);
            toast.success(t("succeed"));
            window.location.href = "/admin/gallery";
        }).catch(e => {
            setLoading(false);
        })
        console.log(galleryItem);
        console.log(data);
    }


    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title"><MdCollections /> {t("dashboard.createGalleryItem")}</h5>
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
                        <input type="text" className="form-control" id="title" name="title" value={galleryItem.title} onChange={updateTitle} />

                    </div>
                    <div className="mb-3">
                        <label htmlFor="titleArabic" className="form-label">{t("dashboard.title")} ({t("dashboard.arabic")})</label>
                        <input type="text" className="form-control" id="titleArabic" name="titleArabic" value={galleryItem.titleArabic} onChange={updateTitleArabic} />

                    </div>

                    <div className="mb-3">
                        <label htmlFor="brief" className="form-label">{t("dashboard.brief")} ({t("dashboard.english")} )</label>
                        <textarea type="text" className="form-control" id="brief" value={galleryItem.brief} onChange={updateBrief} ></textarea>

                    </div>
                    <div className="mb-3">
                        <label htmlFor="brief" className="form-label">{t("dashboard.brief")}  ({t("dashboard.arabic")} )</label>
                        <textarea type="text" className="form-control" id="briefArabic" value={galleryItem.briefArabic} onChange={updateBriefArabic} ></textarea>

                    </div>

                    <div className="mb-3 form-check">
                        <div className="custom-control custom-checkbox">
                            <input type="checkbox" className="custom-control-input" id="publishedCheck" checked={galleryItem.published} onChange={updatePublished} />
                            <label className="custom-control-label" htmlFor="publishedCheck">{t("dashboard.published")}</label>
                        </div>
                    </div>
                   
                    <div className="mb-3">
                        <hr />
                        <ListImages handleChange={imagesUpdated} images={galleryItem.url!=null?[{url: galleryItem.url}]:[]} />
                    </div>


                    <div className="mb-3 row col justify-content-end" >
                        <Link  className="btn btn-warning" to='/admin/gallery' >{t("dashboard.cancel")}</Link> &nbsp;
                        <button type="button" className="btn btn-primary" onClick={doPost}>{t("dashboard.submit")}</button>
                    </div>
                </form>
            </div>


        </div>
    )
}


export default CreateGalleryItem;