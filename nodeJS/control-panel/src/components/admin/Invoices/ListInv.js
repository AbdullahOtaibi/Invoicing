import React, { useState, useEffect } from 'react'
import { useTranslation } from "react-i18next"
import { MdCollectionsBookmark, MdDelete, MdEdit, MdAdd, MdLocalShipping, MdPrint } from "react-icons/md"
import { getInvoices,updateInvoice}
    from './InvoicesAPI'
import { ThreeDots } from 'react-loader-spinner'
import { Link, useNavigate } from 'react-router-dom'
import { getLocalizedText } from '../utils/utils'
import { Tabs, Tab } from 'react-bootstrap'
import { hasPermission } from '../utils/auth';
import { Helmet } from "react-helmet";
import  {getReceipts,updateReceipt  } from '../Receipt/ReceiptAPI'
import { toast } from "react-toastify";


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
        let insurance = null;
        let insuranceId=null

        if (status == "all") {
            if (props.filter && props.filter.status && props.filter.status != "all") {
                status = props.filter.status;
            } else {
                status = null;
            }
        }
        
            if (props.filter && props.filter.contacttype && props.filter.contacttype != "all") {
                insurance = props.filter.contacttype;
            } else {
                insurance =null
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
            if (props.filter && props.filter.insurance) {
                insuranceId = props.filter.insurance._id;
            }

            if (props.filter && props.filter.contractId) {

                console.log("insert filter invoice contract ...");
                contractId = props.filter.contractId;  
            }
            console.log(insuranceId)

            console.log(props)
        setInvoicesPage(newPage);
        getInvoices({
            page: newPage,
            status: status,
            startDate: startDate,
            endDate: endDate,
            clientId: clientId ,
            contractId: contractId,
            insurance:insurance,
            insuranceId:insuranceId
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
    const viewItemValidMessage = (message) => {
        toast.warning(message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      };
    const processReceipts = async (insuranceId,invtot,INV) => {
        try {

            let filter={
                seqNumber: "",
                contactId: insuranceId,
                contractId: null,
            };
          // Call getReceipts to get the receipts data
          const responseData = await getReceipts(filter);
          // Extract the receipts array from the response data
          const receipts = responseData.items;
      
          // Function to find the receipt with the smallest seqNumber
          const findSmallestSeqNumber = (receipts) => {
            return receipts.reduce((minReceipt, currentReceipt) => {
              const minSeqNumber = parseInt(minReceipt.seqNumber.split('-')[1], 10);
              const currentSeqNumber = parseInt(currentReceipt.seqNumber.split('-')[1], 10);
          
              // Check if receiptBalance is not equal to 0 before comparing seqNumbers
              if (minReceipt.receiptBalance !== 0 && (minSeqNumber < currentSeqNumber || currentReceipt.receiptBalance === 0)) {
                return minReceipt;
              } else {
                return currentReceipt;
              }
            });
          };
      
          // Find the receipt with the smallest seqNumber
          const smallestSeqNumberReceipt = findSmallestSeqNumber(receipts);
      
          // Log or use the smallestSeqNumberReceipt as needed
          console.log('Receipt with the smallest seqNumber:', smallestSeqNumberReceipt);
          const indexOfObject = receipts.findIndex(obj => obj === smallestSeqNumberReceipt );
          console.log(indexOfObject)
          if(smallestSeqNumberReceipt.receiptBalance<invtot ){ 
            if (indexOfObject!== -1)
            {
            smallestSeqNumberReceipt.receiptAppliedAmount +=smallestSeqNumberReceipt.receiptBalance;
            const resttot=invtot-smallestSeqNumberReceipt.receiptBalance // Change to the desired value
            const invt2=smallestSeqNumberReceipt.receiptBalance;
            smallestSeqNumberReceipt.receiptBalance = smallestSeqNumberReceipt.receiptBalance-smallestSeqNumberReceipt.receiptBalance;
            const newlistOfAppliedInvoicis={"INVID":INV._id,"amount":invt2};
            smallestSeqNumberReceipt.listOfAppliedInvoicis.push({newlistOfAppliedInvoicis})
            receipts[indexOfObject+1].receiptAppliedAmount+=resttot
            const newlistOfAppliedInvoicis2={"INVID":INV._id,"amount":resttot};
            receipts[indexOfObject+1].receiptBalance = receipts[indexOfObject+1].receiptBalance-resttot;

            receipts[indexOfObject+1].listOfAppliedInvoicis.push({newlistOfAppliedInvoicis2});


            }
            else
            {

                viewItemValidMessage("there is no balance insurance receipts to cover this invoice.") 



            }
            
          
        
        

          }
          else{  
            smallestSeqNumberReceipt.receiptAppliedAmount += invtot; // Change to the desired value
            smallestSeqNumberReceipt.receiptBalance = smallestSeqNumberReceipt.receiptBalance-invtot;
            const newlistOfAppliedInvoicis={"INVID":INV._id,"amount":invtot};
            smallestSeqNumberReceipt.listOfAppliedInvoicis.push({newlistOfAppliedInvoicis})

            INV.isApplied=true
            console.log('Receipt with the smallest seqNumber after pro:', smallestSeqNumberReceipt);
           /* updateReceipt(smallestSeqNumberReceipt).then(async (res) => {
  
              console.log("ABD: updated res :" + JSON.stringify(res)) ;
              /*
              let updatedContract = {} 
              if (receipt.contract) {
                updatedContract = await updateContractCalculation(receipt.contract);
               
              }
      
              if(props.onSave == null )
              {
                window.location.href = "/admin/invoices" ;
              }
              else 
              {
               
              //  props.onSave(updatedContract);
              props.onSave();
      
              }
           
        
            }).catch((err)=> { console.log(err)}) ;
            updateInvoice(INV);*/
        
        }
         
         

        } catch (error) {
          console.error('Error processing receipts:', error.message);
          // Handle the error as needed
          return [];
        }
      };
      
      // Call the function to process receipts

      

    useEffect(() => {
        loadNewPage(0);
    }, [props]);
    const printExternal = (url) => {
        var printWindow = window.open( url);

        // Wait for the page to load
        printWindow.addEventListener('DOMContentLoaded', () => {
          // Introduce a delay of 2000 milliseconds (2 seconds) before printing
          setTimeout(() => {
            printWindow.print();
            printWindow.close();

          }, 10);
        });
      };
   
        
    

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
                        <th>
                          
                          {t("invoice.DocNo")}
                    

                  </th>
                        <th>
                            {t("contracts.contractNo")}
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

                                <td>
                                    <Link to={'/admin/invoices/ViewInvoice/' + item._id} className='text-info'>
                                        {item.docNumber}

                                    </Link>
                                </td>
                                <td>
                                    {item.contract?item.contract.seqNumber:null}
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
                                      <><Link className="btn btn-primary d-print-none" to={"/admin/invoices/edit/" + item._id} title={t("dashboard.edit")}  
                                        style={{ pointerEvents: item.status=='posted' || item.status == 'reverted' ? 'none' : 'auto'
                                        , color:  item.status=='posted' || item.status == 'reverted'  ? 'gray' : '' }}>
                                            Edit <MdEdit /> </Link> </>
                                     {item.status == "posted" || item.status == "reverted" ? (<a href="#" onClick={() => { printExternal('/admin/invoices/ViewInvoice/' + item._id) }} className="btn btn-dark d-print-none" title={t("dashboard.print")} style={{ marginLeft: '5px' }}>
                                            <MdPrint />
                                        </a>) :null}
                                       
                                    </td>
                                    : ""
                                }

{item.insurance!=null && item.isApplied==false ?
                                    <td className="justify-content-end" style={{ textAlign: 'end', width:"20px" ,height:"5px"}}>
                                      <><Link href="#" onClick={() => processReceipts(item.insurance,item.legalMonetaryTotal.taxExclusiveAmount,item)}className="btn btn-primary "  title="apply invoice"  >
                                            apply invoice  </Link> </>
                                     
                                       
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