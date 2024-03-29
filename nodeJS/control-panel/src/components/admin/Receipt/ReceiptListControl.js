import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { MdPrint } from "react-icons/md";
import { ThreeDots } from 'react-loader-spinner';
import { Link } from 'react-router-dom';
import { getReceipts } from './ReceiptAPI';

const ReceiptListControl = (props) => {
    const { t, i18n } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [packages, setPackages] = useState([]);
    const [receiptsPage, setReceiptsPage] = useState(0);
    const [receiptsPages, setReceiptsPages] = useState(0);





    
    const loadNewPage = (newPage) => {
        if (newPage < 0 || (newPage >= receiptsPages && receiptsPages > 0)) {
            return;
        }

        setLoading(true);

        var filter = {
            page: newPage,
        };

        if (props.contractId) {
            filter.contractId = props.contractId;
        }
        if (props.contactId) {
            filter.contactId = props.contactId;
        }

        if (props.filter) {
            console.log(" before set: props.filter:" + JSON.stringify(props.filter));
            filter = { ...filter, ...props.filter };
            console.log(" receipt after set: props.filter:" + JSON.stringify(filter));
        }

        getReceipts(filter)
            .then(data => {
                setLoading(false);
                setPackages(data.items || []);
                setReceiptsPage(data.page);
                setReceiptsPages(data.pages);
            })
            .catch(e => {
                setLoading(false);
                console.log(e);
            });
    };
    const handleReceiptSelected = (item) => {
        if(props.handleReceiptSelected){
            props.handleReceiptSelected(item);
        }
        return true;
    };

    const printReceipt = (id) => {
        const baseUrl = window.location.origin;

        // Append the relative URL to the base URL
        const url = `${baseUrl}/Receipt/view/${id}`;
    
        let newWindow = window.open(url);    
        // Wait for the page to fully load
        newWindow.addEventListener('load', () => {
            // Introduce a longer delay (e.g., 2000 milliseconds) before printing
            setTimeout(() => {
                newWindow.print();
                newWindow.close();
            }, 10);
        });
    };
    

    useEffect(() => {
        loadNewPage(0);
    }, [props, props.filter, props.contractId, props.contactId]);

    return (
        <div className="container">
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
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>{t("receipt.seqNumber")}</th>
                            <th>{t("receipt.contactName")}</th>
                            <th>{t("receipt.contract")}</th>
                            <th>{t("receipt.receiptAmount")}</th>
                            <th>{t("receipt.note")}</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {packages.map(item => (
                            <tr key={'' + item.id}>
                                <td>
                                    {!props.handleReceiptSelected ? (
                                        <Link to={'/admin/Receipt/view/' + item._id} className='text-info'>
                                            {item.seqNumber}
                                        </Link>
                                    ) : (
                                        <a href="#" onClick={(e) => { e.preventDefault(); handleReceiptSelected(item); return true; }} className='text-info'>
                                            {item.seqNumber}
                                        </a>
                                    )}
                                </td>
                                <td>{item.contact?.contactName}</td>
                                <td>{item.contract?.seqNumber}</td>
                                <td>{item.receiptAmount}</td>
                                <td>{item.note}</td>
                                <td className='text-end'>
                                    <button
                                        type='button'
                                        onClick={() => { printReceipt(item._id); }}
                                        className='btn btn-sm btn-dark d-print-none'
                                        style={{ backgroundColor: 'black' }}>
                                        <MdPrint size={30} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <th colSpan="7" className="text-right">
                                <nav aria-label="Page navigation example">
                                    <ul className="pagination">
                                        {receiptsPages > 1 ? (
                                            <li className="page-item">
                                                <label className="page-link" href="#" onClick={() => loadNewPage(receiptsPage - 1)}>
                                                    Previous
                                                </label>
                                            </li>
                                        ) : null}
                                        {Array.from(Array(receiptsPages), (e, i) => (
                                            <li className={i === receiptsPage ? "page-item active" : "page-item"} key={i}>
                                                <label className="page-link" onClick={() => loadNewPage(i)}>
                                                    {i + 1}
                                                </label>
                                            </li>
                                        ))}
                                        {receiptsPages > 1 ? (
                                            <li className="page-item">
                                                <label className="page-link" href="#" onClick={() => loadNewPage(receiptsPage + 1)}>
                                                    Next
                                                </label>
                                            </li>
                                        ) : null}
                                    </ul>
                                </nav>
                            </th>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
};

export default ReceiptListControl;
