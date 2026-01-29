const ApiKey = require("../model/user.model");

const TOKENS_PER_REQUEST = 5;

const apiKeyMiddleware = async (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next(); 
  }
  try {
    const apiKey = req.headers["x-api-key"];

    if (!apiKey) {
      return res.status(401).json({ message: "API key missing" });
    }

    const keyDoc = await ApiKey.findOne({
      api_key: apiKey,
      active: true
    });

    if (!keyDoc) {
      return res.status(401).json({ message: "Invalid API key" });
    }

    const remaining = keyDoc.tokens_total - keyDoc.tokens_used;

    if (remaining < TOKENS_PER_REQUEST) {
      return res.status(429).json({ 
        message: "Token quota exceeded",
        remaining,
        required: TOKENS_PER_REQUEST
      });
    }

    // Attach API key info to request for later use
    req.apiKey = keyDoc;
    req.tokensToDeduct = TOKENS_PER_REQUEST;

    next();
  } catch (err) {
    console.error("API Key Middleware Error:", err);
    return res.status(500).json({ message: "Middleware error: " + err.message });
  }
};

module.exports = apiKeyMiddleware;
