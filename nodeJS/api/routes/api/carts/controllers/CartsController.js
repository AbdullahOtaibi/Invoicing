const express = require('express');
const router = express.Router();
const verifyToken = require('../../utils/auth');
const Carts = require('../data-access/Carts')


//GET "/v1/carts/my"
router.get('/my', verifyToken, async (req, res) => {
    let result = await Carts.getCart(req.user.id);
    res.json(result);

});

//POST "/v1/carts/create"
router.post('/create', verifyToken, async (req, res) => {

    let result = await Carts.addCart(req.user.id, req.send.body);
    res.json(result);
});



module.exports = router;
