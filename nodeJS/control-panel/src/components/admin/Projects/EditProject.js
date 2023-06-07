import React,{ useState, useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getProject, updateProject } from './ProjectsAPI'
import { useTranslation } from "react-i18next"
import { toast } from 'react-toastify'
import { ThreeDots } from  'react-loader-spinner'
import { Editor } from '@tinymce/tinymce-react'
import ListImages from '../Images/ListImages'

const EditProject = (props) => {

    const [project, setProject] = useState({ images: [] });
    const [loading, setLoading] = useState(false);
    const {projectId} = useParams();
    const { t } = useTranslation();
    const editorArRef = useRef(null);
    const editorEnRef = useRef(null);

    useEffect(() => {
        setLoading(true);
        getProject(projectId)
            .then(res => {
                console.log("GOT Project " + projectId);
                console.log(res.data);
                setProject(res.data);
                setLoading(false);
                updateEditorContent();

            })
            .catch(e => {
                setLoading(false);
                if (e.response && e.response.status === 403) {
                    window.location.href = "/admin/sign-in"
                }
               
            })
    }, []);

    const updateEditorContent = () => {

        if (editorEnRef.current) {
            editorEnRef.current.setContent(project.content);
        }else{
            console.log('editorEnRef.current is null');
        }
        if (editorArRef.current) {
            editorArRef.current.setContent(project.contentArabic);
        }else{
            console.log('editorArRef.current is null');
        }

    }

    const imagesUpdated = imgs => {
        console.log(imgs);
        let cloned = JSON.parse(JSON.stringify(project));
        cloned.images = imgs;
        setProject(cloned);
    }

    const updateTitle = (event) => {
        let cloned = JSON.parse(JSON.stringify(project));
        cloned.title = event.target.value;
        setProject(cloned);
    }
    const updateTitleArabic = (event) => {
        let cloned = JSON.parse(JSON.stringify(project));
        cloned.titleArabic = event.target.value;
        setProject(cloned);
    }

    const updateAuthor = (event) => {
        let cloned = JSON.parse(JSON.stringify(project));
        cloned.author = event.target.value;
        setProject(cloned);
    }

    const updateAuthorArabic = (event) => {
        let cloned = JSON.parse(JSON.stringify(project));
        cloned.authorArabic = event.target.value;
        setProject(cloned);
    }

    const updateAlias = (event) => {
        let cloned = JSON.parse(JSON.stringify(project));
        cloned.alias = event.target.value;
        setProject(cloned);
    }



    const updatePublished = (event) => {
        let cloned = JSON.parse(JSON.stringify(project));
        cloned.published = event.target.checked;
        setProject(cloned);
    }

    const updateActive = (event) => {
        let cloned = JSON.parse(JSON.stringify(project));
        cloned.active = event.target.checked;
        setProject(cloned);
    }





    const updateContent = (content, editor) => {
        let cloned = JSON.parse(JSON.stringify(project));
        cloned.content = content;
        setProject(cloned);
        //console.log('Content was updated:', content);
    }

    const updateContentArabic = (content, editor) => {
        let cloned = JSON.parse(JSON.stringify(project));
        cloned.contentArabic = content;
        setProject(cloned);
        //console.log('Content was updated:', content);
    }

    const updateBrief = (event) => {
        let cloned = JSON.parse(JSON.stringify(project));
        cloned.brief = event.target.value;
        setProject(cloned);
    }


    const updateBriefArabic = (event) => {
        let cloned = JSON.parse(JSON.stringify(project));
        cloned.briefArabic = event.target.value;
        setProject(cloned);
    }




    const cancel = () => {
        window.location.href = "/admin/projects";
    }

    const doPost = data => {
        setLoading(true);
        updateProject(project).then(res => {
            setLoading(false);
            toast.success(t("succeed"));
            window.location.href = "/admin/projects";
        }).catch(e => {
            setLoading(false);
        })
        console.log(project);
        console.log(data);
    }


    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">{t("dashboard.editProject")}</h5>
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

                    <div className="row">
                        <div className="col">
                            <div className="mb-3">
                                <label htmlFor="alias" className="form-label">{t("dashboard.alias")} </label>
                                <input type="text" className="form-control" id="alias" value={project.alias} onChange={updateAlias} />

                            </div>
                        </div>
                        <div className="col">

                            <div className="mb-3 form-check">
                                <div className="custom-control custom-checkbox">
                                    <input type="checkbox" className="custom-control-input" id="publishedCheck" checked={project.published} onChange={updatePublished} />
                                    <label className="custom-control-label bold" htmlFor="publishedCheck">{t("dashboard.published")}</label>
                                </div>
                            </div>

                            <div className="mb-3 form-check">
                                <div className="custom-control custom-checkbox">
                                    <input type="checkbox" className="custom-control-input" id="activeCheck" checked={project.active} onChange={updateActive} />
                                    <label className="custom-control-label bold" htmlFor="activeCheck">{t("dashboard.current")}</label>
                                </div>
                            </div>

                        </div>
                    </div>


                    <div className="row">
                        <div className="col">
                            <div className="mb-3">
                                <label htmlFor="title" className="form-label">{t("dashboard.title")} ({t("dashboard.english")})</label>
                                <input type="text" className="form-control" id="title" name="title" value={project.title} onChange={updateTitle} />

                            </div>
                        </div>
                        <div className="col">
                            <div className="mb-3">
                                <label htmlFor="titleArabic" className="form-label">{t("dashboard.title")} ({t("dashboard.arabic")})</label>
                                <input type="text" className="form-control" id="titleArabic" name="titleArabic" value={project.titleArabic} onChange={updateTitleArabic} />

                            </div>
                        </div>
                    </div>




                    <div className="row">
                        <div className="col">
                            <div className="mb-3">
                                <label htmlFor="articleEnglishAuthor" className="form-label">{t("dashboard.author")} ({t("dashboard.english")} )</label>
                                <input type="text" className="form-control" id="articleEnglishAuthor" value={project.author} onChange={updateAuthor} />

                            </div>
                        </div>
                        <div className="col">
                            <div className="mb-3">
                                <label htmlFor="articleArabicAuthor" className="form-label">{t("dashboard.author")}  ({t("dashboard.arabic")} )</label>
                                <input type="text" className="form-control" id="articleArabicAuthor" value={project.authorArabic} onChange={updateAuthorArabic} />

                            </div>
                        </div>
                    </div>





                    <div className="row">
                        <div className="col">
                            <div className="mb-3">
                                <label htmlFor="brief" className="form-label">{t("dashboard.brief")} ({t("dashboard.english")} )</label>
                                <textarea type="text" className="form-control" id="brief" value={project.brief} onChange={updateBrief} ></textarea>

                            </div>
                        </div>
                        <div className="col">
                            <div className="mb-3">
                                <label htmlFor="brief" className="form-label">{t("dashboard.brief")}  ({t("dashboard.arabic")} )</label>
                                <textarea type="text" className="form-control" id="briefArabic" value={project.briefArabic} onChange={updateBriefArabic} ></textarea>

                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col">
                            <div className="mb-3">
                                <label className="form-label">{t("dashboard.content")}  ({t("dashboard.english")} )</label>
                                <Editor
                                    apiKey="qnh6wwtrn2assdut2aukvl4690bx354iz3vul03ht16f7qmu"
                                    initialValue={project.content}
                                    init={{
                                        forced_root_block:"div",
                                        height: 500,
                                        menubar: false,
                                        plugins: [
                                            'advlist autolink lists link image charmap print preview anchor',
                                            'searchreplace visualblocks code fullscreen',
                                            'insertdatetime media table paste code help wordcount table'
                                        ],
                                        toolbar:
                                            'undo redo | formatselect | bold italic forecolor backcolor | image table| \
                                    alignleft aligncenter alignright alignjustify | \
                                    bullist numlist outdent indent | removeformat | help'
                                    }}
                                    onEditorChange={updateContent}
                                    onInit={(evt, editor) => {editorEnRef.current = editor; updateEditorContent();}}
                                >{project.content}</Editor>
                            </div>
                        </div>
                        <div className="col">
                            <div className="mb-3">
                                <label className="form-label">{t("dashboard.content")}  ({t("dashboard.arabic")} )</label>
                                <Editor
                                    apiKey="qnh6wwtrn2assdut2aukvl4690bx354iz3vul03ht16f7qmu"
                                    initialValue={project.contentArabic}
                                    init={{
                                        forced_root_block:"div",
                                        height: 500,
                                        menubar: false,
                                        plugins: [
                                            'advlist autolink lists link image charmap print preview anchor',
                                            'searchreplace visualblocks code fullscreen',
                                            'insertdatetime media table paste code help wordcount table'
                                        ],
                                        toolbar:
                                            'undo redo | formatselect | bold italic forecolor backcolor | image table| \
                                    alignleft aligncenter alignright alignjustify | \
                                    bullist numlist outdent indent | removeformat | help'
                                    }}
                                    onEditorChange={updateContentArabic}
                                    onInit={(evt, editor) => {editorArRef.current = editor; updateEditorContent();}}
                                >{project.contentArabic}</Editor>
                            </div>
                        </div>
                    </div>






                    <div className="mb-3">
                        <hr />
                        <ListImages handleChange={imagesUpdated} images={project.images} />
                    </div>

                    <div className="mb-3 row col justify-content-end" >

                        <Link className="btn btn-warning" to='/admin/projects' >{t("close")}</Link> &nbsp;
                        <button type="button" className="btn btn-primary" onClick={doPost}>{t("dashboard.save")}</button>
                    </div>
                </form>
            </div>


        </div>
    )
}


export default EditProject;