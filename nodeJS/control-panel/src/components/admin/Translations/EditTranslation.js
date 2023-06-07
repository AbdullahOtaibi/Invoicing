import React, { useState, useEffect } from 'react'
import { useTranslation } from "react-i18next"
import { MdSettings, MdOutlineDeviceHub, MdSave, MdClose } from "react-icons/md";
import { toast } from 'react-toastify'
import { getTranslation } from './TanslationsAPI'
import LocalizedTextEditor from '../Shared/LocalizedTextEditor'
import LocalizedTextAreaEditor from '../Shared/LocalizedTextAreaEditor'
import { hasPermission } from '../utils/auth';
import { useNavigate, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet';

const EditTranslation = (props) => {

    let navigate = useNavigate();
    if (!hasPermission('settings.modify')) {
        navigate("/admin", { replace: true });
    }

    const { t } = useTranslation();
    const [translaion, SetTranslation] = useState({});

    useEffect(() => {
        // getSettings().then(res => {

        //     if (res.data != null) {
        //         if (!res.data.title) {
        //             res.data.title = {}
        //         }
        //         if (!res.data.address) {
        //             res.data.address = {}
        //         }
        //         if(!res.data.keywords){
        //             res.data.keywords = {};
        //         }

        //         if(!res.data.description){
        //             res.data.description = {};
        //         }


        //         setSettings(res.data);
        //     }
        // });
    }, []);

    const doPost = () => {
        // updateSettings(settings).then(res => {
        //     console.log(res.data);
        //     toast.success(t("succeed"));
        // })
    }

    const updatePhone = event => {
        let cloned = JSON.parse(JSON.stringify(translaion));
        cloned.phone = event.target.value;
        SetTranslation(cloned);
    }




    return (
        <div className="conatiner">
            <Helmet>
                <title> Invoicing | Admin | {t("sidebar.tanslation")}</title>
            </Helmet>
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title"><MdSettings /> {t("sidebar.tanslation")}</h5>
                    <br />
                    <form>
                        <div className="mb-3">
                            <label htmlFor="phone" className="form-label">{t("phone")} </label>
                            <input type="text" className="form-control" id="phone" value={translaion.phone} onChange={updatePhone} />
                        </div>

                        <div className="row col justify-content-end" >
                            <Link to="/admin/translations" className="btn btn-danger" ><MdClose /> {t("close")}</Link>
                            &nbsp;
                            <button type="button" className="btn btn-primary" onClick={doPost}><MdSave /> {t("dashboard.save")}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EditTranslation;