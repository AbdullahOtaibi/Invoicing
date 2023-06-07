import axios from 'axios'
import { getSecured, postSecured } from './ApiClient'



export const getQuotation = (id) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/quotations/get/" + id);
}

export const getNewQuotations = () => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/quotations/new");
}

export const createQuotation = (quotation) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/quotations/create", quotation);
}

export const getClientQuotations = () => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/quotations/clientQuotations");
}