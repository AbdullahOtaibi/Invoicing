const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const verifyToken =  require('../../utils/auth');

// Article Model
const Article = require('../models/Article');



// @route GET api/v1/articles
router.get('/', verifyToken, (req, res) => {
    Article.find()
    .sort( {id: 1})
    .then(articles => {
        res.json(articles);
    });
});

router.get('/all', (req, res) => {
    Article.find({})
    .sort( {id: 1})
    .then(articles => {
        res.json(articles);
    });
});

router.get('/allAliases', (req, res) => {
    Article.find({alias: {$ne: null}}, "alias")
    .then(articles => {
        res.json(articles);
    });
});

router.get('/getByAlias/:alias', (req, res) => {
    console.log("Param : " + req.params.alias);
    Article.findOne({alias: req.params.alias})
    .sort( {id: 1})
    .then(item => {
        res.json(item);
    });
});

router.get('/get/:id', (req, res) => {
    console.log("Param : " + req.params.id);
    Article.findOne({_id: req.params.id})
    .sort( {id: 1})
    .then(item => {
        res.json(item);
    });
});

router.get('/remove/:id', verifyToken, async (req, res) => {
    console.log("Param : " + req.params.id);
    Article.findById(req.params.id)
    .then(item => 
        item.remove().then(() => res.json({ success: true}))).catch(e => res.status(404).json({success: false, ex: e}));
   
});


router.post('/create', verifyToken, async (req, res) => {
   const newArticle = new Article({
    ...req.body
   });
   newArticle._id = new mongoose.Types.ObjectId();
   newArticle.save().then(article => {

       console.log('saved into database...');
       res.json(article);
   }).catch(e => {
       console.log('cannot save into database', e.message);
       res.json(e);
   });
});

router.post('/update', verifyToken, async (req, res) => {
    Article.findByIdAndUpdate(req.body._id, req.body, function (err, item){
        console.log('saved into database...');
        res.json(item);
    })
   
 
});


module.exports =  router;
