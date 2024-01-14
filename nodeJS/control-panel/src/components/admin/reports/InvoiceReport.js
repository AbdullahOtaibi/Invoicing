import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ThreeDots } from 'react-loader-spinner';
import { getInvoices } from '../Invoices/InvoicesAPI';
import { toast } from 'react-toastify';
import InvoiceSearch from '../Invoices/InvoiceSearch';  // Import InvoiceSearch
import { MdEdit, MdClose, MdAddTask, MdCollectionsBookmark, MdOutlineLocalPrintshop } from "react-icons/md";

const InvoiceReport = (props) => {
    const [loading, setLoading] = useState(false);
    const { t, i18n } = useTranslation();
    const [newInvoices, setNewInvoices] = useState([]);
    const [grandTotal, setGrandTotal] = useState(0);
    const [invoicesPage, setInvoicesPage] = useState(0);
    const [invoicesPages, setInvoicesPages] = useState(0);

    useEffect(() => {
        // Load data when the component mounts
        loadNewPage(0);
    }, []); // Empty dependency array means this effect runs once after the initial render

    useEffect(() => {
        // Additional logic or side effects related to newInvoices
    }, [newInvoices]);

    const loadNewPage = (newPage, filters = {}) => {
        if (newPage < 0 || (newPage >= invoicesPages && invoicesPages > 0)) {
            return;
        }
        setLoading(true);

        let status = props.status;
        let startDate = null;
        let endDate = null;
        let clientId = null;
        let contractId = null;
        let insurance = null;
        let insuranceId = null;

        if (status === "all") {
            if (filters && filters.status && filters.status !== "all") {
                status = filters.status;
            } else {
                status = null;
            }
        }

        if (filters && filters.contacttype && filters.contacttype !== "all") {
            insurance = filters.contacttype;
        } else {
            insurance = null;
        }

        if (filters && filters.startDate) {
            startDate = filters.startDate;
        }
        if (filters && filters.endDate) {
            endDate = filters.endDate;
        }
        if (filters && filters.contact) {
            clientId = filters.contact._id;
        }
        if (filters && filters.insurance) {
            insuranceId = filters.insurance._id;
        }

        if (filters && filters.contractId) {
            console.log("insert filter invoice contract ...");
            contractId = filters.contractId;
        }
        console.log(insuranceId);

        console.log(props);
        setInvoicesPage(newPage);
        getInvoices({
            page: newPage,
            status: status,
            startDate: startDate,
            endDate: endDate,
            clientId: clientId,
            contractId: contractId,
            insurance: insurance,
            insuranceId: insuranceId
        }).then(data => {
            setLoading(false);
            setNewInvoices(data.items || []);
            setInvoicesPage(data.page);
            setInvoicesPages(data.pages);
            setGrandTotal(calculateGrandTotal(data.items || []));

            setInvoicesPages(data.pages);
            if (props.updateCount) {
                props.updateCount(data.count);
            }
        }).catch(e => {
            setLoading(false);
            console.log(e);
        });
    }

    const calculateGrandTotal = (items) => {
        return items.reduce((total, item) => total + item.legalMonetaryTotal.taxInclusiveAmount, 0);
    };

    const viewItemValidMessage = (message) => {
        toast.warning(message, {
            position: toast.POSITION.TOP_RIGHT,
        });
    };

    const handleSearch = (filters) => {
        // Handle search logic here
        // For example, update startDate, endDate, clientId, etc.
        loadNewPage(0, filters);
    };

    return (
        <>
        <a href="#" className="btn btn-dark btn-lg mx-1 d-print-none" onClick={() => { window.print(); }}>
    <MdOutlineLocalPrintshop size={20} />

  </a>
        <div className='row p-3 d-none d-print-flex'>
                <div className='col col-auto'>
                  {/* <img src='https://www.tailorbrands.com/wp-content/uploads/2020/07/mcdonalds-logo.jpg' style={{width:'100px'}} /> */}
                  <img src={process.env.REACT_APP_MEDIA_BASE_URL + '/uploads/' + localStorage.getItem("logoUrl")} style={{ width: '100px' }} />
                </div>
                <div className='col'>
                  <h5>
                    {localStorage.getItem("companyName")}
                                      </h5>
          </div>
          </div>
                          <h1>invoice Report</h1>

            <div className="mb-3">
                <InvoiceSearch searchFilterChanged={handleSearch} />
            </div>

            {loading ? (
                <div className="row">
                    <div className="col"></div>
                    <div className="col col-auto d-flex text-center">
                        <ThreeDots type="ThreeDots" color="#00BFFF" height={100} width={100} visible={loading} />
                    </div>
                    <div className="col"></div>
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead className="thead-light">
                            <tr>
                                <th>{t('invoice.invoiceNo')}</th>
                                <th>{t('invoice.DocNo')}</th>
                                <th>{t('contracts.contractNo')}</th>
                                <th>{t('invoice.status')}</th>
                                <th>{t('invoice.TaxExclusiveAmount')}</th>
                                <th>{t('invoice.AllowanceTotalAmount')}</th>
                                <th>{t('invoice.TaxInclusiveAmount')}</th>
                                <th>{t('invoice.fullName')}</th>
                                <th>{t('invoice.issuedDate')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {newInvoices
                                .map((item) => (
                                    <tr key={'' + item._id}>
                                        <td className="text-truncate">{item.seqNumber}</td>
                                        <td className="text-truncate">{item.docNumber}</td>
                                        <td className="text-truncate">{item.contract ? item.contract.seqNumber : null}</td>
                                        <td className="text-truncate">{item.status}</td>
                                        <td className="text-truncate">{item.legalMonetaryTotal.taxExclusiveAmount.toFixed(3)}</td>
                                        <td className="text-truncate">{item.legalMonetaryTotal.allowanceTotalAmount.toFixed(3)}</td>
                                        <td className="text-truncate">{item.legalMonetaryTotal.taxInclusiveAmount.toFixed(3)}</td>
                                        <td className="text-truncate">{item.accountingCustomerParty.registrationName}</td>
                                        <td className="text-truncate">{getInvoiceDate(item.issuedDate)}</td>
                                    </tr>
                                ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <th colSpan="5" className="text-right">
                                    Grand total:
                                </th>
                                <th colSpan="4" className="text-truncate">
                                    {grandTotal.toFixed(3)}
                                </th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            )}
        </>
    );
};

function getInvoiceDate(issuedDate) {
    let d = new Date(issuedDate.toString());
    let str =
        d.getFullYear() +
        '/' +
        (d.getMonth().length === 2
            ? parseInt(d.getMonth()) + 1
            : '0' + (parseInt(d.getMonth()) + 1)) +
        '/' +
        d.getDate();
    return str;
}

export default InvoiceReport;
