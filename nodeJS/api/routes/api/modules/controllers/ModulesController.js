const express = require('express');
const router = express.Router();
const verifyToken = require('../../utils/auth');
const Modules = require('../data-access/Modules');

"/v1/modules/create"
router.post('/create', verifyToken, async (req, res, next) => {
    let result = await Modules.createNewModule(req.body);
    res.json(result);
});

"/v1/modules/all"
router.get('/all', verifyToken, async (req, res) => {
    let result = await Modules.getAllModules();
    res.json(result);

});

"/v1/modules/enabled"
router.get('/enabled', verifyToken, async (req, res) => {
    let result = await Modules.getEnabledModules();
    res.json(result);

});




module.exports = router;