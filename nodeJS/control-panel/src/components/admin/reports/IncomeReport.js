import React, { useEffect, useState } from 'react';
import { getIncomeReport } from '../Receipt/ReceiptAPI';

const IncomeReport = () => {
  const [reportData, setReportData] = useState([]);
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data using the provided API function with filter parameters
        const { receipts, invoices, contract } = await getIncomeReport({
          paymentMethod: paymentMethodFilter,
          startDate: startDateFilter,
          endDate: endDateFilter,
        });

        // Ensure all required arrays are defined
        if (Array.isArray(receipts) && Array.isArray(invoices) && Array.isArray(contract)) {
          // Check if arrays have the same length
          if (receipts.length === invoices.length && invoices.length === contract.length) {
            // Transform the data structure to match the expected format
            const transformedData = receipts.map((entry, index) => {
              // Extract corresponding invoice and receipt information
              const invoiceInfo = invoices[index] || {};
              const contractInfo = contract[index] || {};

              const paymentMethod = entry?.paymentMethod || '';
              const receiptNumber = entry?.seqNumber || '';
              const receiptAmount = entry?.receiptAmount || 0;

              const invoiceNumber = invoiceInfo?.seqNumber || '';
              const invoiceDocNumber = invoiceInfo?.docNumber || '';
              const invoiceAmount = invoiceInfo?.taxExclusiveAmount || 0;
              const date = entry.receiptDate.split('T')[0] || '';
              const contractNumber = contractInfo?.seqNumber || '';

              return {
                paymentMethod,
                receiptNumber,
                invoiceNumber,
                invoiceDocNumber,
                contractNumber,
                receiptAmount,
                invoiceAmount,
                date,
              };
            });

            setReportData(transformedData);
          } else {
            console.error('Arrays have different lengths:', { receipts, invoices, contract });
          }
        } else {
          console.error('Some arrays are undefined:', { receipts, invoices, contract });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle the error
      }
    };

    fetchData(); // Call the asynchronous function
  }, [paymentMethodFilter, startDateFilter, endDateFilter]);

  // Group data by payment method and calculate total amount for each group
  const groupedData = reportData.reduce((groups, entry) => {
    const { paymentMethod, receiptAmount } = entry;
    if (!groups[paymentMethod]) {
      groups[paymentMethod] = { totalAmount: 0, entries: [] };
    }
    groups[paymentMethod].totalAmount += receiptAmount;
    groups[paymentMethod].entries.push(entry);
    return groups;
  }, {});

  // Calculate grand total
  const grandTotal = Object.values(groupedData).reduce(
    (total, group) => total + group.totalAmount,
    0
  );

  const handleStartDateChange = (e) => {
    const selectedDate = e.target.value;
    const formattedDate = formatDate(selectedDate);
    setStartDateFilter(formattedDate);
  };
 
  
  const formatDate2 = (inputDate) => {
    const date = new Date(inputDate);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}T00:00:00.000Z`;
  };

  const handleEndDateChange = (e) => {
    const selectedDate = e.target.value;
    const formattedDate = formatDate(selectedDate);
    setEndDateFilter(formattedDate);
  };

  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div>
      <h1>Income Report</h1>
      {/* Add filter input fields or date pickers here */}
      <div>
        <label>Payment Method:</label>
        <select
          value={paymentMethodFilter}
          onChange={(e) => setPaymentMethodFilter(e.target.value)}
        >
          <option value="">Select Payment Method</option>
          <option value="Cash">Cash</option>
          <option value="Visa">Visa</option>
          <option value="Insurance">Insurance</option>
        </select>
      </div>
      <div>
        <label>Start Date:</label>
        <input
          type="date"
          value={startDateFilter}
          onChange={handleStartDateChange}
        />
      </div>
      <div>
        <label>End Date:</label>
        <input
          type="date"
          value={endDateFilter}
          onChange={handleEndDateChange}
        />
      </div>
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Payment Method</th>
              <th>Receipt Number</th>
              <th>Invoice Number</th>
              <th>Invoice docNumber</th>
              <th>Contract Number</th>
              <th>Receipt Amount</th>
              <th>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(groupedData).map((paymentMethod) => {
              const group = groupedData[paymentMethod];
              return (
                <React.Fragment key={paymentMethod}>
                  {group.entries.map((entry, index) => (
                    <tr key={index}>
                      <td>{entry.paymentMethod}</td>
                      <td>{entry.receiptNumber}</td>
                      <td>{entry.invoiceNumber}</td>
                      <td>{entry.invoiceDocNumber}</td>
                      <td>{entry.contractNumber}</td>
                      <td>{entry.receiptAmount}</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="5">Subtotal</td>
                    <td colSpan="1">{group.totalAmount}</td>
                    <td></td>
                  </tr>
                </React.Fragment>
              );
            })}
            <tr>
              <td colSpan="7">Grand Total</td>
              <td>{grandTotal}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IncomeReport;
