import React,{ useState, useEffect } from "react";
import { getProducts } from "../Products/ProductsAPI";

const ProductSelection = (props) => {

    const [products, setProducts] = useState([]);
    const [productId, setProductId] = useState(0);
    

    useEffect(() => {
        getProducts().then(res => {
            setProducts(res.data);
        });
    }, []);

    const addProduct = () => {
        if(props.productSelected){
            props.productSelected(productId);
        }
    }

    return (<>
        <div className="form-group">
            <label className="control-label">Select Product: </label>
            <select className="form-control" value={productId} onChange={(event) => {setProductId(event.target.value)}}>
                {
                    products.map(p => (
                        <option value={p.id} key={p.id.toString()}> {p.name.arabic}</option>
                    ))
                }
            </select>
        </div>
        <div className="form-group text-left">
            <button className="btn btn-primary" onClick={() => addProduct()}>Add Product</button>
        </div>
    </>);
}


export default ProductSelection;