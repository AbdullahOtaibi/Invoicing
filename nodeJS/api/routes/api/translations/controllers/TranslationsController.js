const express = require('express');
const router = express.Router();
const verifyToken = require('../../utils/auth');
const Languages = require('../data-access/Languages');

"GET /v1/translations/enabled-languages"
router.get('/enabled-languages', async (req, res) => {
    let result = await Languages.getEnabledLanguages();
    res.json(result);

});


"GET /v1/translations/all-languages"
router.get('/all-languages', async (req, res) => {
    console.log("all-languages called");
    let result = await Languages.getAllLanguages();
    res.json(result);
});



module.exports = router;