const express = require("express");
const router = express.Router();
const { generateQuestions, analyzeSentiment } = require("./controllers");

router.post("/generateQuestions", generateQuestions);
router.post("/analyzeSentiment", analyzeSentiment);

module.exports = router;
