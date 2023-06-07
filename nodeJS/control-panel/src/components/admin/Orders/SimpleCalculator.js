import React, { useState, useEffect } from 'react'
import { useTranslation } from "react-i18next"
import { Link } from 'react-router-dom'
import { MdAddShoppingCart, MdOutlineRequestQuote } from "react-icons/md";
import { getFinalPrice, getOriginalPrice } from '../utils/PriceUtils';
import { toast } from 'react-toastify'




const SimpleCalculator = (props) => {


    const [qty, setQty] = useState(1);
    const { t, i18n } = useTranslation();

    const increment = () => {
        setQty(qty + 1);
        if (props.handleCalculatorChange) {
            props.handleCalculatorChange(qty);
        }
    }

    const updateQty = (event) => {
        let minQty = props.product.minimumOrderQty;
        if (!minQty) {
            minQty = 1;
        }
        if (event.target.value >= minQty) {
            setQty(event.target.value);
        }
    }

    const decrement = () => {
        let minQty = props.product.minimumOrderQty;
        if (!minQty) {
            minQty = 1;
        }
        if (qty > minQty) {
            setQty(qty - 1);
        }
        if (props.handleCalculatorChange) {
            props.handleCalculatorChange(qty);
        }

    }


    const handleProductAdded = (item, qty) => {
      if(props.onProductAdded){
        props.onProductAdded(item, qty);
      }
    }

   

    useEffect(() => {
        let minQty = props.product.minimumOrderQty;
        if (!minQty) {
            minQty = 1;
        }
        setQty(minQty);

    }, [props.product]);
    return (<>


        <div className="addtocart-form quantite-article" style={{ textAlign: 'center' }}>
            <div className="row ml-0 mr-0 mb-15 justify-content-center align-items-center">
                <div className="input-group col p-0">
                    <span>
                        <button className="btn btn-default btn-dec btn-uc" onClick={decrement} style={{ height: '43px' }}>
                            -
                        </button>
                    </span>
                    <input type="text" min="6.00" max="99999" className="form-control text-center" value={qty} onChange={updateQty} />
                    <span>
                        <button className="btn btn-default btn-inc btn-uc" onClick={increment} style={{ height: '43px' }} >
                            +
                        </button>
                    </span>
                </div>
                <span className="pl-2 pr-2">
                    {t("product.units")}
                </span>

            </div>

            <div className='row p-2'>
                <span style={{ textAlign: 'center', fontSize: '18px', color: 'green', width: '100%' }}>

                    {(getFinalPrice(props.product) * qty).toFixed(2)} &nbsp;
                    {props.product.price ? (props.product.price.currencyCode) : null}
                </span>

            </div>


        </div>


        <div className="boutons pt-1">

            {props.product.quotationOnly ? (<></>) : (
            <button type="button"
                className="btn btn-primary  w-100 text-19 mt-10 shadow"
                onClick={() => handleProductAdded(props.product, qty)}>
                <MdAddShoppingCart />    {t("product.addProduct")}
            </button>)}




            {/* <Link className="btn btn-dark  w-100 mt-3 shadow" to="#"
                onClick={() => handleProductAdded(props.product, qty)} >
                <MdOutlineRequestQuote />   {t("product.addToQuote")}
            </Link> */}
        </div>

    </>
    )
}


export default SimpleCalculator;