import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from "react-i18next"
import { toast } from 'react-toastify'
import Loader from "react-loader-spinner"
import { getAllProductCategoriesWithCounts } from './ProductCategoriesAPI';
import { getLocalizedText } from '../utils/utils'
import { hasPermission } from '../utils/auth';


const ShowProductCategories = ({ onPrev }) => {

    let navigate = useNavigate();



    const [contentLocale, setContentLocale] = useState('en');
    const [loading, setLoading] = useState(false);
    const { t, i18n } = useTranslation();
    const [categories, setCategories] = useState([]);



    const setLocalTextValue = (textObject, newValue) => {
        if (contentLocale == 'en') {
            textObject.english = newValue;
        } else if (contentLocale == 'ar') {
            textObject.arabic = newValue;
        } else if (contentLocale == 'tr') {
            textObject.turkish = newValue;
        }
    }





    useEffect(() => {

        getAllProductCategoriesWithCounts().then(res => {
            setCategories(res.data);
        }).catch(e => {

        });

    }, []);






    const subCategories = (catId) => {

        if (categories) {
            console.log("catID => " + catId);
            return categories.filter(c => c.parentId && c.parentId == catId);
        } else {
            return [];
        }
    }

    const mainCategories = () => {
        if (categories) {
            return categories.filter(c => c.parentId == null);
        } else {
            return [];
        }
    }












    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">  {t("Categories")}</h5>
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
                    <h4></h4>

                    <hr />

                    {mainCategories().map(c => (
                        <div className='row'>
                            <div className='col'>
                                <div className='row p-2' style={{ backgroundColor: '#2c3e50', color: '#fff' }}>
                                    <div className='col col-6'>
                                        <h5 style={{ color: '#fff' }}>* {c.name} ({c.productsCount} Products)</h5>
                                    </div>
                                    <div className='col col-6 text-right'>
                                        {c._id}
                                    </div>

                                </div>
                                <div className='row p-2' >
                                    {subCategories(c._id).map(sc => (

                                        <div className="col col-12">
                                            <table className='table table-sm' style={{ border: 'solid 2px #888' }}>
                                                <tr style={{ backgroundColor: '#007791', color: '#fff' }}>
                                                    <th >
                                                        ** {sc.name} ({sc.productsCount} Products)
                                                    </th>
                                                    <th className='text-right'>
                                                        {sc._id}
                                                    </th>
                                                </tr>
                                                {subCategories(sc._id).map(sc2 => (<tr>

                                                    <td>
                                                        *** {sc2.name} ({sc2.productsCount} Products)
                                                    </td>
                                                    <td className='text-right'>
                                                        {sc2._id}
                                                    </td>
                                                </tr>))}
                                            </table>
                                        </div>

                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}





                    <div className="mb-3 row col justify-content-end" >
                        <Link className="btn btn-warning" to='/admin/companies' >{t("dashboard.cancel")}</Link> &nbsp;
                        <button type="button" className="btn btn-primary" >{t("dashboard.submit")}</button>
                    </div>
                </form>
            </div>


        </div>
    )
}


export default ShowProductCategories;