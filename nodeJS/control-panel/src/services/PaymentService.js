import axios from 'axios'



export const initPayment = (amount, orderId, languageCode) => {
  return axios.post(process.env.REACT_APP_API_BASE_URL + "/v1/payment/knet/init-payment/", {amount: amount, orderId: orderId, languageCode: languageCode });
  
}

export const getPaymentDetails = (id) => {
  return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/payments/get/"+ id);
}

export const getPaymentsByOrderId = (id) => {
  return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/payments/byOrderId/"+ id);
}

