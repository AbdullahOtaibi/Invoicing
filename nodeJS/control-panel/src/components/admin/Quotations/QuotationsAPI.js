import axios from 'axios'
import { getSecured, postSecured } from '../../../services/ApiClient'

export const getQuotations = () => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/quotations/all", {headers:
    {"authorization": "Bearer " + localStorage.getItem("jwt")}, crossdomain:true});
}


export const getQuotation = (quotationId) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/quotations/get/" + quotationId);
}

export const getNewQuotations = () => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/quotations/new");
}

export const removeQuotation = (quotationId) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/quotations/remove/" + quotationId);
}








export const sendTocompanies = (quotationId) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/quotations/sendTocompanies/" + quotationId);
}

export const updateItemAvailable = (quotationId, itemId, available) => {
    const data = {
        quotationId: quotationId,
        itemId: itemId,
        available: available
    }
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/quotations/updateItemAvailable",data);
}


export const updateItemConfirmed = (quotationId, itemId, confirmed) => {
    const data = {
        quotationId: quotationId,
        itemId: itemId,
        confirmed: confirmed
    }
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/quotations/updateItemConfirmed",data);
}

export const addItemMessage = (quotationId, itemId, message) => {
    const data = {
        quotationId: quotationId,
        itemId: itemId,
        message: message
    }
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/quotations/addItemMessage",data);
}