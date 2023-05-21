import React, { useState, useEffect } from 'react'
import { useTranslation } from "react-i18next"
import { MdCollectionsBookmark, MdDelete, MdEdit, MdList, MdInventory, MdAdd } from "react-icons/md"
import { getMainCategoriesWithCounts, getSubCategoriesWithCounts, removeProductCategory, getProductCategory, updateUrls, applyToAllCategories } from './ProductCategoriesAPI'
import { ThreeDots } from  'react-loader-spinner'
import { Link, useNavigate } from 'react-router-dom'
import { getLocalizedText } from '../utils/utils'
import { hasPermission } from '../utils/auth';
import { Helmet } from 'react-helmet'

const ListProductCategories = () => {

    let navigate = useNavigate();
    if (!hasPermission('productCategories.view')) {
        navigate("/admin", { replace: true });
    }

    const { t, i18n } = useTranslation();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [parentId, setParentId] = useState(null);
    const [parentCategory, setParentCategory] = useState(null);


    useEffect(() => {
        getMainCategoriesWithCounts().then(res => {
            setCategories(res.data);
        }).catch(error => {

        })
    }, []);

    const deleteCategory = (id) => {
        removeProductCategory(id).then(res => {
            setCategories(categories.filter(cat => cat.id != id));
        });
    }

    const showMainCategories = () => {
        setParentCategory(null);
        setParentId(null);
        getMainCategoriesWithCounts().then(res => {
            setCategories(res.data);
        }).catch(error => {

        })
    }

    const showSubCategories = (categoryId) => {
        getSubCategoriesWithCounts(categoryId).then(res => {
            setParentId(categoryId);
            setCategories(res.data);
        }).catch(e => { });

        getProductCategory(categoryId).then(res => {
            setParentCategory(res.data);
        }).catch(e => { });
    }

    return (
        <div className="conatiner">
            <Helmet>
                <title> Invoicing | Admin | {t("sidebar.productCategories")}</title>
            </Helmet>

            <div className="card">
                <div className="card-body">

                    <div className='row'>
                        <div className='col-md-8 col-sm-6'>
                            <h5 className="card-title"><MdCollectionsBookmark /> {t("sidebar.productCategories")}
                                &nbsp;
                            </h5>
                        </div>

                        <div className='col-md-4 col-sm-6' style={{ textAlign: 'end' }}>
                            {hasPermission('products.modify') ? (<Link className="add-btn" to={"/admin/product-categories/create"}><MdAdd size={20} />  {t("dashboard.add")}</Link>) : null}
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
                    {parentCategory != null ? (<>
                        <a href="#" onClick={showMainCategories}> {t("mainCategories")} </a> &nbsp; / &nbsp;
                        {getLocalizedText(parentCategory.name, i18n)} 

                        <br /><br />
                    </>) : null}
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
                                                {item.level} - 
                                                {getLocalizedText(item.name, i18n)} ({item.subCategoriesCount})
                                            </td>
                                            <td className="text-center">
                                                <div className="custom-control custom-checkbox">
                                                    <input type="checkbox" className="custom-control-input" id="customCheck1" checked={item.published} onChange={() => { }} />
                                                    <label className="custom-control-label" htmlFor="customCheck1"></label>
                                                </div>
                                            </td>
                                            <td className="text-end">

                                                {!item.parent ? (<Link className="btn btn-primary" to={"#"} title={t("sidebar.categories")} onClick={() => showSubCategories(item._id)} ><MdList /> </Link>) : null}
                                                {item.parent ? (<Link className="btn btn-primary" to={"/admin/products/byCategory/" + item._id} title={t("sidebar.products")}  ><MdInventory /> </Link>) : null}
                                                &nbsp;
                                                <Link className="btn btn-primary" to={"/admin/product-categories/edit/" + item._id} title={t("dashboard.edit")} ><MdEdit /> </Link> &nbsp;
                                                <Link className="btn btn-danger" to="#" title={t("dashboard.delete")} onClick={e => deleteCategory(item._id)} ><MdDelete /></Link>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>

                    {/* <div>
                        <button type='button' className="btn btn-primary" title={t("dashboard.fixUrls")} onClick={updateUrls}><MdEdit /> </button> &nbsp;
                        <button type='button' className="btn btn-primary" title={t("dashboard.generateSerials")} onClick={applyToAllCategories}><MdEdit /> # </button> &nbsp;
                        
                    </div> */}
                </div>
            </div>
        </div>
    )
}

export default ListProductCategories;