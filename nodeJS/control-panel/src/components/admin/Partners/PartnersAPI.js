import axios from 'axios'
import { getSecured, postSecured } from '../../../services/ApiClient'


export const createPartner = (partner) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/partners/create", partner);
}

export const updatePartner = (partner) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/partners/update", partner);
}


export const getPartners = () => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/partners/all", {headers:
    {"authorization": "Bearer " + localStorage.getItem("jwt")}, crossdomain:true});
}

export const getPartner = (partnerId) => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/partners/get/" + partnerId);
}

export const removePartner = (partnerId) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/partners/remove/" + partnerId);
}
