export const getFinalPrice = (product) => {
    let price = {};
    
    let amount = 0;
    if (product && product.price) {
        amount = product.price.amount;
    }
    if(product && product.company && product.company.profitPercentage){
        try{
            let profit = product.company.profitPercentage/100 * amount;
           
            
            amount = amount  + profit;
        }catch(e){

        }
    }
    if (product.discountPercentage && product.discountPercentage > 0) {
        amount = amount - (amount * product.discountPercentage / 100);
    }
    price.amount = Math.ceil(amount).toFixed(2);
    price.currencyCode = product.price.currencyCode;
    if(!price.currencyCode){
        price.currencyCode = "USD";
    }
    return price;
}

export const getOriginalPrice = (product) => {
    let price = 0;
    if (product && product.price) {
        price = product.price.amount;
    }
    if(product && product.company && product.company.profitPercentage){
        try{
            let profit = product.company.profitPercentage/100 * price;
           
            
            price = price  + profit;
        }catch(e){

        }
    }
    
    return Math.ceil(price).toFixed(2);
}

