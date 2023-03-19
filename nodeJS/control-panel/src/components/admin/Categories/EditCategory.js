import React,{ useState, useEffect } from 'react'
import { useTranslation } from "react-i18next"
import { toast } from 'react-toastify'
import Loader from "react-loader-spinner"
import { MdCollectionsBookmark } from "react-icons/md"
import { updateCategory, getCategory } from './CategoriesAPI'
import { useParams } from 'react-router-dom'


const EditCategory = (props) => {
    const [category, setCategory] = useState({});
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const {categoryId} = useParams();

    const updateTitle = (event) => {
        let cloned = JSON.parse(JSON.stringify(category));
        cloned.title = event.target.value;
        setCategory(cloned);
    }

    const updateTitleArabic = (event) => {
        let cloned = JSON.parse(JSON.stringify(category));
        cloned.titleArabic = event.target.value;
        setCategory(cloned);
    }

    const updateAlias = (event) => {
        let cloned = JSON.parse(JSON.stringify(category));
        cloned.alias = event.target.value;
        setCategory(cloned);
    }



    const doPost = () => {
        setLoading(true);
        updateCategory(category).then(res => {
            setLoading(false);
            toast.success(t("succeed"));
            window.location.href = "/admin/categories";
        }).catch(e => {
            setLoading(false);
            toast.error(t(e.message));
        })
    }

    useEffect(() => {
        getCategory(categoryId).then(res => {
            setCategory(res.data);
        })
    }, []);




    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title"><MdCollectionsBookmark /> {t("dashboard.createCategory")}</h5>
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
                        <label htmlFor="alias" className="form-label">{t("dashboard.alias")} </label>
                        <input type="text" className="form-control" id="alias" value={category.alias} onChange={updateAlias} />

                    </div>

                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">{t("dashboard.category")} ({t("dashboard.english")})</label>
                        <input type="text" className="form-control" id="title" value={category.title} onChange={updateTitle} />

                    </div>

                    <div className="mb-3">
                        <label htmlFor="titleArabic" className="form-label">{t("dashboard.category")} ({t("dashboard.arabic")})</label>
                        <input type="text" className="form-control" id="titleArabic" value={category.titleArabic} onChange={updateTitleArabic} />

                    </div>
                    <div className=" row col justify-content-end" >
                        <button type="button" className="btn btn-primary" onClick={doPost}>{t("dashboard.save")}</button>
                    </div>
                </form>
            </div>

        </div>

    )
}

export default EditCategory;