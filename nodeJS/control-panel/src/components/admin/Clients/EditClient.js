import React,{ useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { getUser, updateUser } from './ClientsAPI'
import { getCountries } from '../../../services/CountriesService'
import { useTranslation } from "react-i18next"
import { toast } from 'react-toastify'
import Loader from "react-loader-spinner"
import { MdPerson } from "react-icons/md";
import UploadImage from '../Images/UploadImage';
import { hasPermission } from '../utils/auth';

const EditClient = (props) => {

    let navigate = useNavigate();
    if(!hasPermission('users.modify')){
        navigate("/admin/clients", { replace: true });
    }

    const [user, setUser] = useState({ contactDetails: {} });
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const { userId } = useParams();
    
  
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

    useEffect(() => {
        getCountries().then(res => {
            setCountries(res.data);
        }).catch(e => {
            console.log(e);
        });

        getUser(userId).then(res => {
            if (!res.data.roles) {
                res.data.roles = [];
            }
            if (!res.data.contactDetails) {
                res.data.contactDetails = {};
            }
            setUser(res.data);
        });


    }, []);





    const imageUploaded = uploadedImage => {
        let cloned = JSON.parse(JSON.stringify(user));
        cloned.avatarUrl = uploadedImage.url;
        setUser(cloned);

    }




    const doPost = data => {
        setLoading(true);
        updateUser(user).then(res => {
            toast.success(t("succeed"));
            window.location.href = "/admin/clients";
        }).catch(e => {

        })
        console.log(user);
        console.log(data);
    }


    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title"><MdPerson /> {t("clients.editClient")}</h5>
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
                        <div className='col col-8'>


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



                            <div className="mb-3 form-check">
                                <div className="custom-control custom-checkbox">
                                    <input type="checkbox" className="custom-control-input" id="publishedCheck" checked={user.active} onChange={updateActive} />
                                    <label className="custom-control-label" htmlFor="publishedCheck">{t("users.active")}</label>
                                </div>
                            </div>
                            <div className="mb-3 row col justify-content-end" >
                                <Link className="btn btn-warning" to='/admin/clients' >{t("dashboard.cancel")}</Link> &nbsp;
                                <button type="button" className="btn btn-primary" onClick={doPost}>{t("dashboard.submit")}</button>
                            </div>
                        </div>
                        <div className='col col-4'>

                        </div>
                    </div>
                </form>
            </div>


        </div>
    )
}


export default EditClient;