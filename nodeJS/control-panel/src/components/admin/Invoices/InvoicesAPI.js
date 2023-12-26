import { getSecured, postSecured } from '../../../services/ApiClient'


export const sendWhatsApp = (invoiceId) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/invoices/sendWhatsApp", { invoiceId: invoiceId });
}
export const removeInvoice = (invoiceId) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/invoices/remove/" + invoiceId);
}


export const getInvoice = (invoiceId) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/invoices/get/" + invoiceId);
}

export const getContract = (contractId) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/contracts/get/" + contractId);
}


export const getContractInvoices = (contractId) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/invoices/getContractInvoices/" + contractId);
}

export const postToTaxTypeIncome = (invoiceId) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/invoices/postToTaxTypeIncome/" + invoiceId);
}


export const postToTaxTypeRevertedIncome = (invoiceId) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/invoices/postToTaxTypeRevertedIncome/" + invoiceId);
}




export const sendTocompanies = (invoiceId) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/invoices/sendTocompanies/" + invoiceId);
}


export const getInvoices = (filters) => {
    console.log("url:" +process.env.REACT_APP_API_BASE_URL + "/v1/invoices/filter") ;
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/invoices/filter", filters);
}

export const getInvoicesAsExcel = (filters) => {
    console.log("url:" +process.env.REACT_APP_API_BASE_URL + "/v1/invoices/filterExcel") ;
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/invoices/filterExcel", filters);
}

export const getSumInvoicesByContractId = (params) => {
    console.log("url:" +process.env.REACT_APP_API_BASE_URL + "/v1/invoices/getSumInvoicesByContractId") ;
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/invoices/getSumInvoicesByContractId", params);
}
export const getNewInvoices = (filters) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/invoices/filter", filters);
    //return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/invoices/filter", {deleted:false , page:1});
}

export const getCountInvoices = (filter) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/invoices/count", filter);
    //return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/invoices/filter", {deleted:false , page:1});
}

export const getInvoiceSummary = (filter) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/invoices/DachboardSummary", filter);
    //return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/invoices/filter", {deleted:false , page:1});
}


export const getPostedInvoices = (filters) => {
    filters.status = 'posted';
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/invoices/filter", filters);
}



export const getIncompleteInvoices = (filters) => {
    filters.status = 'incomplete';
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/invoices/filter", filters);
}


export const updateItemAvailable = (invoiceId, itemId, available) => {
    const data = {
        invoiceId: invoiceId,
        itemId: itemId,
        available: available
    }
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/invoices/updateItemAvailable", data);
}


export const updateItemConfirmed = (invoiceId, itemId, confirmed) => {
    const data = {
        invoiceId: invoiceId,
        itemId: itemId,
        confirmed: confirmed
    }
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/invoices/updateItemConfirmed", data);
}

export const addItemMessage = (invoiceId, itemId, message) => {
    const data = {
        invoiceId: invoiceId,
        itemId: itemId,
        message: message
    }
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/invoices/addItemMessage", data);
}

export const closeInvoice = (invoiceId) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/invoices/closeInvoice/" + invoiceId);
}

export const getPaymentsByInvoiceId = (id) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/payments/byInvoiceId/" + id);
}

export const getShipmentByInvoiceId = (id) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/shipments/byInvoiceNumber/" + id);
}


export const deleteInvoiceItem = (id) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/invoices/deleteItem/" + id);
}

export const createInvoice = (invoice) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/invoices/create", invoice);
}

export const updateInvoice = (invoice) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/invoices/update", invoice);
}

export const customSearch = (searchText) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/search/" + searchText);
}


export const addInvoiceItem = (invoiceId, productId, qty) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/invoices/addItem", { invoiceId: invoiceId, productId: productId, qty: qty });

}

export const sendInvoiceMessage = (messageObject) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/mailer/send-invoice-message", messageObject);

}








