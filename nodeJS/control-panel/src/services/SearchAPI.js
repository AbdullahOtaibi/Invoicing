import axios from 'axios'



export const customSearch = (searchText) => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/search/"+ searchText);
}




