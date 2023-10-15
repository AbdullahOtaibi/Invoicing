import React,{ useState, useEffect } from 'react'
import {  removeUser, getAllRoles } from './UsersAPI'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from "react-i18next"
import { MdEdit, MdDelete, MdAccountCircle } from "react-icons/md";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThreeDots } from  'react-loader-spinner';
import { hasPermission } from '../utils/auth';

const ListRoles = () => {

    let navigate = useNavigate();
    if(!hasPermission('users.modify')){
        navigate("/admin/users", { replace: true });
    }

    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
       // createTestPermission();
        setLoading(true);
        getAllRoles().then(res => {

            setRoles(res);
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

    const deleteUser = (id) => {
        removeUser(id).then(res => {
            setUsers(users.filter(a => a._id != id));
        });
    }


    return (
        <div className="conatiner">
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title"><MdAccountCircle /> {t("dashboard.roles")}  <Link className="btn btn-outline-primary btn-sm" to={"/admin/users/roles/create"}>+</Link>
                    </h5>
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
                    <table className="table table-hover">
                        <thead>
                            <tr>
                               
                                <th>
                                    {t("users.userName")}
                                </th>
                               
                                
                                <th></th>

                            </tr>
                           
                        </thead>
                        <tbody>
                            {
                                roles.map(item => (
                                    <tr key={item._id}>
                                        <td>
                                            {item.name.english}
                                        </td>
                                       
                                        
                                        <td className="text-end">
                                            <Link className="btn btn-primary" to={"/admin/users/roles/edit/" + item._id} title={t("dashboard.edit")}> <MdEdit /> </Link> &nbsp;
                                            <Link className="btn btn-danger" to="#" title={t("dashboard.delete")} onClick={e => deleteUser(item._id)}> <MdDelete /> </Link>
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

export default ListRoles;