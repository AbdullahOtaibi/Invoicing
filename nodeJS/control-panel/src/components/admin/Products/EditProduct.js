import React, { useState, useEffect, useRef } from 'react'
import { useTranslation } from "react-i18next"
import { toast } from 'react-toastify'
import Loader from "react-loader-spinner"
import { MdCollectionsBookmark, MdDelete, MdAdd, MdSave, MdClose } from "react-icons/md"
import { updateProduct, getProduct, searchRelatedProduct, createVariant, getVariants, unlinkVariant } from './ProductsAPI'
import { getMyCategories, getProductCategory } from '../ProductCategories/ProductCategoriesAPI'
import ListImages from '../Images/ListImages'
import ListAttachments from '../Attachments/ListAttachments'

import { Link, useParams, useNavigate } from 'react-router-dom'
import { Tabs, Tab } from 'react-bootstrap'
import LocalizedTextEditor from '../Shared/LocalizedTextEditor'
import { getCompanies } from '../../../services/CompaniesAPI';
import { getLocalizedText, getLocalizedTextByLocale } from '../utils/utils'
import { Editor } from '@tinymce/tinymce-react'
import { Helmet } from "react-helmet";
import { hasPermission } from '../utils/auth';
import CategoriesSelector  from './CategoriesSelector'



const EditProduct = (props) => {

    let navigate = useNavigate();
    if(!hasPermission('products.modify')){
        navigate("/admin/products", { replace: true });
    }

    const editorRef = useRef(null);
    const [editorReady, setEditorReady] = useState(false);
    const [contentReady, setContentReady] = useState(false);
    const [contentLocale, setContentLocale] = useState('en');

    const [product, setProduct] = useState({ name: { arabic: "", english: "" }, description: { arabic: "", english: "" }, 
    variants: [], packaging: {}, dimensions:{}, relatedProducts: [], categoryId: {}, keywords:{}, categories:[] });
    const [productVariant, setProductVariant] = useState({ dimensions: {}, description: {}, name: {}, price: {}, unitPrice: {} });
    const [loading, setLoading] = useState(false);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const { t, i18n } = useTranslation();
    const [currencyCode, setCurrencyCode] = useState('USD');
    const [companies, setCompanies] = useState([]);
    const { productId } = useParams();
    const [variants, setVariants] = useState([]);
    const [offerPrice, setOfferPrice] = useState({ minQty: 1, maxQty: 1, amount: 0, currencyCode: 'USD' });
    let contentNeesUpdate = true;
    const priceCalcOptions = [
        {
            english: "Count",
            arabic: "العدد"
        },
        {
            english: "Length",
            arabic: "الطول"
        },
        {
            english: "Area",
            arabic: "المساحة"
        },
        {
            english: "Volume",
            arabic: "الحجم"
        },
        {
            english: "Weight",
            arabic: "الوزن"
        }
    ];

    const addOfferPrice = () => {
        let cloned = JSON.parse(JSON.stringify(product));
        if (!cloned.offers) {
            cloned.offers = {};
        }
        if (!cloned.offers.quantityBased) {
            cloned.offers.quantityBased = [];
        }
        cloned.offers.quantityBased.push({
            minQty: offerPrice.minQty, maxQty: offerPrice.maxQty,
            id: new Date().getTime(),
            price: { amount: offerPrice.amount, currencyCode: offerPrice.currencyCode }
        });

        setProduct(cloned);
    }

    const removeOffer = (id) => {
        let cloned = JSON.parse(JSON.stringify(product));
        if (!cloned.offers) {
            cloned.offers = {};
        }
        if (!cloned.offers.quantityBased) {
            cloned.offers.quantityBased = [];
        }

        cloned.offers.quantityBased = cloned.offers.quantityBased.filter(o => o._id != id && o.id != id);

        setProduct(cloned);
    }

 

    const updateOfferMinQty = (event) => {
        let cloned = JSON.parse(JSON.stringify(offerPrice));
        cloned.minQty = event.target.value;
        setOfferPrice(cloned);
    }

    const updateOfferMaxQty = (event) => {
        let cloned = JSON.parse(JSON.stringify(offerPrice));
        cloned.maxQty = event.target.value;
        setOfferPrice(cloned);
    }

    const updateOfferCurrencyCode = (event) => {
        let cloned = JSON.parse(JSON.stringify(offerPrice));
        cloned.currencyCode = event.target.value;
        setOfferPrice(cloned);
    }



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
        contentNeesUpdate = false;
        editorRef.current.setContent(getLocalizedTextByLocale(product.description, newLocale));

    }

    useEffect(() => {
        if (editorRef && editorRef.current) {
            editorRef.current.setContent(getLocalizedTextByLocale(product.description, contentLocale));
        }

    }, [contentReady, editorReady]);


    const updateAlias = (event) => {
        let cloned = JSON.parse(JSON.stringify(product));
        cloned.alias = event.target.value;
        setProduct(cloned);
    }

    const generateCode = (event) => {
        let cloned = JSON.parse(JSON.stringify(product));
        cloned.alias = product.company.code + "-" + ("00000"+product.category.serialNumber).slice(-5) + "-" + ("000000"+ product.serialNumber).slice(-6);
        setProduct(cloned);
    }

    

    const updateKeywords = (newValue, locale) => {
        setContentLocale(locale);
        let cloned = JSON.parse(JSON.stringify(product));
        setLocalTextValue(cloned.keywords, newValue);
        setProduct(cloned);
    }


    const updateSKU = (event) => {
        let cloned = JSON.parse(JSON.stringify(product));
        cloned.sku = event.target.value;
        setProduct(cloned);
    }


    const updatecompany = (event) => {
        let cloned = JSON.parse(JSON.stringify(product));
        cloned.companyId = event.target.value;
        cloned.company_id = event.target.value;
        setProduct(cloned);
    }



    const updateMinimumOrderQty = (event) => {
        let cloned = JSON.parse(JSON.stringify(product));
        cloned.minimumOrderQty = event.target.value;
        setProduct(cloned);
    }

    const updateDiscountPercentage = (event) => {
        let cloned = JSON.parse(JSON.stringify(product));
        cloned.discountPercentage = event.target.value;
        setProduct(cloned);
    }




    const updatePriceCalc = (event) => {
        let cloned = JSON.parse(JSON.stringify(product));
        cloned.priceCalc = event.target.value;
        setProduct(cloned);
    }

    const updatePrice = (event) => {
        let cloned = JSON.parse(JSON.stringify(product));
        if (!cloned.price) {
            cloned.price = {};
        }
        cloned.price.amount = event.target.value;
        cloned.price.currencyCode = currencyCode;
        setProduct(cloned);
    }

    const updateOfferPrice = (event) => {
        let cloned = JSON.parse(JSON.stringify(offerPrice));

        cloned.amount = event.target.value;
        cloned.currencyCode = currencyCode;
        setOfferPrice(cloned);
    }

    const updateCurrencyCode = (event) => {
        setCurrencyCode(event.target.value);
    }





    const updatePublished = (event) => {
        let cloned = JSON.parse(JSON.stringify(product));
        cloned.published = event.target.checked;
        setProduct(cloned);
    }

    const updateQuotationOnly = (event) => {
        let cloned = JSON.parse(JSON.stringify(product));
        cloned.quotationOnly = event.target.checked;
        setProduct(cloned);
    }


    


    const updateAvailableInStock = (event) => {
        let cloned = JSON.parse(JSON.stringify(product));
        cloned.availableInStock = event.target.checked;
        setProduct(cloned);
    }

    

    const updateApproved = (event) => {
        let cloned = JSON.parse(JSON.stringify(product));
        cloned.approved = event.target.checked;
        setProduct(cloned);
    }



    const updateCategory = (event) => {
        let cloned = JSON.parse(JSON.stringify(product));
        cloned.category = event.target.value;
        setProduct(cloned);
       
    }

    const updateCategories = (newList) => {
      
        let cloned = JSON.parse(JSON.stringify(product));
        cloned.categories = newList;
        setProduct(cloned);
       
    }


    const doPost = () => {
        setLoading(true);
        let cloned = JSON.parse(JSON.stringify(product));

        let relatedIds = [];
        for (let i in cloned.relatedProducts) {
            relatedIds.push(cloned.relatedProducts[i]._id);
        }
        cloned.relatedProducts = relatedIds;
        updateProduct(cloned).then(res => {
            setLoading(false);
            toast.success(t("succeed"));
            reloadProduct();
            // window.location.href = "/admin/products";
            setProduct(res.data);
        }).catch(e => {
            setLoading(false);
            toast.error(t(e.message));
        })
    }

    const saveAndStay = (toBeSaved) => {

        updateProduct(toBeSaved).then(res => {
            setLoading(false);
            //setProduct(res.data);
            let mainProductId = 0;
            if (res.data.mainProduct) {
                mainProductId = res.data.mainProduct;
            } else {
                mainProductId = res.data._id;
            }

            getVariants(mainProductId).then(resV => {
                setVariants(resV.data);
            }).catch(e => {

            });
            //setProductVariant({ dimentions: {}, description: {}, name: {}, price: {}, unitPrice: {}, code: '', color: '' });
            toast.success(t("succeed"));
            reloadProduct();
        }).catch(e => {
            setLoading(false);
            toast.error(t(e.message));
        })
    }


    const reloadProduct = () => {
        getProduct(productId).then(res => {
            if(!res.data.keywords){
                res.data.keywords = {};
            }

            setProduct(res.data);
            setContentReady(true);

            
            let mainProductId = 0;
            if (res.data.mainProduct) {
                mainProductId = res.data.mainProduct;
            } else {
                mainProductId = res.data._id;
            }

            getVariants(mainProductId).then(resV => {
                setVariants(resV.data);
            }).catch(e => {

            });

        });
    }
    useEffect(() => {
        

        reloadProduct();

        getMyCategories().then(res => {
            setCategories(res.data);


        });





        getCompanies().then(res => {
            setCompanies(res.data);
        }).catch(e => {

        });


    }, []);
    useEffect(() => {
        if (!product._id) {
            return;
        }
        let mainProductId = 0;
        if (product.mainProduct) {
            mainProductId = product.mainProduct;
        } else {
            mainProductId = product._id;
        }
        getVariants(mainProductId).then(resV => {
            setVariants(resV.data);
        }).catch(e => {

        });
    }, [product]);


    const imagesUpdated = imgs => {
        console.log(imgs);
        let cloned = JSON.parse(JSON.stringify(product));
        cloned.images = [];
        imgs.map(img => {
            cloned.images.push({ url: img.url, uploadFolder: img.uploadFolder, thumbnailUrl: img.thumbnailUrl })
        });

        setProduct(cloned);
    }

    const attachmentUpdated = items => {
        console.log(items);
        let cloned = JSON.parse(JSON.stringify(product));
        cloned.attachments = [];
        items.map(item => {
            cloned.attachments.push({ url: item.url, description: item.description })
        });

        setProduct(cloned);
    }




    const updateProductName = (newValue, locale) => {
        setContentLocale(locale);
        console.log("EditProduct - newValue: " + newValue + ", locale: " + locale);
        let cloned = JSON.parse(JSON.stringify(product));
        setLocalTextValue(cloned.name, newValue);
        setProduct(cloned);
    }







    
    const updateDimensionsLength = (event) => {
        let cloned = JSON.parse(JSON.stringify(product));
        if (!cloned.dimensions) { cloned.dimensions = {} };
        cloned.dimensions.length = event.target.value;
        setProduct(cloned);
    }

    const updatePackageLength = (event) => {
        let cloned = JSON.parse(JSON.stringify(product));
        if (!cloned.packaging) { cloned.packaging = {} };
        cloned.packaging.length = event.target.value;
        setProduct(cloned);
    }

    const updateVideoUrl = (event) => {
        let cloned = JSON.parse(JSON.stringify(product));
        if (!cloned.video) { cloned.video = {} };
        cloned.video.url = event.target.value;
        setProduct(cloned);
    }


    
    const updateDimensionsWidth = (event) => {
        let cloned = JSON.parse(JSON.stringify(product));
        if (!cloned.dimensions) { cloned.dimensions = {} };
        cloned.dimensions.width = event.target.value;
        setProduct(cloned);
    }

    const updatePackageWidth = (event) => {
        let cloned = JSON.parse(JSON.stringify(product));
        if (!cloned.packaging) { cloned.packaging = {} };
        cloned.packaging.width = event.target.value;
        setProduct(cloned);
    }

    const updateDimensionsHeight = (event) => {
        let cloned = JSON.parse(JSON.stringify(product));
        if (!cloned.dimensions) { cloned.dimensions = {} };
        cloned.dimensions.height = event.target.value;
        setProduct(cloned);
    }

    const updatePackageHeight = (event) => {
        let cloned = JSON.parse(JSON.stringify(product));
        if (!cloned.packaging) { cloned.packaging = {} };
        cloned.packaging.height = event.target.value;
        setProduct(cloned);
    }

    const updateDimensionsWeight = (event) => {
        let cloned = JSON.parse(JSON.stringify(product));
        if (!cloned.dimensions) { cloned.dimensions = {} };
        cloned.dimensions.weight = event.target.value;
        setProduct(cloned);
    }

    const updatePackageWeight = (event) => {
        let cloned = JSON.parse(JSON.stringify(product));
        if (!cloned.packaging) { cloned.packaging = {} };
        cloned.packaging.weight = event.target.value;
        setProduct(cloned);
    }
    const updatePackageUnits = (event) => {
        let cloned = JSON.parse(JSON.stringify(product));
        if (!cloned.packaging) { cloned.packaging = {} };
        cloned.packaging.numberOfUnits = event.target.value;
        setProduct(cloned);
    }
    const updatePackageStacking = (event) => {
        let cloned = JSON.parse(JSON.stringify(product));
        if (!cloned.packaging) { cloned.packaging = {} };
        cloned.packaging.stacking = event.target.value;
        setProduct(cloned);
    }


    const searchForRelatedProducts = (event) => {
        let searchText = event.target.value;
        if (searchText && searchText.length > 3) {
            searchRelatedProduct(searchText).then(res => {
                setRelatedProducts(res.data);
            });
        }
    }

    const addRelatedProduct = (relatedProduct) => {
        if (product.relatedProducts.filter(p => p._id == relatedProduct._id).length == 0) {
            console.log("adding Related Product:");
            console.log(relatedProduct)
            let cloned = JSON.parse(JSON.stringify(product));
            if (!cloned.relatedProducts) { cloned.relatedProducts = [] };
            cloned.relatedProducts.push(relatedProduct);
            setProduct(cloned);
        }
    }

    const removeRelatedProduct = (relatedProductId) => {
        let cloned = JSON.parse(JSON.stringify(product));
        cloned.relatedProducts = cloned.relatedProducts.filter(p => p._id != relatedProductId);
        setProduct(cloned);

    }

    const toggleFilter = (filterId) => {
        let cloned = JSON.parse(JSON.stringify(product));
        if (!cloned.filters) {
            cloned.filters = [];
        }
        let filterExists = cloned.filters.filter(f => f == filterId).length > 0;
        if (!filterExists) {
            cloned.filters.push(filterId);
        } else {
            cloned.filters = cloned.filters.filter(f => f != filterId);
        }

        setProduct(cloned);
    }

    const newVariant = () => {
        let mainProductId = 0;
        if (product.mainProduct) {
            mainProductId = product.mainProduct;
        } else {
            mainProductId = product._id;
        }
        createVariant(mainProductId).then(res => {
            let cloned = JSON.parse(JSON.stringify(product));
            if (!cloned.productVariants) {
                cloned.productVariants = [];
            }
            cloned.productVariants.push(res.data._id);
            setProduct(cloned);
            saveAndStay(cloned);
        }).catch(e => {

        });
    }

    const removeVariant = (id) => {
        unlinkVariant(id).then(res => {
            let cloned = JSON.parse(JSON.stringify(variants));
            cloned = cloned.filter(v => v != id);
            setVariants(cloned);
            let clonedProduct = JSON.parse(JSON.stringify(product));
            clonedProduct.productVariants = clonedProduct.productVariants.filter(v => v != id);

            setProduct(clonedProduct);

            saveAndStay(clonedProduct);

        }).catch(e => {
            console.log(e);
        });
    }

    const conentChanged = (newText, editor) => {
        if (contentNeesUpdate) {
            console.log('New Text :' + newText);

            let cloned = JSON.parse(JSON.stringify(product));

            var bm = editor.selection.getBookmark();
            console.log(bm);


            setLocalTextValue(cloned.description, newText);
            setProduct(cloned);
            editor.selection.moveToBookmark(bm);


        } else {
            contentNeesUpdate = true;
        }

    }

    return (
        <div className="card">
             <Helmet>
                <title>{'Invoicing | Admin | Edit Product'} </title>
            </Helmet>
            <div className="card-body">
                <h5 className="card-title"><MdCollectionsBookmark /> {t("product.editProduct")}</h5>
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


                <Tabs
                    defaultActiveKey="general"
                    transition={false}
                    id="noanim-tab-example"
                    className="mb-3" >
                    <Tab eventKey="general" title={t("product.general")} tabClassName="tab-item">
                        <form>
                            <div className="row">
                                <div className="col col-12">

                                    <div className="mb-3 form-check">
                                        <div className="custom-control custom-checkbox">
                                            <input type="checkbox" className="custom-control-input" id="publishedCheck" checked={product.published} onChange={updatePublished} />
                                            <label className="custom-control-label bold" htmlFor="publishedCheck">{t("dashboard.published")}</label>
                                        </div>
                                    </div>

                                    <div className="mb-3 form-check">
                                        <div className="custom-control custom-checkbox">
                                            <input type="checkbox" className="custom-control-input" id="quotationOnlyCheck" checked={product.quotationOnly} 
                                            onChange={updateQuotationOnly} />
                                            <label className="custom-control-label bold" htmlFor="quotationOnlyCheck">{t("product.quotationOnly")}</label>
                                        </div>
                                    </div>


                                    

                                
                                    {localStorage.getItem("role") != null && localStorage.getItem("role") == 'Administrator' ? (<div className="mb-3 form-check">
                                        <div className="custom-control custom-checkbox">
                                            <input type="checkbox" className="custom-control-input" id="approvedCheck" checked={product.approved} onChange={updateApproved} />
                                            <label className="custom-control-label bold" htmlFor="approvedCheck">{t("product.approved")}</label>
                                        </div>
                                    </div>) : null}

                                    <div className="mb-3 form-check">
                                        <div className="custom-control custom-checkbox">
                                            <input type="checkbox" className="custom-control-input" id="availableInStock" checked={product.availableInStock} onChange={updateAvailableInStock} />
                                            <label className="custom-control-label bold" htmlFor="availableInStock">{t("product.availableInStock")}</label>
                                        </div>
                                    </div>

                                    {localStorage.getItem("role") != null && localStorage.getItem("role") == 'Administrator' ? (<div className="row mx-1 mt-4 mb-3">
                                        <label htmlFor="alias" className="form-label">{t("dashboard.alias")} </label>
                                        <div className='col'>
                                        <input type="text" className="form-control" id="alias" value={product.alias} onChange={updateAlias} />
                                        </div>
                                        <div className='col'>
                                        <button type='button' className='btn btn-dark' onClick={generateCode}>Generate CODE</button>
                                        </div>
                                      
                                       

                                    </div>) : null}

                                    <div className="mb-3">
                                        <label htmlFor="sku" className="form-label">{t("product.sku")} </label>
                                        <input type="text" className="form-control" id="sku" value={product.sku} onChange={updateSKU} />

                                    </div>


                                    <div className="mb-3">
                                        <label htmlFor="name" className="form-label">{t("product.productName")}</label>
                                        <LocalizedTextEditor placeholder={t("product.productName")} locale={contentLocale} textObject={product.name}
                                            onLocalChanged={changeLocale} onChange={updateProductName} />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="category" className="form-label">{t("dashboard.category")} </label>
                                        <select type="text" className="form-control" id="category" 
                                        value={(product && product.category && product.category._id?product.category._id:null)} 
                                        onChange={updateCategory} >
                                            <option>Category</option>
                                            {categories.map(cat => (<option key={cat._id} value={cat._id}>{getLocalizedText(cat.name, i18n)}</option>))}
                                        </select>
                                    </div>

                                    



                                    <div className="mb-3">
                                        <label htmlFor="description" className="form-label">{t("product.description")}</label>

                                        <Editor
                                            apiKey='qnh6wwtrn2assdut2aukvl4690bx354iz3vul03ht16f7qmu'
                                            onInit={(evt, editor) => { editorRef.current = editor; setEditorReady(true) }}
                                            init={{
                                                forced_root_block:"div",
                                                height: 500,
                                                menubar: false,
                                                automatic_uploads: true,
                                                file_picker_types: 'image',

                                                plugins: [
                                                    'advlist',
                                                    'lists',
                                                    'image',
                                                    'preview',
                                                    'anchor',
                                                    'link',
                                                    'searchreplace',
                                                    'visualblocks',
                                                    'fullscreen',
                                                    'insertdatetime',
                                                    'media',
                                                    'table',
                                                    'paste',
                                                    'code',
                                                    'wordcount',
                                                    'directionality'
                                                ],
                                                toolbar:
                                                    'undo redo |fontfamily  blocks | fontsize bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat ltr rtl | link table image code',
                                                    font_size_formats: '8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt'
                                            }
                                            }
                                            onEditorChange={conentChanged}
                                        >
                                        </Editor>


                                    </div>

                                    <div className="mb-3">
                                        <div className="row">
                                            <div className="col">
                                                <label htmlFor="price" className="form-label">{t("product.price")} </label>
                                                <input type="text" className="form-control" id="price" value={product.price ? product.price.amount : null} onChange={updatePrice} />
                                            </div>
                                            <div className="col col-2">
                                                <label htmlFor="currencyCode" className="form-label">{t("product.currency")} </label>
                                                <select className="me-sm-2 form-select form-control" id="currencyCode" value={product.price ? product.price.currencyCode : currencyCode} onChange={updateCurrencyCode} >
                                                    <option value='USD'>USD</option>
                                                    <option value='TRY'>TRY</option>
                                                    <option value='KWD'>KWD</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="minimumOrderQty" className="form-label">{t("product.minimumOrderQty")} </label>
                                        <input type="text" className="form-control" id="minimumOrderQty" value={product.minimumOrderQty} onChange={updateMinimumOrderQty} />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="calc" className="form-label">{t("product.calc")} </label>
                                        <select type="text" className="form-control" id="calc" value={product.priceCalc} onChange={updatePriceCalc} >

                                            {priceCalcOptions.map(opt => (<option key={opt.english} value={opt.english}>{getLocalizedText(opt, i18n)}</option>))}
                                        </select>
                                    </div>

                                    {localStorage.getItem("role") != null && localStorage.getItem("role") == "Administrator" ? (
                                        <div className="mb-3">
                                            <label htmlFor="company" className="form-label">{t("product.company")} </label>
                                            <select type="text" className="form-control" id="company" value={product.company ? product.company._id : product.companyId} onChange={updatecompany} >

                                                {companies.map(v => (<option key={v._id} value={v._id}>{getLocalizedText(v.name, i18n)}</option>))}
                                            </select>
                                        </div>

                                    ) : null}


                                </div>

                            </div>
                        </form>
                    </Tab>
                    <Tab eventKey="categories" title={t("product.categories")} tabClassName="tab-item">
                    <CategoriesSelector  availableCategories={categories} selectedCategories={product.categories}
                     updateSelected={(newList) => {updateCategories(newList);}}/>
                    <br/><br/>
                    </Tab>
                    <Tab eventKey="pricing" title={t("product.offers")} tabClassName="tab-item">
                        <div className='row'>
                            <div className="mb-3 p-3">
                                <label htmlFor="discountPercentage" className="form-label">{t("product.discountPercentage")} % </label>
                                <input type="text" className="form-control" id="discountPercentage" value={product.discountPercentage}
                                    onChange={updateDiscountPercentage} />
                            </div>
                        </div>

                        <div className='row'>
                            <table className='table'>
                                <thead>
                                    <tr>
                                        <th>
                                            Min Qty
                                        </th>
                                        <th>
                                            Max Qty
                                        </th>
                                        <th>
                                            Price
                                        </th>
                                        <th>

                                        </th>
                                    </tr>
                                    <tr>
                                        <td>
                                            <input type='number' className='form-control' onChange={updateOfferMinQty} />
                                        </td>
                                        <td>
                                            <input type='number' className='form-control' onChange={updateOfferMaxQty} />
                                        </td>
                                        <td>
                                            <div className="row">
                                                <div className="col">

                                                    <input type="text" className="form-control" id="price" value={offerPrice.amount} onChange={updateOfferPrice} />
                                                </div>
                                                <div className="col col-2">

                                                    <select className="me-sm-2 form-select form-control" id="currencyCode" value={offerPrice.currencyCode} onChange={updateOfferCurrencyCode} >
                                                        <option value='USD'>USD</option>
                                                        <option value='TRY'>TRY</option>
                                                        <option value='KWD'>KWD</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <button type='buttun' className='add-btn' onClick={addOfferPrice}>
                                                <MdAdd />
                                            </button>
                                        </td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {product.offers ? (
                                        <>
                                            {product.offers.quantityBased.map(offer => (
                                                <tr>
                                                    <td>
                                                        {offer.minQty}
                                                    </td>
                                                    <td>
                                                        {offer.maxQty}
                                                    </td>
                                                    <td>
                                                        {offer.price.amount} {offer.price.currencyCode}
                                                    </td>
                                                    <td>
                                                        <button type='buttun' className='add-btn btn-danger' onClick={() => removeOffer(offer._id ? offer._id : offer.id)}>
                                                            <MdDelete />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </>
                                    ) : null}
                                </tbody>
                            </table>
                        </div>
                    </Tab>
                    <Tab eventKey="images" title={t("product.images")} tabClassName="tab-item">
                        <div className="mb-3">
                            <label htmlFor="youtubeVideo" className="form-label">youtube video id </label>
                            <input type="text" className="form-control" id="youtubeVideo" value={product.video?product.video.url:null} onChange={updateVideoUrl} />
                        </div>

                        <div className="mb-3">
                            <hr />
                            <ListImages handleChange={imagesUpdated} images={product.images} productId={product._id} uploadFolder="products" />
                        </div>

                    </Tab>
                    <Tab eventKey="attachments" title={t("product.attachments")} tabClassName="tab-item">
                        <div className="mb-3">
                            <hr />
                            <ListAttachments handleChange={attachmentUpdated} attachments={product.attachments} parentId={product._id} uploadFolder="products" />
                        </div>

                    </Tab>

                    <Tab eventKey="variants" title={t("product.variants")} tabClassName="tab-item">
                        <div className="row">

                            <table className='table table-striped'>
                                <tr>
                                    <th>
                                        Name
                                    </th>
                                    <th>
                                        <button type='button' className='btn btn-info' onClick={newVariant}> + </button>
                                    </th>
                                </tr>
                                {variants ? variants.filter(v => v._id != product._id).map(pv => (
                                    <tr key={pv._id}>
                                        <td>
                                            <a href={"/admin/products/edit/" + pv._id}>
                                                {getLocalizedText(pv.name, i18n)}
                                            </a>

                                        </td>
                                        <td>
                                            {pv.mainProduct ? (<button type='button' className='btn btn-danger' onClick={() => removeVariant(pv._id)}>
                                                <MdDelete />
                                            </button>) : null}

                                        </td>
                                    </tr>
                                )) : null}
                            </table>



                        </div>
                    </Tab>

                    {/* <Tab eventKey="filters" title={t("product.filters")} tabClassName="tab-item">

                    </Tab> */}


                    {/* <Tab eventKey="options" title={t("product.options")} tabClassName="tab-item">
                        <ProductOptions productId={product._id} />
                    </Tab> */}

                    <Tab eventKey="shipping" title={t("product.packagingAndShipping")} tabClassName="tab-item">
                        <div className="mb-3">
                            <label htmlFor="packageLength" className="form-label">{t("product.length")} </label>
                            <input type="text" className="form-control" id="packageLength" value={product.packaging ? product.packaging.length : null} onChange={updatePackageLength} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="packageWidth" className="form-label">{t("product.width")} </label>
                            <input type="text" className="form-control" id="packageWidth" value={product.packaging ? product.packaging.width : null} onChange={updatePackageWidth} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="packageHeight" className="form-label">{t("product.height")} </label>
                            <input type="text" className="form-control" id="packageHeight" value={product.packaging ? product.packaging.height : null} onChange={updatePackageHeight} />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="packageWeight" className="form-label">{t("product.weight")} </label>
                            <input type="text" className="form-control" id="packageWeight" value={product.packaging ? product.packaging.weight : null} onChange={updatePackageWeight} />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="packageUnits" className="form-label">{t("product.numberOfUnits")} </label>
                            <input type="text" className="form-control" id="packageUnits" value={product.packaging ? product.packaging.numberOfUnits : null} onChange={updatePackageUnits} />
                        </div>



                        <div className="mb-3">
                            <label htmlFor="packageStacking" className="form-label">{t("product.stacking")} </label>
                            <select type="text" className="form-control" id="packageStacking" alue={product.packaging ? product.packaging.stacking : null} onChange={updatePackageStacking} >
                                <option>Stackable</option>
                                <option>Non-Stackable</option>
                            </select>
                        </div>
                    </Tab>




                    <Tab eventKey="dimensions" title={t("product.dimensions")} tabClassName="tab-item">
                        <div className="mb-3">
                            <label htmlFor="productLength" className="form-label">{t("product.length")} </label>
                            <input type="text" className="form-control" id="productLength" value={product.dimensions ? product.dimensions.length : null} 
                            onChange={updateDimensionsLength} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="productWidth" className="form-label">{t("product.width")} </label>
                            <input type="text" className="form-control" id="productWidth" value={product.dimensions ? product.dimensions.width : null} 
                            onChange={updateDimensionsWidth} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="productHeight" className="form-label">{t("product.height")} </label>
                            <input type="text" className="form-control" id="productHeight" value={product.dimensions ? product.dimensions.height : null} 
                            onChange={updateDimensionsHeight} />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="productWeight" className="form-label">{t("product.weight")} </label>
                            <input type="text" className="form-control" id="productWeight" value={product.dimensions ? product.dimensions.weight : null} 
                            onChange={updateDimensionsWeight} />
                        </div>

                       



                       
                    </Tab>



                    {/* <Tab eventKey="inventory" title={t("product.inventory")} tabClassName="tab-item" disabled>
                        <h1>Inventory</h1>
                    </Tab> */}

                    <Tab eventKey="related" title={t("product.relatedProducts")} tabClassName="tab-item" >
                        <h5>{t("product.relatedProducts")}</h5>
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>
                                            {t("product.productName")}
                                        </th>
                                        <th>

                                        </th>
                                    </tr>

                                    <tr>
                                        <th>
                                            <input type='text' className="form-control" placeholder={t("search")} onChange={searchForRelatedProducts} />
                                        </th>
                                        <th>

                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {relatedProducts.map(rp => (
                                        <tr key={rp._id}>
                                            <td>
                                                {rp.name.english}
                                            </td>
                                            <td className="row justify-content-end">
                                                <Link className="btn btn-sm btn-success" to="#" title={t("product.productOptions")} onClick={() => addRelatedProduct(rp)} ><MdAdd /> </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <hr />
                        <div className="table-responsive">
                            <table className="table  ">
                                <thead>
                                    <tr className='table-primary'>
                                        <th>
                                            {t("product.productName")}
                                        </th>
                                        <th>

                                        </th>
                                    </tr>


                                </thead>

                                <tbody>
                                    {product && product.relatedProducts ? product.relatedProducts.map(rp => (
                                        <tr key={rp._id}>
                                            <td>
                                                {rp.name.english}
                                            </td>
                                            <td className="row justify-content-end">
                                                <Link className="btn btn-sm btn-danger" to="#" title={t("product.productOptions")} onClick={() => removeRelatedProduct(rp._id)} ><MdDelete /> </Link>
                                            </td>
                                        </tr>
                                    )) : null}
                                </tbody>
                            </table>
                        </div>

                    </Tab>

                    <Tab eventKey="filters" title={t("product.filters")} tabClassName="tab-item" >
                        <h5>{t("product.filters")}</h5>
                        <hr />
                        <div className="mb-3">
                                <label htmlFor="keywords" className="form-label">{t("seo.keywords")}</label>
                                <LocalizedTextEditor placeholder={t("seo.keywords")} locale={contentLocale} textObject={product.keywords}
                                    onLocalChanged={changeLocale} onChange={updateKeywords} />
                            </div>

                        {product.category && product.category.filters ? (product.category.filters.map(cf => (
                            <div className='col-12' key={cf._id}>
                                <input type="checkbox" id={"filter_" + cf._id}
                                    checked={product.filters && product.filters.filter(pf => pf == cf._id).length > 0}
                                    onChange={() => toggleFilter(cf._id)}
                                />
                                <label className='ml-3 mr-3' htmlFor={"filter_" + cf._id}>
                                    {getLocalizedText(cf.name, i18n)}
                                </label>

                            </div>
                        ))

                        ) : null}
                    </Tab>


                </Tabs>

                <div className=" row col justify-content-end" >
                    <Link className="add-btn btn-danger" to='/admin/products' >
                        <MdClose />
                        &nbsp;&nbsp;
                        {t("close")}
                    </Link> &nbsp;
                    <button type="button" className="add-btn btn-primary" onClick={doPost}>
                        <MdSave />
                        &nbsp;&nbsp;
                        {t("dashboard.save")}
                    </button>
                </div>

            </div>

        </div>

    )
}

export default EditProduct;