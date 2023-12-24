import React, { useEffect, useState } from 'react';
import { getInvoices}
    from '../Invoices/InvoicesAPI'
import { getContract } from '../Contracts/ContractsAPI'

import  { getReceipts ,getReceipt } from '../Receipt/ReceiptAPI'
const isKeyInJSONAndNotNull = (jsonObject, keyToCheck) =>
jsonObject.hasOwnProperty(keyToCheck) && jsonObject[keyToCheck] !== null;

function findKeyByValue(obj, value) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key) && obj[key] == value) {
        return key;
      }
    }
    return null; // Return null if the value is not found
  }
async function processInvoicesAndReceipts(invoices, receipts) {
    const paymentMethodData = {};

    if (!Array.isArray(invoices)) {
        console.error('Invoices data is not an array:', invoices);
        return [];
    }

    await Promise.all(invoices.map(async (invoice) => {
        const paymentMethod = invoice.paymentMethod || '';
        if (['Visa', 'Cash','Insurance'].includes(paymentMethod)) {
            const invoiceNumber = invoice.seqNumber;
            var receiptNumber=''
           var receiptAmount=0
           console.log(invoice.ObjectIdReceipt);
            if((isKeyInJSONAndNotNull(invoice,"ObjectIdReceipt")|| typeof invoice.ObjectIdReceipt != 'undefined' && paymentMethod !='Insurance' ) ){    
                receiptNumber = (await getReceipt(invoice.ObjectIdReceipt)).seqNumber  ;
                receiptAmount =(await getReceipt(invoice.ObjectIdReceipt)).receiptAmount ;

            }
            else if(paymentMethod =='Insurance' ){
                let filter={
                    seqNumber: "",
                    contactId: invoice.insurance,
                    contractId: null,
                };
              // Call getReceipts to get the receipts data
             
              const responseData = await getReceipts(filter);
              // Extract the receipts array from the response data
              const receipts = responseData.items;
          console.log(receipts)
              // Function to find the receipt with the smallest seqNumber
              

             
                var receli=[]
              const hasInvoiceId = receipts.some((receipt) => {
                var index = receipt.listOfAppliedInvoicis.indexOf({_id:invoice._id}); // 1
                if (typeof index === 'number' && Number.isInteger(index)) {receli.push(receipt)}

                 
              });
              
              console.log(receli);
              receiptNumber=receli[0].seqNumber
              receiptAmount=invoice.legalMonetaryTotal.taxExclusiveAmount 
            }
           
            const docNumber = invoice.docNumber || '';

            const matchingReceipt = receipts.find(receipt => receipt._id === invoice.ObjectIdReceipt);
            if (matchingReceipt) {
                receiptAmount = matchingReceipt.receiptAmount || 0;
            }

            if (!paymentMethodData[paymentMethod]) {
                paymentMethodData[paymentMethod] = [];
            }

            paymentMethodData[paymentMethod].push({
                paymentMethod,
                receiptNumber: receiptNumber,
                invoiceNumber:invoiceNumber,
                invoiceDocNumber: docNumber,
                receiptAmount:receiptAmount,
                invoiceAmount: invoice.legalMonetaryTotal.taxExclusiveAmount || 0,
            });
        }
    }));

    const grandTotal = {
        paymentMethod: 'Grand Total',
        receiptNumber: null,
        invoiceNumber: null,
        receiptAmount: Object.values(paymentMethodData).reduce((total, entries) =>
            total + entries.reduce((subtotal, entry) => subtotal + entry.receiptAmount, 0), 0),
        invoiceAmount: Object.values(paymentMethodData).reduce((total, entries) =>
            total + entries.reduce((subtotal, entry) => subtotal + entry.invoiceAmount, 0), 0),
        contractNumber: null
    };

    Object.values(paymentMethodData).forEach(entries => entries.push({ ...grandTotal }));
    console.log(paymentMethodData)
    const result = Object.values(paymentMethodData).flat();

    return result;
}
const IncomeReport = () => {
    const [reportData, setReportData] = useState([]);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          // Fetch invoices and receipts data
          const invoices = (await getInvoices()).items;
          const receipts = (await getReceipts()).items;
  
          // Process invoices and receipts
          const result = await processInvoicesAndReceipts(invoices, receipts);
          console.log(result)
          setReportData(result);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      // Call the fetchData function
      fetchData();
    }, []); // Empty dependency array to run the effect only once when the component mounts
  
    return (
      <div>
        <h1>Income Report</h1>
        <div className="table-responsive">  <table  className="table   table-hover">
          <thead>
            <tr>
              <th>Payment Method</th>
              <th>Receipt Number</th>
              <th>Invoice Number</th>
              <th>Invoice docNumber</th>

              <th>Receipt Amount</th>
              <th>Invoice Amount</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((entry, index) => (
              <tr key={index}>
                <td>{entry.paymentMethod}</td>
                <td>{entry.receiptNumber}</td>
                <td>{entry.invoiceNumber}</td>
                <td>{entry.invoiceDocNumber}</td>

                <td>{entry.receiptAmount}</td>
                <td>{entry.invoiceAmount}</td>
              </tr>
            ))}
          </tbody>
        </table></div>
      
      </div>
    );
  };
  
  export default IncomeReport;