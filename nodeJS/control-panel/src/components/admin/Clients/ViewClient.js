import React,{ useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { getUser, updateUser } from './ClientsAPI'
import { useTranslation } from "react-i18next"
import { toast } from 'react-toastify'
import Loader from "react-loader-spinner"
import { MdPerson } from "react-icons/md";
import UploadImage from '../Images/UploadImage';
import { hasPermission } from '../utils/auth';

const ViewClient = (props) => {

    let navigate = useNavigate();
    if(!hasPermission('users.view')){
        navigate("/admin/clients", { replace: true });
    }

    const [user, setUser] = useState({});
    const [companies, setCompanies] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const {userId} = useParams();
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

    const updateActive = (event) => {
        let cloned = JSON.parse(JSON.stringify(user));
        cloned.active = event.target.checked;
        setUser(cloned);
    }

    useEffect(() => {
        getUser(userId).then(res => {
            if (!res.data.roles) {
                res.data.roles = [];
            }
            setUser(res.data);
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

                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">{t("users.userName")} </label>
                                <input type="text" className="form-control" id="name" name="name" value={user.name} onChange={updateName} />

                            </div>

                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">{t("users.phone")} </label>
                                <input type="text" className="form-control" id="phone" name="phone" value={user.phone} onChange={updatePhone} />

                            </div>


                            <div className="mb-3">
                                <label htmlFor="email" className="form-label" >{t("users.email")} </label>
                                <input type="text" className="form-control" id="email" name="email" value={user.email} readonly='true' />

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
                        </div>
                        <div className='col col-4'>
                           
                        </div>
                    </div>
                </form>
            </div>


        </div>
    )
}


export default ViewClient;