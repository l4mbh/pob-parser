const express = require("express");
const router = express.Router();

const apiController = require('../controllers/api');



// GET api

// POST api
router.post("/pob-parser",apiController.pobParser);
router.post("/pobb",apiController.pobb);
router.post("/poewiki-skills", apiController.skillsGem);
router.post("/poewiki-skill-img", apiController.skillGemImg)



module.exports = router;
