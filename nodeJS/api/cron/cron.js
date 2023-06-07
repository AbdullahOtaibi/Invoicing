const mongoose = require('mongoose');
const MessageQueue = require('../routes/api/communication/models/MessageQueue');
const nodemailer = require("nodemailer");
const config = require('config');

class CronTask {

    constructor() {
        this.processed = 0;
        const db = config.get("mongoURI");
        mongoose
            .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => { console.log("Connected to database...") })
            .catch(e => { console.log("Error Connecting to db. - " + e.message); });
    }

    sendEmail = async (to, subject, body) => {

        let transporter = nodemailer.createTransport({
            host: config.get("mailServer"),
            port: config.get("mailPort"),
            secure: true, // true for 465, false for other ports
            auth: {
                user: config.get("mailUser"), // generated ethereal user
                pass: config.get("mailPassword"), // generated ethereal password
            },
            tls: {
                ciphers: 'SSLv3'
            }
        });

        return transporter.sendMail({
            from: config.get("mailFrom"), // sender address
            to: to, // list of receivers
            subject: subject, // Subject line
            html: body, // html body
        });

    }


    getUnsentMessages = async function () {
        let result = {};
        try {
            let unsentMessages = await MessageQueue.find({ sent: false, retries: { $lt: 4 } })
                .sort({ _id: -1 });
            result.items = unsentMessages;
            result.success = true;
        } catch (e) {
            result.success = false;
            result.errorMEssage = e.message;
        }

        return result;
    }

    updateSentStatus = async function(id, sent, retries, totalCount){
        this.processed++;
        console.log(`msg._id: ${id}, sent: ${sent} , retries: ${retries}`);
        let updated = await MessageQueue.findOneAndUpdate({_id: id }, {sent: sent, retries: retries});
       
        //console.log('this.processed : ' + this.processed);
        //console.log('totalCount: ' + totalCount);
        if(this.processed == totalCount){
            console.log("all messages processed.");
            console.log("closing database connection.");
            mongoose.disconnect();
        }

    }

    
    

    runTask = async function () {
        console.log("Starting Cron Task...");
        let unsentMessages = await this.getUnsentMessages();
        
        //console.log(unsentMessages);
        if (unsentMessages.success == true && unsentMessages.items && unsentMessages.items.length > 0) {
            unsentMessages.items.forEach(msg => {
                console.log(`sending message ${msg._id} to ${msg.recipients}`);
                this.sendEmail(msg.recipients, msg.subject, msg.messageBody).then(res => {
                    
                    console.log("====================");
                    console.log(res.response);
                    if(res.rejected.length == 0){
                        this.updateSentStatus(msg._id, true, msg.retries, unsentMessages.items.length);
                        console.log("Sent successfully.")
                    }else{
                        this.updateSentStatus(msg._id, false, msg.retries+1, unsentMessages.items.length);
                    }
                }).catch(e => {
                   
                    updateSentStatus(msg._id, false, msg.retries+1, unsentMessages.items.length);
                    console.error(e);
                });
                //console.log(msg);
            })
        }else{
            console.log('no pending messages found.');
            console.log('closing database connection.')
            mongoose.disconnect();
        }
        return;
    }
}

let cronTask = new CronTask();
cronTask.runTask();


//module.exports = new CronTask();