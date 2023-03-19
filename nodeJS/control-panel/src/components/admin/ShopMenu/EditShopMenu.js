import React,{ useState, useEffect } from 'react'
import { useTranslation } from "react-i18next"
import { toast } from 'react-toastify'
import Loader from "react-loader-spinner"
import { MdCollectionsBookmark } from "react-icons/md"
import { updateShopMenu, getShopMenuByShopId } from './ShopMenuAPI'
import { Link, useParams } from 'react-router-dom'
import ProductSelection from './ProductSelector'
import { getProducts, removeProduct } from "../Products/ProductsAPI";
//import ListImages from '../Images/ListImages'


const EditShopMenu = (props) => {

    const [menu, setMenu] = useState({ categories: [] });
    const [category, setCategory] = useState({ name: { english: "", arabic: "" } });
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const { shopId } = useParams();
    const [categoryId, setCategoryId] = useState(0);


    useEffect(() => {
        getShopMenuByShopId(shopId).then(res => {
            let theMenu = res.data;
            if (!theMenu) {
                console.log("No Menu for this Shop.");
                theMenu = { categories: [] };
            }
            if (!theMenu.categories) {
                theMenu.categories = [];
            }
            setMenu(theMenu);
        });

        getProducts().then(res => {
            setProducts(res.data);
        });
    }, []);


    const updateCategoryName = (event) => {
        let cloned = JSON.parse(JSON.stringify(category));
        cloned.name.english = event.target.value;
        setCategory(cloned);
    }

    const updateCategoryNameArabic = (event) => {
        let cloned = JSON.parse(JSON.stringify(category));
        cloned.name.arabic = event.target.value;
        setCategory(cloned);
    }

    const addCategory = () => {
        let cloned = JSON.parse(JSON.stringify(menu));
        cloned.categories.push(category);
        setMenu(cloned);
        setCategory({ name: { english: "", arabic: "" } });
    }

    const doPost = () => {
        setLoading(true);
        updateShopMenu(menu).then(res => {
            setLoading(false);
            toast.success(t("succeed"));
            // window.location.href = "/admin/shop-menu";
        }).catch(e => {
            setLoading(false);
            toast.error(t(e.message));
        })
    }

    const addProduct = (productId) => {
        let clonedMenu = JSON.parse(JSON.stringify(menu));
        let selectedMenuCategory = clonedMenu.categories.filter(c => c.id == categoryId)[0];
        let selectedProduct = products.filter(p => p.id == productId)[0];
        if (!selectedMenuCategory.products) {
            selectedMenuCategory.products = [];
        }
        selectedMenuCategory.products.push(JSON.parse(JSON.stringify(selectedProduct)));
        setMenu(clonedMenu);
        setCategoryId(0);

    }

    const updateCategory = () => {
        let clonedMenu = JSON.parse(JSON.stringify(menu));
        let selectedMenuCategory = clonedMenu.categories.filter(c => c.id == categoryId)[0];
        selectedMenuCategory.name.english = category.name.english;
        selectedMenuCategory.name.arabic = category.name.arabic;

        setMenu(clonedMenu);
        setCategory({ name: { english: "", arabic: "" } });
    }

    const removeProduct = (catId, prodId) => {
        let clonedMenu = JSON.parse(JSON.stringify(menu));
        let selectedMenuCategory = clonedMenu.categories.filter(c => c.id == catId)[0];

        if (!selectedMenuCategory.products) {
            selectedMenuCategory.products = [];
        }
        selectedMenuCategory.products = selectedMenuCategory.products.filter(p => p.id != prodId);
        setMenu(clonedMenu);
        setCategoryId(0);
    }


    return (<>
        <div className="card">
            <div className="card-body">
                <h5 className="card-title"><MdCollectionsBookmark /> {t("dashboard.editMenu")}</h5>
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
                        <label htmlFor="title" className="form-label">{t("dashboard.category")} ({t("dashboard.english")}) </label>
                        <input type="text" className="form-control" id="title" value={category.name.english} onChange={updateCategoryName} />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="titleArabic" className="form-label">{t("dashboard.category")} ({t("dashboard.arabic")}) </label>
                        <input type="text" className="form-control" id="titleArabic" value={category.name.arabic} onChange={updateCategoryNameArabic} />
                    </div>

                    <div className=" row col justify-content-end" >
                        <button type="button" className="btn btn-primary" onClick={updateCategory}>{t("shopMenu.updateMenuCategory")}</button>
                        &nbsp;
                        <button type="button" className="btn btn-primary" onClick={addCategory}>{t("shopMenu.addMenuCategory")}</button>
                    </div>


                    <hr />
                    <div className=" row col justify-content-end" >
                        <Link className="btn btn-warning" to='/admin/shops' >{t("close")}</Link> &nbsp;
                        <button type="button" className="btn btn-primary" onClick={doPost}>{t("dashboard.save")}</button>
                    </div>
                </form>
            </div>
        </div>


        <div className="card">
            <div className="card-body">
                <h5 className="card-title"><MdCollectionsBookmark /> {t("shopMenu.categories")}</h5>
                <hr />
                {
                    categoryId != 0 ? <ProductSelection productSelected={addProduct} /> : <></>
                }

                <div className="table-responsive">
                    <table className="table   table-stiped">
                        <thead>
                            {

                                menu.categories ? menu.categories.map(item => (
                                    <>
                                        <tr style={{ backgroundColor: '#e6f2ff' }}>
                                            <th>
                                                {item.name.arabic}
                                            </th>
                                            <th>
                                                <button type="button" className="btn btn-primary" onClick={() => { setCategory(item); setCategoryId(item.id) }} >{t("shopMenu.editCategory")}</button>
                                                &nbsp;
                                                <button type="button" className="btn btn-primary" onClick={() => setCategoryId(item.id)} >{t("shopMenu.addProduct")}</button>
                                            </th>
                                        </tr>

                                        <tr>


                                            <td colSpan="2">
                                                <div className="row">
                                                    {
                                                        item.products ? item.products.map(p => (
                                                            <div className="col col-4" key={p.id.toString()}>
                                                                <div className="card">
                                                                    <div className="card-body">
                                                                        <h5 className="card-title">
                                                                            {p.id} :
                                                                            {p.name.arabic}
                                                                        </h5>
                                                                        <hr />
                                                                        <b>{p.price} $</b>
                                                                        <hr />
                                                                        <a href="#" className="btn btn-danger" onClick={() => removeProduct(item.id, p.id)}>Remove</a>
                                                                    </div>
                                                                </div>
                                                                <br />
                                                            </div>)) : <></>
                                                    }
                                                </div>

                                            </td>
                                        </tr>


                                    </>
                                )) : <></>}

                        </thead>
                    </table>
                </div>
            </div>
        </div>

    </>);
}

export default EditShopMenu;
