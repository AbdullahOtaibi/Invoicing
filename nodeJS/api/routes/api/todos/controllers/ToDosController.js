const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const verifyToken = require('../../utils/auth');

const ToDo = require('../models/ToDo');

router.get('/all', verifyToken, (req, res) => {
    ToDo.find({ user: req.user.id })
        .sort({ _id: 1 })
        .then(items => {
            res.json(items);
        });
});


module.exports = router;
