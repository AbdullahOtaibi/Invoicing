import axios from 'axios'
import { getSecured, postSecured } from '../../../services/ApiClient'

export const getShipments = (filters) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/shipments/filter", filters);
}

export const createShipment = (orderId) => {
    let params = {
        order: orderId
    }
    return axios.post(process.env.REACT_APP_API_BASE_URL + "/v1/shipments/create", params, {headers:
    {"authorization": "Bearer " + localStorage.getItem("jwt")}, crossdomain:true});
}

export const getShipment = (shipmentId) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/shipments/get/" + shipmentId);
}

export const removeShipment = (shipmentId) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/shipments/remove/" + shipmentId);
}


export const updateShipment = (shipment) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/shipments/update",shipment);
}


