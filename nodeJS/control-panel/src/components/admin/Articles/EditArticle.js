import React, { useState, useEffect, useRef } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { getArticle, updateArticle } from './ArticlesAPI'
import { getCategories } from '../Categories/CategoriesAPI'
import { useTranslation } from "react-i18next"
import { toast } from 'react-toastify'
import { ThreeDots } from  'react-loader-spinner'
import { Editor } from '@tinymce/tinymce-react'
import ListImages from '../Images/ListImages'
import LocalizedTextEditor from '../Shared/LocalizedTextEditor'
import LocalizedTextAreaEditor from '../Shared/LocalizedTextAreaEditor'
import { getLocalizedTextByLocale } from '../utils/utils';
import { MdSave, MdClose } from "react-icons/md";
import { hasPermission } from '../utils/auth';
import { Helmet } from 'react-helmet'

import { upload } from '../../../services/ApiClient'

const EditArticle = (props) => {

    let navigate = useNavigate();
    if (!hasPermission('articles.modify')) {
        navigate("/admin/articles", { replace: true });
    }

    const { t, i18n } = useTranslation();
    const [contentLocale, setContentLocale] = useState('en');
    const editorRef = useRef(null);
    const [article, setArticle] = useState({ images: [], title: {}, author: {}, brief: {}, content: {}, keywords: {}, description: {} });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editorReady, setEditorReady] = useState(false);
    let contentNeesUpdate = true;

    const [contentReady, setContentReady] = useState(false);

    const { id } = useParams();


    const [uploading, setUploading] = useState(false);
    const [fileName, setFileName] = useState(null);
    const [file, setFile] = useState();

    const updateFile = (event) => {
        setFile(event.target.files[0]);
        setFileName(event.target.files[0].name);
    }

    useEffect(() => {
        if (editorRef && editorRef.current) {
            editorRef.current.setContent(getLocalizedTextByLocale(article.content, contentLocale));
        }

    }, [contentReady, editorReady]);


    const updateProgressPercentage = percentage => {
        //setProgress(percentage);
    }

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
        // console.log('updating to new content: ' + getLocalizedTextByLocale(article.content, newLocale));
        contentNeesUpdate = false;
        editorRef.current.setContent(getLocalizedTextByLocale(article.content, newLocale));
        //editorRef.current.setContent(newLocale);
        //updateEditorContent();

    }

    const conentChanged = (newText, editor) => {
        if (contentNeesUpdate) {
            console.log('New Text :' + newText);

            let cloned = JSON.parse(JSON.stringify(article));
            let newContent = newText;//editor.getContent();
            var bm = editor.selection.getBookmark();
            console.log(bm);


            setLocalTextValue(cloned.content, newText);
            setArticle(cloned);
            editor.selection.moveToBookmark(bm);
            console.log(newContent);

        } else {
            contentNeesUpdate = true;
        }

    }

    const updateKeywords = (newValue, locale) => {
        setContentLocale(locale);
        let cloned = JSON.parse(JSON.stringify(article));
        setLocalTextValue(cloned.keywords, newValue);
        setArticle(cloned);
    }

    const updateDescription = (newValue, locale) => {
        setContentLocale(locale);
        let cloned = JSON.parse(JSON.stringify(article));
        setLocalTextValue(cloned.description, newValue);
        setArticle(cloned);
    }


    const uploadFile = (fileToUpload, cb) => {
        const formData = new FormData();
        setUploading(true);
        formData.append("file", fileToUpload);
        upload(process.env.REACT_APP_API_BASE_URL +"/v1/file-upload", formData, updateProgressPercentage).then(res => {
            //setFileName(null);
            //fileRef.current.value = null;
            console.log(res.data);
            setUploading(false);
            cb('/uploads/' + res.data.path, { title: fileToUpload.name });
            toast.success(t("succeed"));
            console.log("File Uploaded : res.path =" + res.data.path);
            // if(props.handleUpload != null){
            //     props.handleUpload({url:res.path});
            // }
        }).catch(e => {
            setUploading(false);

            console.log(e.message);
            toast.error(e.message);
        });



    }




    useEffect(() => {
        setLoading(true);
        getArticle(id)
            .then(res => {
                console.log("GOT Articles " + id);
                console.log(res.data);
                if (!res.data.author) {
                    res.data.author = {};
                }

                if (!res.data.title) {
                    res.data.title = {};
                }

                if (!res.data.brief) {
                    res.data.brief = {};
                }

                if (!res.data.content) {
                    res.data.content = {};
                }

                if (!res.data.keywords) {
                    res.data.keywords = {};
                }

                if (!res.data.description) {
                    res.data.description = {};
                }

                setArticle(res.data);
                setContentReady(true);
                setLoading(false);
            })
            .catch(e => {
                setLoading(false);
                if (e.response && e.response.status === 403) {
                    window.location.href = "/admin/sign-in"
                }

            });
        console.log('EditArticle useEffect called.')
    }, []);



    useEffect(() => {
        setLoading(true);
        getCategories().then(res => {
            if (res.data) {
                setCategories(res.data);
            }

            setLoading(false);
        }).catch(e => {
            setLoading(false);
        });
    }, []);

    const imagesUpdated = imgs => {
        console.log("editarticle");
        console.log(imgs);
        let cloned = JSON.parse(JSON.stringify(article));
        cloned.images = imgs;
        setArticle(cloned);
    }



    const updateTitle = (newValue, locale) => {
        setContentLocale(locale);
        console.log("EditProduct - newValue: " + newValue + ", locale: " + locale);
        let cloned = JSON.parse(JSON.stringify(article));
        setLocalTextValue(cloned.title, newValue);
        setArticle(cloned);
    }

    const updateAuthor = (newValue, locale) => {
        setContentLocale(locale);
        console.log("EditProduct - newValue: " + newValue + ", locale: " + locale);
        let cloned = JSON.parse(JSON.stringify(article));
        setLocalTextValue(cloned.author, newValue);
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

    const updateShowTitle = (event) => {
        let cloned = JSON.parse(JSON.stringify(article));
        cloned.showTitle = event.target.checked;
        setArticle(cloned);
    }



    const updateCategory = (event) => {
        let cloned = JSON.parse(JSON.stringify(article));
        console.log("category Id :" + event.target.value);
        cloned.category = categories.filter(cat => cat.id == event.target.value)[0];
        setArticle(cloned);
    }






    const updateBrief = (newValue, locale) => {
        setContentLocale(locale);
        console.log("EditProduct - newValue: " + newValue + ", locale: " + locale);
        let cloned = JSON.parse(JSON.stringify(article));
        setLocalTextValue(cloned.brief, newValue);
        setArticle(cloned);
    }









    const doPost = data => {
        setLoading(true);
        updateArticle(article).then(res => {
            setLoading(false);
            toast.success(t("succeed"));
            window.location.href = "/admin/articles";
        }).catch(e => {
            setLoading(false);
        })
        console.log(article);
        console.log(data);
    }


    return (
        <div className="card">
            <Helmet>
                <title> Invoicing | Admin | {t("dashboard.editArticle")}</title>
            </Helmet>
            <div className="card-body">
                <h5 className="card-title">{t("dashboard.editArticle")}</h5>
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
                        <label htmlFor="categoryId" className="form-label">{t("dashboard.category")} </label>
                        <select className="form-control" id="categoryId" value={article.category ? article.category.id : 0} onChange={updateCategory}>
                            {
                                categories ? (categories.map(item => (<option key={item._id} value={item._id}>{item.title}</option>))) : null

                            }
                        </select>
                    </div>
                    <div className="row">
                        <div className="col">
                            <div className="mb-3">
                                <label htmlFor="alias" className="form-label">{t("dashboard.alias")} </label>
                                <input type="text" className="form-control" id="alias" value={article.alias} onChange={updateAlias} />

                            </div>
                        </div>
                        <div className="col">
                            <br />
                            <div className="mb-3 form-check">
                                <div className="custom-control custom-checkbox">
                                    <input type="checkbox" className="custom-control-input" id="publishedCheck" checked={article.published} onChange={updatePublished} />
                                    <label className="custom-control-label bold" htmlFor="publishedCheck">{t("dashboard.published")}</label>
                                </div>
                            </div>
                        </div>

                        <div className="col">
                            <br />
                            <div className="mb-3 form-check">
                                <div className="custom-control custom-checkbox">
                                    <input type="checkbox" className="custom-control-input" id="showTitleCheck" checked={article.showTitle} onChange={updateShowTitle} />
                                    <label className="custom-control-label bold" htmlFor="showTitleCheck">{t("article.showTitle")}</label>
                                </div>
                            </div>
                        </div>

                    </div>


                    <div className="row">
                        <div className="col">
                            <div className="mb-3">
                                <label htmlFor="title" className="form-label">{t("dashboard.title")} </label>

                                <LocalizedTextEditor placeholder={t("dashboard.title")} locale={contentLocale} textObject={article.title}
                                    onLocalChanged={changeLocale} onChange={updateTitle} />
                            </div>
                        </div>

                    </div>




                    <div className="row">
                        <div className="col">
                            <div className="mb-3">
                                <label htmlFor="articleEnglishAuthor" className="form-label">{t("dashboard.author")}</label>

                                <LocalizedTextEditor placeholder={t("dashboard.author")} locale={contentLocale} textObject={article.author}
                                    onLocalChanged={changeLocale} onChange={updateAuthor} />



                            </div>
                        </div>

                    </div>





                    <div className="row">
                        <div className="col">
                            <div className="mb-3">
                                <label htmlFor="brief" className="form-label">{t("dashboard.brief")} </label>

                                <LocalizedTextAreaEditor placeholder={t("dashboard.brief")} locale={contentLocale} textObject={article.brief}
                                    onLocalChanged={changeLocale} onChange={updateBrief} />



                            </div>
                        </div>

                    </div>

                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">{t("product.description")}</label>
                        <LocalizedTextAreaEditor placeholder={t("product.description")} locale={contentLocale} textObject={article.description}
                            onLocalChanged={changeLocale} onChange={updateDescription} />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="keywords" className="form-label">{t("seo.keywords")}</label>
                        <LocalizedTextEditor placeholder={t("seo.keywords")} locale={contentLocale} textObject={article.keywords}
                            onLocalChanged={changeLocale} onChange={updateKeywords} />
                    </div>


                    <div className="row">
                        <div className="col">
                            <div className="mb-3">
                                <label htmlFor="brief" className="form-label">{t("dashboard.content")} </label>

                                <Editor
                                    apiKey='qnh6wwtrn2assdut2aukvl4690bx354iz3vul03ht16f7qmu'
                                    onInit={(evt, editor) => { editorRef.current = editor; setEditorReady(true) }}
                                    init={{
                                        forced_root_block:"div",
                                        height: 500,
                                        menubar: false,
                                        automatic_uploads: true,
                                        file_picker_types: 'image',
                                        file_picker_callback: function (cb, value, meta) {
                                            var input = document.createElement('input');
                                            input.setAttribute('type', 'file');
                                            input.setAttribute('accept', 'image/*');
                                            input.onchange = function () {

                                                var uploadedFileUri = uploadFile(this.files[0], cb);

                                            }
                                            input.click();
                                        },
                                        plugins: [
                                            'advlist',
                                            'lists',
                                            'image',
                                            'preview',
                                            'anchor',
                                            'link',
                                            'searchreplace',
                                            'visualblocks',
                                            'fullscreen',
                                            'insertdatetime',
                                            'media',
                                            'table',
                                            'paste',
                                            'code',
                                            'wordcount',
                                            'directionality'
                                        ],
                                        toolbar:
                                            'undo redo |fontfamily  blocks | fontsize bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat ltr rtl | link table image code',
                                        font_size_formats: '8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt'
                                    }
                                    }
                                    onEditorChange={conentChanged}
                                >
                                </Editor>



                            </div>
                        </div>

                    </div>









                    <div className="mb-3">
                        <hr />
                        <ListImages handleChange={imagesUpdated} images={article.images} />
                    </div>

                    <div className="mb-3 row col justify-content-end" >

                        <Link className="add-btn btn-danger" to='/admin/articles' >
                            <MdClose /> &nbsp;&nbsp;
                            {t("close")}
                        </Link> &nbsp;
                        <button type="button" className="add-btn btn-primary" onClick={doPost}>
                            <MdSave /> &nbsp;&nbsp;
                            {t("dashboard.save")}
                        </button>
                    </div>
                </form>
            </div>


        </div>
    )
}


export default EditArticle;