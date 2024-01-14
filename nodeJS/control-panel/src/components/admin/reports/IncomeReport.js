import React, { useEffect, useState } from 'react';
import { getIncomeReport } from '../Receipt/ReceiptAPI';
import { MdEdit, MdClose, MdAddTask, MdCollectionsBookmark, MdOutlineLocalPrintshop } from "react-icons/md";

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
      <h1>Income Report</h1>

      <div className="invoiceSearch mb-5">
        <div className="card">
          <form>
            {/* Add filter input fields or date pickers here */}
            <div className="row mb-3">
              <div className="col-md-4">
                <label className="form-label">Payment Method:</label>
                <select
                  className="form-select"
                  value={paymentMethodFilter}
                  onChange={(e) => setPaymentMethodFilter(e.target.value)}
                >
                  <option value="">all</option>
                  <option value="Cash">Cash</option>
                  <option value="Visa">Visa</option>
                  <option value="Insurance">Insurance</option>
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label">Start Date:</label>
                <input
                  type="date"
                  className="form-control"
                  value={startDateFilter}
                  onChange={handleStartDateChange}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">End Date:</label>
                <input
                  type="date"
                  className="form-control"
                  value={endDateFilter}
                  onChange={handleEndDateChange}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-hover">
        <thead>
  <tr>
    <th colSpan="1">Payment Method</th>
    <th colSpan="1">Receipt Number</th>
    <th colSpan="1">Invoice Number</th>
    <th colSpan="1">Invoice docNumber</th>
    <th colSpan="1">Contract Number</th>
    <th colSpan="1">Receipt Amount</th>
    <th colSpan="1"></th> {/* Empty cell for consistency */}
  </tr>
</thead>
        <tbody>
  {Object.keys(groupedData).map((paymentMethod) => {
    const group = groupedData[paymentMethod];
    return (
      <React.Fragment key={paymentMethod}>
        {group.entries.map((entry, index) => (
          <tr key={index}>
            <td colSpan="1">{entry.paymentMethod}</td>
            <td colSpan="1">{entry.receiptNumber}</td>
            <td colSpan="1">{entry.invoiceNumber}</td>
            <td colSpan="1">{entry.invoiceDocNumber}</td>
            <td colSpan="1">{entry.contractNumber}</td>
            <td colSpan="1">{entry.receiptAmount}</td>
            <td colSpan="1"></td> {/* Empty cell for consistency */}
          </tr>
        ))}
        <tr>
          <td colSpan="5">Subtotal</td>
          <td colSpan="1">{group.totalAmount}</td>
          <td colSpan="1"></td> {/* Empty cell for consistency */}
        </tr>
        
      </React.Fragment>
    );
  })}
  <tr>
    <td colSpan="5">Grand Total</td>
    <td colSpan="1">{grandTotal}</td>
    <td colSpan="1"></td> {/* Empty cell for consistency */}
  </tr>
</tbody>
        </table>
      </div>
    </div>
  );
};

export default IncomeReport;
