const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const verifyToken = require('../../utils/auth');

const Payment = require('../models/Payment');
const OutstandingPayment = require('../models/OutstandingPayment');
const Payments = require('../data-access/Payments');

router.post('/all', verifyToken, async (req, res) => {
    let payments = await Payments.getPayments();
    res.json(payments);
   
});

router.get('/get/:id', verifyToken, async (req, res) => {
    let payment = await Payments.getPaymentById(req.params.id);
    res.json(payment);
   
});

router.get('/byOrderId/:id',verifyToken, async (req, res) => {
    let payment = await Payments.getPaymentByOrderId(req.params.id);
    res.json(payment);
});


router.get('/outstanding/by-user:userId',verifyToken, async (req, res) => {
    let outstandingPayments = await Payments.getOutstandingPaymentsByUserId(req.params.userId);
    res.json(outstandingPayments);
});

router.post('/outstanding/filter',verifyToken, async (req, res) => {
    let outstandingPayments = await Payments.getOutstandingPayments(req.body);
    res.json(outstandingPayments);
});


router.get('/outstanding/by-order/:orderId',verifyToken, async (req, res) => {
    let outstandingPayments = await Payments.getOutstandingPaymentByOrderId(req.params.orderId);
    res.json(outstandingPayments);
});

router.post('/outstanding/create',verifyToken, async (req, res) => {
    let payment = await Payments.createOutstandingPaymentPayment(req.body);
    res.json(payment);
});


module.exports = router;