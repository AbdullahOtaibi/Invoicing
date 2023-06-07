import React, { useState, useEffect } from 'react'
import { useTranslation } from "react-i18next"
import { toast } from 'react-toastify'
import { ThreeDots } from  'react-loader-spinner'
import { MdDelete, MdEdit, MdOutlineCategory, MdClose, MdSave, MdAdd } from "react-icons/md"
import { updateProductCategory, getProductCategory, getMainCategories } from './ProductCategoriesAPI'
import LocalizedTextEditor from '../Shared/LocalizedTextEditor'
import LocalizedTextAreaEditor from '../Shared/LocalizedTextAreaEditor'
import UploadImage from '../Images/UploadImage';
import { Link, useParams, useNavigate } from 'react-router-dom'
import { getLocalizedText, getThumbUrl } from '../utils/utils'
import { hasPermission } from '../utils/auth';
import { Helmet } from 'react-helmet'

const EditProductCategory = (props) => {

    let navigate = useNavigate();
    if(!hasPermission('productCategories.modify')){
        navigate("/admin/product-categories", { replace: true });
    }

    const [category, setCategory] = useState({ name: { arabic: "", english: "" }, keywords: {}, description: {} });
    const [categories, setCategories] = useState([]);
    const [contentLocale, setContentLocale] = useState('en');
    const [loading, setLoading] = useState(false);
    const { t, i18n } = useTranslation();
    const { categoryId } = useParams();
    const [categoryFilter, setCategoryFilter] = useState({ name: {} });

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

  
    const updateCategoryName = (newValue, locale) => {
        setContentLocale(locale);
        let cloned = JSON.parse(JSON.stringify(category));
        setLocalTextValue(cloned.name, newValue);
        setCategory(cloned);
    }

    const updateKeywords = (newValue, locale) => {
        setContentLocale(locale);
        let cloned = JSON.parse(JSON.stringify(category));
        setLocalTextValue(cloned.keywords, newValue);
        setCategory(cloned);
    }

    const updateDescription = (newValue, locale) => {
        setContentLocale(locale);
        let cloned = JSON.parse(JSON.stringify(category));
        setLocalTextValue(cloned.description, newValue);
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




    const updateAlias = (event) => {
        let cloned = JSON.parse(JSON.stringify(category));
        cloned.alias = event.target.value;
        setCategory(cloned);
    }

    const updateArticleAlias = (event) => {
        let cloned = JSON.parse(JSON.stringify(category));
        cloned.articleAlias = event.target.value;
        setCategory(cloned);
    }

    

    const updateParentId = (event) => {
        let cloned = JSON.parse(JSON.stringify(category));
        cloned.parent = event.target.value;
        setCategory(cloned);
    }



    const doPost = () => {
        setLoading(true);
        updateProductCategory(category).then(res => {
            setLoading(false);
            toast.success(t("succeed"));
            window.location.href = "/admin/product-categories";
        }).catch(e => {
            setLoading(false);
            toast.error(t(e.message));
        })
    }

    useEffect(() => {
        getProductCategory(categoryId).then(res => {
            if (res.data.filters) {
                for (var f in res.data.filters) {
                    if (!res.data.filters[f].id) {
                        res.data.filters[f].id = new Date().getTime();
                    }
                }
            }
            if (!res.data.keywords) {
                res.data.keywords = {};
            }

            if (!res.data.description) {
                res.data.description = {};
            }

            setCategory(res.data);
        })

        getMainCategories().then(res => {
            setCategories(res.data);
        });
    }, []);

    const imageUploaded = uploadedImage => {

        let cloned = JSON.parse(JSON.stringify(category));
        cloned.imageUrl = uploadedImage.url;
        if (!cloned.image) {
            cloned.image = {}
        }
        cloned.image.url = uploadedImage.url;
        cloned.image.uploadFolder = uploadedImage.uploadFolder;
        cloned.image.thumbnailUrl = uploadedImage.thumbnailUrl;

        setCategory(cloned);

        //
        // images = [...images, uploadedImage];        //alert('uploaded...' + info.path);
        if (props.handleChange != null) {
            //props.handleChange(images);
        }
    }

    const iconUploaded = uploadedImage => {
        let cloned = JSON.parse(JSON.stringify(category));
        cloned.icon = uploadedImage.url;
        setCategory(cloned);
    }

    const updateFilterName = (newValue, locale) => {
        setContentLocale(locale);
        console.log("EditProduct - newValue: " + newValue + ", locale: " + locale);
        let cloned = JSON.parse(JSON.stringify(categoryFilter));
        setLocalTextValue(cloned.name, newValue);
        setCategoryFilter(cloned);
    }

    const selectFilterToEdit = (filter) => {
        console.log(filter);
        setCategoryFilter(filter);
    }

    const addFilter = () => {
      
        let cloned = JSON.parse(JSON.stringify(category));
        if (!cloned.filters) {
            cloned.filters = [];
        }
        if (!categoryFilter.id) {
            cloned.filters.push({ name: categoryFilter.name, id: (new Date().getTime()) });
        } else {
            let index = cloned.filters.findIndex(element => {
                if (element._id == categoryFilter._id) {
                    return true;
                }
            });
            console.log("indes=======");
            console.log(index);
            cloned.filters[index] = { name: categoryFilter.name, id: categoryFilter.id, _id: categoryFilter._id };

        }

        setCategory(cloned);
        setCategoryFilter({ name: {} });
    }

    const removeFilter = (id) => {
        let cloned = JSON.parse(JSON.stringify(category));
        if (!cloned.filters) {
            cloned.filters = [];
        }
        cloned.filters = cloned.filters.filter(f => f.id != id);
        setCategory(cloned);
    }




    return (
        <div className="card">
             <Helmet>
                <title> Invoicing | Admin | {t("product.editCategory")}</title>
            </Helmet>

            <div className="card-body">
                <h5 className="card-title"><MdOutlineCategory /> {t("product.editCategory")}</h5>
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
                    <div className='row'>
                        <div className='col-6'>
                            <div className="mb-3">

                                <label htmlFor="image" className="form-label">{t("image")} </label>
                                <br />
                                <img src={category.image ? getThumbUrl(category.image) : "/images/no-image.png"}
                                    style={{ width: '200px', hwight: '200px' }} alt="" />

                                <br /><br />
                                <UploadImage handleUpload={imageUploaded} uploadFolder="categories" parentId={categoryId} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="image" className="form-label">{t("icon")} </label>
                                <br />
                                <img src={category.icon ? "/uploads/" + category.icon : "/images/no-image.png"}
                                    style={{ width: '100px', hwight: '100px', backgroundColor: '#000' }} alt="" />

                                <br /><br />
                                <UploadImage handleUpload={iconUploaded} />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="alias" className="form-label">{t("dashboard.alias")} </label>
                                <input type="text" className="form-control" id="alias" value={category.alias} onChange={updateAlias} />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="articleAlias" className="form-label">{t("dashboard.articleAlias")} </label>
                                <input type="text" className="form-control" id="articleAlias" value={category.articleAlias} onChange={updateArticleAlias} />
                            </div>


                            



                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">{t("product.parentCategory")}</label>
                                <select className="form-control" onChange={updateParentId} value={category.parent ? category.parent._id : ''} >
                                    <option value=''>Parent</option>
                                    {categories.map(cat => (<option key={cat._id} value={cat._id}>{getLocalizedText(cat.name, i18n)}</option>))}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">{t("product.categoryName")}</label>
                                <LocalizedTextEditor placeholder={t("product.categoryName")} locale={contentLocale} textObject={category.name}
                                    onLocalChanged={changeLocale} onChange={updateCategoryName} />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="description" className="form-label">{t("product.description")}</label>
                                <LocalizedTextAreaEditor placeholder={t("product.description")} locale={contentLocale} textObject={category.description}
                                    onLocalChanged={changeLocale} onChange={updateDescription} />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="keywords" className="form-label">{t("seo.keywords")}</label>
                                <LocalizedTextEditor placeholder={t("seo.keywords")} locale={contentLocale} textObject={category.keywords}
                                    onLocalChanged={changeLocale} onChange={updateKeywords} />
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
                                <Link className="add-btn btn-warning" to='/admin/product-categories' >

                                    <MdClose /> {t("close")}
                                </Link> &nbsp;
                                <button type="button" className="add-btn" onClick={doPost}>
                                    <MdSave /> {t("dashboard.save")}
                                </button>
                            </div>
                        </div>
                        <div className='col-6'>
                            <h5>
                                {t("product.filters")}
                            </h5>
                            <hr />
                            <div className="mb-3">
                                <label htmlFor="filter" className="form-label">{t("product.filters")}</label>
                                <LocalizedTextEditor placeholder={t("product.filters")} locale={contentLocale} textObject={categoryFilter.name}
                                    onLocalChanged={changeLocale} onChange={updateFilterName} />
                            </div>
                            <div className="mb-3">
                                <button type="button" className="add-btn  btn-success" onClick={addFilter}>
                                    <MdAdd /> {t("dashboard.add")}
                                </button>
                            </div>

                            <table className='table'>


                                {category.filters ? category.filters.map(f => (<tr>
                                    <td>
                                        {getLocalizedText(f.name, i18n)}
                                    </td>
                                    <td>
                                        <button type="button" className='btn btn-sm btn-dark mx-2' onClick={() => { selectFilterToEdit(f) }}>
                                            <MdEdit />
                                        </button>
                                        <button type="button" className="btn btn-sm btn-danger" onClick={() => removeFilter(f.id)} >
                                            <MdDelete />
                                        </button>
                                    </td>
                                </tr>)) : null}

                            </table>
                        </div>
                    </div>
                </form>

            </div>

        </div>

    )
}

export default EditProductCategory;