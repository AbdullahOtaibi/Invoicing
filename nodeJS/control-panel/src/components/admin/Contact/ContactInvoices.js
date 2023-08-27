import React, { useState, useEffect } from "react";
import { getContactInvoices, getContact } from "./ContactAPI";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {MdEdit, MdLocalShipping} from "react-icons/md";

const ContactInvoices = (props) => {
    const { t, i18n } = useTranslation();
    const [invoices, setInvoices] = useState([]);
    const [invoicesPages, setInvoicesPages] = useState(0);
    const [invoicesPage,setInvoicesPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [contact, setContact] = useState({});

    useEffect(() => {
        loadNewPage(0);
    }, [contact]);

    useEffect(() => {
        getContact(props.contactId).then(data => {
            console.log("data:" + JSON.stringify(data));
            setContact(data);
        }
        ).catch(e => {
            console.log(e);
        });
    }, [props])
   
   
    const loadNewPage = (newPage) => {
        if (newPage < 0 || (newPage >= invoicesPages && invoicesPages > 0)) {
            return;
        }

        console.log("newPage:" + newPage);
        setLoading(true);


        setInvoicesPage(newPage);
        let filter = {
            page: newPage,
            clientId: props.contactId
        }
        if(contact && contact.contactType && contact.contactType == "Insurance"){
            filter = {
                page: newPage,
                insuranceId: props.contactId
                
            }

            
        }
        //alert(JSON.stringify(contact));
        getContactInvoices(filter).then(data => {
            setLoading(false);
            setInvoices(data.items || []);
            setInvoicesPage(data.page);
           // console.log("data.items:" + JSON.stringify(data.items));
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

    return (<>
        <div className="table-responsive">
    
            <table className="table   table-hover">
                <thead>
                    <tr>
                        <th>
                            <a href="#" >
                                {t("invoice.invoiceNo")} 
                            </a>

                        </th>
                        <th>  <a href="#" > {t("invoice.TaxExclusiveAmount")}  </a></th>
                        <th>  <a href="#" > {t("invoice.AllowanceTotalAmount")}</a></th>
                        <th>  <a href="#" > {t("invoice.TaxInclusiveAmount")}</a></th>
                        <th>
                            <a href="#" >
                                {t("invoice.fullName")}
                            </a>
                        </th>
                        <th>
                            <a href="#" >
                                {t("invoice.issuedDate")}
                            </a>
                        </th>


                        {(props.status) != "posted" ? <th></th> : ""}

                    </tr>


                </thead>
                <tbody>
                    {invoices.map(item => (

                            <tr key={'' + item.id}>
                                <td>
                                    <Link to={'/admin/invoices/ViewInvoice/' + item._id} className='text-info'>
                                        {item.seqNumber}

                                    </Link>
                                </td>
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


                                        {item.shipment ? (<><Link className="btn btn-primary" to={"/admin/shipments/" + item.shipment} title={t("dashboard.shipmentDetails")} ><MdLocalShipping /> </Link> &nbsp;</>) : null}
                                        <Link className="btn btn-primary" to={"/admin/invoices/edit/" + item._id} title={t("dashboard.edit")} > Edit <MdEdit /> </Link> &nbsp;
                                        {/* <Link className="btn btn-danger" to="#" title={t("dashboard.delete")} onClick={e => deleteInvoice(item._id)} ><MdDelete /></Link> */}
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
        </div>
    </>);
}

export default ContactInvoices;