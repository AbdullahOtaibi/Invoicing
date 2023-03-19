const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const verifyToken = require('../../utils/auth');

const Company = require('../models/Company');
const User = require('../../users/models/User');

router.get('/all', (req, res) => {
    Company.find()
        .sort({ id: 1 })
        .then(items => {
            res.json(items);
        });
});

router.get('/homePage', (req, res) => {
    Company.find({ showAsPartner: true, published: true })
        .sort({ id: 1 })
        .then(items => {
            res.json(items);
        });
});




// "/v1/companies/{id}"
router.get('/get/:id', (req, res) => {
    Company.findOne({ _id: req.params.id }).populate("categories")
        .sort({ id: 1 })
        .then(items => {
            res.json(items);
        });
});

// "/v1/companies/create"
router.post('/create', verifyToken, async (req, res) => {
    const newObject = new Company({
        ...req.body
    });
    newObject._id = new mongoose.Types.ObjectId();
    let createdCompany = await newObject.save().then(createdObject => {

        console.log('saved into database...');

    }).catch(e => {
        console.log('cannot save into database', e.message);
        res.json(e);
    });
if(!req.user.role || req.user.role.length == 0){
    //await User.findByIdAndUpdate(req.user.id, {vendor: newObject._id, roles:["623368ce494d1fc52d76571e"] }, function (err, item) {});
}else{
   // await User.findByIdAndUpdate(req.user.id, {vendor: newObject._id }, function (err, item) {});
}
  
    res.json(createdCompany);
});

// "/v1/companies/update"
router.post('/update', verifyToken, async (req, res) => {
    console.log('update vendor called...');
    console.log(req.body);
    if(req.body.vendorId && !req.body.vendor){
        req.body.vendor = req.body.vendorId;
    }
    Company.findByIdAndUpdate(req.body._id, req.body, function (err, item) {
        console.log('saved into database...');
        res.json(item);
    })
   

});

// "/v1/companies/remove/{id}"
router.get('/remove/:id', verifyToken, async (req, res) => {
    console.log("Param : " + req.params.id);
    Company.findById(req.params.id)
        .then(item =>
            item.remove().then(() => res.json({ success: true }))).catch(e => res.status(404).json({ success: false }));
});

module.exports = router;