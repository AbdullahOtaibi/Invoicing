import React,{ useState, useEffect } from 'react'
import { useTranslation } from "react-i18next"
import { toast } from 'react-toastify'
import Loader from "react-loader-spinner"
import { MdCollectionsBookmark, MdClose, MdSave } from "react-icons/md"
import { createProduct } from './ProductsAPI'
import { Link, useNavigate } from 'react-router-dom'
import { getMyCategories } from '../ProductCategories/ProductCategoriesAPI'
import LocalizedTextEditor from '../Shared/LocalizedTextEditor'
import { Helmet } from "react-helmet";
import { hasPermission } from '../utils/auth';

const CreateProduct = (props) => {

    let navigate = useNavigate();
    if(!hasPermission('products.modify')){
        navigate("/admin/products", { replace: true });
    }

    const [contentLocale, setContentLocale] = useState('en');
    const [product, setProduct] = useState({ name: { arabic: "", english: "" }, description: { arabic: "", english: "" } });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

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

    const updateProductName = (newValue, locale) => {
        setContentLocale(locale);
        console.log("EditProduct - newValue: " + newValue + ", locale: " + locale);
        let cloned = JSON.parse(JSON.stringify(product));
        setLocalTextValue(cloned.name, newValue);
        setProduct(cloned);
    }



    const updateAlias = (event) => {
        let cloned = JSON.parse(JSON.stringify(product));
        cloned.alias = event.target.value;
        setProduct(cloned);
    }

    const updateCategory = (event) => {
        let cloned = JSON.parse(JSON.stringify(product));
        cloned.category = event.target.value;
        setProduct(cloned);
    }

    const doPost = () => {
        setLoading(true);
        createProduct(product).then(res => {
            setLoading(false);
            toast.success(t("succeed"));
            window.location.href = "/admin/products";
        }).catch(e => {
            setLoading(false);
            toast.error(t(e.message));
        })
    }

    useEffect(() => {
        getMyCategories().then(res => {
            setCategories(res.data);

        });
    }, []);




    return (
        <div className="card">
             <Helmet>
                <title>{'Invoicing | Admin | Create Product'} </title>
            </Helmet>
            <div className="card-body">
                <h5 className="card-title"><MdCollectionsBookmark /> {t("product.addProduct")}</h5>
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
                    {localStorage.getItem("role") != null && localStorage.getItem("role") == 'Administrator' ? (<div className="mb-3">
                        <label htmlFor="alias" className="form-label">{t("dashboard.alias")} </label>
                        <input type="text" className="form-control" id="alias" value={product.alias} onChange={updateAlias} />

                    </div>) : null}

                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">{t("product.productName")} ({t("dashboard.english")})</label>
                        <LocalizedTextEditor placeholder={t("product.productName")} locale={contentLocale} textObject={product.name}
                            onLocalChanged={changeLocale} onChange={updateProductName} />
                    </div>



                    <div className="mb-3">
                        <label htmlFor="category" className="form-label">{t("dashboard.category")} </label>
                        <select type="text" className="form-control" id="category" value={product.category} onChange={updateCategory} >
                            <option>Category</option>
                            {categories.map(cat => (<option key={cat._id} value={cat._id}>{cat.name.english}</option>))}
                        </select>
                    </div>




                    <div className=" row col justify-content-end" >
                        <Link className="add-btn btn-warning" to='/admin/products' >
                            <MdClose /> &nbsp;&nbsp;
                            {t("close")}
                            </Link> &nbsp;
                        <button type="button" className="add-btn btn-primary" onClick={doPost}>
                            <MdSave /> &nbsp;&nbsp;
                            {t("dashboard.submit")}
                            </button>
                    </div>
                </form>
            </div>

        </div>

    )
}

export default CreateProduct;