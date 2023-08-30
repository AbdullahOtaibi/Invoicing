import axios from 'axios'
import { getSecured } from './ApiClient'



export const getShippingCompanies = () => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/shippingCompanies/all");
}

export const getAvailableOptions = () => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/shipments/getAvailableOptions");
}


