import axios from 'axios'



export const subscribe = (emailAddress) => {
    return axios.post(process.env.REACT_APP_API_BASE_URL + "/v1/newsletter/create", {email: emailAddress});
}




