import React, { useState, useEffect } from 'react'
import { useTranslation } from "react-i18next"
import { MdInsertLink, MdEdit, MdDelete, MdAdd } from "react-icons/md"
import { getNavigationMenus, removeNavigationMenu } from './NavigationMenusAPI'
import { toast } from 'react-toastify'
import { ThreeDots } from  'react-loader-spinner'
import { Link } from 'react-router-dom'
import { getLocalizedText } from '../utils/utils';

const ListNavigationMenus = () => {
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(false);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        setLoading(true);
        getNavigationMenus().then(res => {

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
        removeNavigationMenu(id).then(res => {
            setMenus(menus.filter(m => m._id != id));
        });
    }

    return (
        <div className="conatiner">
            <div className="card">
                <div className="card-body">
                    <div className='row'>
                        <div className='col'>
                            <h5 className="card-title"><MdInsertLink /> {t("sidebar.menus")}</h5>
                        </div>
                        <div className='col' style={{textAlign:'end'}}>
                        <Link className="add-btn" to={"/admin/navigation-menus/create"}> <MdAdd size={24} /> {t("dashboard.add")} </Link>
                        </div>
                    </div>

                    

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
                    {menus ? (<div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                                <tr>

                                    <th>
                                        {t("dashboard.title")}
                                    </th>
                                    <th>
                                        {t("product.code")}
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
                                        <tr key={item._id}>

                                            <td>
                                                {getLocalizedText(item.title, i18n)}

                                            </td>
                                            <td>
                                                {item.code}
                                            </td>
                                            <td className="text-center">
                                                <div className="custom-control custom-checkbox">
                                                    <input type="checkbox" className="custom-control-input" id="customCheck1" checked={item.published} onChange={() => { }} />
                                                    <label className="custom-control-label" htmlFor="customCheck1"></label>
                                                </div>
                                            </td>
                                            <td className="justify-content-end" style={{textAlign:'end'}}>
                                                {/* <Link className="btn btn-danger" to="#"  title={t("dashboard.delete")} onClick={e => deleteMenu(item._id)}> <MdDelete /></Link> &nbsp; */}
                                                <Link className="btn btn-primary" to={"/admin/navigation-menus/edit/" + item._id} title={t("dashboard.edit")}> <MdEdit /> </Link>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>) : null}

                </div>
            </div>
        </div>
    )
}

export default ListNavigationMenus;
