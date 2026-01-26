const mongoose = require("mongoose");

const ApiKeySchema = new mongoose.Schema(
  {
    api_key: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    user_id: {
      type: String,
      required: true,
      index: true
    },

    plan: {
      type: String,
      enum: ["free", "pro", "enterprise"],
      default: "free"
    },

    tokens_total: {
      type: Number,
      required: true,
      default: 10000
    },

    tokens_used: {
      type: Number,
      default: 0
    },

    active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true   // creates createdAt & updatedAt
  }
);

const ApiKey = mongoose.model("ApiKey", ApiKeySchema);
module.exports = ApiKey;
