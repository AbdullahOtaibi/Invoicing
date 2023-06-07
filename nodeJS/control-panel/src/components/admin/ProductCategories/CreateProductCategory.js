import React, { useState, useEffect } from 'react'
import { useTranslation } from "react-i18next"
import { toast } from 'react-toastify'
import { ThreeDots } from  'react-loader-spinner'
import { Link, useNavigate } from 'react-router-dom'
import { MdCollectionsBookmark } from "react-icons/md"
import { createProductCategory, getMainCategories } from './ProductCategoriesAPI'
import LocalizedTextEditor from '../Shared/LocalizedTextEditor'
import UploadImage from '../Images/UploadImage';
import { getLocalizedText } from '../utils/utils'
import { hasPermission } from '../utils/auth';
import { Helmet } from 'react-helmet'

const CreateProductCategory = (props) => {

    let navigate = useNavigate();
    if (!hasPermission('productCategories.modify')) {
        navigate("/admin/product-categories", { replace: true });
    }

    const [category, setCategory] = useState({ name: { arabic: "", english: "" } });
    const [categories, setCategories] = useState([]);
    const [contentLocale, setContentLocale] = useState('en');
    const [loading, setLoading] = useState(false);
    const { t, i18n } = useTranslation();

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

    const updateAlias = (event) => {
        let cloned = JSON.parse(JSON.stringify(category));
        cloned.alias = event.target.value;
        setCategory(cloned);
    }

    const updatePublished = (event) => {
        let cloned = JSON.parse(JSON.stringify(category));
        cloned.published = event.target.checked;
        setCategory(cloned);
    }

    const updateFilter = (event) => {
        let cloned = JSON.parse(JSON.stringify(category));
        cloned.showInFilters = event.target.checked;
        setCategory(cloned);
    }


    const updateParentId = (event) => {
        let cloned = JSON.parse(JSON.stringify(category));
        cloned.parent = event.target.value;
        setCategory(cloned);
    }



    const updateCategoryName = (newValue, locale) => {
        setContentLocale(locale);
        console.log("EditProduct - newValue: " + newValue + ", locale: " + locale);
        let cloned = JSON.parse(JSON.stringify(category));
        setLocalTextValue(cloned.name, newValue);
        setCategory(cloned);
    }

    const doPost = () => {
        setLoading(true);
        createProductCategory(category).then(res => {
            setLoading(false);
            toast.success(t("succeed"));
            window.location.href = "/admin/product-categories";
        }).catch(e => {
            setLoading(false);
            toast.error(t(e.message));
        })
    }

    useEffect(() => {
        getMainCategories().then(res => {
            setCategories(res.data);
        });
    }, []);

    const imageUploaded = uploadedImage => {
        let cloned = JSON.parse(JSON.stringify(category));
        cloned.imageUrl = uploadedImage.url;
        setCategory(cloned);
        // images = [...images, uploadedImage];        //alert('uploaded...' + info.path);
        if (props.handleChange != null) {
            //props.handleChange(images);
        }
    }


    return (
        <div className="card">
            <Helmet>
                <title> Invoicing | Admin | {t("product.createProductCategory")}</title>
            </Helmet>
            <div className="card-body">
                <h5 className="card-title"><MdCollectionsBookmark /> {t("product.createProductCategory")}</h5>
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
                        <img src={category.imageUrl ? "/uploads/" + category.imageUrl : "/images/no-image.png"}
                            style={{ width: '200px', hwight: '200px' }}
                            alt={"upload image"}
                        />

                        <br /><br />
                        <UploadImage handleUpload={imageUploaded} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="alias" className="form-label">{t("dashboard.alias")} </label>
                        <input type="text" className="form-control" id="alias" value={category.alias} onChange={updateAlias} />

                    </div>

                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">{t("product.parentCategory")}</label>
                        <select className="form-control" onChange={updateParentId} >
                            <option>{t("product.parentCategory")}</option>
                            {categories.map(cat => (<option key={cat._id} value={cat._id}>{getLocalizedText(cat.name, i18n)}</option>))}
                        </select>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">{t("product.categoryName")}</label>
                        <LocalizedTextEditor placeholder={t("product.categoryName")} locale={contentLocale} textObject={category.name}
                            onLocalChanged={changeLocale} onChange={updateCategoryName} />
                    </div>

                    <div className="mb-3 form-check">
                        <div className="custom-control custom-checkbox">
                            <input type="checkbox" className="custom-control-input" id="filterCheck" checked={category.showInFilters} onChange={updateFilter} />
                            <label className="custom-control-label" htmlFor="filterCheck">{t("product.showInFilters")}</label>
                        </div>
                    </div>

                    <div className="mb-3 form-check">
                        <div className="custom-control custom-checkbox">
                            <input type="checkbox" className="custom-control-input" id="publishedCheck" checked={category.published} onChange={updatePublished} />
                            <label className="custom-control-label" htmlFor="publishedCheck">{t("dashboard.published")}</label>
                        </div>
                    </div>


                    <div className=" row col justify-content-end" >
                        <Link className="btn btn-warning" to='/admin/product-categories' >{t("dashboard.cancel")}</Link> &nbsp;
                        <button type="button" className="btn btn-primary" onClick={doPost}>{t("dashboard.submit")}</button>
                    </div>
                </form>
            </div>

        </div>

    )
}

export default CreateProductCategory;