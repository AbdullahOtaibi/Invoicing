import axios from 'axios'
import { getSecured, postSecured } from '../../../services/ApiClient'

export const getOrders = () => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/orders/all", {
        headers:
            { "authorization": "Bearer " + localStorage.getItem("jwt") }, crossdomain: true
    });
}

export const removeOrder = (orderId) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/orders/remove/" + orderId);
}


export const getOrder = (orderId) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/orders/get/" + orderId);
}




export const sendTocompanies = (orderId) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/orders/sendTocompanies/" + orderId);
}


export const getNewOrders = (filters) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/orders/filter", filters);
}

export const getClosedOrders = (filters) => {
    filters.status = 'closed';
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/orders/filter", filters);
}

export const getIncompleteOrders = (filters) => {
    filters.status = 'incomplete';
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/orders/filter", filters);
}


export const updateItemAvailable = (orderId, itemId, available) => {
    const data = {
        orderId: orderId,
        itemId: itemId,
        available: available
    }
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/orders/updateItemAvailable", data);
}


export const updateItemConfirmed = (orderId, itemId, confirmed) => {
    const data = {
        orderId: orderId,
        itemId: itemId,
        confirmed: confirmed
    }
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/orders/updateItemConfirmed", data);
}

export const addItemMessage = (orderId, itemId, message) => {
    const data = {
        orderId: orderId,
        itemId: itemId,
        message: message
    }
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/orders/addItemMessage", data);
}

export const closeOrder = (orderId) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/orders/closeOrder/" + orderId);
}

export const getPaymentsByOrderId = (id) => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/payments/byOrderId/" + id);
}

export const getShipmentByOrderId = (id) => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/shipments/byOrderNumber/" + id);
}


export const deleteOrderItem = (id) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/orders/deleteItem/" + id);
}

export const requestPayment = (paymentRequest) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/payments/outstanding/create", paymentRequest);
}


export const customSearch = (searchText) => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/search/" + searchText);
}


export const addOrderItem = (orderId, productId, qty) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/orders/addItem", { orderId: orderId, productId: productId, qty: qty });

}

export const sendOrderMessage = (messageObject) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/mailer/send-order-message", messageObject);

}








