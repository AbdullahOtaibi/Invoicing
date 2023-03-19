import React, { useState, useEffect } from 'react'
import { useTranslation } from "react-i18next"
import { MdCollectionsBookmark, MdDelete, MdEdit, MdContentCopy, MdAdd, MdSearch, MdClose, MdRefresh } from "react-icons/md"
import { getMyProducts, removeProduct, cloneProduct, getAdminProducts, applyToAll, updateApproved, updatePublished, getCompanies } from './ProductsAPI'
import Loader from "react-loader-spinner"
import { Link, useParams, useNavigate } from 'react-router-dom'
import { getLocalizedText } from '../utils/utils'
import { hasPermission } from '../utils/auth';
import { Helmet } from "react-helmet";

const ListProducts = (props) => {

    let navigate = useNavigate();
    if (!hasPermission('products.view')) {
        navigate("/admin", { replace: true });
    }

    const { t, i18n } = useTranslation();
    const [products, setProducts] = useState([]);
    const [all, setAll] = useState([]);
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(false);
    const [sortOrder, setSortOrder] = useState(true);
    const { categoryIdParam, companyIdParam } = useParams();
    const [page, setPage] = useState(0);
    const [pages, setPages] = useState(0);
    const [filters, setFilters] = useState({});
    const [companies, setCompanies] = useState([]);
    const [search, setSearch] = useState(false);




    const loadPage = (newPage) => {
        if (newPage < 0 || (newPage >= pages && pages > 0)) {
            return;
        }

        let cloned = JSON.parse(JSON.stringify(filters));
        cloned.page = newPage;
        setFilters(cloned);
        doFilter(cloned);
    }

    const toPage = (e) => {
         loadPage(e.target.value);
    }
    useEffect(() => {
        getCompanies().then(res => {
            setCompanies(res.data);
        }).catch(e => {
            console.error(e);
        });
    }, []);
    useEffect(() => {
        // fixCategories();
        // getCompanies().then(res => {
        //     setCompanies(res.data);
        // }).catch(e => {

        // });

        let cloned = JSON.parse(JSON.stringify(filters));
        if (companyIdParam && companyIdParam != 0) {

            cloned.companyId = companyIdParam;

        }

        if (categoryIdParam) {

            cloned.category = categoryIdParam;

        }
        setFilters(cloned);
        doFilter(cloned);
    }, []);

    const deleteProduct = (id) => {
        let confirmed = window.confirm('are you sure yo want to delete this product ?');
        if (confirmed == true) {
            removeProduct(id).then(res => {
                setProducts(products.filter(p => p._id != id));
                setAll(all.filter(p => p._id != id));
            });
        }
    }

    const sortByName = () => {
        const cloned = JSON.parse(JSON.stringify(products));
        var order = 1;
        if (sortOrder) {
            order = -1;
        }
        cloned.sort(function (a, b) { return a.name.english.localeCompare(b.name.english) * order });
        setSortOrder(!sortOrder);
        setProducts(cloned);
    }

    const sortByAlias = () => {
        const cloned = JSON.parse(JSON.stringify(products));
        var order = 1;
        if (sortOrder) {
            order = -1;
        }

        cloned.sort(function (a, b) { if (a.alias != undefined && b.alias != undefined) { return a.alias.localeCompare(b.alias) * order } else { return 0 } });
        setSortOrder(!sortOrder);
        setProducts(cloned);
    }

    const filterByName = (event) => {
        const filter = event.target.value;
        setProducts(all.filter(prod => prod.name.english.toLowerCase().indexOf(filter.toLowerCase()) != -1));
    }

    const filterByAlias = (event) => {
        const filter = event.target.value;
        setProducts(all.filter(prod => prod.alias != undefined && prod.alias.toLowerCase().indexOf(filter.toLowerCase()) != -1));
    }


    const cloneSelectedProduct = (id) => {
        cloneProduct(id).then(res => {
            getMyProducts(page).then(res2 => {
                setProducts(res2.data);
            }).catch(error => {

            })
        });


    }
    const updateOffersFilter = (event) => {
        const cloned = JSON.parse(JSON.stringify(filters));
        cloned.offers = event.target.checked;
        setFilters(cloned);
    }

    const updateApprovalFilter = (event) => {
        const cloned = JSON.parse(JSON.stringify(filters));
        cloned.needsApproval = event.target.checked;
        setFilters(cloned);
    }

    const updatePublishedFilter = (event) => {
        const cloned = JSON.parse(JSON.stringify(filters));
        if (filters.published == null) {
            cloned.published = true;
        } else if (filters.published == true) {
            cloned.published = false;
        } else if (filters.published == false) {
            cloned.published = null;
        }

        setFilters(cloned);
    }

    const updatecompanyId = (event) => {
        const cloned = JSON.parse(JSON.stringify(filters));
        cloned.companyId = event.target.value;
        setFilters(cloned);
    }
    const updateFiltersAlias = (event) => {
        const cloned = JSON.parse(JSON.stringify(filters));
        cloned.alias = event.target.value;
        setFilters(cloned);
    }



    const updateSKU = (event) => {
        const cloned = JSON.parse(JSON.stringify(filters));
        cloned.sku = event.target.value;
        setFilters(cloned);
    }


    const updateFiltersProductName = (event) => {
        const cloned = JSON.parse(JSON.stringify(filters));
        cloned.productName = event.target.value;
        setFilters(cloned);
    }

    const doFilter = (filtersObj) => {
        setLoading(true);
        getAdminProducts(filtersObj).then(res => {
            setLoading(false);
            //console.log(res.data);
            setProducts(res.data.items);
            setAll(res.data.items);
            setPage(res.data.page);
            setPages(res.data.pages);
        }).catch(e => {
            setLoading(false);
        });
    }





    const toggleApprovedIfAdmin = (event, id) => {
        updateApproved(id, event.target.checked).then(res => {
            if (res.data.success == true) {
                let cloned = JSON.parse(JSON.stringify(products));
                let selectedItem = cloned.filter(p => p._id == id)[0];
                selectedItem.approved = res.data.approved;
                setProducts(cloned);
            }
        }).catch(e => {
            console.error(e);
        });

    }

    const togglePublish = (event, id) => {
        updatePublished(id, event.target.checked).then(res => {
            if (res.data.success == true) {
                let cloned = JSON.parse(JSON.stringify(products));
                let selectedItem = cloned.filter(p => p._id == id)[0];
                selectedItem.published = res.data.published;
                setProducts(cloned);
            }
        }).catch(e => {
            console.error(e);
        });

    }

    const reloadData = () => {
        doFilter(filters);
    }


    return (
        <div className="conatiner">
            <Helmet>
                <title>{'Invoicing | Admin | Products'} </title>
            </Helmet>
            <div className="card">
                <div className="card-body">


                    <div className='row'>
                        <div className='col col-auto'>
                            <h5 className="card-title"><MdCollectionsBookmark /> {t("product.products")}
                                &nbsp;
                            </h5>
                        </div>

                        <div className='col text-end'>

                            <nav aria-label="Page navigation example">
                                <ul className="pagination">

                                    {pages > 1 ? (<li className="page-item"><label className="page-link" href="#" onClick={() => loadPage(page - 1)}>Previous</label></li>) : null}

                                    {pages > 0 ? (<li className="page-item active" >
                                        <label className="page-link" >
                                            {parseInt(page) + 1} / {pages}
                                        </label>
                                    </li>) : null}



                                    {pages > 1 ? (<li className="page-item"><label className="page-link" href="#" onClick={() => loadPage(page + 1)}>Next</label></li>) : null}

                                </ul>
                            </nav>
                        </div>
                        <div className='col' style={{ textAlign: 'end' }}>
                            <button className='add-btn btn-info mx-2'
                                onClick={reloadData} style={{ cursor: 'pointer', paddingLeft: '8px', paddingRight: '8px' }}
                                title='reload data'
                            >
                                <MdRefresh size={20} />
                            </button>
                            {!search ? (<Link className="add-btn btn-dark" to={"#"} onClick={() => setSearch(!search)}><MdSearch size={20} />  {t("search")}</Link>) : null}
                            &nbsp;
                            {hasPermission('products.modify') ? (<Link className="add-btn" to={"/admin/products/create"}><MdAdd size={20} />  {t("dashboard.add")}</Link>) : null}
                        </div>
                    </div>



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
                    {category != null ? (<>
                        <a href="/admin/product-categories" > {t("sidebar.productCategories")} </a> &nbsp; / &nbsp;
                        {getLocalizedText(category.name, i18n)}

                        <br /><br />
                    </>) : null}

                    {search ? (<div className='row'>
                        <div className='col-12'>
                            <div className='filters' style={{ border: 'solid 1px' }}>
                                <div className='row p-3'>
                                    <div className="col-6 p-3 form-check">
                                        <div className="custom-control custom-checkbox">
                                            <input type="checkbox" className="custom-control-input" id="offersCheck" checked={filters.offers} onChange={updateOffersFilter} />
                                            <label className="custom-control-label bold" htmlFor="offersCheck">{t("product.withOffersOnly")}</label>
                                        </div>
                                    </div>
                                    {localStorage.getItem("role") == "Administrator" ? (<div className="col-6 p-3  form-check">
                                        <div className="custom-control custom-checkbox">
                                            <input type="checkbox" className="custom-control-input" id="approvalCheck" checked={filters.needsApproval} onChange={updateApprovalFilter} />
                                            <label className="custom-control-label bold" htmlFor="approvalCheck">{t("product.needsApprovalOnly")}</label>
                                        </div>
                                    </div>) : null}


                                    <div className="col-12 p-3  form-check">
                                        <div className="custom-control custom-checkbox">
                                            <label>Status &nbsp;</label>
                                            <button type="button" className={filters.published == false ? "add-btn btn-danger" : "add-btn btn-success"} id="publishedCheck"
                                                onClick={updatePublishedFilter} >
                                                {filters.published == true ? "Show Published Only" : null}
                                                {filters.published == false ? "Show unpublished Only" : null}
                                                {filters.published == null ? "Show All" : null}

                                            </button>

                                        </div>
                                    </div>

                                    {localStorage.getItem("role") == "Administrator" ? (<div className="col-6 mb-3">
                                        <label htmlFor="company" className="form-label">{t("product.company")} </label>
                                        <select type="text" className="form-control" id="company" value={filters.companyId} onChange={updatecompanyId} >
                                            <option value="">All companies</option>
                                            {companies.map(v => (<option key={v._id} value={v._id}>{getLocalizedText(v.name, i18n)}</option>))}
                                        </select>
                                    </div>) : null}

                                    <div className="col-6 mb-3">
                                        <label htmlFor="sku" className="form-label">{t("product.sku")} </label>
                                        <input type="text" className="form-control" id="sku" value={filters.sku} onChange={updateSKU} />

                                    </div>

                                    {localStorage.getItem("role") == "Administrator" ? (<div className="col-6 mb-3">
                                        <label htmlFor="sku" className="form-label">{t("product.alias")} </label>
                                        <input type="text" className="form-control" id="sku" value={filters.alias} onChange={updateFiltersAlias} />

                                    </div>) : null}

                                    <div className="col-6 mb-3">
                                        <label htmlFor="name" className="form-label">{t("product.name")} </label>
                                        <input type="text" className="form-control" id="name" value={filters.productName} onChange={updateFiltersProductName} />

                                    </div>

                                    <div className="col-6 mb-3">
                                        <button type='button' className='add-btn btn-danger' onClick={() => setSearch(false)}>
                                            <MdClose /> &nbsp;&nbsp;
                                            {t("close")}
                                        </button>
                                        &nbsp;

                                        <button type='button' className='add-btn btn-primary' onClick={() => doFilter(filters)}>
                                            <MdSearch /> &nbsp;&nbsp;
                                            {t("search")}
                                        </button>
                                    </div>



                                </div>
                                <br /><br />

                            </div>
                        </div>
                    </div>) : null}

                    <div className="table-responsive">
                        <table className="table   table-hover table-sm">
                            <thead>
                                <tr>
                                    <th>
                                        <a href="#" onClick={sortByName}>
                                            {t("product.productName")}
                                        </a>

                                    </th>
                                    <th>
                                        <a href="#" onClick={sortByAlias}>
                                            {t("product.alias")}
                                        </a>
                                    </th>
                                    <th>
                                        <a href="#" onClick={sortByAlias}>
                                            {t("product.company")}
                                        </a>
                                    </th>
                                    <th>
                                        <a href="#" onClick={sortByAlias}>
                                            {t("dashboard.category")}
                                        </a>
                                    </th>
                                    <th>
                                        {t("users.addedBy")}
                                    </th>
                                    <th className="text-center">
                                        <a href="#">
                                            {t("dashboard.published")}
                                        </a>

                                    </th>

                                    <th className="text-center">
                                        <a href="#">
                                            {t("product.approved")}
                                        </a>

                                    </th>
                                    <th>

                                    </th>

                                </tr>


                            </thead>
                            <tbody>
                                {
                                    products.map(item => (
                                        <tr key={'' + item._id}>
                                            <td>
                                                {getLocalizedText(item.name, i18n)}
                                            </td>
                                            <td>
                                                {item.alias}
                                            </td>
                                            <td>
                                                {item.company ? getLocalizedText(item.company.name, i18n) : null}
                                            </td>
                                            <td>
                                                {item.category ? getLocalizedText(item.category.name, i18n) : null}
                                            </td>
                                            <td>
                                                {item.addedBy ? item.addedBy.firstName + ' ' + item.addedBy.surName : null}
                                            </td>
                                            <td className="text-center">
                                                <div className="custom-control custom-checkbox">
                                                    <input type="checkbox" className="custom-control-input" id={"publish_" + item._id}
                                                        checked={item.published == true} onChange={(event) => { togglePublish(event, item._id) }} />
                                                    <label className="custom-control-label" htmlFor={"publish_" + item._id}></label>
                                                </div>
                                            </td>
                                            <td className="text-center">
                                                <div className="custom-control custom-checkbox">
                                                    <input type="checkbox" className="custom-control-input" id={"approved_" + item._id}
                                                        style={{ cursor: 'pointer' }}
                                                        checked={item.approved == true} onChange={(event) => { toggleApprovedIfAdmin(event, item._id) }} />
                                                    <label className="custom-control-label" htmlFor={"approved_" + item._id}></label>
                                                </div>
                                            </td>
                                            <td className="justify-content-end" style={{ textAlign: 'end' }}>
                                                {/* <Link className="btn btn-primary" to={"/admin/products/options/" + item._id} title={t("product.productOptions")} ><MdTune /> </Link> &nbsp; */}
                                                <Link className="btn btn-primary" to={"/admin/products/edit/" + item._id} target="_blank" title={t("dashboard.edit")} ><MdEdit /> </Link> &nbsp;
                                                <Link className="btn btn-primary" to="#" title={t("dashboard.clone")} onClick={e => cloneSelectedProduct(item._id)} ><MdContentCopy /></Link>
                                                &nbsp;
                                                <Link className="btn btn-danger" to="#" title={t("dashboard.delete")} onClick={e => deleteProduct(item._id)} ><MdDelete /></Link>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th colSpan="8" className="text-right" style={{ textAlign: 'end' }}>
                                        <nav aria-label="Page navigation example">
                                            <ul className="pagination">

                                                {pages > 1 ? (<li className="page-item"><label className="page-link" href="#" onClick={() => loadPage(page - 1)}>Previous</label></li>) : null}
                                               
                                                <select onChange={toPage} className="form-control">

                                                    {Array.from(Array(pages), (e, i) => {
                                                        return <option key={i} value={i}>{i+1}</option>

                                                    })}
                                                </select>

                                                {/* {Array.from(Array(pages), (e, i) => {
                                                    return <li className={i == page ? "page-item active" : "page-item"} key={i}>
                                                        <label className="page-link" onClick={() => loadPage(i)}>
                                                            {i + 1}
                                                        </label>
                                                    </li>
                                                })} */}


                                                {pages > 1 ? (<li className="page-item"><label className="page-link" href="#" onClick={() => loadPage(page + 1)}>Next</label></li>) : null}

                                            </ul>
                                        </nav>
                                    </th>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    <br />

                </div>
            </div>
            {/* <button type='button' className="btn btn-primary" title={t("dashboard.generateSerials")} onClick={applyToAll}><MdEdit /> # </button> &nbsp; */}
        </div>
    )
}

export default ListProducts;