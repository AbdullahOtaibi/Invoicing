import React,{ useState, useEffect } from 'react'
import { getShippingCompanies } from './ShippingCompaniesAPI'
import { Link } from 'react-router-dom'
import { useTranslation } from "react-i18next"
import { MdEdit, MdDelete, MdLocalShipping, MdAdd } from "react-icons/md";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "react-loader-spinner";
import { getLocalizedText } from '../utils/utils';
import { hasPermission } from '../utils/auth';


const ListShippingCompanies = () => {
    const [shippingCompanies, setShippingCompanies] = useState([]);
    const [loading, setLoading] = useState(false);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        setLoading(true);
        getShippingCompanies().then(data => {
            console.log(data);
            setShippingCompanies(data);


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

    const deleteShippingCompany = (id) => {
        // removeProject(id).then(res => {
        //     setProjects(projects.filter(p => p.id != id));
        // });
    }


    return (
        <div className="conatiner">
            <div className="card">
                <div className="card-body">


                    <div className='row'>
                        <div className='col-md-8 col-sm-6'>
                            <h5 className="card-title"><MdLocalShipping /> {t("sidebar.shippingCompanies")}
                                &nbsp;
                            </h5>
                        </div>

                        <div className='col-md-4 col-sm-6' style={{ textAlign: 'end' }}>
                            {hasPermission('users.view') ? (<Link className="add-btn" to={"/admin/shippingCompanies/create"}><MdAdd size={20} />  {t("dashboard.add")}</Link>) : null}
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
                        <table className="table   table-hover">
                            <thead>
                                <tr>
                                   
                                    <th>
                                        {t("shipping.companyName")}
                                    </th>
                                    <th className="text-center">
                                        {t("dashboard.published")}
                                    </th>
                                    <th></th>

                                </tr>
                            </thead>
                            <tbody>
                                {
                                    shippingCompanies ? (shippingCompanies.map(item => (
                                        <tr key={item._id}>
                                           
                                            <td>
                                               <Link to={"/admin/shippingCompanies/edit/" + item._id}> {getLocalizedText(item.name, i18n)} </Link>
                                            </td>
                                            <td className="text-center">
                                                <div className="custom-control custom-checkbox">
                                                    <input type="checkbox" className="custom-control-input" id="customCheck1" checked={item.published} onChange={() => { }} />
                                                    <label className="custom-control-label" htmlFor="customCheck1"></label>
                                                </div>
                                            </td>
                                            <td className="justify-content-end"  style={{textAlign:'end'}}>
                                                <Link className="btn btn-primary" to={"/admin/shippingCompanies/edit/" + item._id} title={t("dashboard.edit")}> <MdEdit /> </Link> &nbsp;
                                                <Link className="btn btn-danger" to="#" title={t("dashboard.delete")} onClick={e => deleteShippingCompany(item._id)}> <MdDelete /> </Link>
                                            </td>
                                        </tr>
                                    ))
                                    ) : null}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default ListShippingCompanies;