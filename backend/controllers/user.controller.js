const ApiKey = require("../model/user.model.js");    

const createApiKey = async (req, res) => {
  try {
    const { user_id, plan, api_keyy } = req.body;

    if (!user_id) {
      return res.status(400).json({ message: "user_id is required" });
    }

    if (!api_keyy) {
      return res.status(400).json({ message: "api_keyy is required" });
    }

    // Check if user already has an API key
    const existingKey = await ApiKey.findOne({ user_id: user_id });
    
    if (existingKey) {
      // Update existing key
      const updatedKey = await ApiKey.findOneAndUpdate(
        { user_id: user_id },
        { api_key: api_keyy },
        { new: true }
      );
      
      return res.status(200).json({
        message: "API key updated successfully",
        api_key: updatedKey.api_key,
        plan: updatedKey.plan,
        tokens_total: updatedKey.tokens_total,
        tokens_used: updatedKey.tokens_used,
        active: updatedKey.active,
        createdAt: updatedKey.createdAt,
        updated: true
      });
    }

    // Create new API key
    const PLAN_LIMITS = {
      free: 10000,
      pro: 100000,
      enterprise: 1000000
    };

    const selectedPlan = plan && PLAN_LIMITS[plan] ? plan : "free";

    const apiKeyDoc = await ApiKey.create({
      api_key: api_keyy,                    
      user_id: user_id,                    
      plan: selectedPlan,         
      tokens_total: PLAN_LIMITS[selectedPlan], 
      tokens_used: 0,             
      active: true               
    });

    return res.status(201).json({
      message: "API key created successfully",
      api_key: apiKeyDoc.api_key,
      plan: apiKeyDoc.plan,
      tokens_total: apiKeyDoc.tokens_total,
      tokens_used: apiKeyDoc.tokens_used,
      active: apiKeyDoc.active,
      createdAt: apiKeyDoc.createdAt,
      updated: false
    });

  } catch (error) {
    console.error("Create API Key Error:", error);
    return res.status(400).json({ message: error.message });
  }
};

module.exports = { createApiKey };
