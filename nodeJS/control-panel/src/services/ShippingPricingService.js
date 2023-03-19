
import axios from 'axios'
import { getSecured, postSecured } from './ApiClient'

export const calculateShippingPrice = (companyId, cartItems, shippingMethodId) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/shipping/pricing/calculatePrice", {companyId: companyId, cartItems: cartItems, shippingMethodId: shippingMethodId});
}

