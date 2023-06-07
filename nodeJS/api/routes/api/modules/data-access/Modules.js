const mongoose = require('mongoose');
const Module = require('../models/Module');


function Modules() {

    this.getEnabledModules = async () => {
        let result = {};
        try {
            let modules = await Module.find({ enabled: true });
            result.items = modules;
            result.success = true;
        } catch (e) {
            console.error(e);
            result.errorMessage = e.message;
            result.success = false;
        }

        return result;
    }

    this.getAllModules = async () => {
        let result = {};
        try {
            let modules = await Module.find({});
            result.items = modules;
            result.success = true;
        } catch (e) {
            console.error(e);
            result.errorMessage = e.message;
            result.success = false;
        }

        return result;
    }


    this.enableModule = async (moduleId) => {
        let result = {};
        try {
            await Module.findOneAndUpdate({ _id: moduleId }, { enabled: true });
            result.success = true;
        } catch (e) {
            console.error(e);
            result.errorMessage = e.message;
            result.success = false;
        }
        return result;
    }

    this.disableModule = async (moduleId) => {
        let result = {};
        try {
            await Module.findOneAndUpdate({ _id: moduleId }, { enabled: false });
            result.success = true;
        } catch (e) {
            console.error(e);
            result.errorMessage = e.message;
            result.success = false;
        }
        return result;
    }

    this.createNewModule = async (module) => {
        let result = {};
        
        try{
            const newObject = new Module({
                ...module
            });
        
            newObject._id = new mongoose.Types.ObjectId();
            let savedObject = await newObject.save();
            result.success = true;
            result.item = savedObject;
        }catch(e){
            console.error(e);
            result.errorMessage = e.message;
            result.success = false;
        }

        return result;
    }




}


module.exports = new Modules();  