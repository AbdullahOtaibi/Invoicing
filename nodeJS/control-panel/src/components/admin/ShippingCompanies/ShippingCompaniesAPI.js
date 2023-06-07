import axios from 'axios'
import { getSecured, postSecured } from '../../../services/ApiClient'



export const getShippingCompanies = () => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/shippingCompanies/all");
}

export const getShippingCompany = (id) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/shippingCompanies/get/" + id);
}

export const createShippingCompany = (company) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/shippingCompanies/create", company);
   
}

export const updateShippingCompany = (company) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/shippingCompanies/update", company);
   
}


export const getShippingPricings = (companyId) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/shipping/pricing/all/" + companyId);
}

export const getLatestShippingPricing = (companyId) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/shipping/pricing/latest/" + companyId);
}

export const createShippingPricing = (pricing) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/shipping/pricing/create", pricing);
   
}

export const updateShippingPricing = (pricing) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/shipping/pricing/update", pricing);
   
}


//

