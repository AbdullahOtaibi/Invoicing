const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const verifyToken =  require('../../utils/auth');

const MailTemplate = require('../models/MailTemplate');

// "/v1/mail-templates/all"
router.get('/all', (req, res) => {
    MailTemplate.find({})
        .sort({ _id: 1 })
        .then(items => {
            res.json(items);
        });
});

// "/v1/mail-templates/get/:id"
router.get('/get/:id', (req, res) => {
    MailTemplate.findOne({ _id: req.params.id })
        .sort({ id: 1 })
        .then(items => {
            res.json(items);
        });
});

// "/v1/mail-templates/create"
router.post('/create', verifyToken, async (req, res) => {
    const newObject = new MailTemplate({
        ...req.body
    });
    newObject._id = new mongoose.Types.ObjectId();
    newObject.save().then(createdObject => {

        console.log('saved into database...');
        res.json(createdObject);
    }).catch(e => {
        console.log('cannot save into database', e.message);
        res.json(e);
    });
});

// "/v1/mail-templates/update"
router.post('/update', verifyToken, async (req, res) => {
    MailTemplate.findByIdAndUpdate(req.body._id, req.body, function (err, item) {
        console.log('saved into database...');
        res.json(item);
    })
});


module.exports = router;