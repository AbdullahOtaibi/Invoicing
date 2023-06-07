import axios from 'axios'



export const getTestimonial = (testimonialsId) => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/testimonials/get/"+ testimonialsId);
}


export const getTestimonials = () => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/testimonials/all");
}


