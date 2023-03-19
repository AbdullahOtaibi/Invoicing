import React,{ useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getShop, updateShop } from './ShopsAPI'
import { useTranslation } from "react-i18next"
import { toast } from 'react-toastify'
import Loader from "react-loader-spinner"
import { Editor } from '@tinymce/tinymce-react'
import ListImages from '../Images/ListImages'

const EditShop = (props) => {

    const [shop, setShop] = useState({ images: [], name: { english: "", arabic: "" } , brief: { english: "", arabic: "" } });
    const [loading, setLoading] = useState(false);
    const {shopId} = useParams();
    const { t } = useTranslation();

    useEffect(() => {
        setLoading(true);
        getShop(shopId)
            .then(res => {
                console.log("GOT Project " + shopId);
                console.log(res.data);
                let theShop = res.data;
                if(!theShop.brief){
                    theShop.brief = {english:"", arabic:""};
                }
                setShop(theShop);
                setLoading(false);
            })
            .catch(e => {
                setLoading(false);
                if (e.response && e.response.status === 403) {
                    window.location.href = "/admin/sign-in"
                }
                toast.error(e.message);
            })
    }, []);



    const imagesUpdated = imgs => {
        console.log(imgs);
        let cloned = JSON.parse(JSON.stringify(shop));
        cloned.logo = imgs[0].url;
        setShop(cloned);
    }

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

    const updateActive = (event) => {
        let cloned = JSON.parse(JSON.stringify(shop));
        cloned.active = event.target.checked;
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
        if(!cloned.brief){
            cloned.brief = {english:"", arabic:""};
        }
        cloned.brief.english = event.target.value;
        setShop(cloned);
    }


    const updateBriefArabic = (event) => {
        let cloned = JSON.parse(JSON.stringify(shop));
        if(!cloned.brief){
            cloned.brief = {english:"", arabic:""};
        }
        cloned.brief.arabic = event.target.value;
        setShop(cloned);
    }




    const cancel = () => {
        window.location.href = "/admin/shops";
    }

    const doPost = data => {
        setLoading(true);
        updateShop(shop).then(res => {
            setLoading(false);
            toast.success(t("succeed"));
            window.location.href = "/admin/shops";
        }).catch(e => {
            setLoading(false);
        })
        console.log(shop);
        console.log(data);
    }


    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">{t("shop.editShop")}</h5>
                <div className="container text-center">
                    <Loader
                        type="ThreeDots"
                        color="#00BFFF"
                        height={100}
                        width={100}
                        visible={loading}

                    />
                </div>
                

                <form>   <div className="row">
                    <div className="col">
                        <div className="mb-3">
                            <img src={'http://51.195.200.24:8011/images/' + shop.logo} style={{width:200}} />
                        </div>
                        <div className="mb-3">
                            <hr />
                            <ListImages handleChange={imagesUpdated} images={shop.images} />
                        </div>
                    </div>
                </div>
                    <div className="row">



                        <div className="col">
                            <div className="mb-3">
                                <label htmlFor="alias" className="form-label">{t("dashboard.alias")} </label>
                                <input type="text" className="form-control" id="alias" value={shop.alias} onChange={updateAlias} />

                            </div>
                        </div>
                        <div className="col">

                            <div className="mb-3 form-check">
                                <div className="custom-control custom-checkbox">
                                    <input type="checkbox" className="custom-control-input" id="publishedCheck" checked={shop.published} onChange={updatePublished} />
                                    <label className="custom-control-label bold" htmlFor="publishedCheck">{t("dashboard.published")}</label>
                                </div>
                            </div>

                            <div className="mb-3 form-check">
                                <div className="custom-control custom-checkbox">
                                    <input type="checkbox" className="custom-control-input" id="activeCheck" checked={shop.active} onChange={updateActive} />
                                    <label className="custom-control-label bold" htmlFor="activeCheck">{t("dashboard.current")}</label>
                                </div>
                            </div>

                        </div>
                    </div>


                    <div className="row">
                        <div className="col">
                            <div className="mb-3">
                                <label htmlFor="title" className="form-label">{t("dashboard.title")} ({t("dashboard.english")})</label>
                                <input type="text" className="form-control" id="title" name="title" value={shop.name.english} onChange={updateTitle} />

                            </div>
                        </div>
                        <div className="col">
                            <div className="mb-3">
                                <label htmlFor="titleArabic" className="form-label">{t("dashboard.title")} ({t("dashboard.arabic")})</label>
                                <input type="text" className="form-control" id="titleArabic" name="titleArabic" value={shop.name.arabic} onChange={updateTitleArabic} />

                            </div>
                        </div>
                    </div>




                    <div className="row">
                        <div className="col">
                            <div className="mb-3">
                                <label htmlFor="articleEnglishAuthor" className="form-label">{t("dashboard.author")} ({t("dashboard.english")} )</label>
                                <input type="text" className="form-control" id="articleEnglishAuthor" value={shop.author} onChange={updateAuthor} />

                            </div>
                        </div>
                        <div className="col">
                            <div className="mb-3">
                                <label htmlFor="articleArabicAuthor" className="form-label">{t("dashboard.author")}  ({t("dashboard.arabic")} )</label>
                                <input type="text" className="form-control" id="articleArabicAuthor" value={shop.authorArabic} onChange={updateAuthorArabic} />

                            </div>
                        </div>
                    </div>





                    <div className="row">
                        <div className="col">
                            <div className="mb-3">
                                <label htmlFor="brief" className="form-label">{t("dashboard.brief")} ({t("dashboard.english")} )</label>
                                <textarea type="text" className="form-control" id="brief" value={shop.brief.english} onChange={updateBrief} ></textarea>

                            </div>
                        </div>
                        <div className="col">
                            <div className="mb-3">
                                <label htmlFor="brief" className="form-label">{t("dashboard.brief")}  ({t("dashboard.arabic")} )</label>
                                <textarea type="text" className="form-control" id="briefArabic" value={shop.brief.arabic} onChange={updateBriefArabic} ></textarea>

                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col">
                            <div className="mb-3">
                                <label className="form-label">{t("dashboard.content")}  ({t("dashboard.english")} )</label>
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
                        </div>
                        <div className="col">
                            <div className="mb-3">
                                <label className="form-label">{t("dashboard.content")}  ({t("dashboard.arabic")} )</label>
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
                        </div>
                    </div>








                    <div className="mb-3 row col justify-content-end" >

                        <Link className="btn btn-warning" to='/admin/shops' >{t("close")}</Link> &nbsp;
                        <button type="button" className="btn btn-primary" onClick={doPost}>{t("dashboard.save")}</button>
                    </div>
                </form>
            </div>


        </div>
    )
}


export default EditShop;