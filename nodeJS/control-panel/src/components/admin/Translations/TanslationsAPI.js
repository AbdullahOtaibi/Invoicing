import axios from 'axios'
import { getSecured, postSecured } from '../../../services/ApiClient'



export const getTranslations = () => {
    return getSecured("/v1/translations/all-languages");
}

export const getTranslation = (code) => {
    return getSecured("/v1/translations/" + code);
}

