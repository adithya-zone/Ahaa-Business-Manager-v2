const router=require("express").Router();

const controller=require("../controllers/settingsController");

router.get("/",controller.getSettings);

router.post("/",controller.saveSettings);

module.exports=router;