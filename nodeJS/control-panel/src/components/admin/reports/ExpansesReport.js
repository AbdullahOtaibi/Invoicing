// ExpenseReport.js
import React, { useState, useEffect } from 'react';
import { getExpenses } from '../Expenses/ExpensesAPI';
import './ExpansesReport.css'; // Import CSS file for styling

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
      // Filtering logic based on the provided filter criteria
      const startDateCheck = !filter.startDate || new Date(expense.createdDate) >= new Date(filter.startDate);
      const endDateCheck = !filter.endDate || new Date(expense.createdDate) <= new Date(filter.endDate);
      const monthCheck = !filter.month || expense.month === parseInt(filter.month, 10);
      const yearCheck = !filter.year || expense.year === parseInt(filter.year, 10);
  
      // Category filter applied only to details
      const categoryCheck = !filter.category || 
        expense.details.some(detail => detail.category.toLowerCase().includes(filter.category.toLowerCase()));
  
      return startDateCheck && endDateCheck && monthCheck && yearCheck && categoryCheck;
    });
  
    setFilteredExpenses(filteredData);
  };
  
  

  const calculateTotal = () => {
    // Calculate the total amount based on the filtered expenses
    const total = filteredExpenses.reduce((acc, expense) => acc + expense.totalAmount, 0);
    setTotalAmount(total);
  };

  const handleFilterChange = (event) => {
    setFilter({ ...filter, [event.target.name]: event.target.value });
  };
  

  return (
    <div>
      <div className="filter-container">
        {/* Your filter inputs go here, e.g., date pickers, dropdowns, etc. */}
        <label>
          Start Date:
          <input type="date" name="startDate" value={filter.startDate} onChange={handleFilterChange} />
        </label>
        <label>
          End Date:
          <input type="date" name="endDate" value={filter.endDate} onChange={handleFilterChange} />
        </label>
        <label>
          Month:
          <input type="text" name="month" value={filter.month} onChange={handleFilterChange} />
        </label>
        <label>
          Year:
          <input type="text" name="year" value={filter.year} onChange={handleFilterChange} />
        </label>
        <label>
          Category:
          <input type="text" name="category" value={filter.category} onChange={handleFilterChange} />
        </label>
        <button onClick={applyFilter}>Apply Filter</button>
      </div>

      <div className="total-container">
        <p>Total Amount: {totalAmount}</p>
      </div>

      <table className="expense-table">
        <thead>
          <tr>
            <th>Seq Number</th>
            <th>Year</th>
            <th>Month</th>
            <th>Total Amount</th>
            <th>Details</th>
            {/* Add more headers as needed */}
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
            <ul>
              {expense.details
                .filter(detail => 
                  !filter.category || 
                  detail.category.toLowerCase().includes(filter.category.toLowerCase())
                )
                .map((detail, index) => (
                  <li key={index}>
                    Amount: {detail.amount}, Category: {detail.category}
                    {/* Add more details fields as needed */}
                  </li>
                ))}
            </ul>
          )}
        </td>
      </tr>
    </React.Fragment>
  ))}
</tbody>
      </table>
    </div>
  );
};

export default ExpenseReport;
