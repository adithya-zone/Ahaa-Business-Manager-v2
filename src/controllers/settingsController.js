const service = require("../services/settingsService");

const {

    success,

    error

} = require("../utils/response");

async function getSettings(req,res){

    try{

        success(

            res,

            await service.getSettings()

        );

    }

    catch(err){

        error(

            res,

            err.message,

            500

        );

    }

}

async function saveSettings(req,res){

    try{

        await service.saveSettings(req.body);

        success(

            res,

            {},

            "Settings Saved"

        );

    }

    catch(err){

        error(

            res,

            err.message,

            500

        );

    }

}

module.exports={

    getSettings,

    saveSettings

};