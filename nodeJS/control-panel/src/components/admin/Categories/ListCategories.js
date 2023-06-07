import React, { useState, useEffect } from 'react'
import { useTranslation } from "react-i18next"
import { MdCollectionsBookmark, MdDelete, MdEdit, MdAdd } from "react-icons/md"
import { getCategories, removeCategory } from './CategoriesAPI'
import { ThreeDots } from  'react-loader-spinner'
import { Link } from 'react-router-dom'
import { hasPermission } from '../utils/auth';

const ListCategories = () => {
    const { t, i18n } = useTranslation();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        getCategories().then(res => {
            setCategories(res.data);
        }).catch(error => {

        })
    }, []);

    const deleteCategory = (id) => {
        removeCategory(id).then(res => {
            setCategories(categories.filter(cat => cat.id != id));
        });
    }

    return (
        <div className="conatiner">
            <div className="card">
                <div className="card-body">


                    <div className='row'>
                        <div className='col-md-8 col-sm-6'>
                            <h5 className="card-title"><MdCollectionsBookmark /> {t("sidebar.categories")}
                                &nbsp;
                            </h5>
                        </div>

                        <div className='col-md-4 col-sm-6' style={{ textAlign: 'end' }}>
                            {hasPermission('articles.modify') ? (<Link className="add-btn" to={"/admin/categories/create"}><MdAdd size={20} />  {t("dashboard.add")}</Link>) : null}
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
                    <div className="table-responsive">
                        <table className="table  ">
                            <thead>
                                <tr>
                                    <th>

                                        {t("dashboard.category")}

                                    </th>
                                    <th className="text-center">
                                        {t("dashboard.published")}

                                    </th>
                                    <th>

                                    </th>

                                </tr>
                            </thead>
                            <tbody>
                                {
                                    categories.map(item => (
                                        <tr key={item.id}>
                                            <td>
                                                {i18n.language === "en" ? item.title : item.titleArabic}
                                            </td>
                                            <td className="text-center">
                                                <div className="custom-control custom-checkbox">
                                                    <input type="checkbox" className="custom-control-input" id="customCheck1" checked={item.published} onChange={() => { }} />
                                                    <label className="custom-control-label" htmlFor="customCheck1"></label>
                                                </div>
                                            </td>
                                            <td className="text-end">
                                                <Link className="btn btn-primary" to={"/admin/categories/edit/" + item.id} title={t("dashboard.edit")} ><MdEdit /> </Link> &nbsp;
                                                <Link className="btn btn-danger" to="#" title={t("dashboard.delete")} onClick={e => deleteCategory(item.id)} ><MdDelete /></Link>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default ListCategories;