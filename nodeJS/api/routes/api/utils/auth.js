const express = require('express');
const jwt = require('jsonwebtoken');
const process = require('process');

function verifyToken(req, res, next) {
        const bearerHeader = req.headers['authorization'];
        if (typeof bearerHeader !== 'undefined') {
                const bearerToken = bearerHeader.split(' ')[1];
                req.token = bearerToken;
                jwt.verify(bearerToken, process.env.ACCESS_TOKEN_SECRET, (err, authData) => {
                        if (err) {
                                res.sendStatus(403);
                        } else {
                                // console.log(authData);
                                req.user = authData;
                                next();
                        }
                });
        } else {
                res.sendStatus(403);
        }
}



module.exports = verifyToken;