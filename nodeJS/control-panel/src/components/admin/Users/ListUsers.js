import React,{ useState, useEffect } from 'react'
import { getUsers, removeUser, getUsersBycompany } from './UsersAPI'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from "react-i18next"
import { MdAdd, MdEdit, MdDelete, MdAccountCircle } from "react-icons/md";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "react-loader-spinner";
import { getCompanies } from '../Companies/CompaniesAPI'
import { hasPermission } from '../utils/auth';

const ListUsers = (props) => {

    let navigate = useNavigate();
    if(!hasPermission('users.view')){
        navigate("/admin", { replace: true });
    }

    const [users, setUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const {companyId} = useParams();
    const usercompanyId = localStorage.getItem("companyId");
    const userRole = localStorage.getItem("role");

    useEffect(() => {
        setLoading(true);
        if(companyId && userRole != "Administrator"){
            getUsersBycompany(usercompanyId).then(res => {
                if(!res.data){
                    res.data = [];
                }
                setUsers(res.data);
                setAllUsers(res.data);
            }).catch(error => {
    
            })
        }else
        if(companyId && companyId != 0 && userRole == "Administrator"){

            getUsersBycompany(companyId).then(res => {
                if(!res.data){
                    res.data = [];
                }
                setUsers(res.data);
                setAllUsers(res.data);
                setLoading(false);
            }).catch(e => {
                setLoading(false);
                if (e.response && e.response.status === 403) {
                    window.location.href = "/admin/sign-in"
                }
                toast.error(e.message);
            })
            
            
        }
        else{
            getUsers().then(res => {
                if(!res.data){
                    res.data = [];
                }
                setUsers(res.data);
                setAllUsers(res.data);
                setLoading(false);
            }).catch(e => {
                setLoading(false);
                if (e.response && e.response.status === 403) {
                    window.location.href = "/admin/sign-in"
                }
                toast.error(e.message);
            })
        }
        




       

        getCompanies().then(res => {
            setCompanies(res.data);
        })
    }, []);

    const deleteUser = (id) => {
        removeUser(id).then(res => {
            setUsers(users.filter(a => a._id != id));
            setAllUsers(allUsers.filter(a => a._id != id));
        });
    }

    const filterBycompanyId = event => {
       
        if( event.target.value){
        setUsers(allUsers.filter(a => a.company == event.target.value));
        }else{
            setUsers(allUsers);
        }
    }

    const filterByUserName = event => {
       
        if( event.target.value){
        setUsers(allUsers.filter(a => ("" + a.firstName + " " + a.surName).toUpperCase().indexOf(event.target.value.toUpperCase()) != -1));
        }else{
            setUsers(allUsers);
        }
    }

    const filterByEmail = event => {
       
        if( event.target.value){
        setUsers(allUsers.filter(a => a.email.toUpperCase().indexOf(event.target.value.toUpperCase()) != -1));
        }else{
            setUsers(allUsers);
        }
    }

    return (
        <div className="conatiner">
            <div className="card">
                <div className="card-body">
                    


                    <div className='row'>
                        <div className='col-md-8 col-sm-6'>
                            <h5 className="card-title"><MdAccountCircle /> {t("dashboard.users")}
                                &nbsp;
                            </h5>
                        </div>

                        <div className='col-md-4 col-sm-6' style={{textAlign:'end'}}>
                        <Link to="/admin/users/roles" className="add-btn"> Roles </Link>
                        &nbsp;
                            {hasPermission('users.modify') ? (<Link className="add-btn" to={"/admin/users/create"}><MdAdd size={20}/>  {t("dashboard.add")}</Link>) : null}
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
                                    {t("users.userName")}
                                </th>
                                <th> {t("users.email")} </th>

                                <th className="text-center">
                                    {t("users.active")}
                                </th>

                                <th></th>

                            </tr>
                            <tr>

                                <th>
                                    <input type='text' className='form-control' placeholder={t("users.userName")} onChange={filterByUserName} />
                                </th>
                                <th>
                                    <input type='text' className='form-control' placeholder={t("users.email")} onChange={filterByEmail} />
                                </th>

                                <th className="text-center">
                                    <select className='form-control' onChange={filterBycompanyId} >
                                        <option value=''>All companies</option>
                                        {companies.map(v => (
                                            <option value={v._id} key={v._id}>{v.name.english}</option>
                                        ))}
                                    </select>

                                    
                                    
                                </th>

                                <th></th>

                            </tr>
                        </thead>
                        <tbody>
                            {
                                users.map(item => (
                                    <tr key={item._id}>
                                        <td>
                                            {item.firstName} {item.surName}
                                        </td>
                                        <td >
                                            {item.email}
                                        </td>
                                        <td className="text-center">
                                            <div className="custom-control custom-checkbox">
                                                <input type="checkbox" className="custom-control-input" id="customCheck1" checked={item.active} onChange={() => { }} />
                                                <label className="custom-control-label" htmlFor="customCheck1"></label>
                                            </div>
                                        </td>
                                        <td className="row justify-content-end">
                                            <Link className="btn btn-primary" to={"/admin/users/edit/" + item._id} title={t("dashboard.edit")}> <MdEdit /> </Link> &nbsp;
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

export default ListUsers;