const express = require('express');
const router = express.Router();
const verifyToken = require('../../utils/auth');
const mongoose = require('mongoose');
const NavigationMenuItem = require('../models/NavigationMenuItem')
const navigationMenus = require('../data-access/NavigationMenus');


// Menu Model
const NavigationMenu = require('../models/NavigationMenu');

// @route GET api/v1/menus
router.get('/', (req, res) => {
    NavigationMenu.find()
        .sort({ _id: 1 })
        .then(items => {
            res.json(items);
        });
});

router.get('/all', (req, res) => {
    NavigationMenu.find({})
        .sort({ _id: 1 })
        .then(items => {
            res.json(items);
        });
});

router.get('/get/:id', async (req, res) => {
    let id = req.params.id;
    let result = await navigationMenus.getMenuById(id);
    res.json(result);
});

router.get('/getByCode/:code', async (req, res) => {
    let code = req.params.code;
    let result = await navigationMenus.getMenuByCode(code);
    res.json(result);
});


router.get('/removeSubItem/:id', async (req, res) => {

    NavigationMenuItem.findById(req.params.id)
        .then(item =>
            item.remove().then(() => {


                res.json({ success: true });
            })).catch(e => res.status(404).json({ success: false, ex: e }));

});



router.post('/create', verifyToken, async (req, res) => {
    console.log('create menu called...');
    console.log(req.body);
    const newObject = new NavigationMenu({
        title: req.body.title,
        published: req.body.published,
        code: req.body.code,
        cssClassName: req.body.cssClassName
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

router.post('/update', verifyToken, async (req, res) => {
    console.log('update menu called...');
    //console.log(req.body);
    req.body.items.forEach(menuItem => {
        if (menuItem._id == null) {
            menuItem._id = new mongoose.Types.ObjectId();
        }
        menuItem.items.forEach(subItem => {
            if (subItem._id == null) {
                subItem._id = new mongoose.Types.ObjectId();
            }
        });
    });

    await NavigationMenu.findByIdAndUpdate(req.body._id, req.body, function (err, item) {
        if (err) {
            console.log("Error:");
            console.log(err);
        } else {
            console.log('changes saved into database...');
            // console.log(item);
        }
    });
    let menu = await NavigationMenu.findOne({ _id: req.body._id }).populate({
        path: 'items',
        populate: {
            path: 'items',
            model: 'NavigationMenuItem'
        }
    });
    res.json(menu);
});

router.post('/updateItem', verifyToken, async (req, res) => {
    console.log(req.body);
    let result = await navigationMenus.updateMenuItem(req.body);
    res.json(result);
});

router.post('/reorder-items', verifyToken, async (req, res) => {
    let result = await navigationMenus.reorderItems(req.body);
    res.json(result);
});



router.post('/addItem', verifyToken, async (req, res) => {
    console.log(req.body)
    let result = await navigationMenus.addMenuItem(req.body);

    res.json(result);
});



module.exports = router;
