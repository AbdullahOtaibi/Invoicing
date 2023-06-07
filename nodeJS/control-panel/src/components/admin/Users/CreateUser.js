import React,{ useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createUser, getAllRoles } from './UsersAPI'
import { useTranslation } from "react-i18next"
import { toast } from 'react-toastify'
import { ThreeDots } from  'react-loader-spinner'
import { MdPerson } from "react-icons/md";
import { getCompanies } from '../Companies/CompaniesAPI'
import { getCountries } from '../../../services/CountriesService'
import { hasPermission } from '../utils/auth';

const CreateUser = (props) => {

    let navigate = useNavigate();
    if(!hasPermission('users.modify')){
        navigate("/admin/users", { replace: true });
    }

    const [user, setUser] = useState({});
    const [roles, setRoles] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const [countries, setCountries] = useState([]);

  
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

    const updateRole = (event) => {
        let cloned = JSON.parse(JSON.stringify(user));
        cloned.roles = [];
        cloned.roles.push(event.target.value)
       
        setUser(cloned);
    }

    


    const updateActive = (event) => {
        let cloned = JSON.parse(JSON.stringify(user));
        cloned.active = event.target.checked;
        setUser(cloned);
    }



    useEffect(() => {
        setLoading(true);

        getCountries().then(res => {
            setCountries(res.data);
        }).catch(e => {
            console.log(e);
        });

        getAllRoles().then(res => {
            setRoles(res.data);
        });

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

    const doPost = data => {
        setLoading(true);
        createUser(user).then(res => {
            setLoading(false);
            toast.success(t("succeed"));
            window.location.href = "/admin/users";
        }).catch(e => {
            setLoading(false);
        })
        console.log(user);
        console.log(data);
    }


    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title"><MdPerson /> {t("users.createUser")}</h5>
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
                        <label htmlFor="phone" className="form-label">{t("users.phone")} </label>
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

                    <div className="mb-3">

                        <label className="labels">{t("users.roles")}</label>
                        <select className="form-control" placeholder={t("users.roles")}
                            value={user.countryCode} onChange={updateRole} >
                            {roles.map(role => (<option key={role._id} value={role._id}>
                                {role.name.english}
                            </option>))}
                        </select>

                    </div>


                    


                    <div className="mb-3">
                        <label htmlFor="company" className="form-label">{t("users.company")} </label>
                        <select type="text" className="form-control" id="company" name="company" value={user.company} onChange={updatecompany} >
                            <option value=''>{t("users.company")}</option>
                            {companies.map(v => (<option key={v._id} value={v._id}>{v.name.english}</option>))}
                        </select>

                    </div>


                    <div className="mb-3 form-check">
                        <div className="custom-control custom-checkbox">
                            <input type="checkbox" className="custom-control-input" id="publishedCheck" checked={user.active} onChange={updateActive} />
                            <label className="custom-control-label" htmlFor="publishedCheck">{t("users.active")}</label>
                        </div>
                    </div>






                    <div className="mb-3 text-end col justify-content-end" >
                        <Link className="btn btn-warning" to='/admin/users' >{t("dashboard.cancel")}</Link> &nbsp;
                        <button type="button" className="btn btn-primary" onClick={doPost}>{t("dashboard.submit")}</button>
                    </div>
                </form>
            </div>


        </div>
    )
}


export default CreateUser;