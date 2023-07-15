const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const verifyToken = require('../../utils/auth');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const UserRole = require('../../users/models/UserRole');
const Permission = require('../models/Permission');
const config = require('config');
const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, body) => {

    let transporter = nodemailer.createTransport({
        host: config.get("mailServer"),
        port: config.get("mailPort"),
        secure: true, // true for 465, false for other ports
        auth: {
            user: config.get("mailUser"), // generated ethereal user
            pass: config.get("mailPassword"), // generated ethereal password
        },
        tls: {
            ciphers: 'SSLv3'
        }
    });

    console.log("sending email to " + to);
    try {
        let info = await transporter.sendMail({
            from: config.get("mailFrom"), // sender address
            to: to, // list of receivers
            subject: subject, // Subject line
            html: body, // html body
        });
        console.log(info);
    } catch (e) {
        console.log(e);
    }

}


router.get('/all', verifyToken, async (req, res) => {
    if (!req.user) {
        res.json({ message: 'unauthorized access' });
    }
    if (req.user.role != "Administrator") {
        res.json({ success: false, message: "Unauthorized" });
    }
//{ roles: { $ne: [] } }
    User.find()
        .sort({ _id: 1 })
        .then(items => {
            res.json(items);
        });
});

router.get('/allClients', verifyToken, async (req, res) => {
    if (!req.user) {
        res.json({ message: 'unauthorized access' });
    }
    if (req.user.role != "Administrator" && (req.user.role != "Company")) {
        res.json({ success: false, message: "Unauthorized" });
    }

    User.find({ roles: [] })
        .sort({ id: 1 })
        .then(items => {
            res.json(items);
        });
});




router.get('/byCompany/:companyId', verifyToken, async (req, res) => {
    if (!req.user) {
        res.json({ message: 'unauthorized access' });
    }
    if (req.user.role != "Administrator" && (req.user.role != "Company")) {
        res.json({ success: false, message: "Unauthorized" });
    }

    User.find({ company: req.params.companyId })
        .sort({ id: 1 })
        .then(items => {
            res.json(items);
        });
});




router.get('/roles', verifyToken, async (req, res) => {
    if (!req.user) {
        res.json({ message: 'unauthorized access' });
    }
    if (req.user.role != "Administrator") {
        res.json({ success: false, message: "Unauthorized" });
    }

    UserRole.find()
        .sort({ id: 1 })
        .then(items => {
            res.json(items);
        });
});

router.get('/permissions', verifyToken, async (req, res) => {
    if (!req.user) {
        res.json({ message: 'unauthorized access' });
    }
    if (req.user.role != "Administrator") {
        res.json({ success: false, message: "Unauthorized" });
    }

    Permission.find()
        .sort({ id: 1 })
        .then(items => {
            res.json(items);
        });
});



router.get('/per', verifyToken, (req, res) => {
    const newObject = new Permission({
        code: "add_user",
        name: {
            english: "add",
            arabic: "add",
            turkish: "add"

        }
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




router.get('/roles/get/:id', (req, res) => {
    UserRole.findOne({ _id: req.params.id })
        .sort({ id: 1 })
        .then(items => {
            res.json(items);
        });
});

router.post('/roles/create', verifyToken, async (req, res) => {
    const newObject = new UserRole({
        ...req.body
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

router.post('/roles/update', verifyToken, async (req, res) => {
    await UserRole.findByIdAndUpdate(req.body._id, req.body);
    res.json(req.body);
    
});



router.get('/byShop/:shopId', (req, res) => {
    User.find({ shopId: req.params.shopId })
        .sort({ id: 1 })
        .then(items => {
            res.json(items);
        });
});

router.get('/get/:id', (req, res) => {
    User.findOne({ _id: req.params.id })
        .sort({ id: 1 })
        .then(items => {
            res.json(items);
        });
});

router.get('/activate/:id/:otp', async (req, res) => {
    let otp = req.params.otp;

    let user = await User.findOne({ _id: req.params.id });
    if (user && user.otp && user.otp.length > 0 && user.otp == otp) {
        User.findByIdAndUpdate(req.params.id, { emailConfirmed: true }, function (err, item) {
            console.log('saved into database...');
            res.json({ success: true, message: "Email address confirmed." });
        })
    } else if (user && user.otp && user.otp.length > 0 && user.otp != otp) {
        res.json({ success: false, message: "Invalid OTP, please send code again", generateNewOTP: true });
    }
    else {
        res.json({ success: false, message: "not found" });
    }


});

router.get('/sendActivationEmail/:email', async (req, res) => {
    let email = req.params.email;

    let user = await User.findOne({ email: email });
    if (user && user.email && user.email.length > 0) {
        let emailBody = "<a href='" + process.env.WEB_BASE_URL + "/admin/activate-account/" + user._id + "/" + user.otp + "'>Verify your email address</a>";
        sendEmail(email, "website-domain.com | Email Verification", emailBody)
        //User.findByIdAndUpdate(req.params.id, {emailConfirmed: true}, function (err, item) {
        //     console.log('saved into database...');
        //    res.json({ message: "ok" });
        // })

    }
    res.json({ message: "ok" });

});

router.get('/forgot-password/:email', async (req, res) => {
    let email = req.params.email;

    let user = await User.findOne({ email: email });
    if (user && user.email && user.email.length > 0) {
        let emailBody = "<a href='" + process.env.WEB_BASE_URL + "/admin/reset-password/" + user.otp + "'>Reset your password</a>.";
        sendEmail(email, "website-domain.com | Reset Password", emailBody);
        //User.findByIdAndUpdate(req.params.id, {emailConfirmed: true}, function (err, item) {
        //     console.log('saved into database...');
        //    res.json({ message: "ok" });
        // })

    }
    res.json({ message: "ok" });

});


router.post('/reset-password', async (req, res) => {
    var email = req.body.email;
    var password = req.body.newPassword;
    var otp = req.body.otp;
console.log("otp: " + otp)


    var salt = await bcrypt.genSalt(10);
    var hash = await bcrypt.hash(password, salt);

    let updateData = {
        password: hash
    }
    //console.log(req.user);
    let user = await User.findOne({ email: email });
    if (user) {
        if (user.otp == otp) {
            console.log('user.otp : ' + user.otp);
             await User.findByIdAndUpdate(user._id, updateData, function (err, item) {
                console.log('saved into database...');
                res.json({ success: true });
            });
        }else{
            res.json({ success: false, message: 'Invalid Reset URL.' });
        }



    } else {
        res.json({ success: false, message: 'Invalid Email Address.' });
    }

});



router.post('/create', verifyToken, async (req, res) => {
    var password = req.body.password;
    var salt = await bcrypt.genSalt(10);
    var hash = await bcrypt.hash(password, salt);
    let exists = await User.findOne({email: req.body.email});
    if(exists){
        res.json({success: false, message: "Email already exists."});
        return;
    }
    await sendEmail(req.body.email, "New User Registeres", "Welcome");
    const newObject = new User({
        ...req.body,
        password: hash
    });
    newObject._id = new mongoose.Types.ObjectId();
    await newObject.save();
    newObject.success = true;
    res.json(newObject);
});



//TODO: implement update
router.post('/update', verifyToken, async (req, res) => {
    let newObject = {
        name: req.body.name,
        roles: req.body.roles,
        avatarUrl: req.body.avatarUrl,
        company: req.body.company,
        active: req.body.active,
        phone: req.body.phone,
        firstName: req.body.firstName,
        surName: req.body.surName,
        address: req.body.address,
        countryCode: req.body.countryCode,
        shippingCompany: req.body.shippingCompany
    }
    if (!req.body.company) {
        newObject.company = null;
    }

    console.log(newObject);

    User.findByIdAndUpdate(req.body._id, newObject, function (err, item) {
        console.log('saved into database...');
        res.json(item);
    })
});

router.get('/byCategoryIds/:categoryIds', (req, res) => {
    console.log("Param : " + req.params.categoryIds);
    User.find({ alias: req.params.categoryIds })
        .sort({ id: 1 })
        .then(items => {
            res.json(items[0]);
        });
});



router.get('/remove/:id', verifyToken, async (req, res) => {
    console.log("Param : " + req.params.id);
    User.findById(req.params.id)
        .then(item =>
            item.remove().then(() => res.json({ success: true }))).catch(e => res.status(404).json({ success: false }));
});


router.get('/clone/:id', verifyToken, async (req, res) => {
    User.findOne({ _id: req.params.id })
        .sort({ id: 1 })
        .then(item => {
            const newObject = new User({
                ...item
            });
            newObject._id = null;
            newObject.save().then(createdObject => {
                res.json("TODO");
            });

        });


});




module.exports = router;