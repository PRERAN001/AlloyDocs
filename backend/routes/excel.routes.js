const express = require("express");
const router = express.Router();
const apiKeyMiddleware=require("../middleware/apiKeyAuth")
const ApiKey = require("../model/user.model.js");    

router.post('/to_csv',apiKeyMiddleware,async(req,res)=>{
    try {
        const python_utl="http://127.0.0.1:5000"    
        await ApiKey.updateOne(
          { _id: req.apiKey._id },
          { $inc: { tokens_used: req.tokensToDeduct } }
        );
        
        const response=await fetch(`${python_utl}/excel/to_csv`,{
            method:"POST",
            headers: req.headers,
            body: req,
            duplex:"half"
        })
        
        if(response.status===200){
            const res_frontend=await response.arrayBuffer()
            res.set("Content-Type", "text/csv");
            res.send(Buffer.from(res_frontend));
        } else {
            res.status(response.status).json({error: "Python backend error"});
        }
    } catch(error) {
        console.error("Excel to CSV error:", error);
        res.status(500).json({error: error.message});
    }
})

module.exports = router;