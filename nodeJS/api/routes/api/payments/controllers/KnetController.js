const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const verifyToken = require('../../utils/auth');
const unpack = require('../utils/utils');
const urlencode = require('locutus/php/url/urlencode');
const strlen = require('locutus/php/strings/strlen');
const str_repeat = require('locutus/php/strings/str_repeat');
const chr = require('locutus/php/strings/chr');
const bin2hex = require('locutus/php/strings/bin2hex')
const hex2bin = require('locutus/php/strings/hex2bin')
const ord = require('locutus/php/strings/ord')
const strspn = require('locutus/php/strings/strspn')
const Payment = require('../models/Payment');
const WebsiteSettings = require('../../settings/models/WebsiteSettings')
var url = require('url');

var crypto = require('crypto');

//https://stackoverflow.com/questions/40048629/convert-php-code-to-javascript-implode-pack-and-unpack

//https://locutus.io/php/misc/pack/

router.post('/init-payment', async (req, res) => {

  let settings = await WebsiteSettings.findOne();
   

  let result = {};
  let amount = req.body.amount;
  //amount = (amount / settings.exchangeRate).toFixed(3);
  let currencyCode = req.body.currencyCode;
  let orderId = req.body.orderId;
  let languageCode = req.params.languageCode;
  //TODO: calculate amount according to current exchange rate: 

  let tranTrackid = Date.now();
  let tranportalId = "351901";
  //let responseUrl = "https://website-domain.com/knet/GetHandlerResponse.php";
  let responseUrl = "https://website-domain.com/v1/payment/knet/handle-payment-response";
  let errorUrl = "https://website-domain.com/payment/error";
  if (languageCode == 'ar') {
    errorUrl = "https://website-domain.com/ar/payment/error";
  }

  let reqTrackId = 'trackid=' + tranTrackid;
  let reqTranportalId = "id=" + tranportalId;
  let reqTranportalPassword = "password=351901pg";
  let reqAmount = "amt=" + amount;
  let reqCurrency = "currencycode=414";
  let reqLangid = "langid=EN";
  if (languageCode == 'ar') {
    reqLangid = "langid=AR";
  }

  let reqAction = "action=1";
  let reqResponseUrl = "responseURL=" + responseUrl;
  let reqErrorUrl = "errorURL=" + errorUrl;

  let reqUdf1 = "udf1=" + orderId;
  let reqUdf2 = "udf2=";
  let reqUdf3 = "udf3=";
  let reqUdf4 = "udf4=";
  let reqUdf5 = "udf5=";
  let param = reqTranportalId + "&" + reqTranportalPassword + "&" + reqAction + "&" + reqLangid + "&" + reqCurrency + "&" + reqAmount + "&" + reqResponseUrl + "&" + reqErrorUrl + "&" + reqTrackId + "&" + reqUdf1;
  console.log(param);
  let termResourceKey = "7G4WH96X71J59JNT";
  let encryptedDate = encryptAES(param, termResourceKey);
  param = encryptedDate + "&tranportalId=" + tranportalId + "&" + "responseURL=" + responseUrl + "&errorURL=" + errorUrl;
  let paymentLink = "https://kpaytest.com.kw/kpg/PaymentHTTP.htm?param=paymentInit&trandata=" + param;
  result.paymentLink = paymentLink;

  res.json(result);
});


router.post('/handle-payment-response', async (req, res) => {
  let result = {};
  //chack ip address white list
  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  ip = ip.split(":").pop();
  console.log(ip);

  let termResourceKey = "7G4WH96X71J59JNT";

  let decrytedData = "";
  let ResErrorText = req.param('ErrorText');

  let ResPaymentId = req.param('paymentid');		//Payment Id
  let ResTrackID = req.param('trackid');       	//Merchant Track ID
  let ResErrorNo = req.param('Error');           //Error Number
  let ResResult = req.param('result');          //Transaction Result
  let ResPosdate = req.param('postdate');        //Postdate
  let ResTranId = req.param('tranid');           //Transaction ID
  let ResAuth = req.param('auth');               //Auth Code		
  let ResAVR = req.param('avr');                 //TRANSACTION avr					
  let ResRef = req.param('ref');                 //Reference Number also called Seq Number
  let ResAmount = req.param('amt');              //Transaction Amount
  let Resudf1 = req.param('udf1');               //UDF1
  //let Resudf2 = req.body['udf2'];               //UDF2
  // let Resudf3 = req.body['udf3'];               //UDF3
  // let Resudf4 = req.body['udf4'];               //UDF4
  //let Resudf5 = req.body['udf5'];               //UDF5
  //application/x-www-form-urlencoded
  result.requestBody = req.body;
  result.requestParams = req.params;
  result.requestQuery = req.query;

  if (!ResErrorText && !ResErrorNo) {
    result.noErrors1 = true;
    let ResTranData = req.param('trandata');
    result.tranData = ResTranData;
    if (ResTranData) {
      decrytedData = decrypt(ResTranData, termResourceKey);
      result.tranData = decrytedData;



      const newObject = new Payment({
        udf1: Resudf1,
        trackingId: ResTrackID,
        paymentId: ResPaymentId,
        transactionId: ResTranId,
        authCode: ResAuth,
        referenceId: ResRef,
        amount: ResAmount,
        status: ResResult,
        paymentMethod: 'KNET'
      });

      let formDataItems = decrytedData.split('&');
      result.output = formDataItems;
      formDataItems.forEach(element => {
        if (element.indexOf("=") >= 0) {
          let pair = element.split("=");
          var key = pair[0];
          var value = pair[1];
          if (key == 'paymentid') {
            newObject.paymentId = value;
          }
          if (key == 'result') {
            newObject.status = value;
          }
          if (key == 'auth') {
            newObject.authCode = value;
          }
          if (key == 'ref') {
            newObject.referenceId = value;
          }
          if (key == 'tranid') {
            newObject.transactionId = value;
          }
          if (key == 'postdate') {
            newObject.postdate = value;
          }
          if (key == 'trackid') {
            newObject.trackingId = value;
          }
          if (key == 'udf1') {
            newObject.order = value;
            newObject.udf1 = value;
          }
          if (key == 'amt') {
            newObject.amount = value;
          }
          if (key == 'authRespCode') {
            newObject.authCode = value;
          }


          //newObject[key] = value;

        }

      });

      result.db = newObject;

      let newSerial = 1;
      let lastPayment = await Payment.findOne({}).sort({ serialNumber: -1 });
      if (lastPayment && lastPayment.serialNumber) {
        newSerial = parseInt(lastPayment.serialNumber) + 1;
      }
      newObject.currencyCode = "KWD";
      newObject._id = new mongoose.Types.ObjectId();
      newObject.serialNumber = newSerial;

      
      newObject.save().then(createdObject => {
       
        console.log('saved into database...');
        // res.json(result);
        //return;
        return res.redirect('/knet-payment-result/' + createdObject._id);
      }).catch(e => {
        console.log('cannot save into database', e.message);
        res.json(e);
        return;
      });


      //return res.redirect('/UserHomePage');
    } else {
      //return res.redirect('/UserHomePage');
    }
  } else {
    // return res.redirect("Location: https://yourwebsite.com/PHP/result.php?"."Error=".$ResErrorNo."&ErrorText=".$ResErrorText."&trackid=".$ResTrackID."&amt=".$ResAmount."&paymentid="+$ResPaymentId);
  }
  //return res.redirect('/UserHomePage');
  //res.json({ result });


});

function encryptAES(str, key) {

  str = pkcs5_pad(str);
  var cipher = crypto.createCipheriv('aes-128-cbc', key, key);
  cipher.setAutoPadding(false);
  let encrypted = Buffer.from(cipher.update(str, 'utf8', 'binary') + cipher.final('binary'), 'binary').toString('base64');
  let buff = Buffer.from(encrypted, 'base64');
  encrypted = buff.toString('binary');
  encrypted = unpack('C*', (encrypted));
  //C - unsigned char
  encrypted = byteArray2Hex(encrypted);
  encrypted = urlencode(encrypted);
  return encrypted;
}

function decrypt(code, key) {
  code = hex2ByteArray(code.trim());
  code = byteArray2String(code);
  let iv = key;
  const buff = Buffer.from(code, 'binary');
  code = buff.toString('base64');

  let decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
  decipher.setAutoPadding(false);
  code = Buffer.from(decipher.update(code, 'base64', 'binary') + decipher.final('binary'), 'binary').toString('utf8');

  //let buff2 = Buffer.from(code, 'utf8');
  // code = buff2.toString('base64');
  return pkcs5_unpad(code);
}

function byteArray2String(byteArray) {
  let chars = [];
  let outputString = "";
  Object.values(byteArray).forEach(element => {
    outputString += chr(element);
  });
  return outputString;
}


function pkcs5_pad(text) {
  let blocksize = 16;
  let pad = blocksize - (strlen(text) % blocksize);
  return text + str_repeat(chr(pad), pad);
}

function pkcs5_unpad(text) {
  let pad = ord(text[strlen(text) - 1]);
  if (pad > strlen(text)) {
    return false;
  }
  if (strspn(text, chr(pad), strlen(text) - pad) != pad) {
    return false;
  }
  return text.substring(0, text.length - pad);
}



function byteArray2Hex(byteArray) {
  let chars = [];
  let hexString = "";
  Object.values(byteArray).forEach(element => {
    hexString += chr(element);
  });

  return bin2hex(hexString);
}




function hex2ByteArray(hexString) {
  let string = hex2bin(hexString);
  return unpack('C*', string);
}


module.exports = router;