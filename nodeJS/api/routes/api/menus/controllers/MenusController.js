const express = require('express');
const router = express.Router();
const verifyToken =  require('../../utils/auth');

// Menu Model
const Menu = require('../models/Menu');

// @route GET api/v1/menus
router.get('/', (req, res) => {
    Menu.find()
    .sort( {id: 1})
    .then(items => {
        res.json(items);
    });
});

router.get('/all', (req, res) => {
    Menu.find()
    .sort( {id: 1})
    .then(items => {
        res.json(items);
    });
});

router.get('/get/:id', (req, res) => {
    Menu.find()
    .sort( {id: 1})
    .then(items => {
        res.json(items[0]);
    });
});





router.post('/create', verifyToken, async (req, res) => {
    console.log('create menu called...');
    console.log(req.body);
   const newObject = new Menu({
       id: req.body.id,
       title: req.body.title
   });
   newObject.save().then(createdObject => {

       console.log('saved into database...');
       res.json(createdObject);
   }).catch(e => {
       console.log('cannot save into database', e.message);
       res.json(e);
   });
});


module.exports =  router;
