import React, { useState, useEffect } from 'react'
import { getAllModules } from './ModulesAPI'
import { Link } from 'react-router-dom'
import { useTranslation } from "react-i18next"
import { MdEdit, MdDelete, MdBurstMode, MdAdd } from "react-icons/md";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThreeDots } from  'react-loader-spinner';
import { getLocalizedText } from '../utils/utils';
import { hasPermission } from '../utils/auth';


const ListModules = () => {

    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(false);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        setLoading(true);
        getAllModules({}).then(data => {

            setModules(data.items);
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


    return (
        <div className="conatiner">
            <div className="card">
                <div className="card-body">


                    <div className='row'>
                        <div className='col-md-8 col-sm-6'>
                            <h5 className="card-title"><MdBurstMode /> {t("sidebar.modules")}
                                &nbsp;
                            </h5>
                        </div>

                        <div className='col-md-4 col-sm-6' style={{ textAlign: 'end' }}>
                            {hasPermission('articles.modify') ? (<Link className="add-btn" to={"/admin/modules/create"}><MdAdd size={20} />  {t("dashboard.add")}</Link>) : null}
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
                        <table className="table   table-hover">
                            <thead>
                                <tr>

                                    <th>
                                        Module Name
                                    </th>
                                    <th>
                                        Code
                                    </th>
                                    <th className="text-center">
                                        Enabled
                                    </th>


                                    <th></th>

                                </tr>
                            </thead>
                            <tbody>
                                {
                                    modules ? modules.map(item => (
                                        <tr key={item._id}>
                                            <td>
                                                {getLocalizedText(item.name, i18n)}
                                            </td>
                                            <td>
                                                <Link to={"/admin/modules/" + item._id}>
                                                    {item.code}
                                                </Link>

                                            </td>

                                            <td className="text-center">
                                                {item.enabled.toString()}
                                            </td>
                                            <td className="text-end">
                                                <Link className="btn btn-primary" to={"/admin/modules/edit/" + item._id} title={t("dashboard.edit")}> <MdEdit /> </Link> &nbsp;
                                                <Link className="btn btn-danger" to="#" title={t("dashboard.delete")} > <MdDelete /> </Link>
                                            </td>
                                        </tr>
                                    )) : null
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>




        </div>
    )
}


export default ListModules;