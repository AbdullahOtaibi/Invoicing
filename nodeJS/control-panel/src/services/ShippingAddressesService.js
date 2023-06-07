import axios from 'axios'
import { getSecured, postSecured } from './ApiClient'

export const getSavedAddresses = () => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/shipments/addresses/savedAddresses");
}

export const getAddress = (id) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/shipments/addresses/get/" + id);
}

export const createAddress = (address) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/shipments/addresses/create", address);
}

export const updateAddress = (address) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/shipments/addresses/update", address);
}
