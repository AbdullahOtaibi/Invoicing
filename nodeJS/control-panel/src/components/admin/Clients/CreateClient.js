import React,{ useState, useEffect, useReducer } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createUser } from './ClientsAPI'
import { useTranslation } from "react-i18next"
import { toast } from 'react-toastify'
import Loader from "react-loader-spinner"
import { getCountries } from '../../../services/CountriesService'
import {  MdPerson } from "react-icons/md";
import { hasPermission } from '../utils/auth';

const CreateClient = (props) => {

    let navigate = useNavigate();
    if(!hasPermission('users.modify')){
        navigate("/admin/clients", { replace: true });
    }

    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const [countries, setCountries] = useState([]);

    const updateName = (event) => {
        let cloned = JSON.parse(JSON.stringify(user));
        cloned.name = event.target.value;
        setUser(cloned);
    }
    const updateEmail = (event) => {
        let cloned = JSON.parse(JSON.stringify(user));
        cloned.email = event.target.value;
        setUser(cloned);
    }

    const updatePassword = (event) => {
        let cloned = JSON.parse(JSON.stringify(user));
        cloned.password = event.target.value;
        setUser(cloned);
    }

    const updatecompany = (event) => {
        let cloned = JSON.parse(JSON.stringify(user));
        cloned.company = event.target.value;
        setUser(cloned);
    }

    const updateFirstName = (event) => {
        let cloned = JSON.parse(JSON.stringify(user));
        cloned.firstName = event.target.value;
        setUser(cloned);
    }

    const updateSurName = (event) => {
        let cloned = JSON.parse(JSON.stringify(user));
        cloned.surName = event.target.value;
        setUser(cloned);
    }




    const updatePhone = (event) => {
        let cloned = JSON.parse(JSON.stringify(user));
        cloned.phone = event.target.value;
        setUser(cloned);
    }

    const updateAddress = (event) => {
        let cloned = JSON.parse(JSON.stringify(user));
        cloned.address = event.target.value;
        setUser(cloned);
    }

    const updateCountryCode = (event) => {
        let cloned = JSON.parse(JSON.stringify(user));
        cloned.countryCode = event.target.value;
        setUser(cloned);
    }

    const updateActive = (event) => {
        let cloned = JSON.parse(JSON.stringify(user));
        cloned.active = event.target.checked;
        setUser(cloned);
    }






    const imagesUpdated = imgs => {
        console.log(imgs);
        let cloned = JSON.parse(JSON.stringify(user));
        if (imgs != null && imgs.length > 0) {
            cloned.url = imgs[0].url;
        } else {
            cloned.url = null;
        }
        setUser(cloned);
    }


    useEffect(() => {
        getCountries().then(res => {
            setCountries(res.data);
        }).catch(e => {
            console.log(e);
        });

    }, []);

    const doPost = data => {
        setLoading(true);
        createUser(user).then(res => {
            setLoading(false);
            toast.success(t("succeed"));
            window.location.href = "/admin/clients";
        }).catch(e => {
            setLoading(false);
        })
        console.log(user);
        console.log(data);
    }


    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title"><MdPerson /> {t("clients.createClient")}</h5>
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

                    <div className='row'>
                        <div className="mb-3 col-6">
                            <label htmlFor="firstName" className="form-label">{t("users.firstName")} </label>
                            <input type="text" className="form-control" id="firstName" name="firstName" value={user.firstName} onChange={updateFirstName} />
                        </div>

                        <div className="mb-3 col-6">
                            <label htmlFor="surName" className="form-label">{t("users.surName")} </label>
                            <input type="text" className="form-control" id="surName" name="surName" value={user.surName} onChange={updateSurName} />
                        </div>

                    </div>

                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">{t("users.phone")} </label>
                        <input type="text" className="form-control" id="phone" name="phone" value={user.phone} onChange={updatePhone} />

                    </div>

                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">{t("users.email")} </label>
                        <input type="email" className="form-control" id="email" name="email" value={user.email} onChange={updateEmail} />

                    </div>






                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">{t("users.password")} </label>
                        <input type="text" className="form-control" id="password" name="password" value={user.password} onChange={updatePassword} />

                    </div>

                    <div className="mb-3">
                        <label htmlFor="address" className="form-label">{t("users.address")} </label>
                        <input type="text" className="form-control" id="address" name="address" value={user.address} onChange={updateAddress} />

                    </div>
                    <div className="mb-3">

                        <label className="labels">{t("users.country")}</label>
                        <select className="form-control" placeholder={t("users.country")}
                            value={user.countryCode} onChange={updateCountryCode} >
                            {countries.map(country => (<option key={country.code} value={country.code}>
                                {country.name.english}
                            </option>))}
                        </select>

                    </div>


                    <div className="mb-3 form-check">
                        <div className="custom-control custom-checkbox">
                            <input type="checkbox" className="custom-control-input" id="publishedCheck" checked={user.active} onChange={updateActive} />
                            <label className="custom-control-label" htmlFor="publishedCheck">{t("users.active")}</label>
                        </div>
                    </div>






                    <div className="mb-3 row col justify-content-end" >
                        <Link className="btn btn-warning" to='/admin/users' >{t("dashboard.cancel")}</Link> &nbsp;
                        <button type="button" className="btn btn-primary" onClick={doPost}>{t("dashboard.submit")}</button>
                    </div>
                </form>
            </div>


        </div>
    )
}


export default CreateClient;