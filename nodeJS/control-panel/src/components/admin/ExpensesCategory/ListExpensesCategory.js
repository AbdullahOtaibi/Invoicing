import React, { useState, useEffect } from 'react'
import { useTranslation } from "react-i18next"
import { MdCollectionsBookmark, MdDelete, MdEdit, MdAdd, MdSearch, MdContacts, MdCollections, MdCategory } from "react-icons/md"
import { ThreeDots } from 'react-loader-spinner'
import { Link, useNavigate } from 'react-router-dom'
import { getLocalizedText } from '../utils/utils'
import { hasPermission } from '../utils/auth';
import { Helmet } from "react-helmet";
import { getExpensesCategory, removeExpenseCategory } from './ExpensesCategoryAPI'
import swal from 'sweetalert';



const ListExpensesCategory = (props) => {

    const { t, i18n } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [packages, setPackages] = useState([]);

    const [contactsSort, setContactsSort] = useState('_idDesc');
    const [expenseCategoryPage, setExpenseCategoryPage] = useState(0);
    const [expenseCategoryPages, setExpenseCategoryPages] = useState(0);
    const loadNewPage = (newPage) => {
        if (newPage < 0 || (newPage >= expenseCategoryPages && expenseCategoryPages > 0)) {
            return;
        }
    }

    const loadData = () => {
        getExpensesCategory({
            page: expenseCategoryPage,

        }).then(data => {
            setLoading(false);
            setPackages(data.items || []);
            setExpenseCategoryPage(data.page);
            console.log("data.pages:" + data.pages);
            setExpenseCategoryPages(data.pages);
        }).catch(e => {
            setLoading(false);
            console.log(e);
        });
    }
    useEffect(() => {
        loadData();
    }, []);

    const handleDeleteCategory = (id) => {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this entry!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {

                    removeExpenseCategory(id).then(data => {
                        swal("entry has been deleted!", {
                            icon: "success",
                        });
                        loadData();
                    }).catch(e => {
                    });
                } else {

                }
            });
    }



    return (
        <div className="conatiner">
            <Helmet>
                <title>{'Invoicing | Admin | Expenses Categories'} </title>
            </Helmet>
            <div className="card">
                <div className={"card-body"}>


                    <div className='row'>
                        <div className='col-md-8 col-sm-6'>
                            <h5 className="card-title"><MdCategory />
                                <span className='text-info px-2'> {t("sidebar.expensesCategory")} </span>
                            </h5>
                        </div>

                        <div className='col-md-4 col-sm-6' style={{ textAlign: 'end' }}>


                            <a className="add-btn btn-info btn-lg" href={"/admin/expenseCategories/create"}><MdAdd size={20} />  {t("dashboard.add")}</a>

                        </div>
                    </div>


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



                    <div className="table-responsive">


                        <table className="table   table-hover">
                            <thead>
                                <tr>
                                    <th>
                                        {t("ExpenseCategory.categoryName")}
                                    </th>
                                    <th>
                                        {t("ExpenseCategory.defaultAmount")}
                                    </th>
                                    <th>

                                    </th>
                                </tr>


                            </thead>
                            <tbody>
                                {


                                    packages.map(item => (

                                        <tr key={'' + item.id}>
                                            <td>
                                                <Link to={'/admin/expenseCategories/view/' + item._id} className='text-info'>
                                                    {item.categoryName}
                                                </Link>
                                            </td>

                                            <td> {item.defaultAmount}</td>
                                            <td className='text-end'>
                                                <a href={'/admin/expenseCategories/edit/' + item._id} className='btn btn-primary'>
                                                    <MdEdit size={20} />    {t("dashboard.edit")}
                                                </a>
                                                &nbsp;
                                                <button type='button' className='btn btn-danger' onClick={() => { handleDeleteCategory(item._id) }}>
                                                    <MdDelete size={20} />    {t("dashboard.delete")}
                                                </button>
                                            </td>


                                        </tr>
                                    ))
                                }
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th colSpan="7" className="text-right">
                                        <nav aria-label="Page navigation example">
                                            <ul className="pagination">

                                                {expenseCategoryPages > 1 ? (<li className="page-item"><label className="page-link" href="#" onClick={() => loadNewPage(expenseCategoryPage - 1)}>Previous</label></li>) : null}

                                                {Array.from(Array(expenseCategoryPages), (e, i) => {
                                                    console.log('i:' + i, "expenseCategoryPages:" + expenseCategoryPages);
                                                    return <li className={i == expenseCategoryPage ? "page-item active" : "page-item"} key={i}>
                                                        <label className="page-link" onClick={() => loadNewPage(i)}>
                                                            {i + 1}
                                                        </label>
                                                    </li>
                                                })}


                                                {expenseCategoryPages > 1 ? (<li className="page-item"><label className="page-link" href="#" onClick={() => loadNewPage(expenseCategoryPage + 1)}>Next</label></li>) : null}

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
        </div>


    );


};

export default ListExpensesCategory;

