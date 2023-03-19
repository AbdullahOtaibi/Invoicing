import React, { useState, useEffect } from 'react'
import { getArticles, removeArticle } from './ArticlesAPI'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from "react-i18next"
import { MdDescription, MdEdit, MdDelete, MdAdd } from "react-icons/md";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "react-loader-spinner";
import { getLocalizedText } from '../utils/utils';
import { hasPermission } from '../utils/auth';
import { Helmet } from 'react-helmet';

const ListArticles = () => {
    let navigate = useNavigate();
    if (!hasPermission('articles.view')) {
        navigate("/admin", { replace: true });
    }

    const [articles, setArticles] = useState([]);

    useEffect(() => {
       // var nums = [1, 2, 3, 4, 5, 6];
       
       // var nums2 = [...nums, 7, 8, 9];
       // console.log(nums2);
    }, []);


    
    const [loading, setLoading] = useState(false);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        setLoading(true);
        getArticles().then(res => {

            setArticles(res.data);
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

    const deleteArticle = (id) => {
        removeArticle(id).then(res => {
            setArticles(articles.filter(a => a._id != id));
        });
    }


    return (
        <div className="conatiner">
            <Helmet>
                <title> Invoicing | Admin | {t("dashboard.articles")}</title>
            </Helmet>
            <div className="card">
                <div className="card-body">


                    <div className='row'>
                        <div className='col-md-8 col-sm-6'>
                            <h5 className="card-title"><MdDescription /> {t("dashboard.articles")}
                                &nbsp;
                            </h5>
                        </div>

                        <div className='col-md-4 col-sm-6' style={{ textAlign: 'end' }}>
                            {hasPermission('articles.modify') ? (<Link className="add-btn" to={"/admin/articles/create"}><MdAdd size={20} />  {t("dashboard.add")}</Link>) : null}
                        </div>
                    </div>


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
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                                <tr>

                                    <th>
                                        {t("dashboard.title")}
                                    </th>
                                    <th>
                                        {t("dashboard.alias")}
                                    </th>
                                    <th className="text-center">
                                        {t("dashboard.published")}
                                    </th>
                                    <th></th>

                                </tr>
                            </thead>
                            <tbody>
                                {
                                    articles.map(item => (
                                        <tr key={item._id}>

                                            <td>
                                                <a href={"/page/" + item.alias} target="_blank">
                                                    {getLocalizedText(item.title, i18n)}
                                                </a>

                                            </td>
                                            <td>
                                                {item.alias}
                                            </td>
                                            <td className="text-center">
                                                <div className="custom-control custom-checkbox">
                                                    <input type="checkbox" className="custom-control-input" id="customCheck1" checked={item.published} onChange={() => { }} />
                                                    <label className="custom-control-label" htmlFor="customCheck1"></label>
                                                </div>
                                            </td>
                                            <td className="row justify-content-end">
                                                <Link className="btn btn-primary" to={"/admin/articles/edit/" + item._id} title={t("dashboard.edit")}> <MdEdit /> </Link> &nbsp;
                                                <Link className="btn btn-danger" to="#" title={t("dashboard.delete")} onClick={e => deleteArticle(item._id)}> <MdDelete /> </Link>
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

export default ListArticles;