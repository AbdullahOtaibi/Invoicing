const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Payment = require('../models/Payment');
const OutstandingPayment = require('../models/OutstandingPayment');

const { query } = require('express');



function Payments() {

    this.getPayments = async () => {
        let result = {};
        try {
            let payments = await Payment.find({});
            result.items = payments;
            result.success = true;
        } catch (e) {
            result.success = false;
            result.error = e.message;
        }
        return result;
    }

    this.getPaymentById = async (paymentId) => {
        try {
            return await Payment.findOne({ _id: paymentId })
                .populate("order")
                //.populate("client")
                .populate("shipment");
        } catch (e) {
            console.log("ERROR in payments:data-access:Payments:getPaymentById[" + paymentId + "]" ,e);
            return { found: false };
        }
    }

    this.getPaymentByOrderId = async (orderId) => {
        try {
            return await Payment.findOne({ order: orderId })
                .populate("order")
                .populate("client")
                .populate("shipment");
        } catch (e) {
            console.log(e);
            return { found: false };
        }
    }

    this.getOutstandingPaymentsByUserId = async (userId) => {
        try {
            return await OutstandingPayment.findOne({ client: userId })
                .populate("order")
                .populate("client")
                .populate("shipment");
        } catch (e) {
            console.log(e);
            return { found: false };
        }

    }

    this.getOutstandingPaymentByOrderId = async (orderId) => {
        try {
            return await OutstandingPayment.findOne({ order: orderId })
                .populate("order")
                .populate("client")
                .populate("shipment");
        } catch (e) {
            console.log(e);
            return { found: false };
        }

    }
    this.getOutstandingPayments = async (filters) => {
        let result = {};
        let queryParams = {}
        try {
            let payments = await OutstandingPayment.find({  })
                .populate("order")
                .populate("client")
                .populate("shipment");
                result.items = payments;
                result.success = true;
        } catch (e) {
            console.log(e);
            result.success = false;
            result.error = e.message;
        }
        return result;

    }

    this.createOutstandingPaymentPayment = async (postedData) => {
        try {
            let newSerial = 1;
            let lastItem = await OutstandingPayment.findOne({}).sort({ serialNumber: -1 });
            if (lastItem && lastItem.serialNumber) {
                newSerial = lastItem.serialNumber + 1;
            }


            const newObject = new OutstandingPayment(postedData);
            newObject.serialNumber = newSerial;
            newObject._id = new mongoose.Types.ObjectId();
            newObject.paid = false;
            let savedObject = await newObject.save();
            return savedObject;

        } catch (e) {
            console.log(e);
            return { found: false };
        }
    }
   




}


module.exports = new Payments();  