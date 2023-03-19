import axios from 'axios'
import { getSecured, postSecured } from '../../../services/ApiClient'



export const createSubscription = (subscription) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/newsletter/create", subscription);
}

export const updateSubscription = (subscription) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/newsletter/update", subscription);
}


export const getSubscriptions = () => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/newsletter/all", {headers:
    {"authorization": "Bearer " + localStorage.getItem("jwt")}, crossdomain:true});
}

export const getSubscription = (email) => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/newsletter/get/" + email);
}

export const removeSubscription = (email) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/newsletter/removeByEmail/" + email);
}
