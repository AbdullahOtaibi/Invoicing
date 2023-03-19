import axios from 'axios'
import { getSecured, postSecured } from './ApiClient'

export const getNewOrders = () => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/orders/new");
}

export const createOrder = (cart) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/orders/create", cart);
}

export const getClientOrders = () => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/orders/clientOrders");
}


export const getOrder = (id) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/orders/get/" + id);
}

export const getPaymentDetails = (id) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/orders/getPaymentDetails/" + id);
}

