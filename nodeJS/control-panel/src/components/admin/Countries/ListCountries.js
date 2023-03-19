import React,{ useState, useEffect } from 'react'
import { getCountries, removeCountry, initCountries } from './CountriesAPI'
import { Link } from 'react-router-dom'
import { useTranslation } from "react-i18next"
import { MdDescription, MdEdit, MdDelete, MdBuild } from "react-icons/md";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "react-loader-spinner";


const ListCountries = () => {
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(false);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        // initCountries();
        setLoading(true);
        getCountries().then(res => {

            setCountries(res.data);
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

    const deleteCountry = (id) => {
        removeCountry(id).then(res => {
            setCountries(countries.filter(p => p.id != id));
        });
    }


    return (
        <div className="conatiner">
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title"><MdBuild /> {t("sidebar.countries")} <Link className="btn btn-outline-primary btn-sm" to={"/admin/countries/create"}>+</Link>
                    </h5>
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
                                        #
                                    </th>
                                    <th>
                                        {t("dashboard.title")}
                                    </th>

                                    <th></th>

                                </tr>
                            </thead>
                            <tbody>
                                {
                                    countries.map(item => (
                                        <tr key={item.code}>
                                            <td> {item.code}</td>
                                            <td>
                                                {i18n.language === "en" ? item.name.english : item.name.arabic}
                                            </td>

                                            <td className="row justify-content-end">
                                                <Link className="btn btn-primary" to={"/admin/countries/edit/" + item._id} title={t("dashboard.edit")}> <MdEdit /> </Link> &nbsp;
                                                <Link className="btn btn-danger" to="#" title={t("dashboard.delete")} onClick={e => deleteCountry(item._id)}> <MdDelete /> </Link>
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

export default ListCountries;