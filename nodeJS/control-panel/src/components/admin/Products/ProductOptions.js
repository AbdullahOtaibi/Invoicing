import React,{ useState, useEffect } from 'react'
import { useTranslation } from "react-i18next"
import { toast } from 'react-toastify'
import { ThreeDots } from  'react-loader-spinner'
import { updateProduct, getProduct } from './ProductsAPI'
import { MdCollectionsBookmark, MdDelete, MdEdit, MdContentCopy, MdTune, MdDashboard } from "react-icons/md"
import { Link } from 'react-router-dom'


const ProductOptions = (props) => {

    const [product, setProduct] = useState({ name: { arabic: "", english: "" }, description: { arabic: "", english: "" } });
    const [group, setGroup] = useState({ description: { english: "", arabic: "" } });
    const [productOption, setProductOption] = useState({ description: { english: "", arabic: "" }, price: 0 });
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const productId = props.productId;

    useEffect(() => {
        setLoading(true);
        getProduct(productId).then(res => {
            setProduct(res.data);
            setLoading(false);

        }).catch(e => {
            setLoading(false);
        });

    }, []);

    const updateOptionPrice = (event) => {
        let cloned = JSON.parse(JSON.stringify(productOption));
        cloned.cost = event.target.value;
        setProductOption(cloned);
    }

    const updateOptionDesc = (event) => {
        let cloned = JSON.parse(JSON.stringify(productOption));
        cloned.description.english = event.target.value;
        setProductOption(cloned);
    }
    const updateOptionDescAr = (event) => {
        let cloned = JSON.parse(JSON.stringify(productOption));
        cloned.description.arabic = event.target.value;
        setProductOption(cloned);
    }

    const updateGroupDesc = (event) => {
        let cloned = JSON.parse(JSON.stringify(group));
        cloned.description.english = event.target.value;
        setGroup(cloned);
    }

    const updateGroupMin = (event) => {
        let cloned = JSON.parse(JSON.stringify(group));
        cloned.minimumAllowed = event.target.value;
        setGroup(cloned);
    }

    const updateGroupMax = (event) => {
        let cloned = JSON.parse(JSON.stringify(group));
        cloned.maximumAllowed = event.target.value;
        setGroup(cloned);
    }


    const updateGroupDescAr = (event) => {
        let cloned = JSON.parse(JSON.stringify(group));
        cloned.description.arabic = event.target.value;
        setGroup(cloned);
    }

    const addCategoryGroup = () => {
        let cloned = JSON.parse(JSON.stringify(product));
        let editMode = group.id != 0;
        if (!cloned.options) {
            cloned.options = [];
        }
        if (group.id == 0) {
            group.id = new Date().getTime();
        }
        if (editMode) {
            cloned.options = cloned.options.filter(g => g.id != group.id);

        }
        cloned.options.push(group);



        //  cloned.name.english = event.target.value;
        setProduct(cloned);
        setGroup({ description: { english: "", arabic: "" } });
    }

    const addProductOption = (groupId) => {
        let clonedProduct = JSON.parse(JSON.stringify(product));
        let clonedGroup = clonedProduct.options.filter(g => g.id == groupId)[0];
        if (!clonedGroup.options) {
            clonedGroup.options = [];
        }
        if (productOption.id != 0) {
            clonedGroup.options = clonedGroup.options.filter(op => op.id != productOption.id);
        }
        clonedGroup.options.push(productOption);
        setProduct(clonedProduct);
        //setProductOption({ description: { english: "", arabic: "" }, price: 0 });

    }

    const saveProductOptions = () => {
        setLoading(true);
        updateProduct(product).then(res => {
            setLoading(false);
            toast.success(t("succeed"));
            //window.location.href = "/admin/products";
        }).catch(e => {
            setLoading(false);
            toast.error(t(e.message));
        });
    }

    return (<>
        <div className="card">
            <div className="card-body">
                <h5 className="card-title"><MdTune /> {t("product.productOptions")}</h5>
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
                        <h5>{product.name.arabic} </h5>
                        <hr />
                    </div>
                    <div className="row">
                        <div className="mb-3 col">
                            <label htmlFor="groupDesc" className="form-label">
                                {t("product.productOptionsCategory")} ({t("dashboard.english")})

                            </label>
                            <input type="text" className="form-control" id="groupDesc" value={group.description.english} onChange={updateGroupDesc} />
                        </div>
                        <div className="mb-3 col">
                            <label htmlFor="groupDescAr" className="form-label">{t("product.productOptionsCategory")} ({t("dashboard.arabic")}) </label>
                            <input type="text" className="form-control" id="groupDescAr" value={group.description.arabic} onChange={updateGroupDescAr} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="mb-3 col">
                            <label htmlFor="minAllowed" className="form-label">{t("product.minAllowed")}  </label>
                            <input type="number" className="form-control" id="minAllowed" value={group.minimumAllowed} onChange={updateGroupMin} />
                        </div>
                        <div className="mb-3 col">
                            <label htmlFor="maxAllowed" className="form-label">{t("product.maxAllowed")}  </label>
                            <input type="number" className="form-control" id="maxAllowed" value={group.maximumAllowed} onChange={updateGroupMax} />
                        </div>
                    </div>

                    <div className=" row col justify-content-end" >
                        <Link className="btn btn-warning" to='/admin/products' >{t("close")}</Link>
                        &nbsp;
                        <button type="button" className="btn btn-primary" onClick={addCategoryGroup}>{t("dashboard.add")}</button>
                        &nbsp;
                        <button type="button" className="btn btn-primary-1" onClick={saveProductOptions}>{t("dashboard.save")}</button>
                    </div>


                </form>
            </div>
        </div>
        <br />

        {
            product.options ? product.options.map(og => (<>
                <div className="card">
                    <div className="card-body">
                        {og.description.arabic}
                        &nbsp; <button type="button" className="btn btn-sm btn-primary" onClick={() => setGroup(og)}><MdEdit /></button>
                        <hr />
                        &nbsp;
                        <div className="row">
                            <div className="col">
                                {t("product.description")}
                            </div>
                            <div className="col">
                                <input type="text" className="form-control" placeholder={t("dashboard.english")} onChange={updateOptionDesc} value={productOption.description.english} />
                            </div>
                            <div className="col">
                                <input type="text" className="form-control" placeholder={t("dashboard.arabic")} onChange={updateOptionDescAr} value={productOption.description.arabic} />
                            </div>
                            <div className="col">
                                <input type="number" className="form-control" style={{ width: 100 }} placeholder={t("product.price")} value={productOption.cost} onChange={updateOptionPrice} />
                            </div>
                            <div className="col">
                                <button type="button" className="btn btn-primary" onClick={() => addProductOption(og.id)} >{t("product.addOption")}</button>
                            </div>
                        </div>
                        <br />
                        <div className="table-responsive">
                            <table className="table  ">
                                <thead>
                                    <tr>
                                        <th> {t("product.option")} ({t("dashboard.arabic")})</th>
                                        <th>{t("product.option")} ({t("dashboard.english")})</th>
                                        <th> {t("product.price")} </th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        og.options ? og.options.map(op => (<tr>
                                            <td>{op.description.arabic}</td>
                                            <td>{op.description.english}</td>
                                            <td>{op.cost}</td>
                                            <td><button type="button" className="btn btn-sm btn-primary" onClick={() => setProductOption(op)}><MdEdit /></button></td>
                                        </tr>)) : <></>
                                    }

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <br />
            </>)) : <></>
        }


    </>);
}

export default ProductOptions;