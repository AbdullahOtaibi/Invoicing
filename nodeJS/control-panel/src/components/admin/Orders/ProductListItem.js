import React, { useState, useEffect } from 'react'
import { useTranslation } from "react-i18next"
import { Link } from 'react-router-dom'
import SimpleCalculator from './SimpleCalculator';
import { MdInfoOutline, MdOutlineInfo } from "react-icons/md"
import { Modal, Button, Dropdown, DropdownButton } from 'react-bootstrap'
import { getFinalPrice, getOriginalPrice } from '../utils/PriceUtils'
import { getLocalizedUrl, getLocalizedText, getProductThumb } from '../utils/utils'





const ProductListItem = (props) => {
    const { t, i18n } = useTranslation();
   
    const [productLink, setProductLink] = useState("/product/" + ((""+props.product.alias).toLowerCase()) || "/");

    

    const getProductLink = (id) => {
        return "/product/" + ((""+props.product.alias).toLowerCase());
        
    }

   

    const handleProductAdded = (product, qty) => {
        if(props.onProductAdded){
            props.onProductAdded(product, qty);
          }
    }

    return (<>
        {props.product ? (<>
            <div className="blocArticle col-12  mb-3 "  >
                <div className="content product-cell p-2 card border-1" >
                    <div className="row">
                        <div className="col-lg-4 col-sm-12  mb-lg-0 align-self-center">
                            <div className="align-items-center">

                                <Link to={productLink} link-type="productDetailLink">
                                    <img alt={getLocalizedText(props.product.name, i18n)} className="img-produit img-fluid"
                                        src={getProductThumb(props.product)}
                                        style={{ width: '100%', height: '100%' }} />
                                </Link>



                            </div>
                        </div>
                        <div className="col-lg-4 px-0">
                            <div className="row prix">
                                <div className="col-md-12">
                                    <div className="row align-items-center">
                                        <div className="col-12">
                                            <div className="text-center">

                                                <Link link-type="productDetailLink" to={productLink}
                                                    className="grey-default-color"
                                                    style={{ fontWeight: 'bold', color: '#343a40' }}

                                                >
                                                    <h3 className='normal-text'>
                                                        {getLocalizedText(props.product.name, i18n)}
                                                    </h3>
                                                </Link>
                                                &nbsp;
                                               

                                                {/* <div className="libelle-diff">Diamètre 10 mm</div> */}
                                                {props.product.alias ? (<div className="">
                                                    <span style={{ fontWeight: 'bold' }}>{t("product.code")} :
                                                    </span>
                                                    {props.product.alias}
                                                </div>) : null}

                                                {props.product.productVariants && props.product.productVariants.length > 0 ? (
                                                    <DropdownButton id="dropdown-item-button" title={t("product.alsoAvailableIn")} variant="secondary" className="mt-2">
                                                        {props.product.productVariants.map(pv => (
                                                            <Dropdown.Item as="a" key={pv._id} href={getLocalizedUrl(getProductLink(pv._id))}>
                                                                {getLocalizedText(pv.name, i18n)}
                                                            </Dropdown.Item>)
                                                        )}


                                                    </DropdownButton>) : null}






                                            </div>

                                            <div className="stock-prix pl-3 pr-3 pt-2" style={{ textAlign: 'center' }}>
                                                <div className="prices">
                                                    <div className="prix-principal-tab">
                                                        <span className="prix-principal">
                                                            {props.product.discountPercentage && props.product.discountPercentage != null && props.product.discountPercentage > 0 ? (<>
                                                                <span className="text-danger"
                                                                    style={{ textDecorationLine: 'line-through' }}>&nbsp;
                                                                    {props.product.price ? (props.product.price.currencyCode == 'USD' ? '$' : props.product.price.currencyCode) : null}  {props.product.price ? getOriginalPrice(props.product) : null}
                                                                    <span style={{ fontSize: '16px' }}> / {t("product.unit")}</span>
                                                                </span><br /></>) : null}


                                                            <span>{getFinalPrice(props.product)} &nbsp;
                                                                {props.product.price ? props.product.price.currencyCode : null}
                                                                <small> / {t("product.unit")} </small></span>
                                                        </span>
                                                        {props.product.availableInStock ? (null) : (<>
                                                            <br />
                                                            <span className="text-danger" style={{ fontSize: '1em' }}>Out of Stock</span>
                                                        </>)}

                                                        <button href="#" className="d-none d-md-inline-flex tooltip-info" data-toggle="tooltip" data-placement="left" data-html="true" title="">
                                                            <i className="fa fa-question-circle-o fa-palette"></i>
                                                        </button>
                                                    </div>


                                                </div>
                                                <eco-taxe></eco-taxe>
                                            </div>

                                            <div className='row'>

                                                {props.product.minimumOrderQty > 1 ? (<span className='text-info' style={{ textAlign: 'center', fontSize: '12px', width: '100%' }}>
                                                    <MdOutlineInfo size={16} />    {t("product.minimumOrderQty")} :  {props.product.minimumOrderQty}
                                                </span>) : null}

                                            </div>


                                        </div>
                                    </div>
                                </div>


                            </div>
                        </div>

                        <div className="col-lg-4 prix ">
                            <div className="row align-items-center">
                                <div className="col-12">
                                    <SimpleCalculator product={props.product} onProductAdded={handleProductAdded} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

         



        </>) : (<></>)}
    </>
    )
}


export default ProductListItem;