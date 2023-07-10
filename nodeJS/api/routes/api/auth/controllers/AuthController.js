const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../users/models/User");
const UserRole = require("../../users/models/UserRole");
const Permission = require("../../users/models/Permission");
const process = require("process");
const verifyToken = require("../../utils/auth");
const config = require("config");
const nodemailer = require("nodemailer");
const Logs = require("../../schemas/Log");

//import { sendEmail } from '../../../../utils/Mailer';

const logMessage = (msg, ip) => {
  const newLogEntry = new Logs({
    message: msg,
    ipAddress: ip,
  });
  newLogEntry._id = new mongoose.Types.ObjectId();
  newLogEntry.save().then((logEntry) => { });
};
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
      ciphers: "SSLv3",
    },
  });

  let info = await transporter.sendMail({
    from: config.get("mailFrom"), // sender address
    to: to, // list of receivers
    subject: subject, // Subject line
    html: body, // html body
  });
};

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email })
    .populate("roles")
    .populate("company")
    .populate({
      path: "roles",
      populate: {
        path: "permissions",
        model: "Permission",
      },
    })
    .populate("company");

  var ip = req.connection.remoteAddress;
  logMessage("New Login Attempt for " + req.body.email, ip);
  const userPermissions = [];
  let userRoleName = null;
  let userRole = {};
  if (user) {
    if(user.company && user.company.subscriptionExpiryDate <= Date.now()){
      res.json({ message: "Subscription Expired", success: false });
      return;
    }
    if (req.body.SeqCompanyID == user.company.companyInvoiceID) {
      const password = req.body.password;
      const validPassword = await bcrypt.compare(password, user.password);
      //&& user.emailConfirmed
      if (validPassword) {
        console.log("validPassword true");

        if (user.roles && user.roles.length > 0) {
          userRoleName = user.roles[0].name.english;
          console.log("role found");

          user.roles.forEach((role) => {
            if (role.permissions && role.permissions.length > 0) {
              role.permissions.forEach((permission) => {
                userPermissions.push(permission.code);
              });
            }
          });
        }
        const accessToken = jwt.sign(
          {
            id: user._id,
            email: user.email,
            name: user.name,
            firstName: user.firstName,
            surName: user.surName,
            phone: user.phone,
            countryCode: user.countryCode,
            avatarUrl: user.avatarUrl,
            register_date: user.register_date,
            permissions: userPermissions,
            role: userRoleName,
            company: user.company ? user.company._id : "",
            companyName: user.company ? user.company.name.arabic : "",
            companyId: user.company ? user.company.companyInvoiceID : "",
            logoUrl: user.company ? user.company.logoUrl : "",
            incomeSourceSequence: user.company
              ? user.company.incomeSourceSequence
              : "",
            invoiceCategory: user.company ? user.company.invoiceCategory : "",
            companyClientId: user.company ? user.company.clientId : "",
            companyClientSecret: user.company ? user.company.clientSecret : "",
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "30 days" }
        );

        res.json({
          success:true,
          jwt: accessToken,
          user: {
            name: user.name,
            email: user.email,
            firstName: user.firstName,
            surName: user.surName,
            phone: user.phone,
            countryCode: user.countryCode,
            avatarUrl: user.avatarUrl,
            id: user._id,
            permissions: userPermissions,
            role: userRoleName,
            company: user.company ? user.company._id : "",
            companyName: user.company ? user.company.name.arabic : "",
            companyId: user.company ? user.company.companyInvoiceID : "",
            logoUrl: user.company ? user.company.logoUrl : "",
            incomeSourceSequence: user.company
              ? user.company.incomeSourceSequence
              : "",
            invoiceCategory: user.company ? user.company.invoiceCategory : "",
            companyClientId: user.company ? user.company.clientId : "",
            companyClientSecret: user.company ? user.company.clientSecret : "",
          },
        });
      }

      // else if(!user.emailConfirmed){
      //       res.json({message: "Please confirm your email address", success:false, confirmEmailAddress: true});
      //}
      else {
        res.json({ message: "Invalid Username Or Password!.", success: false });
      }
    } else {
      res.json({
        message: "Invalid Username Or Password Or Sequance Company ID.",
        success: false,
      });
    }
  } else {
    res.json({ message: "Invalid Username Or Password!.", success: false });
  }
});

router.get("/oauth-login/:email", async (req, res) => {
  const user = await User.findOne({ email: req.params.email })
    .populate("roles")
    .populate({
      path: "roles",
      populate: {
        path: "permissions",
        model: "Permission",
      },
    })
    .populate("company");
  var ip = req.connection.remoteAddress;
  logMessage("New Login Attempt for " + req.params.email, ip);
  const userPermissions = [];
  let userRoleName = null;
  let userRole = {};
  if (user) {
    if (user.roles && user.roles.length > 0) {
      userRoleName = user.roles[0].name.english;
      console.log("role found");

      user.roles.forEach((role) => {
        if (role.permissions && role.permissions.length > 0) {
          role.permissions.forEach((permission) => {
            userPermissions.push(permission.code);
          });
        }
      });
    }
    const accessToken = jwt.sign(
      {
        id: user._id,
        email: user.email,
        name: user.name,
        firstName: user.firstName,
        surName: user.surName,
        phone: user.phone,
        countryCode: user.countryCode,
        avatarUrl: user.avatarUrl,
        register_date: user.register_date,
        permissions: userPermissions,
        role: userRoleName,
        companyName: user.company ? user.company.name.arabic : "",
        companyId: user.company ? user.company.companyInvoiceID : "",
        logoUrl: user.company ? user.company.logoUrl : "",
        incomeSourceSequence: user.company
          ? user.company.incomeSourceSequence
          : "",
        invoiceCategory: user.company ? user.company.invoiceCategory : "",
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30 days" }
    );

    res.json({
      jwt: accessToken,
      user: {
        name: user.name,
        email: user.email,
        firstName: user.firstName,
        surName: user.surName,
        phone: user.phone,
        countryCode: user.countryCode,
        avatarUrl: user.avatarUrl,
        id: user._id,
        permissions: userPermissions,
        role: userRoleName,
        companyName: user.company ? user.company.name.arabic : "",
        companyId: user.company ? user.company.companyInvoiceID : "",
        logoUrl: user.company ? user.company.logoUrl : "",
        incomeSourceSequence: user.company
          ? user.company.incomeSourceSequence
          : "",
        invoiceCategory: user.company ? user.company.invoiceCategory : "",
      },
    });
  } else {
    res.json({ message: "Invalid Username Or Password!.", success: false });
  }
});

router.get("/oauth-profile/:token", async (req, res) => {
  let user = {};
  if (typeof req.params.token !== "undefined") {
    const bearerToken = req.params.token;

    await jwt.verify(
      bearerToken,
      process.env.ACCESS_TOKEN_SECRET,
      (err, authData) => {
        if (err) {
          res.sendStatus(403);
        } else {
          // console.log(authData);
          user = authData;
        }
      }
    );
  } else {
    res.sendStatus(403);
  }

  user = await User.findOne({ email: user.email })
    .populate("roles")
    .populate({
      path: "roles",
      populate: {
        path: "permissions",
        model: "Permission",
      },
    });
  var ip = req.connection.remoteAddress;
  logMessage("New Login Attempt for " + req.params.email, ip);
  const userPermissions = [];
  let userRoleName = null;
  let userRole = {};
  if (user) {
    if (user.roles && user.roles.length > 0) {
      userRoleName = user.roles[0].name.english;
      console.log("role found");

      user.roles.forEach((role) => {
        if (role.permissions && role.permissions.length > 0) {
          role.permissions.forEach((permission) => {
            userPermissions.push(permission.code);
          });
        }
      });
    }

    res.json({
      jwt: req.params.token,
      user: {
        name: user.name,
        email: user.email,
        firstName: user.firstName,
        surName: user.surName,
        phone: user.phone,
        countryCode: user.countryCode,
        avatarUrl: user.avatarUrl,
        id: user._id,
        permissions: userPermissions,
        role: userRoleName,
        companyName: user.company ? user.company.name.arabic : "",
        companyId: user.company ? user.company.companyInvoiceID : "",
        logoUrl: user.company ? user.company.logoUrl : "",
        incomeSourceSequence: user.company
          ? user.company.incomeSourceSequence
          : "",
        invoiceCategory: user.company ? user.company.invoiceCategory : "",
      },
    });
  } else {
    res.json({ message: "Invalid Username Or Password!.", success: false });
  }
});

router.post("/register", async (req, res) => {
  var password = req.body.password;
  var salt = await bcrypt.genSalt(10);
  var hash = await bcrypt.hash(password, salt);
  const rand = Math.random().toString().substr(2, 14);

  const newUser = new User({
    firstName: req.body.firstName,
    surName: req.body.surName,
    phone: req.body.phone,
    address: req.body.address,
    countryCode: req.body.countryCode,
    email: req.body.email,
    password: hash,
    emailConfirmed: true,
    active: true,
    otp: rand,
  });
  newUser._id = new mongoose.Types.ObjectId();
  newUser
    .save()
    .then((user) => {
      console.log("saved into database...");
      let mailBody =
        "Welcome " +
        user.firstName +
        " " +
        user.surName +
        "<br/> Please click <a href='https://website-domain.com/activate-account/" +
        user._id +
        "/" +
        rand +
        "'> here </a> to activate your account.";
      sendEmail(req.body.email, "New User Registeres", mailBody);
      res.json(user);
    })
    .catch((e) => {
      console.log("cannot save into database", e.message);
      res.json(e);
    });
  //res.json({passwordHash: hash});
});

router.post("/updatePassword", verifyToken, async (req, res) => {
  var password = req.body.newPassword;
  var salt = await bcrypt.genSalt(10);
  var hash = await bcrypt.hash(password, salt);

  let updateData = {
    password: hash,
  };
  //console.log(req.user);
  User.findByIdAndUpdate(req.user.id, updateData, function (err, item) {
    console.log("saved into database...");
    res.json({ success: true });
  });
});

router.post("/updateProfile", verifyToken, async (req, res) => {
  // console.log(req.user);
  let updateData = {
    firstName: req.body.firstName,
    surName: req.body.surName,
    phone: req.body.phone,
    address: req.body.address,
    countryCode: req.body.countryCode,
  };
  User.findByIdAndUpdate(req.user.id, updateData, function (err, item) {
    console.log("saved into database...");
    res.json({ success: true });
  });
});

router.get("/user", verifyToken, async (req, res) => {
  const user = await User.findOne({ _id: req.user.id });
  user.password = "";
  res.json(user);
});

module.exports = router;
