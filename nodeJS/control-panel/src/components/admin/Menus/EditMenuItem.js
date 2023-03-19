import React,{ useState, useEffect } from 'react'
import Loader from "react-loader-spinner"
import { CreateMenuItem } from './CreateMenuItem'
import { useTranslation } from "react-i18next"
import { Link, useParams } from 'react-router-dom'
import { getMenuItem, updateMenuItem } from './MenusAPI'
import { toast } from 'react-toastify'

const EditMenuItem = (props) => {
    const [model, setModel] = useState({ childs: [] });
    const [loading, setLoading] = useState(false);
    const [createVisible, setCreateVisible] = useState(false);
    const { t, i18n } = useTranslation();
    const { itemId } = useParams();

    useEffect(() => {
        loadModel(itemId);
    }, []);

    const loadModel = (id) => {
        setLoading(true);
        getMenuItem(id).then(res => {
            const cloned = JSON.parse(JSON.stringify(res.data));
            if (cloned != null && cloned.childs == null) {
                cloned.childs = [];
            }
            setModel(cloned);
            setLoading(false);
        }).catch(e => {
            setLoading(false);
            toast.error(t("error") + e.message);
        });
    }

    const addItem = () => {
        console.log("EditMenuItem.addItemCallled...");
        if (props.onItemAdded) {
            props.onItemAdded(model);
        }
    }

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

    const updateLink = (event) => {
        let cloned = JSON.parse(JSON.stringify(model));
        cloned.link = event.target.value;
        setModel(cloned);
    }


    const updatePublished = (event) => {
        let cloned = JSON.parse(JSON.stringify(model));
        cloned.published = event.target.checked;
        setModel(cloned);
    }

    const doPost = data => {
        updateMenuItem(model).then(res => {
            if (res.data != null) {
                setModel(res.data);
            }
            toast.success(t("succeed"));
        });

    }

    const toggleCreateItem = () => {
        setCreateVisible(!createVisible);
    }




    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">{t("dashboard.editMenu")}</h5>
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
                        <input type="text" className="form-control" id="title" name="title" value={model.title} onChange={updateTitle} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="titleArabic" className="form-label">{t("dashboard.title")} ({t("dashboard.arabic")})</label>
                        <input type="text" className="form-control" id="titleArabic" name="titleArabic" value={model.titleArabic} onChange={updateTitleArabic} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="link" className="form-label">{t("dashboard.link")}</label>
                        <input type="text" className="form-control" id="link" value={model.link} onChange={updateLink} dir="ltr" />
                    </div>

                    <div className="mb-3 form-check">
                        <div className="custom-control custom-checkbox">
                            <input type="checkbox" className="custom-control-input" id="publishedCheck" checked={model.published} onChange={updatePublished} />
                            <label className="custom-control-label" htmlFor="publishedCheck">{t("dashboard.published")}</label>
                        </div>
                    </div>

                    <div className="mb-3 row col justify-content-end" >
                        <Link className="btn btn-warning" to='/admin/menus' >{t("dashboard.cancel")}</Link> &nbsp;
                        <button type="button" className="btn btn-primary" onClick={doPost}>{t("dashboard.save")}</button>
                    </div>

                    <div className="table-responsive">
                        <table className="table   table-hover">
                            <thead>
                                <tr>
                                    <th>
                                        {t("dashboard.title")}
                                    </th>
                                    <th className="text-center">
                                        {t("dashboard.published")}
                                    </th>
                                    <th className="row justify-content-end">
                                        <Link to="#" onClick={toggleCreateItem} className="btn btn-outline-primary btn-sm">+</Link>
                                    </th>

                                </tr>
                            </thead>
                            <tbody>
                                {createVisible ? (<tr visible={createVisible}>
                                    <td colSpan="3" >
                                        <CreateMenuItem onItemAdded={addItem} closeHandler={toggleCreateItem} />
                                    </td>
                                </tr>) : (<></>)}
                                {
                                    model.childs.map(item => (
                                        <tr key={item.title}>
                                            <td>
                                                {i18n.language === "en" ? item.title : item.titleArabic}
                                            </td>
                                            <td className="text-center">
                                                <div className="custom-control custom-checkbox">
                                                    <input type="checkbox" className="custom-control-input" id="customCheck1" checked={item.published} onChange={() => { }} />
                                                    <label className="custom-control-label" htmlFor="customCheck1"></label>
                                                </div>
                                            </td>
                                            <td className="row justify-content-end">

                                                <Link className="btn btn-primary" to="#" onClick={() => { loadModel(item.id) }}>{t("dashboard.edit")}</Link>
                                            </td>
                                        </tr>

                                    ))
                                }
                            </tbody>
                        </table>
                    </div>





                </form>
            </div>


        </div>
    )
}

export default EditMenuItem;
