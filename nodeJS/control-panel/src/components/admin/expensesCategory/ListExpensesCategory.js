import React, { useState, useEffect } from 'react'
import { useTranslation } from "react-i18next"
import { MdCollectionsBookmark, MdDelete, MdEdit, MdAdd, MdSearch, MdContacts, MdCollections } from "react-icons/md"
import { ThreeDots } from 'react-loader-spinner'
import { Link, useNavigate } from 'react-router-dom'
import { getLocalizedText } from '../utils/utils'
import { hasPermission } from '../utils/auth';
import { Helmet } from "react-helmet";
import {  getExpenses } from './ExpensesCategoryAPI'




const ListExpenses = (props) => {
  
    const { t, i18n } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [packages , setPackages] = useState([]) ; 

    const [contactsSort, setContactsSort] = useState('_idDesc');
    const [expensesPage, setExpensesPage] = useState(0);
    const [expensesPages, setExpensesPages] = useState(0);
    const loadNewPage = (newPage) => {
        if (newPage < 0 || (newPage >= expensesPages && expensesPages > 0)) {
            return;
        }
    }
    useEffect( ()=> {

        getExpenses({
            page: expensesPage,
            
        }).then(data => {
            setLoading(false);
            setPackages(data.items || []);
            setExpensesPage(data.page);
            console.log("data.pages:" + data.pages);
            setExpensesPages(data.pages);
        }).catch(e => {
            setLoading(false);
            console.log(e);
        });
    }


    , []) 

    return (
        <div className="conatiner">
            <Helmet>
                <title>{'Invoicing | Admin | Expenses'} </title>
            </Helmet>
            <div className="card">
                <div className={"card-body"}>


                    <div className='row'>
                        <div className='col-md-8 col-sm-6'>
                            <h5 className="card-title"><MdCollections />
                                <span className='text-info px-2'> {t("sidebar.expenses")} </span>
                            </h5>
                        </div>

                        <div className='col-md-4 col-sm-6' style={{ textAlign: 'end' }}>
                            
                          
                            <a className="add-btn btn-info btn-lg" href={"/admin/Expenses/create"}><MdAdd size={20} />  {t("dashboard.add")}</a>
                            
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
                                      
                                            {t("Expense.seqNumber")}
                                    

                                    </th>
                                    <th>
                                     
                                            {t("Expense.year")}
                                  

                                    </th>
                                    <th>
                                     
                                     {t("Expense.month")}
                           

                             </th>
                             <th>
                                     
                                     {t("Expense.totalAmount")}
                           

                             </th>
                                

                                   
                                    <th>
                                      
                                            {t("Expense.note")}
                                     

                                    </th>




                                </tr>


                            </thead>
                            <tbody>
                                {


                                    packages.map(item => (

                                        <tr key={'' + item.id}>
                                            <td>
                                                <Link to={'/admin/Expenses/view/' + item._id} className='text-info'>
                                                    {item.seqNumber}

                                                </Link>
                                            </td>

                                            <td> {item.year}</td>
                                            <td> { item.month}</td>
                                            <td> { item.totalAmount}</td>
                                            
                                            <td>
                                                {item.note}
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

                                                {expensesPages > 1 ? (<li className="page-item"><label className="page-link" href="#" onClick={() => loadNewPage(expensesPage - 1)}>Previous</label></li>) : null}

                                                {Array.from(Array(expensesPages), (e, i) => {
                                                    console.log('i:' + i, "expensesPages:" + expensesPages);
                                                    return <li className={i == expensesPage ? "page-item active" : "page-item"} key={i}>
                                                        <label className="page-link" onClick={() => loadNewPage(i)}>
                                                            {i + 1}
                                                        </label>
                                                    </li>
                                                })}


                                                {expensesPages > 1 ? (<li className="page-item"><label className="page-link" href="#" onClick={() => loadNewPage(expensesPage + 1)}>Next</label></li>) : null}

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

export default ListExpenses;

