import axios from 'axios'
import { getSecured, postSecured } from '../../../services/ApiClient'

export const getShops = () => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/shops/all", {headers:
    {"authorization": "Bearer " + localStorage.getItem("jwt")}, crossdomain:true});
}

export const getShop = (shopId) => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/shops/get/" + shopId);
}


export const createShop = (shop) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/shops/create", shop);
    
}

export const updateShop = (shop) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/shops/update", shop);
}


export const removeShop = (shopId) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/shops/remove/" + shopId);
}