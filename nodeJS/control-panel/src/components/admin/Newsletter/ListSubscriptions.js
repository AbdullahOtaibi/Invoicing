import React,{ useState, useEffect } from 'react'
import { getSubscriptions, removeSubscription } from './NewsletterAPI'
import { Link } from 'react-router-dom'
import { useTranslation } from "react-i18next"
import { MdDelete, MdNotificationsActive } from "react-icons/md";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "react-loader-spinner";

const ListSubscriptions = () => {

    const [model, setModel] = useState([]);
    const [loading, setLoading] = useState(false);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        setLoading(true);
        getSubscriptions().then(res => {

            setModel(res.data);
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

    const deleteSubscription = (email) => {
        removeSubscription(email).then(res => {
            setModel(model.filter(a => a.email != email));
        });
    }


    return (
        <div className="conatiner">
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title"> <MdNotificationsActive /> {t("sidebar.newsletter")}</h5>
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
                                        #
                                    </th>
                                    <th>
                                        {t("signin.email")}
                                    </th>

                                    <th></th>

                                </tr>
                            </thead>
                            <tbody>
                                {
                                    model.map(item => (
                                        <tr key={item.id}>
                                            <td> {item.id}</td>
                                            <td>
                                                {item.email}
                                            </td>

                                            <td className="row justify-content-end">
                                                <Link className="btn btn-danger" to="#" title={t("dashboard.delete")} onClick={e => deleteSubscription(item.email)}> <MdDelete /> </Link>
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

export default ListSubscriptions;