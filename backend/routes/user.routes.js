const express = require("express");
const router = express.Router();
const { createApiKey, getApiKey } = require("../controllers/user.controller.js");

router.post("/create-api-key", createApiKey);
router.get("/get-api-key", getApiKey);

module.exports = router;
