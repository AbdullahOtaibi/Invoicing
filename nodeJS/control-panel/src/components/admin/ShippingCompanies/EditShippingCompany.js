import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getShippingCompany, updateShippingCompany, getShippingPricings, createShippingPricing, updateShippingPricing } from './ShippingCompaniesAPI'
import { useTranslation } from "react-i18next"
import { toast } from 'react-toastify'
import Loader from "react-loader-spinner"
import { MdLocalShipping, MdSave, MdEdit } from "react-icons/md";
import LocalizedTextEditor from '../Shared/LocalizedTextEditor'

const EditShippingCompany = (props) => {

    const [contentLocale, setContentLocale] = useState('en');
    const [shippingCompany, setShippingCompany] = useState({ name: {}, landTransportationPricing: { stackable: {}, nonStackable: {} }, seaTransportationPricing: { stackable: {}, nonStackable: {} }, airTransportationPricing:  { stackable: {}, nonStackable: {} } });
    const [pricings, setPricings] = useState([]);
    const [pricing, setPricing] = useState({ fullLandContainerPrice: {}, fullSeaContainerPrice: {}, fullAirContainerPrice: {} });
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const { companyId } = useParams();

    const formatDate = (dateObject) => {
        if (dateObject) {
            let dt = new Date(dateObject);
            let output = String(dt.getDate()).padStart(2, '0') + "-" + String((dt.getMonth() + 1)).padStart(2, '0') + "-" + String(dt.getFullYear()).padStart(2, '0');
            return output;
        } else {
            return '';
        }
    }
    const setLocalTextValue = (textObject, newValue) => {
        if (contentLocale == 'en') {
            textObject.english = newValue;
        } else if (contentLocale == 'ar') {
            textObject.arabic = newValue;
        } else if (contentLocale == 'tr') {
            textObject.turkish = newValue;
        }
    }

    const changeLocale = (newLocale) => {
        setContentLocale(newLocale);

    }

    useEffect(() => {
        reloadPricings();
    }, []);

    const reloadPricings = () => {
        getShippingPricings(companyId).then(res => {
            setPricings(res);
        }).catch(e => {
            console.log(e);
        });
    }


    useEffect(() => {
        getShippingCompany(companyId).then(data => {
            if (!data.landTransportationPricing) {
                data.landTransportationPricing = { stackable: {}, nonStackable: {} }
            }
            if (!data.seaTransportationPricing) {
                data.seaTransportationPricing = { stackable: {}, nonStackable: {} }
            }
            if (!data.airTransportationPricing) {
                data.airTransportationPricing = { stackable: {}, nonStackable: {} }
            }
            console.log(data);
            setShippingCompany(data);
        }).catch(e => {
            console.log(e);
        })
    }, [

    ]);

    const updateName = (newValue, locale) => {
        setContentLocale(locale);

        let cloned = JSON.parse(JSON.stringify(shippingCompany));
        setLocalTextValue(cloned.name, newValue);
        setShippingCompany(cloned);
    }


    const updatePublished = (event) => {
        let cloned = JSON.parse(JSON.stringify(shippingCompany));
        cloned.published = event.target.checked;
        setShippingCompany(cloned);
    }






    const doPost = data => {
        setLoading(true);
        updateShippingCompany(shippingCompany).then(res => {
            setLoading(false);
            toast.success(t("succeed"));
            window.location.href = "/admin/shippingCompanies";
        }).catch(e => {
            setLoading(false);
        })
        console.log(shippingCompany);
        console.log(data);
    }

    const updateLandTransportationPricingStackableCPM = (event) => {
        let cloned = JSON.parse(JSON.stringify(shippingCompany));
        if (!cloned.landTransportationPricing) {
            cloned.landTransportationPricing = { stackable: {}, nonStackable: {} }
        }
        if (!cloned.landTransportationPricing.stackable) {
            cloned.landTransportationPricing.stackable = {}
        }
        cloned.landTransportationPricing.stackable.cpm = event.target.value;
        setShippingCompany(cloned);

    }
    const updateLandTransportationPricingStackableMT = (event) => {
        let cloned = JSON.parse(JSON.stringify(shippingCompany));
        if (!cloned.landTransportationPricing) {
            cloned.landTransportationPricing = { stackable: {}, nonStackable: {} }
        }
        if (!cloned.landTransportationPricing.stackable) {
            cloned.landTransportationPricing.stackable = {}
        }
        cloned.landTransportationPricing.stackable.mt = event.target.value;
        setShippingCompany(cloned);
    }
    const updateLandTransportationPricingNonStackableCPM = (event) => {
        let cloned = JSON.parse(JSON.stringify(shippingCompany));
        if (!cloned.landTransportationPricing) {
            cloned.landTransportationPricing = { stackable: {}, nonStackable: {} }
        }
        if (!cloned.landTransportationPricing.nonStackable) {
            cloned.landTransportationPricing.nonStackable = {}
        }
        cloned.landTransportationPricing.nonStackable.cpm = event.target.value;
        setShippingCompany(cloned);
    }
    const updateLandTransportationPricingNonStackableMT = (event) => {
        let cloned = JSON.parse(JSON.stringify(shippingCompany));
        if (!cloned.landTransportationPricing) {
            cloned.landTransportationPricing = { stackable: {}, nonStackable: {} }
        }
        if (!cloned.landTransportationPricing.nonStackable) {
            cloned.landTransportationPricing.nonStackable = {}
        }
        cloned.landTransportationPricing.nonStackable.mt = event.target.value;
        setShippingCompany(cloned);
    }

    const updateSeaTransportationPricingStackableCPM = (event) => {
        let cloned = JSON.parse(JSON.stringify(shippingCompany));
        if (!cloned.seaTransportationPricing) {
            cloned.seaTransportationPricing = { stackable: {}, nonStackable: {} }
        }
        if (!cloned.seaTransportationPricing.stackable) {
            cloned.seaTransportationPricing.stackable = {}
        }
        cloned.seaTransportationPricing.stackable.cpm = event.target.value;
        setShippingCompany(cloned);
    }

    const updateAirTransportationPricingStackableCPM = (event) => {
        let cloned = JSON.parse(JSON.stringify(shippingCompany));
        if (!cloned.airTransportationPricing) {
            cloned.airTransportationPricing = { stackable: {}, nonStackable: {} }
        }
        if (!cloned.airTransportationPricing.stackable) {
            cloned.airTransportationPricing.stackable = {}
        }
        cloned.airTransportationPricing.stackable.cpm = event.target.value;
        setShippingCompany(cloned);
    }


    const updateSeaTransportationPricingStackableMT = (event) => {
        let cloned = JSON.parse(JSON.stringify(shippingCompany));
        if (!cloned.seaTransportationPricing) {
            cloned.seaTransportationPricing = { stackable: {}, nonStackable: {} }
        }
        if (!cloned.seaTransportationPricing.stackable) {
            cloned.seaTransportationPricing.stackable = {}
        }
        cloned.seaTransportationPricing.stackable.mt = event.target.value;
        setShippingCompany(cloned);
    }

    const updateAirTransportationPricingStackableMT = (event) => {
        let cloned = JSON.parse(JSON.stringify(shippingCompany));
        if (!cloned.airTransportationPricing) {
            cloned.airTransportationPricing = { stackable: {}, nonStackable: {} }
        }
        if (!cloned.airTransportationPricing.stackable) {
            cloned.airTransportationPricing.stackable = {}
        }
        cloned.airTransportationPricing.stackable.mt = event.target.value;
        setShippingCompany(cloned);
    }


    const updateSeaTransportationPricingNonStackableCPM = (event) => {
        let cloned = JSON.parse(JSON.stringify(shippingCompany));
        if (!cloned.seaTransportationPricing) {
            cloned.seaTransportationPricing = { stackable: {}, nonStackable: {} }
        }
        if (!cloned.seaTransportationPricing.nonStackable) {
            cloned.seaTransportationPricing.nonStackable = {}
        }
        cloned.seaTransportationPricing.nonStackable.cpm = event.target.value;
        setShippingCompany(cloned);
    }

    const updateAirTransportationPricingNonStackableCPM = (event) => {
        let cloned = JSON.parse(JSON.stringify(shippingCompany));
        if (!cloned.airTransportationPricing) {
            cloned.airTransportationPricing = { stackable: {}, nonStackable: {} }
        }
        if (!cloned.airTransportationPricing.nonStackable) {
            cloned.airTransportationPricing.nonStackable = {}
        }
        cloned.airTransportationPricing.nonStackable.cpm = event.target.value;
        setShippingCompany(cloned);
    }


    const updateSeaTransportationPricingNonStackableMT = (event) => {
        let cloned = JSON.parse(JSON.stringify(shippingCompany));
        if (!cloned.seaTransportationPricing) {
            cloned.seaTransportationPricing = { stackable: {}, nonStackable: {} }
        }
        if (!cloned.seaTransportationPricing.nonStackable) {
            cloned.seaTransportationPricing.nonStackable = {}
        }
        cloned.seaTransportationPricing.nonStackable.mt = event.target.value;
        setShippingCompany(cloned);
    }

    const updateAirTransportationPricingNonStackableMT = (event) => {
        let cloned = JSON.parse(JSON.stringify(shippingCompany));
        if (!cloned.airTransportationPricing) {
            cloned.airTransportationPricing = { stackable: {}, nonStackable: {} }
        }
        if (!cloned.airTransportationPricing.nonStackable) {
            cloned.airTransportationPricing.nonStackable = {}
        }
        cloned.airTransportationPricing.nonStackable.mt = event.target.value;
        setShippingCompany(cloned);
    }


    const updateFullLandContainerPrice = (event) => {
        let cloned = JSON.parse(JSON.stringify(pricing));
        if (!cloned.fullLandContainerPrice) {
            cloned.fullLandContainerPrice = {}
        }

        cloned.fullLandContainerPrice.amount = event.target.value;
        cloned.fullLandContainerPrice.currencyCode = 'USD';
        setPricing(cloned);
    }

    const updateFullSeaContainerPrice = (event) => {
        let cloned = JSON.parse(JSON.stringify(pricing));
        if (!cloned.fullSeaContainerPrice) {
            cloned.fullSeaContainerPrice = {}
        }

        cloned.fullSeaContainerPrice.amount = event.target.value;
        cloned.fullSeaContainerPrice.currencyCode = 'USD';
        setPricing(cloned);
    }

    let current = new Date();
    let cDate = current.getFullYear() + '-' + (current.getMonth() + 1) + '-' + current.getDate();

    const savePricing = (event) => {
        if (pricing._id) {
            updateShippingPricing({ ...pricing, company: companyId }).then(res => {
                reloadPricings();
                setPricing({ _id: null, fullLandContainerPrice: { amount: '' }, fullSeaContainerPrice: { amount: '' }, fullAirContainerPrice: { amount: '' } });
            }).catch(e => {
                console.log(e);
            });
        } else {
            createShippingPricing({ ...pricing, company: companyId }).then(res => {
                reloadPricings();
                setPricing({ _id: null, fullLandContainerPrice: { amount: '' }, fullSeaContainerPrice: { amount: '' }, fullAirContainerPrice: { amount: '' } });
            }).catch(e => {
                console.log(e);
            });
        }
    }

    const updateLandTransportationEta = (event) => {
        let cloned = JSON.parse(JSON.stringify(shippingCompany));
        if (!cloned.landTransportationPricing) {
            cloned.landTransportationPricing = {}
        }

        cloned.landTransportationPricing.eta = event.target.value;

        setShippingCompany(cloned);
    }

    const updateSeaTransportationEta = (event) => {
        let cloned = JSON.parse(JSON.stringify(shippingCompany));
        if (!cloned.seaTransportationPricing) {
            cloned.seaTransportationPricing = {}
        }

        cloned.seaTransportationPricing.eta = event.target.value;

        setShippingCompany(cloned);
    }

    const updateAirTransportationEta = (event) => {
        let cloned = JSON.parse(JSON.stringify(shippingCompany));
        if (!cloned.airTransportationPricing) {
            cloned.airTransportationPricing = {}
        }

        cloned.airTransportationPricing.eta = event.target.value;

        setShippingCompany(cloned);
    }

    const updateSeaTransportationAvailable = (event) => {
        let cloned = JSON.parse(JSON.stringify(shippingCompany));
        if (!cloned.seaTransportationPricing) {
            cloned.seaTransportationPricing = {}
        }

        cloned.seaTransportationPricing.optionAvailable = event.target.checked;

        setShippingCompany(cloned);
    }

    const updateLandTransportationAvailable = (event) => {
        let cloned = JSON.parse(JSON.stringify(shippingCompany));
        if (!cloned.landTransportationPricing) {
            cloned.landTransportationPricing = {}
        }

        cloned.landTransportationPricing.optionAvailable = event.target.checked;

        setShippingCompany(cloned);
    }

    const updateAirTransportationAvailable = (event) => {
        let cloned = JSON.parse(JSON.stringify(shippingCompany));
        if (!cloned.airTransportationPricing) {
            cloned.airTransportationPricing = {}
        }

        cloned.airTransportationPricing.optionAvailable = event.target.checked;

        setShippingCompany(cloned);
    }





    const selectPricing = (p) => {
        setPricing(p);
    }
    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title"><MdLocalShipping /> {t("shipping.editCompanyDetails")}</h5>
                <div className="container text-center">
                    <Loader
                        type="ThreeDots"
                        color="#00BFFF"
                        height={100}
                        width={100}
                        visible={loading}

                    />
                </div>
                <br />

                <form>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">{t("shipping.companyName")}</label>
                        <LocalizedTextEditor placeholder={t("shipping.companyName")} locale={contentLocale} textObject={shippingCompany.name}
                            onLocalChanged={changeLocale} onChange={updateName} />
                    </div>

                    <div className="mb-3 form-check">
                        <div className="custom-control custom-checkbox">
                            <input type="checkbox" className="custom-control-input" id="publishedCheck" checked={shippingCompany.published} onChange={updatePublished} />
                            <label className="custom-control-label" htmlFor="publishedCheck">{t("dashboard.published")}</label>
                        </div>
                    </div>
                    <div className="mb-3">
                        <div className="card">
                            <div className="card-header">{t("shipping.landTransportationPricing")}</div>
                            <div className="card-body">
                                <div className="mb-3">
                                    <label htmlFor="alias" className="form-label">{t("shipping.stackableParcels")} </label>
                                </div>

                                <div className="mb-3 form-check">
                                    <div className="custom-control custom-checkbox">
                                        <input type="checkbox" className="custom-control-input" id="landAvailableCheck" 
                                        checked={shippingCompany.landTransportationPricing.optionAvailable} 
                                        onChange={updateLandTransportationAvailable} />
                                        <label className="custom-control-label" htmlFor="landAvailableCheck">{t("shipping.optionAvailable")}</label>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="landTransportationPricingEta" className="form-label">{t("shipping.eta")} ({t("businessDays")}) </label>
                                    <input type="text" className="form-control" id="landTransportationEta"
                                        value={shippingCompany && shippingCompany.landTransportationPricing ? shippingCompany.landTransportationPricing.eta : null}
                                        onChange={updateLandTransportationEta}
                                    />
                                </div>


                                <div className="mb-3">
                                    <div className='row'>
                                        <div className='col-6'>
                                            <label htmlFor="landTransportationPricingStackableCPM" className="form-label">{t("shipping.cpm")} </label>
                                            <input type="text" className="form-control" id="landTransportationPricingStackableCPM"
                                                value={shippingCompany && shippingCompany.landTransportationPricing && shippingCompany.landTransportationPricing.stackable ? shippingCompany.landTransportationPricing.stackable.cpm : null}
                                                onChange={updateLandTransportationPricingStackableCPM}
                                            />
                                        </div>
                                        <div className='col-6'>
                                            <label htmlFor="landTransportationPricingStackableMT" className="form-label">{t("shipping.mt")} </label>
                                            <input type="text" className="form-control" id="landTransportationPricingStackableMT"
                                                value={shippingCompany && shippingCompany.landTransportationPricing && shippingCompany.landTransportationPricing.stackable ? shippingCompany.landTransportationPricing.stackable.mt : null}
                                                onChange={updateLandTransportationPricingStackableMT}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="alias" className="form-label">{t("shipping.nonStackableParcels")} </label>
                                </div>

                                <div className="mb-3">
                                    <div className='row'>
                                        <div className='col-6'>
                                            <label htmlFor="landTransportationPricingNonStackableCPM" className="form-label">{t("shipping.cpm")} </label>
                                            <input type="text" className="form-control" id="landTransportationPricingNonStackableCPM"
                                                value={shippingCompany && shippingCompany.landTransportationPricing && shippingCompany.landTransportationPricing.nonStackable ? shippingCompany.landTransportationPricing.nonStackable.cpm : null}
                                                onChange={updateLandTransportationPricingNonStackableCPM}
                                            />
                                        </div>
                                        <div className='col-6'>
                                            <label htmlFor="landTransportationPricingNonStackableMT" className="form-label">{t("shipping.mt")} </label>
                                            <input type="text" className="form-control" id="landTransportationPricingNonStackableMT"
                                                value={shippingCompany && shippingCompany.landTransportationPricing && shippingCompany.landTransportationPricing.nonStackable ? shippingCompany.landTransportationPricing.nonStackable.mt : null}
                                                onChange={updateLandTransportationPricingNonStackableMT}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="mb-3">
                        <div className="card">
                            <div className="card-header">{t("shipping.seaTransportationPricing")}</div>
                            <div className="card-body">
                                <div className="mb-3">
                                    <label htmlFor="alias" className="form-label">{t("shipping.stackableParcels")} </label>
                                </div>

                                <div className="mb-3 form-check">
                                    <div className="custom-control custom-checkbox">
                                        <input type="checkbox" className="custom-control-input" id="seaAvailableCheck" 
                                        checked={shippingCompany.seaTransportationPricing.optionAvailable} 
                                        onChange={updateSeaTransportationAvailable} />
                                        <label className="custom-control-label" htmlFor="seaAvailableCheck">{t("shipping.optionAvailable")}</label>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="seaTransportationPricingEta" className="form-label">{t("shipping.eta")} ({t("businessDays")}) </label>
                                    <input type="text" className="form-control" id="seaTransportationEta"
                                        value={shippingCompany && shippingCompany.seaTransportationPricing ? shippingCompany.seaTransportationPricing.eta : null}
                                        onChange={updateSeaTransportationEta}
                                    />
                                </div>

                                <div className="mb-3">
                                    <div className='row'>
                                        <div className='col-6'>
                                            <label htmlFor="seaTransportationPricingStackableCPM" className="form-label">{t("shipping.cpm")} </label>
                                            <input type="text" className="form-control" id="seaTransportationPricingStackableCPM"
                                                value={shippingCompany && shippingCompany.seaTransportationPricing && shippingCompany.seaTransportationPricing.stackable ? shippingCompany.seaTransportationPricing.stackable.cpm : null}
                                                onChange={updateSeaTransportationPricingStackableCPM}
                                            />
                                        </div>
                                        <div className='col-6'>
                                            <label htmlFor="seaTransportationPricingStackableMT" className="form-label">{t("shipping.mt")} </label>
                                            <input type="text" className="form-control" id="seaTransportationPricingStackableMT"
                                                value={shippingCompany && shippingCompany.seaTransportationPricing && shippingCompany.seaTransportationPricing.stackable ? shippingCompany.seaTransportationPricing.stackable.mt : null}
                                                onChange={updateSeaTransportationPricingStackableMT}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="alias" className="form-label">{t("shipping.nonStackableParcels")} </label>
                                </div>

                                <div className="mb-3">
                                    <div className='row'>
                                        <div className='col-6'>
                                            <label htmlFor="seaTransportationPricingNonStackableCPM" className="form-label">{t("shipping.cpm")} </label>
                                            <input type="text" className="form-control" id="seaTransportationPricingNonStackableCPM"
                                                value={shippingCompany && shippingCompany.seaTransportationPricing && shippingCompany.seaTransportationPricing.nonStackable ? shippingCompany.seaTransportationPricing.nonStackable.cpm : null}
                                                onChange={updateSeaTransportationPricingNonStackableCPM}
                                            />
                                        </div>
                                        <div className='col-6'>
                                            <label htmlFor="seaTransportationPricingNonStackableMT" className="form-label">{t("shipping.mt")} </label>
                                            <input type="text" className="form-control" id="seaTransportationPricingNonStackableMT"
                                                value={shippingCompany && shippingCompany.seaTransportationPricing && shippingCompany.seaTransportationPricing.nonStackable ? shippingCompany.seaTransportationPricing.nonStackable.mt : null}
                                                onChange={updateSeaTransportationPricingNonStackableMT}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>


                    <div className="mb-3">
                        <div className="card">
                            <div className="card-header">{t("shipping.airTransportationPricing")}</div>
                            <div className="card-body">
                                <div className="mb-3">
                                    <label htmlFor="alias" className="form-label">{t("shipping.stackableParcels")} </label>
                                </div>

                                <div className="mb-3 form-check">
                                    <div className="custom-control custom-checkbox">
                                        <input type="checkbox" className="custom-control-input" id="airAvailableCheck" 
                                        checked={shippingCompany.airTransportationPricing.optionAvailable} 
                                        onChange={updateAirTransportationAvailable} />
                                        <label className="custom-control-label" htmlFor="airAvailableCheck">{t("shipping.optionAvailable")}</label>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="airTransportationPricingEta" className="form-label">{t("shipping.eta")} ({t("businessDays")}) </label>
                                    <input type="text" className="form-control" id="airTransportationEta"
                                        value={shippingCompany && shippingCompany.airTransportationPricing ? shippingCompany.airTransportationPricing.eta : null}
                                        onChange={updateAirTransportationEta}
                                    />
                                </div>

                                <div className="mb-3">
                                    <div className='row'>
                                        <div className='col-6'>
                                            <label htmlFor="airTransportationPricingStackableCPM" className="form-label">{t("shipping.cpm")} </label>
                                            <input type="text" className="form-control" id="airTransportationPricingStackableCPM"
                                                value={shippingCompany && shippingCompany.airTransportationPricing && shippingCompany.airTransportationPricing.stackable ? shippingCompany.airTransportationPricing.stackable.cpm : null}
                                                onChange={updateAirTransportationPricingStackableCPM}
                                            />
                                        </div>
                                        <div className='col-6'>
                                            <label htmlFor="airTransportationPricingStackableMT" className="form-label">{t("shipping.mt")} </label>
                                            <input type="text" className="form-control" id="airTransportationPricingStackableMT"
                                                value={shippingCompany && shippingCompany.airTransportationPricing && shippingCompany.airTransportationPricing.stackable ? shippingCompany.airTransportationPricing.stackable.mt : null}
                                                onChange={updateAirTransportationPricingStackableMT}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="alias" className="form-label">{t("shipping.nonStackableParcels")} </label>
                                </div>

                                <div className="mb-3">
                                    <div className='row'>
                                        <div className='col-6'>
                                            <label htmlFor="airTransportationPricingNonStackableCPM" className="form-label">{t("shipping.cpm")} </label>
                                            <input type="text" className="form-control" id="airTransportationPricingNonStackableCPM"
                                                value={shippingCompany && shippingCompany.airTransportationPricing && shippingCompany.airTransportationPricing.nonStackable ? shippingCompany.airTransportationPricing.nonStackable.cpm : null}
                                                onChange={updateAirTransportationPricingNonStackableCPM}
                                            />
                                        </div>
                                        <div className='col-6'>
                                            <label htmlFor="airTransportationPricingNonStackableMT" className="form-label">{t("shipping.mt")} </label>
                                            <input type="text" className="form-control" id="airTransportationPricingNonStackableMT"
                                                value={shippingCompany && shippingCompany.airTransportationPricing && shippingCompany.airTransportationPricing.nonStackable ? shippingCompany.airTransportationPricing.nonStackable.mt : null}
                                                onChange={updateAirTransportationPricingNonStackableMT}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className='mb-3'>
                        <div className='card'>
                            <div className='card-header'>
                                Full Container Pricing
                            </div>
                            <div className='card-body p-0'>
                                <div className='table-responsive'>
                                    <table className='table'>
                                        <thead>
                                            <tr>
                                                <th>
                                                    Date
                                                </th>
                                                <th style={{ textAlign: 'center' }}>
                                                    {t("shipping.fullLandContainerPrice")}
                                                </th>
                                                <th style={{ textAlign: 'center' }}>
                                                    {t("shipping.fullSeaContainerPrice")}
                                                </th>
                                                <th>
                                                    Added By
                                                </th>
                                                <th>

                                                </th>
                                            </tr>
                                            <tr>
                                                <th className='pb-4'>
                                                    <span className='text-info'>  {formatDate(pricing.date)}</span>
                                                </th>
                                                <th style={{ textAlign: 'center' }}>
                                                    <input type='number' className='form-control'
                                                        value={pricing.fullLandContainerPrice.amount}
                                                        onChange={updateFullLandContainerPrice}
                                                    />
                                                </th>
                                                <th style={{ textAlign: 'center' }}>
                                                    <input type='number' className='form-control'
                                                        value={pricing.fullSeaContainerPrice.amount}
                                                        onChange={updateFullSeaContainerPrice}
                                                    />
                                                </th>
                                                <th>

                                                </th>
                                                <th style={{ textAlign: 'end' }}>
                                                    <button type='button' className='add-btn' onClick={savePricing}>
                                                        <MdSave size={24} />
                                                        &nbsp;
                                                        {t("dashboard.save")}
                                                    </button>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pricings ? pricings.map(p => (
                                                <tr key={p._id}>
                                                    <td>
                                                        {formatDate(p.date)}
                                                    </td>
                                                    <td style={{ textAlign: 'center' }}>
                                                        {p.fullLandContainerPrice.amount}  {p.fullLandContainerPrice.currencyCode}
                                                    </td>
                                                    <td style={{ textAlign: 'center' }}>
                                                        {p.fullSeaContainerPrice.amount}  {p.fullSeaContainerPrice.currencyCode}
                                                    </td>
                                                    <td>
                                                        {p.addedBy.firstName} {p.addedBy.surName}
                                                    </td>
                                                    <td style={{ textAlign: 'end' }}>
                                                        <button type='button' className='add-btn' onClick={() => selectPricing(p)}>
                                                            <MdEdit size={20} />
                                                            &nbsp;
                                                            {t("dashboard.edit")}
                                                        </button>
                                                    </td>
                                                </tr>
                                            )) : null}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>



                    <div className="mb-3 row col justify-content-end" >
                        <Link className="btn btn-warning" to='/admin/shippingCompanies' >{t("dashboard.cancel")}</Link> &nbsp;
                        <button type="button" className="btn btn-primary" onClick={doPost}>{t("dashboard.submit")}</button>
                    </div>
                </form>
            </div>


        </div>
    )
}


export default EditShippingCompany;