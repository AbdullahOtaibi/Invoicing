import React,{ useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { getUserRole, updateUserRole, getAllPermissions } from './UsersAPI'
import { useTranslation } from "react-i18next"
import { toast } from 'react-toastify'
import { ThreeDots } from  'react-loader-spinner'
import { MdPerson, MdCheckBoxOutlineBlank, MdCheckBox } from "react-icons/md";
import LocalizedTextEditor from '../Shared/LocalizedTextEditor';
import { hasPermission } from '../utils/auth';

const EditRole = (props) => {

    let navigate = useNavigate();
    if(!hasPermission('users.modify')){
        navigate("/admin/users", { replace: true });
    }

    const [role, setRole] = useState({ name: {} });
    const [permissions, setPermissions] = useState([]);
    const [contentLocale, setContentLocale] = useState('en');
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const { roleId } = useParams();
    const updateRoleName = (newValue, locale) => {
        setContentLocale(locale);
        console.log("EditProduct - newValue: " + newValue + ", locale: " + locale);
        let cloned = JSON.parse(JSON.stringify(role));
        setLocalTextValue(cloned.name, newValue);
        setRole(cloned);
    }

    const setLocalTextValue = (textObject, newValue) => {
        if (contentLocale == 'en') {
            textObject.english = newValue;
        } else if (contentLocale == 'ar') {
            textObject.arabic = newValue;
        } else if (contentLocale == 'tr') {
            textObject.turkish = newValue;
        }
    }

    const changeLocale = (newLocale) => {
        setContentLocale(newLocale);
    }

    useEffect(() => {
        getUserRole(roleId).then(res => {
            setRole(res);
        }).catch(e => { });
        getAllPermissions().then(res => {
            setPermissions(res);
        }).catch(e => { });
    }, []);




    const permissionSelected = permissionId => {
        let permission = role.permissions.filter(p => p == permissionId).length;
        console.log(permission);
        if (permission > 0) {
            return true;
        } else {
            return false;
        }
    }

    const textClass = permissionId => {
        let permission = role.permissions.filter(p => p == permissionId).length;
        console.log(permission);
        if (permission > 0) {
            return 'text-success';
        } else {
            return 'text-secondary';
        }
    }

    const togglePermission = permissionId => {
        let cloned = JSON.parse(JSON.stringify(role));
        let permission = role.permissions.filter(p => p == permissionId).length;
        if (permission > 0) {
            cloned.permissions = cloned.permissions.filter(p => p != permissionId);
        } else {
            cloned.permissions.push(permissionId);
        }
        setRole(cloned);
    }


    const doPost = data => {
        setLoading(true);
        updateUserRole(role).then(res => {
            toast.success(t("succeed"));
            window.location.href = "/admin/users/roles";
        }).catch(e => {

        })
        console.log(role);
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
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">{t("users.role")}</label>
                        <LocalizedTextEditor placeholder={t("role.name")} locale={contentLocale} textObject={role.name}
                            onLocalChanged={changeLocale} onChange={updateRoleName} />
                    </div>

                    <div className="mb-3">
                        <h5>Permissions:</h5>
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>

                                        <th>
                                            Permission
                                        </th>
                                        <th>

                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        permissions.map(p => (
                                            <tr >
                                                <td className={textClass(p._id)}>
                                                    {permissionSelected(p._id) ? (<button type="button" className="btn btn-sm" onClick={() => { togglePermission(p._id) }}> <MdCheckBox /></button>) : (<button type="button" className="btn btn-sm" onClick={() => { togglePermission(p._id) }}> <MdCheckBoxOutlineBlank /></button>)}
                                                    &nbsp;&nbsp;

                                                    {p.name.english}
                                                </td>

                                                <td>




                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>


                    <div className="mb-3 row col justify-content-end" >
                        <Link className="btn btn-warning" to='/admin/users/roles' >{t("dashboard.cancel")}</Link> &nbsp;
                        <button type="button" className="btn btn-primary" onClick={doPost}>{t("dashboard.submit")}</button>
                    </div>
                </form>
            </div>


        </div>
    )
}


export default EditRole;