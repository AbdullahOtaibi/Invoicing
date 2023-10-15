import React, { useState, useEffect } from 'react'
import { useTranslation } from "react-i18next"
import { MdCollectionsBookmark, MdDelete, MdEdit, MdAdd, MdSearch, MdContacts, MdCollections, MdReceipt } from "react-icons/md"
import { ThreeDots } from 'react-loader-spinner'
import { Link, useNavigate } from 'react-router-dom'
import { getLocalizedText } from '../utils/utils'
import { hasPermission } from '../utils/auth';
import { Helmet } from "react-helmet";
import { getContracts } from './ContractsAPI'
import ContractSearch from './ContractSearch'



const ListContract = (props) => {

    const { t, i18n } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [packages, setPackages] = useState([]);

    //const [contactsSort, setContactsSort] = useState('_idDesc');
    const [contractsPage, setContractsPage] = useState(0);
    const [contractsPages, setcontractsPages] = useState(0);
    const loadNewPage = (newPage) => {
        if (newPage < 0 || (newPage >= contractsPages && contractsPages > 0)) {
            return;
        }
    }
    const [searchVisible, setSearchVisible] = useState(false);

    useEffect(() => {

        getContracts({
            page: contractsPage,

        }).then(data => {
            setLoading(false);
            setPackages(data.items || []);
            setContractsPage(data.page);
            //console.log("data.items:" + JSON.stringify(data.items));
            console.log("data.pages:" + data.pages);
            setcontractsPages(data.pages);
        }).catch(e => {
            setLoading(false);
            console.log(e);
        });
    }


        , []);

    const handleCloseSearch = () => {
        setSearchVisible(false);
    }

    const conttactSearchFilterChanged = (filter) => {
        console.log("filter:" + JSON.stringify(filter));
        getContracts({
            page: contractsPage,
            contact: filter.contact,
            package: filter.package,
            seqNumber: filter.seqNumber,
            minValue: filter.minValue,
            maxValue: filter.maxValue,
            status: filter.status,
        }).then(data => {
            setLoading(false);
            setPackages(data.items || []);
            setContractsPage(data.page);
            //console.log("data.items:" + JSON.stringify(data.items));
            console.log("data.pages:" + data.pages);
            setcontractsPages(data.pages);
        }).catch(e => {
            setLoading(false);
            console.log(e);
        });
    }


    return (
        <div className="conatiner">
            <Helmet>
                <title>{'Invoicing | Admin | Contracts'} </title>
            </Helmet>
            <div className="card">
                <div className={"card-body"}>


                    <div className='row'>
                        <div className='col-md-8 col-sm-6'>
                            <h5 className="card-title"><MdReceipt />
                                <span className='text-info px-2'> {t("sidebar.contracts")} </span>
                            </h5>
                        </div>

                        <div className='col-md-4 col-sm-6' style={{ textAlign: 'end' }}>

                            <button type="button" className="btn-success btn-lg mx-1" onClick={() => { setSearchVisible(!searchVisible); }} ><MdSearch size={20} />  {t("search")}</button>
                            <a className="add-btn btn-info btn-lg" href={"/admin/Contract/create"}><MdAdd size={20} />  {t("dashboard.add")}</a>

                        </div>
                    </div>

                    <div className='row'>
                        {searchVisible && <ContractSearch searchFilterChanged={conttactSearchFilterChanged} handleCloseSearch={handleCloseSearch} />}
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
                                        {t("contracts.seqNumber")}
                                    </th>

                                    <th>
                                        {t("contracts.contactName")}
                                    </th>
                                    <th>
                                        {t("contracts.contractAmount")   }   {"(JOD)"}
                                    </th>
                                    <th>
                                        {t("contracts.contractTotalReceipts")}   {"(JOD)"}
                                    </th>
                                    <th>
                                        {t("contracts.contractTotalInvoiced")}   {"(JOD)"}
                                    </th>



                                    <th>

                                        {t("contracts.packageName")}


                                    </th>
                                    <th>

                                        {t("contracts.packagePrice")}


                                    </th>
<th>  
    { t("contracts.contractBalance")    }   {"(JOD)"}
</th>


                                </tr>


                            </thead>
                            <tbody>
                                {
                                    packages.map(item => (

                                        <tr key={'' + item.id}>
                                            <td>
                                                <Link to={'/admin/Contract/view/' + item._id} className='text-info'>
                                                    {item.seqNumber}

                                                </Link>
                                            </td>
                                            <td> {item.contact?.contactName}</td>

                                            <td>{item.contractAmount}</td>


                                            <td>{item.contractTotalReceipts}</td>
                                            <td> {item.contractTotalInvoiced ? item.contractTotalInvoiced : '0.00'}</td>

                                            <td> {item.package?.packageName}</td>
                                            <td> {item.packagePrice}</td>
                                            <td className={item.contractBalance > 0 ? "  text-success" : " text-warning"} > {item.contractBalance}</td>
             


                                        </tr>
                                    ))
                                }
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th colSpan="7" className="text-right">
                                        <nav aria-label="Page navigation example">
                                            <ul className="pagination">

                                                {contractsPages > 1 ? (<li className="page-item"><label className="page-link" href="#" onClick={() => loadNewPage(contractsPage - 1)}>Previous</label></li>) : null}

                                                {Array.from(Array(contractsPages), (e, i) => {
                                                    console.log('i:' + i, "contractsPages:" + contractsPages);
                                                    return <li className={i == contractsPage ? "page-item active" : "page-item"} key={i}>
                                                        <label className="page-link" onClick={() => loadNewPage(i)}>
                                                            {i + 1}
                                                        </label>
                                                    </li>
                                                })}


                                                {contractsPages > 1 ? (<li className="page-item"><label className="page-link" href="#" onClick={() => loadNewPage(contractsPage + 1)}>Next</label></li>) : null}

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

export default ListContract;