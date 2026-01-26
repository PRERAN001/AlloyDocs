const ApiKey = require("../model/user.model.js");    

const createApiKey = async (req, res) => {
  try {
    const { user_id, plan,api_keyy } = req.body;

    if (!user_id) {
      return res.status(400).json({ message: "user_id is required" });
    }

    // 🔐 Generate API key server-side
    const api_key = api_keyy

    // 📊 Plan-based token limits (schema compliant)
    const PLAN_LIMITS = {
      free: 10000,
      pro: 100000,
      enterprise: 1000000
    };

    const selectedPlan = plan && PLAN_LIMITS[plan] ? plan : "free";

    const apiKeyDoc = await ApiKey.create({
      api_key,                    // required
      user_id,                    // required
      plan: selectedPlan,         // enum-safe
      tokens_total: PLAN_LIMITS[selectedPlan], // required
      tokens_used: 0,             // default
      active: true                // default
    });

    return res.status(201).json({
      message: "API key created successfully",
      api_key: apiKeyDoc.api_key,
      plan: apiKeyDoc.plan,
      tokens_total: apiKeyDoc.tokens_total,
      tokens_used: apiKeyDoc.tokens_used,
      active: apiKeyDoc.active,
      createdAt: apiKeyDoc.createdAt
    });

  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = { createApiKey };
