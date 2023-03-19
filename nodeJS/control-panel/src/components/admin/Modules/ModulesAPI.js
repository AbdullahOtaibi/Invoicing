import axios from 'axios'
import { getSecured, postSecured } from '../../../services/ApiClient'

export const createModule = (module) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/modules/create", module);
}

export const getAllModules = () => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/modules/all");
}