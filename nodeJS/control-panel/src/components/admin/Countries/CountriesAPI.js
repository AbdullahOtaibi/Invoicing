import axios from 'axios'
import { getSecured, postSecured } from '../../../services/ApiClient'


export const createCountry = (country) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/countries/create", country);
}

export const updateCountry = (country) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/countries/update", country);
}


export const getCountries = () => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/countries/all", {headers:
    {"authorization": "Bearer " + localStorage.getItem("jwt")}, crossdomain:true});
}

export const initCountries = () => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/countries/init", {headers:
    {"authorization": "Bearer " + localStorage.getItem("jwt")}, crossdomain:true});
}



export const removeCountry = (countryCode) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/countries/remove/" + countryCode);
}
