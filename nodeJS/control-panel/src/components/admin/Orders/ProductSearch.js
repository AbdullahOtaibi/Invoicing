import React, { useState, useEffect } from 'react'
import { useTranslation } from "react-i18next"
import { MdCollectionsBookmark, MdDelete, MdEdit, MdAdd, MdLocalShipping } from "react-icons/md"
import { ThreeDots } from  'react-loader-spinner'
import { Link, useNavigate } from 'react-router-dom'
import { getLocalizedText } from '../utils/utils'
import { customSearch } from './OrdersAPI'
import ProductListItem from './ProductListItem'





const ProductSearch = (props) => {

    let navigate = useNavigate();


    const { t, i18n } = useTranslation();
    const [searchText, setSearchText] = useState('');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const searchTextUpdated = (event) => {
        setSearchText(event.target.value);
        if (event.target.value.length > 3) {
            doSearch();
        }
    }

    const doSearch = () => {
        
        if (searchText.length > 0) {
            setLoading(true);
            customSearch(searchText).then(res => {
                //setSearchText('');
                console.log(res.data);
                setProducts(res.data.products);
                setLoading(false);

            }).catch(e => {
                setLoading(false);
            });
        }
    }

   
    const handleProductAdded = (product, qty) => {
        if(props.onProductAdded){
            props.onProductAdded(product, qty);
          }
    }


    return (
        <div className="conatiner">
            <div className='row'>
                <div className='col'>
                    <input type='text' className='form-control' placeholder={t("search")} onChange={searchTextUpdated} />
                </div>
            </div>
            <br/>
            <ThreeDots
                                        type="ThreeDots"
                                        color="#00BFFF"
                                        visible={loading}
                                        height={20} />
            {products && products.length > 0 ? (
                <>
                    {
                    products.map(product => (
                        <div className='row' key={product._id}>
                        <ProductListItem product={product} onProductAdded={handleProductAdded}  />
                        </div>
                    ))}
                </>) : (<></>)}
        </div>
    )
}

export default ProductSearch;