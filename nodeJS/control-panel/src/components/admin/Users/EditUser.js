import React, { useState, useEffect, useReducer } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { getUser, updateUser, getAllRoles } from './UsersAPI'
import { useTranslation } from "react-i18next"
import { toast } from 'react-toastify'
import { ThreeDots } from  'react-loader-spinner'
import { MdPerson, MdCheckBoxOutlineBlank, MdCheckBox } from "react-icons/md";
import { getCompanies } from '../Companies/CompaniesAPI';
import UploadImage from '../Images/UploadImage';
import { getCountries } from '../../../services/CountriesService'
import { getShippingCompanies } from '../../../services/ShippingCompaniesService'
import { hasPermission } from '../utils/auth';

const EditUser = (props) => {

    let navigate = useNavigate();
    if (!hasPermission('users.modify')) {
        navigate("/admin/users", { replace: true });
    }

    const [user, setUser] = useState({});
    const [companies, setCompanies] = useState([]);
    const [shippingCompanies, setShippingCompanies] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const { userId } = useParams();
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

    const updatePhone = (event) => {
        let cloned = JSON.parse(JSON.stringify(user));
        cloned.phone = event.target.value;
        setUser(cloned);
    }




    const updatecompany = (event) => {
        let cloned = JSON.parse(JSON.stringify(user));
        cloned.company = event.target.value;
        setUser(cloned);
    }

    const updateShippingCompany = (event) => {
        let cloned = JSON.parse(JSON.stringify(user));
        cloned.shippingCompany = event.target.value;
        setUser(cloned);
    }




    const updateActive = (event) => {
        let cloned = JSON.parse(JSON.stringify(user));
        cloned.active = event.target.checked;
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

    useEffect(() => {

        getCountries().then(res => {
            setCountries(res.data);
        }).catch(e => {
            console.log(e);
        });

        getShippingCompanies().then(data => {
            setShippingCompanies(data);
        }).catch(e => {
            console.log(e);
        });

        getUser(userId).then(res => {
            if (!res.data.roles) {
                res.data.roles = [];
            }
            setUser(res.data);
        });

        getCompanies().then(res => {
            console.log(res.data);
            setCompanies(res.data);
            setLoading(false);
        }).catch(e => {

        });

        getAllRoles().then(res => {
            setRoles(res.data);
        });

    }, []);



    const roleSelected = roleId => {
        let role = user.roles.filter(p => p == roleId).length;
        console.log(role);
        if (role > 0) {
            return true;
        } else {
            return false;
        }
    }


    const imageUploaded = uploadedImage => {
        let cloned = JSON.parse(JSON.stringify(user));
        cloned.avatarUrl = uploadedImage.url;
        setUser(cloned);

    }

    const toggleRole = roleId => {
        let cloned = JSON.parse(JSON.stringify(user));
        let role = user.roles.filter(p => p == roleId).length;
        if (role > 0) {
            cloned.roles = cloned.roles.filter(p => p != roleId);
        } else {
            cloned.roles.push(roleId);
        }
        setUser(cloned);
    }


    const doPost = data => {
        setLoading(true);
        updateUser(user).then(res => {
            toast.success(t("succeed"));
            window.location.href = "/admin/users";
        }).catch(e => {

        })
        console.log(user);
        console.log(data);
    }


    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title"><MdPerson /> {t("users.editUser")}</h5>
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
                        <div className='col col-8'>

                            {/* <br /><br />

                            {'/activate-account/' + user._id + "/" + user.otp}
                            <br /><br /> */}
                            <div className="mb-3">
                                <img src={user.avatarUrl ? "/uploads/" + user.avatarUrl : "/images/no-image.png"} style={{ width: '200px', hwight: '200px' }} />
                                <br /><br />
                                <UploadImage handleUpload={imageUploaded} />
                            </div>
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
                                <label htmlFor="email" className="form-label" >{t("users.email")} </label>
                                <input type="text" className="form-control" id="email" name="email" value={user.email} readonly='true' />

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
                                <label htmlFor="company" className="form-label">{t("users.company")} </label>
                                <select type="text" className="form-control" id="company" name="company" value={user.company} onChange={updatecompany} >
                                    <option value=''>{t("users.company")}</option>
                                    {companies.map(v => (<option key={v._id} value={v._id}>{v.name.english}</option>))}
                                </select>

                            </div>

                            <div className="mb-3">
                                <label htmlFor="shippingCompany" className="form-label">{t("shipping.shippingCompany")} </label>
                                <select type="text" className="form-control" id="shippingCompany" name="shippingCompany" value={user.shippingCompany}
                                    onChange={updateShippingCompany} >
                                    <option value=''>{t("shipping.shippingCompany")}</option>
                                    {shippingCompanies.map(v => (<option key={v._id} value={v._id}>{v.name.english}</option>))}
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
                        </div>
                        <div className='col col-4'>
                            <h5>{t("users.roles")}</h5>

                            <table className='table'>

                                {roles.map(role => (
                                    <tr>
                                        <td>
                                            {roleSelected(role._id) ? (<button type="button" className="btn btn-sm" onClick={() => { toggleRole(role._id) }}> <MdCheckBox /></button>) : (<button type="button" className="btn btn-sm" onClick={() => { toggleRole(role._id) }}> <MdCheckBoxOutlineBlank /></button>)}
                                            &nbsp;&nbsp;
                                            {role.name.english}
                                        </td>
                                        <td>

                                        </td>
                                    </tr>

                                ))}


                            </table>
                        </div>
                    </div>
                </form>
            </div>


        </div>
    )
}


export default EditUser;