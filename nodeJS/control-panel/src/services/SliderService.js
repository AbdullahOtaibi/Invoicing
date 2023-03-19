import axios from 'axios'

export const getSlide = (slideId) => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/slides/get/"+ slideId);
}


export const getSlides = () => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/slides/all");
}

export const getHomePageSlides = () => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/slides/homePage");
}





