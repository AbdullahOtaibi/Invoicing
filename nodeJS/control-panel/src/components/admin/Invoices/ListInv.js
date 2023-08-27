import React, { useState, useEffect } from 'react'
import { useTranslation } from "react-i18next"
import { MdCollectionsBookmark, MdDelete, MdEdit, MdAdd, MdLocalShipping } from "react-icons/md"
import { getInvoices }
    from './InvoicesAPI'
import { ThreeDots } from 'react-loader-spinner'
import { Link, useNavigate } from 'react-router-dom'
import { getLocalizedText } from '../utils/utils'
import { Tabs, Tab } from 'react-bootstrap'
import { hasPermission } from '../utils/auth';
import { Helmet } from "react-helmet";



const ListInv = (props) => {
    const [loading, setLoading] = useState(false);
    const { t, i18n } = useTranslation();
    const [newInvoices, setNewInvoices] = useState([]);

    const [nvoicesSort, setnvoicesSort] = useState('_idDesc');
    const [invoicesPage, setInvoicesPage] = useState(0);
    const [invoicesPages, setInvoicesPages] = useState(0);
    //const [startDate, setStartDate] = useState()

    useEffect(() => {
        //console.log('********test ....');
        //console.log(JSON.stringify(newInvoices));
    }, [newInvoices]);

    const loadNewPage = (newPage) => {
        if (newPage < 0 || (newPage >= invoicesPages && invoicesPages > 0)) {
            return;
        }

        console.log("newPage:" + newPage);
        setLoading(true);

        let status = props.status;
        let startDate = null;
        let endDate = null;
        let clientId = null;
        let contractId=null 
        if (status == "all") {
            if (props.filter && props.filter.status && props.filter.status != "all") {
                status = props.filter.status;
            } else {
                status = null;
            }
        }

            if (props.filter && props.filter.startDate) {
                startDate = props.filter.startDate;
            }
            if (props.filter && props.filter.endDate) {
                endDate = props.filter.endDate;
            }
            if (props.filter && props.filter.contact) {
                clientId = props.filter.contact._id;
            }

            if (props.filter && props.filter.contractId) {

                console.log("insert filter invoice contract ...");
                contractId = props.filter.contractId;  
            }

        setInvoicesPage(newPage);
        getInvoices({
            page: newPage,
            status: status,
            startDate: startDate,
            endDate: endDate,
            clientId: clientId ,
            contractId: contractId
        }).then(data => {
            setLoading(false);
            setNewInvoices(data.items || []);
            setInvoicesPage(data.page);
            //console.log("data.items:" + JSON.stringify(data.items));
            console.log("data.pages:" + data.pages);
            setInvoicesPages(data.pages);
            if (props.updateCount) {
                props.updateCount(data.count);
            }
        }).catch(e => {
            setLoading(false);
            console.log(e);
        });
    }

    useEffect(() => {
        loadNewPage(0);
    }, [props]);


    return (
        <>{loading ? (
            <div className="row">
                <div className='col'></div>
                <div className='col col-auto d-flex text-center' >
                    <ThreeDots
                        type="ThreeDots"
                        color="#00BFFF"
                        height={100}
                        width={100}
                        visible={loading}
                    />
                </div>
                <div className='col'></div>
            
        </div>) : (<div className="table-responsive">
            {/* <p>{props.filter?JSON.stringify(props.filter):'empty filter'}</p> */}
            <table className="table   table-hover">
                <thead>
                    <tr>
                        <th>
                          
                                {t("invoice.invoiceNo")}
                          

                        </th>
                        <th>   {t("invoice.status")} </th>
                        <th>  {t("invoice.TaxExclusiveAmount")} </th>
                        <th>  {t("invoice.AllowanceTotalAmount")}</th>
                        <th>  {t("invoice.TaxInclusiveAmount")}</th>
                        <th>
                           
                                {t("invoice.fullName")}
                           
                        </th>
                        <th>
                          
                                {t("invoice.issuedDate")}
                            
                        </th>


                        {(props.status) != "posted" ? <th></th> : ""}

                    </tr>


                </thead>
                <tbody>
                    {


                        newInvoices.map(item => (

                            <tr key={'' + item._id}>
                                <td>
                                    <Link to={'/admin/invoices/ViewInvoice/' + item._id} className='text-info'>
                                        {item.seqNumber}

                                    </Link>
                                </td>
                                <td> {item.status}</td>
                                <td> {item.legalMonetaryTotal.taxExclusiveAmount.toFixed(3)}</td>
                                <td> {item.legalMonetaryTotal.allowanceTotalAmount.toFixed(3)}</td>
                                <td> {item.legalMonetaryTotal.taxInclusiveAmount.toFixed(3)}</td>
                                <td>
                                    {item.accountingCustomerParty.registrationName}
                                </td>
                                <td>
                                    {getInvoiceDate(item.issuedDate)}
                                </td>



                                {(props.status) != "posted" ?
                                    <td className="justify-content-end" style={{ textAlign: 'end' }}>
                                      <><Link className="btn btn-primary" to={"/admin/invoices/edit/" + item._id} title={t("dashboard.edit")}  
                                        style={{ pointerEvents: item.status=='posted' || item.status == 'reverted' ? 'none' : 'auto'
                                        , color:  item.status=='posted' || item.status == 'reverted'  ? 'gray' : '' }}>
                                        Edit <MdEdit /> </Link> </>
                                       
                                    </td>
                                    : ""
                                }
                            </tr>
                        ))
                    }
                </tbody>
                <tfoot>
                    <tr>
                        <th colSpan="7" className="text-right">
                            <nav aria-label="Page navigation example">
                                <ul className="pagination">

                                    {invoicesPages > 1 ? (<li className="page-item"><label className="page-link" href="#" onClick={() => loadNewPage(invoicesPage - 1)}>Previous</label></li>) : null}

                                    {Array.from(Array(invoicesPages), (e, i) => {
                                        console.log('i:' + i, "invoicesPages:" + invoicesPages);
                                        return <li className={i == invoicesPage ? "page-item active" : "page-item"} key={i}>
                                            <label className="page-link" onClick={() => loadNewPage(i)}>
                                                {i + 1}
                                            </label>
                                        </li>
                                    })}


                                    {invoicesPages > 1 ? (<li className="page-item"><label className="page-link" href="#" onClick={() => loadNewPage(invoicesPage + 1)}>Next</label></li>) : null}

                                </ul>
                            </nav>
                        </th>
                    </tr>
                </tfoot>
            </table>
        </div>)}
        </>




    );

    //return (<h1>test .................</h1>);
}

function getInvoiceDate(issuedDate) {
    let d = new Date(issuedDate.toString());
    let str =
        d.getFullYear() +
        "/" +
        (d.getMonth().length == 2
            ? parseInt(d.getMonth()) + 1
            : "0" + (parseInt(d.getMonth()) + 1)) +
        "/" +
        d.getDate();
    return str;
}

export default ListInv;