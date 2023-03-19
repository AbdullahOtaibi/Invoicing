const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const MessageQueue = require('../models/MessageQueue');

function Messages() {

    this.getUserNewMessages = async function (userId) {
        let result = {};
        try {
            let unreadMessages = await MessageQueue.find({ user: userId, seen: false })
                .populate("sender", "-password").sort({_id: -1});
            result.items = unreadMessages;
            result.success = true;
        } catch (e) {
            result.success = false;
            result.errorMEssage = e.message;
        }

        return result;
    }

    this.getUserMessages = async function (filters) {
        let result = {};
        try {
            let unreadMessages = await MessageQueue.find({ user: filters.userId })
                .populate("sender", "-password").sort({_id: -1});
            result.items = unreadMessages;
            result.success = true;
        } catch (e) {
            result.success = false;
            result.errorMEssage = e.message;
        }

        return result;
    }

    this.markMessageAsRead = async function (messageId, userId) {
        let result = {};
        try {
            let message = await MessageQueue.findOne({_id: messageId});
            if(message.user == userId){
                await MessageQueue.findByIdAndUpdate(messageId, { seen: true }, function (err, item) {
                    console.log('message marked as Read...');
                });
                result.success = true;
            }else{
                result.errorMessage = "not authorized.";
                result.success = false;
            }
           

           
        } catch (e) {
            console.error(e);
            result.errorMessage = e.message;
            result.success = false;
        }
        return result;
    }

    this.markMessageAsUnRead = async function (messageId, userId) {
        let result = {};
        try {
            let message = await MessageQueue.findOne({_id: messageId});
            if(message.user == userId){
                await MessageQueue.findByIdAndUpdate(messageId, { seen: false }, function (err, item) {
                    console.log('message marked as Read...');
                });
                result.success = true;
            }else{
                result.errorMessage = "not authorized.";
                result.success = false;
            }
           

           
        } catch (e) {
            console.error(e);
            result.errorMessage = e.message;
            result.success = false;
        }
        return result;
    }

}

module.exports = new Messages(); 
