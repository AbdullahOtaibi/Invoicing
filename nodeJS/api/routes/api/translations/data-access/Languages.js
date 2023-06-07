const mongoose = require('mongoose');
const Language = require('../models/Language');

function Languages() {
    this.getEnabledLanguages = async () => {
        let result = {};
        try {
            let enabledLanguages = await Language.find({ enabled: true });
            result.success = true;
            result.items = enabledLanguages;
        } catch (e) {
            result.success = false;
            result.errorMessage = e.message;
            result.items = [];
        }
        return result;
    }

    this.getAllLanguages = async () => {
        let result = {};
        try {
            let enabledLanguages = await Language.find({});
            result.success = true;
            result.items = enabledLanguages;
        } catch (e) {
            result.success = false;
            result.errorMessage = e.message;
            result.items = [];
        }
        return result;
    }



    this.addLanguage = async (language) => {
        let result = {};
        try {
            let newObject = new Language({ ...language });
            newObject._id = new mongoose.Types.ObjectId();
            let saveResult = await newObject.save();
            result.data = saveResult;
            result.success = true;


        } catch (e) {
            result.success = false;
            result.errorMessage = e.message;
        }
        return result;
    }


    this.initializeDefaults = async () => {
        this.addLanguage({
            code: 'en',
            name: 'English',
            enabled: true
        });

        this.addLanguage({
            code: 'ar',
            name: 'Arabic',
            localizedName: "العربية",
            enabled: true
        });
        this.addLanguage({
            code: 'tr',
            name: 'Turkish',
            localizedName: "Türkçe",
            enabled: true
        });
        this.addLanguage({
            code: 'fa',
            name: 'Persian',
            localizedName: "فارسی",
            enabled: false
        });
    }
}

module.exports = new Languages();  