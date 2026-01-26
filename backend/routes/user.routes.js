const express = require("express");
const router = express.Router();
const { createApiKey } = require("../controllers/user.controller.js");

router.post("/create-api-key", createApiKey);
module.exports = router;
