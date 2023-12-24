import React from 'react';
import { Link } from 'react-router-dom';

const ReportList = () => {
  return (
    <div>
      <h2>Report List</h2>
      <ul>
        {/* Add links to different reports */}
        <li><Link to="/reports/IncomeReport">Income Report</Link></li>
        {/* Add more links for other reports */}
      </ul>
    </div>
  );
};

export default ReportList;