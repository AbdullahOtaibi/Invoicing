const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const verifyToken =  require('../../utils/auth');

const Unit = require('../models/Unit');

router.get('/all', (req, res) => {
    Unit.find()
        .sort({ id: 1 })
        .then(items => {
            res.json(items);
        });
});

router.get('/init', (req, res) => {

    const units = [
        {
            name: { english: 'Red', arabic:'أحمر'},
            htmlCode:'#FF0000'
        }
    ];
   

    units.forEach(function (unit, index) {
        //console.log(`${fruit.id}, ${fruit.name},${fruit.Section}`);
        const newObject = new Unit({
            name:{
                english: unit.name.english,
                arabic: unit.name.arabic,
                turkish: unit.name.turkish
            }
            
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
    Unit.findOne({ _id: req.params.id })
        .sort({ id: 1 })
        .then(items => {
            res.json(items);
        });
});

// "/v1/countries/create"
router.post('/create',verifyToken.apply, async (req, res) => {
    const newObject = new Unit({
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
router.post('/update',verifyToken, async (req, res) => {
    Unit.findByIdAndUpdate(req.body._id, req.body, function (err, item) {
        console.log('saved into database...');
        res.json(item);
    })


});

// "/v1/countries/remove/{id}"
router.get('/remove/:id',verifyToken, async (req, res) => {
    console.log("Param : " + req.params.id);
    Unit.findById(req.params.id)
        .then(item =>
            item.remove().then(() => res.json({ success: true }))).catch(e => res.status(404).json({ success: false }));
});

module.exports = router;