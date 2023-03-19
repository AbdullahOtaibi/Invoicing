import axios from 'axios'
import { getSecured, postSecured } from '../../../services/ApiClient'

export const getSummary = () => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/dashboard/info");
}


export const getMyUnreadMessages = () => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/message-queue/myMessages");
}
