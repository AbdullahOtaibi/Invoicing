import React,{ useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { createCalendarEvent } from './CalendarAPI'
import { useTranslation } from "react-i18next"
import { toast } from 'react-toastify'
import Loader from "react-loader-spinner"
import { Editor } from '@tinymce/tinymce-react'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import "./Calendar.css"


const CreateCalendarEvent = (props) => {
    
    const [article, setArticle] = useState({});
    const [loading, setLoading] = useState(false);
    const {articleId} = useParams();
    const { t } = useTranslation();
    const [selectedDate, setSelectedDate] = useState(null);



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



    const updateContent = (content, editor) => {
        let cloned = JSON.parse(JSON.stringify(article));
        cloned.content = content;
        setArticle(cloned);
        //console.log('Content was updated:', content);
    }

    const updateContentArabic = (content, editor) => {
        let cloned = JSON.parse(JSON.stringify(article));
        cloned.contentArabic = content;
        setArticle(cloned);
        //console.log('Content was updated:', content);
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

    const setStartDate = newDate => {
        setSelectedDate(newDate);
        console.log(newDate);
        let cloned = JSON.parse(JSON.stringify(article));
        cloned.eventDate =  newDate;
        setArticle(cloned);
        console.log(article);
    }


    const doPost = data => {
        setLoading(true);
        createCalendarEvent(article).then(res => {
            setLoading(false);
            toast.success(t("succeed"));
            //setArticle(res.data);
            window.location.href = "/admin/calendar";
        }).catch(e => {
            setLoading(false);
        })
        console.log(article);
        console.log(data);
    }


    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">{t("dashboard.createCalendarEvent")}</h5>
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
                    <div className="row">
                        <div className="col">
                            <div className="mb-3">
                                <label htmlFor="alias" className="form-label">{t("dashboard.alias")} </label>
                                <input type="text" className="form-control" id="alias" value={article.alias} onChange={updateAlias} />
                            </div>
                        </div>

                        <div className="col">
                            <div className="mb-3">
                                <label htmlFor="eventDate" className="form-label">{t("dashboard.eventDate")} </label>
                                <DatePicker id="eventDate"  selected={selectedDate} showTimeSelect onChange={date => setStartDate(date)} className="form-control" />
                            </div>


                        </div>


                        <div className="col">
                            <div className="mb-3 form-check">
                                <br />
                                <div className="custom-control custom-checkbox">
                                    <input type="checkbox" className="custom-control-input" id="publishedCheck" checked={article.published} onChange={updatePublished} />
                                    <label className="custom-control-label" htmlFor="publishedCheck">{t("dashboard.published")}</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col">
                            <div className="mb-3">
                                <label htmlFor="titleArabic" className="form-label">{t("dashboard.title")} ({t("dashboard.arabic")})</label>
                                <input type="text" className="form-control" id="titleArabic" name="titleArabic" value={article.titleArabic} onChange={updateTitleArabic} />
                            </div>
                        </div>
                        <div className="col">
                            <div className="mb-3">
                                <label htmlFor="title" className="form-label">{t("dashboard.title")} ({t("dashboard.english")})</label>
                                <input type="text" className="form-control" id="title" name="title" value={article.title} onChange={updateTitle} />
                            </div>


                        </div>

                    </div>






                    <div className="row">
                        <div className="col">
                            <div className="mb-3">
                                <label htmlFor="brief" className="form-label">{t("dashboard.brief")}  ({t("dashboard.arabic")} )</label>
                                <textarea type="text" className="form-control" id="briefArabic" value={article.briefArabic} onChange={updateBriefArabic} ></textarea>
                            </div>
                        </div>
                        <div className="col">
                            <div className="mb-3">
                                <label htmlFor="brief" className="form-label">{t("dashboard.brief")} ({t("dashboard.english")} )</label>
                                <textarea type="text" className="form-control" id="brief" value={article.brief} onChange={updateBrief} ></textarea>
                            </div>


                        </div>
                    </div>

                    <div className="row">
                        <div className="col">
                            <hr /><br/>
                        </div>
                    </div>

                    <div className="row">

                        <div className="col">
                            <div className="mb-3">
                                <label className="form-label">{t("dashboard.content")}  ({t("dashboard.arabic")} )</label>
                                <Editor
                                    apiKey="qnh6wwtrn2assdut2aukvl4690bx354iz3vul03ht16f7qmu"
                                    initialValue={article.contentArabic}
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
                        <div className="col">
                            <div className="mb-3">
                                <label className="form-label">{t("dashboard.content")}  ({t("dashboard.english")} )</label>
                                <Editor
                                    apiKey="qnh6wwtrn2assdut2aukvl4690bx354iz3vul03ht16f7qmu"
                                    initialValue={article.content}
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
                    </div>






                    <div className="mb-3 row col justify-content-end" >
                        <Link className="btn btn-warning" to='/admin/articles' >{t("dashboard.cancel")}</Link> &nbsp;
                        <button type="button" className="btn btn-primary" onClick={doPost}>{t("dashboard.submit")}</button>
                    </div>
                </form>
            </div>


        </div>
    )
}


export default CreateCalendarEvent;