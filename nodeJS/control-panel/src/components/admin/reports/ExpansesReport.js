import React, { useState, useEffect } from 'react';
import { getExpenses } from '../Expenses/ExpensesAPI';
import './ExpansesReport.css'; // Import CSS file for styling
import { MdEdit, MdClose, MdAddTask, MdCollectionsBookmark, MdOutlineLocalPrintshop } from "react-icons/md";

const ExpenseReport = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [filter, setFilter] = useState({ startDate: '', endDate: '', month: '', year: '', category: '' });
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    getExpenses()
      .then(data => {
        setExpenses(data.items || []);
        setFilteredExpenses(data.items || []);
      })
      .catch(error => console.log(error));
  }, []);

  useEffect(() => {
    calculateTotal();
  }, [filteredExpenses]);

  const applyFilter = () => {
    const filteredData = expenses.filter(expense => {
      const startDateCheck = !filter.startDate || new Date(expense.createdDate) >= new Date(filter.startDate);
      const endDateCheck = !filter.endDate || new Date(expense.createdDate) <= new Date(filter.endDate);
      const monthCheck = !filter.month || expense.month === parseInt(filter.month, 10);
      const yearCheck = !filter.year || expense.year === parseInt(filter.year, 10);
  
      const categoryCheck = !filter.category || 
        expense.details.some(detail => detail.category.toLowerCase().includes(filter.category.toLowerCase()));
  
      return startDateCheck && endDateCheck && monthCheck && yearCheck && categoryCheck;
    });
  
    setFilteredExpenses(filteredData);
  };

  const calculateTotal = () => {
    const total = filteredExpenses.reduce((acc, expense) => acc + expense.totalAmount, 0);
    setTotalAmount(total);
  };

  const handleFilterChange = (event) => {
    setFilter({ ...filter, [event.target.name]: event.target.value });
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
                  <h1>Expanses Report</h1>

      <div className="invoiceSearch mb-5">
    <div className="card">
        <div className="row g-3">
          <div className="col-md-2">
            <label className="form-label">Start Date:</label>
            <input
              type="date"
              className="form-control"
              name="startDate"
              value={filter.startDate}
              onChange={handleFilterChange}
            />
          </div>
          <div className="col-md-2">
            <label className="form-label">End Date:</label>
            <input
              type="date"
              className="form-control"
              name="endDate"
              value={filter.endDate}
              onChange={handleFilterChange}
            />
          </div>
          <div className="col-md-2">
            <label className="form-label">Month:</label>
            <input
              type="text"
              className="form-control"
              name="month"
              value={filter.month}
              onChange={handleFilterChange}
            />
          </div>
          <div className="col-md-2">
            <label className="form-label">Year:</label>
            <input
              type="text"
              className="form-control"
              name="year"
              value={filter.year}
              onChange={handleFilterChange}
            />
          </div>
          <div className="col-md-2">
            <label className="form-label">Category:</label>
            <input
              type="text"
              className="form-control"
              name="category"
              value={filter.category}
              onChange={handleFilterChange}
            />
          </div>
          <div className="col-md-2 align-self-end">
  <button className="btn btn-primary d-print-none" onClick={applyFilter}>
    Apply Filter
  </button>
</div>
        </div>
      </div>

     

      <table className="table table-hover">
        <thead>
          <tr>
            <th>Seq Number</th>
            <th>Year</th>
            <th>Month</th>
            <th>Total Amount</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {filteredExpenses.map(expense => (
            <React.Fragment key={expense._id}>
              <tr>
                <td>{expense.seqNumber}</td>
                <td>{expense.year}</td>
                <td>{expense.month}</td>
                <td>{expense.totalAmount}</td>
                <td>
                  {expense.details && expense.details.length > 0 && (
                    <ul className="details-list">
                      {expense.details
                        .filter(detail => 
                          !filter.category || 
                          detail.category.toLowerCase().includes(filter.category.toLowerCase())
                        )
                        .map((detail, index) => (
                          <li key={index}>
                            Amount: {detail.amount}, Category: {detail.category}
                          </li>
                        ))}
                    </ul>
                  )}
                </td>
              </tr>

            </React.Fragment>
            
          ))}
          

        </tbody>
       <tfoot> <tr>
       <th  className="text-right">
                                    Grand total:
                                </th>
                                <th colSpan={4} className="text-truncate">
                                {totalAmount.toFixed(3)}
                                </th>
                            </tr>
                            
                            </tfoot> 
      
      </table>
    
    </div></div>
    
  );
};

export default ExpenseReport;
