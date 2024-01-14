import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'
import {  MdPeople, MdOutlineCardGiftcard, MdOutlineFactCheck, MdOutlinePriceChange, MdOutlineMoveUp } from 'react-icons/md'
import { TbReportMoney } from "react-icons/tb";

const ReportList = () => {

  const { t } = useTranslation();


  return (
    <div>
      <h2>Report List</h2>
      <div className="row row-cards-one">
        {/* Add links to different reports */}
        
        <div className="col-md-12 col-lg-6 col-xl-3">
                    <div className="mycard bg3">
                        <div className="left">
                            <h5 className="title">Income Report</h5>
                            <span className="number">
                            </span>
                            <a href="/admin/reports/IncomeReport" className="link">{t("viewAll")}</a>
                        </div>
                        <div className="right d-flex align-self-center">
                            <div className="icon">
                                <TbReportMoney />

                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-12 col-lg-6 col-xl-3">
                    <div className="mycard bg4">
                        <div className="left">
                            <h5 className="title">Expanses Report</h5>
                            <span className="number">
                            </span>
                            <a href="/admin/reports/ExpansesReport" className="link">{t("viewAll")}</a>
                        </div>
                        <div className="right d-flex align-self-center">
                            <div className="icon">
                            <TbReportMoney />

                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-12 col-lg-6 col-xl-3">
                    <div className="mycard bg2">
                        <div className="left">
                            <h5 className="title">Invoice Report</h5>
                            <span className="number">
                            </span>
                            <a href="/admin/reports/InvoiceReport" className="link">{t("viewAll")}</a>
                        </div>
                        <div className="right d-flex align-self-center">
                            <div className="icon">
                            <TbReportMoney />

                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-12 col-lg-6 col-xl-3">
                    <div className="mycard bg1">
                        <div className="left">
                            <h5 className="title">Contract Report</h5>
                            <span className="number">
                            </span>
                            <a href="/admin/reports/ContractReport" className="link">{t("viewAll")}</a>
                        </div>
                        <div className="right d-flex align-self-center">
                            <div className="icon">
                            <TbReportMoney />

                            </div>
                        </div>
                    </div>
                </div>
        
        {/* Add more links for other reports */}
    </div>
    </div>

  );
};

export default ReportList;