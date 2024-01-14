// ContractReport.js

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ThreeDots } from 'react-loader-spinner';
import { Helmet } from 'react-helmet';
import { getContracts } from '../Contracts/ContractsAPI';
import ContractSearch from '../Contracts/ContractSearch';
import { MdEdit, MdClose, MdAddTask, MdCollectionsBookmark, MdOutlineLocalPrintshop } from "react-icons/md";


const ContractReport = () => {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [packages, setPackages] = useState([]);
  const [searchVisible, setSearchVisible] = useState(false);

  // Grand total state variables
  const [grandTotalContract, setGrandTotalContract] = useState(0);
  const [grandTotalBalance, setGrandTotalBalance] = useState(0);
  const [grandTotalReceipt, setGrandTotalReceipt] = useState(0);
  const [grandTotalRemaining, setGrandTotalRemaining] = useState(0);

  useEffect(() => {
    // Load contracts with default filters or initial filters
    loadContracts({});
  }, []);

  const loadContracts = (filters) => {
    setLoading(true);

    // Use the getContracts API with the provided filters
    getContracts(filters)
      .then((data) => {
        const contracts = data.items || [];
        setPackages(contracts);

        // Calculate and update grand totals
        const totalContract = contracts.reduce((sum, contract) => sum + contract.contractAmount, 0);
        const totalBalance = contracts.reduce((sum, contract) => sum + contract.contractBalance, 0);
        const totalReceipt = contracts.reduce((sum, contract) => sum + contract.contractTotalReceipts, 0);
        const totalRemaining = contracts.reduce(
          (sum, contract) => sum + (contract.contractAmount - contract.contractTotalInvoiced),
          0
        );

        setGrandTotalContract(totalContract);
        setGrandTotalBalance(totalBalance);
        setGrandTotalReceipt(totalReceipt);
        setGrandTotalRemaining(totalRemaining);

        setLoading(false);
      })
      .catch((error) => {
        console.error('Error loading contracts:', error);
        setLoading(false);
      });
  };

  const handleCloseSearch = () => {
    setSearchVisible(false);
  };

  const contactSearchFilterChanged = (filter) => {
    console.log('filter:' + JSON.stringify(filter));
    loadContracts({
      contact: filter.contact,
      package: filter.package,
      seqNumber: filter.seqNumber,
      minValue: filter.minValue,
      maxValue: filter.maxValue,
      status: filter.status,
      createdDateFrom: filter.createdDateFrom,
      createdDateTo: filter.createdDateTo,
      contractNumber: filter.contractNumber,
      contactName: filter.contactName,
      balanceFrom: filter.balanceFrom,
      balanceTo: filter.balanceTo,
    });
  };

  return (
    <div className="container"
    > <a href="#" className="btn btn-dark btn-lg mx-1 d-print-none" onClick={() => { window.print(); }}>
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


            <h1>Contact Report</h1>

      <Helmet>
        <title>{'Invoicing | Admin | Contracts'} </title>
      </Helmet>
      <div className="card">
        <div className={'card-body'}>
          <div className="row">
           
              <ContractSearch
                searchFilterChanged={contactSearchFilterChanged}
                handleCloseSearch={handleCloseSearch}
              />
            
          </div>

          <div className="container text-center">
            <ThreeDots type="ThreeDots" color="#00BFFF" height={100} width={100} visible={loading} />
          </div>
          <br />

          {/* Display the grand totals */}
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>{t('contracts.seqNumber')}</th>
                  <th>{t('contracts.contactName')}</th>
                  <th>{t('contracts.contractAmount')} (JOD)</th>
                  <th>{t('contracts.contractTotalReceipts')} (JOD)</th>
                  <th>{t('contracts.contractTotalInvoiced')} (JOD)</th>
                  <th>{t('contracts.packageName')}</th>
                  <th>{t('contracts.packagePrice')}</th>
                  <th>{t('contracts.contractBalance')} (JOD)</th>
                  <th>{t('contracts.grandTotals')}</th> {/* Added column for grand totals */}
                </tr>
              </thead>
              <tbody>
                {packages.map((item) => (
                  <tr key={'' + item.id}>
                    <td>{item.seqNumber}</td>
                    <td>{item.contact?.contactName}</td>
                    <td>{item.contractAmount}</td>
                    <td>{item.contractTotalReceipts}</td>
                    <td>{item.contractTotalInvoiced ? item.contractTotalInvoiced : '0.00'}</td>
                    <td>{item.package?.packageName}</td>
                    <td>{item.packagePrice}</td>
                    <td className={item.contractBalance > 0 ? 'text-success' : 'text-warning'}>
                      {item.contractBalance}
                    </td>
                    <td>
                      <strong>Total Contract:</strong> {grandTotalContract.toFixed(3)} (JOD) <br />
                      <strong>Total Receipt:</strong> {grandTotalReceipt.toFixed(3)} (JOD) <br />
                      <strong>Total Balance:</strong> {grandTotalBalance.toFixed(3)} (JOD)
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <br />
        </div>
      </div>
    </div>
  );
};

export default ContractReport;
