const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const verifyToken = require('../../utils/auth');
const MessageQueue = require('../models/MessageQueue')
const Messages = require('../data-access/Messages');



// "/v1/message-queue/all"
router.get('/all', verifyToken, (req, res) => {
    MessageQueue.find({})
        .populate("sender", "firstName surName")
        .sort({ _id: -1 })
        .then(items => {
            res.json(items);
        });
});
// "/v1/message-queue/myMessages"
router.get('/myMessages', verifyToken, async (req, res) => {
    let result = await Messages.getUserNewMessages(req.user.id);
    res.json(result);
});

// "/v1/message-queue/userMessages"
router.get('/userMessages', verifyToken, async (req, res) => {
    let result = await Messages.getUserMessages({ userId: req.user.id });
    res.json(result);
});

// "/v1/message-queue/markMessageAsRead/:messageId"
router.get('/markMessageAsRead/:messageId', verifyToken, async (req, res, next) => {
    let result = await Messages.markMessageAsRead(req.params.messageId, req.user.id);

    res.notify = { code: 'messages', extra: 'status-change' };
    res.notify.userEmail = req.user.email;
    res.json(result);
    next();
});

// "/v1/message-queue/markMessageAsUnRead/:messageId"
router.get('/markMessageAsUnRead/:messageId', verifyToken, async (req, res, next) => {
    let result = await Messages.markMessageAsUnRead(req.params.messageId, req.user.id);
    res.notify = { code: 'messages', extra: 'status-change' };
    res.notify.userEmail = req.user.email;
    res.json(result);
    next();
});



// "/v1/message-queue/get/:id"
router.get('/get/:id', verifyToken, async (req, res) => {
    MessageQueue.findOne({ _id: req.params.id })
        .populate("sender", "firstName surName")
        .then(item => {
            res.json(item);
        });
});


// "/v1/message-queue/delete/:id"
router.get('/delete/:id', verifyToken, async (req, res, next) => {

    if (req.user.role != 'Administrator') {
        res.notify = { code: 'messages', extra: 'status-change' };
        res.json({ success: true, message: "Successful deletion" });

        //return;
    } else {
       await  MessageQueue.deleteOne({ _id: req.params.id }, function (err) {
            if (err) console.log(err);
            console.log("Successful deletion");
        });
    }
    res.notify = { code: 'messages', extra: 'status-change' };
    res.json({ success: true, message: "Successful deletion" });
    next();

});



module.exports = router;