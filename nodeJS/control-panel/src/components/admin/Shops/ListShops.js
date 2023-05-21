import React,{ useState, useEffect } from 'react'
import { getShops, removeShop } from './ShopsAPI'
import { Link } from 'react-router-dom'
import { useTranslation } from "react-i18next"
import { MdLocalDining, MdEdit, MdDelete, MdBuild } from "react-icons/md";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThreeDots } from  'react-loader-spinner';


const ListShops = () => {
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(false);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        setLoading(true);
        getShops().then(res => {
            console.log(res.data);
            setShops(res.data);
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

    const deleteShop = (id) => {
        removeShop(id).then(res => {
            setShops(shops.filter(s => s.id != id));
        });
    }

  
    return (
        <div className="conatiner">
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title"><MdBuild /> {t("sidebar.shops")} <Link className="btn btn-outline-primary btn-sm" to={"/admin/shops/create"}>+</Link>
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
                    <table className="table   table-hover">
                        <thead>
                            <tr>
                                <th>
                                    #
                                </th>
                                <th>
                                    {t("dashboard.title")}
                                </th>
                                <th className="text-center">
                                    {t("dashboard.published")}
                                </th>
                                <th></th>

                            </tr>
                        </thead>
                        <tbody>
                            {
                                shops.map(item => (
                                    <tr key={item.id}>
                                        <td> {item.id}</td>
                                        <td>
                                            {i18n.language === "en" ? item.name.english : item.name.arabic}
                                        </td>
                                        <td className="text-center">
                                            <div className="custom-control custom-checkbox">
                                                <input type="checkbox" className="custom-control-input" id="customCheck1" checked={item.published} onChange={()=>{}} />
                                                <label className="custom-control-label" htmlFor="customCheck1"></label>
                                            </div>
                                        </td>
                                        <td className="text-end">
                                        
                                            <Link className="btn btn-primary" to={"/admin/shop-menu/" + item.id} title={t("dashboard.editMenu")}> <MdLocalDining /> </Link> &nbsp;
                                            <Link className="btn btn-primary" to={"/admin/shops/edit/" + item.id} title={t("dashboard.edit")}> <MdEdit /> </Link> &nbsp;
                                            <Link className="btn btn-danger" to="#" title={t("dashboard.delete")} onClick={e => deleteShop(item.id)}> <MdDelete /> </Link>
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

export default ListShops;