import React,{ useState, useEffect } from 'react'
import { getCompanies, removecompany } from './CompaniesAPI'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from "react-i18next"
import { MdEdit, MdDelete, MdAccountCircle, MdGroup, MdInventory, MdAccountTree, MdAdd } from "react-icons/md";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "react-loader-spinner";
import { hasPermission } from '../utils/auth';
import { getLocalizedText } from '../utils/utils'

const ListCompanies = () => {

    let navigate = useNavigate();
    if(!hasPermission('vendors.view')){
        navigate("/admin", { replace: true });
    }

    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(false);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        setLoading(true);
        getCompanies().then(res => {
            console.log(res.data);
            setCompanies(res.data);
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

    const deletecompany = (id) => {
        removecompany(id).then(res => {
            setCompanies(companies.filter(a => a._id != id));
        });
    }


    return (
        <div className="conatiner">
            <div className="card">
                <div className="card-body">
                    <div className='row'>
                        <div className='col-md-8 col-sm-6'>
                            <h5 className="card-title"><MdAccountCircle /> {t("companies.companies")}
                                &nbsp;
                            </h5>
                        </div>

                        <div className='col-md-4 col-sm-6' style={{ textAlign: 'end' }}>
                            {hasPermission('vendors.modify') ? (<Link className="add-btn" to={"/admin/companies/create"}><MdAdd size={20} />  {t("dashboard.add")}</Link>) : null}
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
                                        {t("companies.name")}
                                    </th>
                                    <th> {t("users.email")} </th>
                                    <th className="text-center">
                                        {t("users.active")}
                                    </th>
                                    <th></th>

                                </tr>
                            </thead>
                            <tbody>
                                {
                                    companies.map(item => (
                                        <tr key={item._id}>

                                            <td>
                                                {getLocalizedText(item.name, i18n)}
                                                

                                            </td>
                                            <td>
                                                {item.contactDetails ? item.contactDetails.infoEmail : null}
                                            </td>
                                            <td className="text-center">
                                                <div className="custom-control custom-checkbox">
                                                    <input type="checkbox" className="custom-control-input" id="customCheck1" checked={item.published} disabled />
                                                    <label className="custom-control-label" htmlFor="customCheck1"></label>
                                                </div>
                                            </td>
                                            <td className="justify-content-end" style={{textAlign:'end'}}>
                                                {hasPermission('vendors.modify') ? (<Link className="btn btn-primary" to={"/admin/companies/edit/" + item._id} title={t("dashboard.edit")}> <MdEdit /> </Link>) : null}
                                                &nbsp;

                                                <Link className="btn btn-primary" to={"/admin/products/bycompany/" + item._id} title={t("sidebar.products")}> <MdInventory /> </Link> &nbsp;
                                                <Link className="btn btn-primary" to={"/admin/users/bycompany/" + item._id} title={t("dashboard.users")}> <MdGroup /> </Link> &nbsp;
                                                <Link className="btn btn-primary" to={"/admin/companies/categories/" + item._id} title={t("sidebar.productCategories")}> <MdAccountTree /> </Link> &nbsp;

                                                {hasPermission('vendors.modify') ? (<Link className="btn btn-danger" to="#" title={t("dashboard.delete")} onClick={e => deletecompany(item._id)}> <MdDelete /> </Link>) : null}

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

export default ListCompanies;