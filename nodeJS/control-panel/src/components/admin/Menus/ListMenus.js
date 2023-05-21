import React,{ useState, useEffect } from 'react'
import { useTranslation } from "react-i18next"
import { MdInsertLink, MdEdit, MdDelete } from "react-icons/md"
import { getMenus, removeMenu } from './MenusAPI'
import { toast } from 'react-toastify'
import { ThreeDots } from  'react-loader-spinner'
import { Link } from 'react-router-dom'

const ListMenus = () => {
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(false);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        setLoading(true);
        getMenus().then(res => {

            setMenus(res.data);
            setLoading(false);
        }).catch(e => {
            setLoading(false);
            if (e.response && e.response.status === 403) {
                window.location.href = "/admin/sign-in"
            }
            //console.log("Error : " + e.response.status);
            toast.error(e.message);
        })
    }, []);

    const deleteMenu = (id) => {
        removeMenu(id).then(res => {
            setMenus(menus.filter(m => m.id != id));
        });
    }

    return (
        <div className="conatiner">
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title"><MdInsertLink /> {t("sidebar.menus")} <Link className="btn btn-outline-primary btn-sm" to={"/admin/menus/create"}>+</Link>
                    </h5>
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
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>
                                        #
                                    </th>
                                    <th>
                                        {t("dashboard.title")}
                                    </th>
                                    <th className="text-center">
                                        {t("dashboard.published")}
                                    </th>
                                    <th></th>

                                </tr>
                            </thead>
                            <tbody>
                                {
                                    menus.map(item => (
                                        <tr key={item.id}>
                                            <td> {item.id}</td>
                                            <td>
                                                {i18n.language === "en" ? item.title : item.titleArabic}
                                            </td>
                                            <td className="text-center">
                                                <div className="custom-control custom-checkbox">
                                                    <input type="checkbox" className="custom-control-input" id="customCheck1" checked={item.published} onChange={() => { }} />
                                                    <label className="custom-control-label" htmlFor="customCheck1"></label>
                                                </div>
                                            </td>
                                            <td className="justify-content-end" style={{textAlign:'end'}}>
                                                {/* <Link className="btn btn-danger" to="#"  title={t("dashboard.delete")} onClick={e => deleteMenu(item.id)}> <MdDelete /></Link> &nbsp; */}
                                                <Link className="btn btn-primary" to={"/admin/menus/edit/" + item.id} title={t("dashboard.edit")}> <MdEdit /> </Link>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ListMenus;
