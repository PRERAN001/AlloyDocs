const express = require("express");
const router = express.Router();
const apiKeyMiddleware=require("../middleware/apiKeyAuth")
const ApiKey = require("../model/user.model.js");    
const python_utl=process.env.backendurl 
router.post('/convert_pdf',apiKeyMiddleware,async(req,res)=>{
    try {
           
        await ApiKey.updateOne(
          { _id: req.apiKey._id },
          { $inc: { tokens_used: req.tokensToDeduct } }
        );
        
        const response=await fetch(`${python_utl}/word/convert_pdf`,{
            method:"POST",
            headers: req.headers,
            body: req,
            duplex:"half"
        })
        
        if(response.status===200){
            const res_frontend=await response.arrayBuffer()
            res.set("Content-Type", "application/pdf");
            res.send(Buffer.from(res_frontend));
        } else {
            res.status(response.status).json({error: "Python backend error"});
        }
    } catch(error) {
        console.error("Convert word to PDF error:", error);
        res.status(500).json({error: error.message});
    }
})

module.exports = router;