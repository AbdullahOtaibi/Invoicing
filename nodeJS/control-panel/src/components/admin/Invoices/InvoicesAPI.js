import axios from 'axios'
import { getSecured, postSecured } from '../../../services/ApiClient'

export const getInvoices = () => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/invoices/all", {
        headers:
            { "authorization": "Bearer " + localStorage.getItem("jwt") }, crossdomain: true
    });
}

export const removeInvoice = (invoiceId) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/invoices/remove/" + invoiceId);
}


export const getInvoice = (invoiceId) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/invoices/get/" + invoiceId);
}




export const sendTocompanies = (invoiceId) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/invoices/sendTocompanies/" + invoiceId);
}


export const getNewInvoices = (filters) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/invoices/filter", filters);
}

export const getClosedInvoices = (filters) => {
    filters.status = 'closed';
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
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/payments/byInvoiceId/" + id);
}

export const getShipmentByInvoiceId = (id) => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/shipments/byInvoiceNumber/" + id);
}


export const deleteInvoiceItem = (id) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/invoices/deleteItem/" + id);
}

export const createInvoice = (invoice) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/invoices/create", invoice);
}


export const customSearch = (searchText) => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/search/" + searchText);
}


export const addInvoiceItem = (invoiceId, productId, qty) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/invoices/addItem", { invoiceId: invoiceId, productId: productId, qty: qty });

}

export const sendInvoiceMessage = (messageObject) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/mailer/send-invoice-message", messageObject);

}








