import axios from 'axios'
import { getSecured, postSecured } from '../../../services/ApiClient'


export const createTestimonial = (testimonial) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/testimonials/create", testimonial);
}

export const updateTestimonial = (testimonial) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/testimonials/update", testimonial);
}


export const getTestimonials = () => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/testimonials/all", {headers:
    {"authorization": "Bearer " + localStorage.getItem("jwt")}, crossdomain:true});
}

export const getTestimonial = (testimonialId) => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/testimonials/get/" + testimonialId);
}

export const removeTestimonial = (testimonialId) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/testimonials/remove/" + testimonialId);
}
