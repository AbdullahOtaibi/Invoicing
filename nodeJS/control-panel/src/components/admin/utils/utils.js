
import { useTranslation } from "react-i18next"

export const getLocalizedText = (txtObj, i18n) => {
   
    if(!txtObj){
        return "";
    }
    if (i18n.language == 'en') {
        return txtObj.english;
    } else if (i18n.language == 'ar') {
        return txtObj.arabic;
    } else if (i18n.language == 'tr') {
        return txtObj.turkish;
    }
    return "";
}

export const getLocalizedTextByLocale = (txtObj, locale) => {
   
    if(!txtObj){
        return "";
    }
    if (locale == 'en') {
        return ""+txtObj.english;
    } else if (locale == 'ar') {
        return ""+txtObj.arabic;
    } else if (locale == 'tr') {
        return ""+txtObj.turkish;
    }
    return "";
}


export const getProductImage = product => {
    let imgUrl = '/uploads/';
    let firstImage = null;

    if (product.images && product.images.length > 0) {
        firstImage = product.images[0];

    } else {
        return "/images/no-image.png";
    }
    if (firstImage) {
        imgUrl += (firstImage.uploadFolder ? firstImage.uploadFolder : '') + firstImage.url;
    }
    return imgUrl;
}
export const getProductThumb = product => {
    let imgUrl = '/uploads/';
    let firstImage = null;

    if (product.images && product.images.length > 0) {
        firstImage = product.images[0];

    } else {
        return "/images/no-image.png";
    }
    if (firstImage && firstImage.thumbnailUrl) {
        imgUrl += (firstImage.uploadFolder ? firstImage.uploadFolder : '') + firstImage.thumbnailUrl;
    } else {
        imgUrl += (firstImage.uploadFolder ? firstImage.uploadFolder : '') + firstImage.url;
    }
    return imgUrl;
}


export const getImageUrl = img => {
    let imgUrl = '/uploads/';
    if (!img) {
        return "/images/no-image.png";
    }
    imgUrl += (img.uploadFolder ? img.uploadFolder : '') + img.url;
    return imgUrl;
}
export const getThumbUrl = img => {
    let imgUrl = '/uploads/';
    if (!img) {
        return "/images/no-image.png";
    }
    if (img && img.thumbnailUrl) {
        imgUrl += (img.uploadFolder ? img.uploadFolder : '') + img.thumbnailUrl;
    } else {
        imgUrl += (img.uploadFolder ? img.uploadFolder : '') + img.url;
    }
    return imgUrl;
}

export const getLocalizedUrl = (relativeUrl) => {
    if (relativeUrl.length > 1 && relativeUrl.indexOf('/') == 0) {
        relativeUrl = relativeUrl.substring(1);
    }
    let lang = localStorage.getItem("i18nextLng");
    if (!lang) {
        lang = "en";
    }


    if (lang == "ar" && (window.location.href.endsWith("/ar"))) {
        return relativeUrl;
    } else if (lang == "ar" && (window.location.href.indexOf("/ar/") > -1)) {

        return "/" + lang + "/" + relativeUrl;


    } else {
        return ("/" + relativeUrl).replace("//", "/");
    }
}

export const forUrl = (value) => {
    return value == undefined ? '' : value.replace(/[^a-z0-9_]+/gi, '-').replace(/^-|-$/g, '').toLowerCase();
}
