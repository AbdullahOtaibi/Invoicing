const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const verifyToken =  require('../../utils/auth');

const Slide = require('../models/Slide');

router.get('/all', (req, res) => {
    Slide.find()
    .sort( {_id: -1})
    .then(items => {
        res.json(items);
    });
});

router.get('/homePage', (req, res) => {
    Slide.find({ published:true})
    .sort( {_id: -1})
    .then(items => {
        res.json(items);
    });
});




// "/v1/slides/{id}"
router.get('/get/:id', (req, res) => {
    Slide.findOne({_id: req.params.id})
    .sort( {id: 1})
    .then(items => {
        res.json(items);
    });
});

// "/v1/slides/create"
router.post('/create', verifyToken, async (req, res) => {
    const newObject = new Slide({
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
 
// "/v1/slides/update"
router.post('/update', verifyToken, async (req, res) => {
    console.log('update Slide called...');
    console.log(req.body);
    Slide.findByIdAndUpdate(req.body._id, req.body, function (err, item){
        console.log('saved into database...');
        res.json(item);
    })
   
 
});

// "/v1/slides/remove/{id}"
router.get('/remove/:id', verifyToken, async (req, res) => {
    console.log("Param : " + req.params.id);
    Slide.findById(req.params.id)
    .then(item => 
        item.remove().then(() => res.json({ success: true}))).catch(e => res.status(404).json({success: false}));
});

module.exports =  router;