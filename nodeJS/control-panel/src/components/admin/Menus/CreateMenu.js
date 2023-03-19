import React,{ useState, useEffect } from 'react'
import { createMenu } from './MenusAPI'
import { useTranslation } from "react-i18next"
import { toast } from 'react-toastify'
import Loader from "react-loader-spinner"



const CreateMenu = () => {

    const [menu, setMenu] = useState({});
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

    const updateTitle = (event) => {
        let cloned = JSON.parse(JSON.stringify(menu));
        cloned.title = event.target.value;
        setMenu(cloned);
    }
    const updateTitleArabic = (event) => {
        let cloned = JSON.parse(JSON.stringify(menu));
        cloned.titleArabic = event.target.value;
        setMenu(cloned);
    }
    const updateCode = (event) => {
        let cloned = JSON.parse(JSON.stringify(menu));
        cloned.code = event.target.value;
        setMenu(cloned);
    }
    


    const doPost = data => {
        setLoading(true);
        createMenu(menu).then(res => {
            setLoading(false);
            toast.success(t("succeed"));
            //setArticle(res.data);
            window.location.href = "/admin/menus/edit/" + res.id;
        }).catch(e => {
            setLoading(false);
        })
        console.log(menu);
        console.log(data);
    }



    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">{t("dashboard.createMenu")}</h5>
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
                    <div className="mb-3">
                        <label htmlFor="code" className="form-label">{t("dashboard.code")} </label>
                        <input type="text" className="form-control" id="code"  value={menu.code} onChange={updateCode} />

                    </div>

                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">{t("dashboard.title")} ({t("dashboard.english")})</label>
                        <input type="text" className="form-control" id="title"  value={menu.title} onChange={updateTitle} />

                    </div>
                    <div className="mb-3">
                        <label htmlFor="titleArabic" className="form-label">{t("dashboard.title")} ({t("dashboard.arabic")})</label>
                        <input type="text" className="form-control" id="titleArabic"  value={menu.titleArabic} onChange={updateTitleArabic} />

                    </div>





                    <div className="mb-3 row col justify-content-end" >
                        <button type="button" className="btn btn-primary" onClick={doPost}>{t("dashboard.submit")}</button>
                    </div>
                </form>
            </div>


        </div>
    )
}


export default CreateMenu;
