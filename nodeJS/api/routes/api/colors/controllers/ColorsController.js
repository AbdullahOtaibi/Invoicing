const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const verifyToken =  require('../../utils/auth');

const Color = require('../models/Color');

router.get('/all', (req, res) => {
    Color.find()
        .sort({ id: 1 })
        .then(items => {
            res.json(items);
        });
});

router.get('/init', verifyToken, async (req, res) => {

    const mainColors = [
        {
            name: { english: 'Red', arabic:'أحمر'},
            htmlCode:'#FF0000'
        }
    ];
   

    mainColors.forEach(function (color, index) {
        //console.log(`${fruit.id}, ${fruit.name},${fruit.Section}`);
        const newObject = new Color({
            htmlCode: color.htmlCode,
            name: color.name
        });
        newObject._id = new mongoose.Types.ObjectId();
        newObject.save().then(createdObject => {

            console.log('saved into database...');
            //res.json(createdObject);
        }).catch(e => {
            console.log('cannot save into database', e.message);
            //res.json(e);
        });

    })

    res.json(mainColors);
});


// "/v1/countries/{id}"
router.get('/get/:id', (req, res) => {
    Color.findOne({ _id: req.params.id })
        .sort({ id: 1 })
        .then(items => {
            res.json(items);
        });
});

// "/v1/countries/create"
router.post('/create', verifyToken, async (req, res) => {
    const newObject = new Color({
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

// "/v1/countries/update"
router.post('/update', verifyToken, async (req, res) => {
    Color.findByIdAndUpdate(req.body._id, req.body, function (err, item) {
        console.log('saved into database...');
        res.json(item);
    })


});

// "/v1/countries/remove/{id}"
router.get('/remove/:id', verifyToken, async (req, res) => {
    console.log("Param : " + req.params.id);
    Color.findById(req.params.id)
        .then(item =>
            item.remove().then(() => res.json({ success: true }))).catch(e => res.status(404).json({ success: false }));
});

module.exports = router;