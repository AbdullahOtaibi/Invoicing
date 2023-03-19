import axios from 'axios'



export const getpartner = (partnerId) => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/partners/get/"+ partnerId);
}


export const getPartners = () => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/partners/all");
}


