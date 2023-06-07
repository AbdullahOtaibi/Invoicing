import axios from 'axios'
import { getSecured, postSecured } from '../../../services/ApiClient'


export const createSlide = (slide) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/slides/create", slide);
}

export const updateSlide = (slide) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/slides/update", slide);
}


export const getSlides = () => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/slides/all", {headers:
    {"authorization": "Bearer " + localStorage.getItem("jwt")}, crossdomain:true});
}

export const getSlide = (slideId) => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/slides/get/" + slideId);
}

export const removeSlide = (slideId) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/slides/remove/" + slideId);
}
