import React,{ useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {  createShop } from './ShopsAPI'
import { useTranslation } from "react-i18next"
import { toast } from 'react-toastify'
import { ThreeDots } from  'react-loader-spinner'
import { Editor } from '@tinymce/tinymce-react'

const CreateShop = (props) => {

    const [shop, setShop] = useState({name:{arabic:"", english:""}});
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

 

    useEffect(() => {
       // setLoading(true);
     
    }, []);

    const updateTitle = (event) => {
        let cloned = JSON.parse(JSON.stringify(shop));
        cloned.name.english = event.target.value;
        setShop(cloned);
    }
    const updateTitleArabic = (event) => {
        let cloned = JSON.parse(JSON.stringify(shop));
        cloned.name.arabic = event.target.value;
        setShop(cloned);
    }

    const updateAuthor = (event) => {
        let cloned = JSON.parse(JSON.stringify(shop));
        cloned.author = event.target.value;
        setShop(cloned);
    }

    const updateAuthorArabic = (event) => {
        let cloned = JSON.parse(JSON.stringify(shop));
        cloned.authorArabic = event.target.value;
        setShop(cloned);
    }

    const updateAlias = (event) => {
        let cloned = JSON.parse(JSON.stringify(shop));
        cloned.alias = event.target.value;
        setShop(cloned);
    }

    

    const updatePublished = (event) => {
        let cloned = JSON.parse(JSON.stringify(shop));
        cloned.published = event.target.checked;
        setShop(cloned);
    }

   

    const updateContent = (content, editor) => {
        let cloned = JSON.parse(JSON.stringify(shop));
        cloned.content = content;
        setShop(cloned);
        //console.log('Content was updated:', content);
    }

    const updateContentArabic = (content, editor) => {
        let cloned = JSON.parse(JSON.stringify(shop));
        cloned.contentArabic = content;
        setShop(cloned);
        //console.log('Content was updated:', content);
    }

    const updateBrief = (event) => {
        let cloned = JSON.parse(JSON.stringify(shop));
        cloned.brief = event.target.value;
        setShop(cloned);
    }


    const updateBriefArabic = (event) => {
        let cloned = JSON.parse(JSON.stringify(shop));
        cloned.briefArabic = event.target.value;
        setShop(cloned);
    }


    const doPost = data => {
        setLoading(true);
        createShop(shop).then(res => {
            setLoading(false);
            toast.success(t("succeed"));
            //setProject(res.data);
            window.location.href = "/admin/shops/edit/" + res.id;
        }).catch(e => {
            setLoading(false);
        })
        console.log(shop);
        console.log(data);
    }


    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">{t("dashboard.createShop")}</h5>
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
                        <input type="text" className="form-control" id="title" name="title" value={shop.name.english} onChange={updateTitle} />

                    </div>
                    <div className="mb-3">
                        <label htmlFor="titleArabic" className="form-label">{t("dashboard.title")} ({t("dashboard.arabic")})</label>
                        <input type="text" className="form-control" id="titleArabic" name="titleArabic" value={shop.name.arabic} onChange={updateTitleArabic} />

                    </div>

                    <div className="mb-3">
                        <label htmlFor="alias" className="form-label">{t("dashboard.alias")} </label>
                        <input type="text" className="form-control" id="alias"  value={shop.alias} onChange={updateAlias} />

                    </div>


                    <div className="mb-3">
                        <label htmlFor="articleEnglishAuthor" className="form-label">{t("dashboard.author")} ({t("dashboard.english")} )</label>
                        <input type="text" className="form-control" id="articleEnglishAuthor" value={shop.author} onChange={updateAuthor} />

                    </div>
                    <div className="mb-3">
                        <label htmlFor="articleArabicAuthor" className="form-label">{t("dashboard.author")}  ({t("dashboard.arabic")} )</label>
                        <input type="text" className="form-control" id="articleArabicAuthor" value={shop.authorArabic} onChange={updateAuthorArabic} />

                    </div>

                    <div className="mb-3">
                        <label htmlFor="brief" className="form-label">{t("dashboard.brief")} ({t("dashboard.english")} )</label>
                        <textarea type="text" className="form-control" id="brief" value={shop.brief} onChange={updateBrief} ></textarea>

                    </div>
                    <div className="mb-3">
                        <label htmlFor="brief" className="form-label">{t("dashboard.brief")}  ({t("dashboard.arabic")} )</label>
                        <textarea type="text" className="form-control" id="briefArabic" value={shop.briefArabic} onChange={updateBriefArabic} ></textarea>

                    </div>

                    <div className="mb-3 form-check">
                        <div className="custom-control custom-checkbox">
                            <input type="checkbox" className="custom-control-input" id="publishedCheck" checked={shop.published} onChange={updatePublished} />
                            <label className="custom-control-label" htmlFor="publishedCheck">{t("dashboard.published")}</label>
                        </div>
                        
                    </div>
                    <div className="mb-3">
                    <label  className="form-label">{t("dashboard.content")}  ({t("dashboard.english")} )</label>
                        <Editor
                            apiKey="qnh6wwtrn2assdut2aukvl4690bx354iz3vul03ht16f7qmu"
                            initialValue={shop.content}
                            init={{
                                forced_root_block:"div",
                                height: 500,
                                menubar: false,
                                plugins: [
                                    'advlist autolink lists link image charmap print preview anchor textcolor',
                                    'searchreplace visualblocks code fullscreen',
                                    'insertdatetime media table paste code help wordcount table'
                                ],
                                toolbar:
                                    'undo redo | formatselect | bold italic forecolor backcolor | image table| \
                                    alignleft aligncenter alignright alignjustify | \
                                    bullist numlist outdent indent | removeformat | help'
                            }}
                            onEditorChange={updateContent}
                        />
                    </div>

                    <div className="mb-3">
                    <label  className="form-label">{t("dashboard.content")}  ({t("dashboard.arabic")} )</label>
                        <Editor
                            apiKey="qnh6wwtrn2assdut2aukvl4690bx354iz3vul03ht16f7qmu"
                            initialValue={shop.contentArabic}
                            init={{
                                forced_root_block:"div",
                                height: 500,
                                menubar: false,
                                plugins: [
                                    'advlist autolink lists link image charmap print preview anchor textcolor',
                                    'searchreplace visualblocks code fullscreen',
                                    'insertdatetime media table paste code help wordcount table'
                                ],
                                toolbar:
                                    'undo redo | formatselect | bold italic forecolor backcolor | image table| \
                                    alignleft aligncenter alignright alignjustify | \
                                    bullist numlist outdent indent | removeformat | help'
                            }}
                            onEditorChange={updateContentArabic}
                        />
                    </div>


                    <div className="mb-3 row col justify-content-end" >
                        <Link  className="btn btn-warning" to='/admin/shops' >{t("dashboard.cancel")}</Link> &nbsp;
                        <button type="button" className="btn btn-primary" onClick={doPost}>{t("dashboard.submit")}</button>
                    </div>
                </form>
            </div>


        </div>
    )
}


export default CreateShop;