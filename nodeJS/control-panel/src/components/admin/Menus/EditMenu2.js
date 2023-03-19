import React,{ useState, useEffect } from 'react'
import { getMenu, updateMenu } from './MenusAPI'
import { useTranslation } from "react-i18next"
import { toast } from 'react-toastify'
import Loader from "react-loader-spinner"
import { ListMenuItems } from './ListMenuItems'
import { Link, useParams } from 'react-router-dom'
import { CreateMenuItem } from './CreateMenuItem'


const EditMenu = (props) => {

    const [menu, setMenu] = useState({ items: [] });
    const [loading, setLoading] = useState(false);
    const [createVisible, setCreateVisible] = useState(false);
    const { t, i18n } = useTranslation();
    const { menuId } = useParams();

    useEffect(() => {
        getMenu(menuId).then(res => {
            if (res.items == null) {
                res.items = [];
            }
            setMenu(res.data);
        });
    }, []);

    const updateTitle = (event) => {
        let cloned = JSON.parse(JSON.stringify(menu));
        cloned.title = event.target.value;
        setMenu(cloned);
    }
    const updateTitleArabic = (event) => {
        let cloned = JSON.parse(JSON.stringify(menu));
        cloned.titleArabic = event.target.value;
        setMenu(cloned);
    }
    const updateCode = (event) => {
        let cloned = JSON.parse(JSON.stringify(menu));
        cloned.code = event.target.value;
        setMenu(cloned);
    }
    const updatePublished = (event) => {
        let cloned = JSON.parse(JSON.stringify(menu));
        cloned.published = event.target.checked;
        setMenu(cloned);
    }

    const addItem = (menuItem) => {
        console.log("EditMenu.addItem called...");
        let cloned = JSON.parse(JSON.stringify(menu));
        cloned.items.push(menuItem);
        setMenu(cloned);
    }


    const doPost = data => {
        setLoading(true);
        updateMenu(menu).then(res => {
            setLoading(false);
            toast.success(t("succeed"));
            //setArticle(res.data);
            // window.location.href = "/admin/menus/edit/" + res.id;
        }).catch(e => {
            setLoading(false);
        })
        console.log(menu);
        console.log(data);
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
                        <label htmlFor="code" className="form-label">{t("dashboard.code")} </label>
                        <input type="text" className="form-control" id="code" value={menu.code} onChange={updateCode} />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">{t("dashboard.title")} ({t("dashboard.english")})</label>
                        <input type="text" className="form-control" id="title" name="title" value={menu.title} onChange={updateTitle} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="titleArabic" className="form-label">{t("dashboard.title")} ({t("dashboard.arabic")})</label>
                        <input type="text" className="form-control" id="titleArabic" name="titleArabic" value={menu.titleArabic} onChange={updateTitleArabic} />
                    </div>
                    <div className="mb-3 form-check">
                        <div className="custom-control custom-checkbox">
                            <input type="checkbox" className="custom-control-input" id="publishedCheck" checked={menu.published} onChange={updatePublished} />
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
                                    menu.items.map(item => (
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

                                                <Link className="btn btn-primary" to={"/admin/menus/editItem/" + item.id}>{t("dashboard.edit")}</Link>
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

export default EditMenu;
