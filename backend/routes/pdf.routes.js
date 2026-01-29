const express = require("express");
const apiKeyMiddleware=require("../middleware/apiKeyAuth")
const ApiKey = require("../model/user.model.js");    
const router = express.Router();

router.post('/merge',apiKeyMiddleware,async(req,res)=>{
    try {
        const python_utl="http://127.0.0.1:5000"    
        await ApiKey.updateOne(
          { _id: req.apiKey._id },
          { $inc: { tokens_used: req.tokensToDeduct } }
        );
        
        const response=await fetch(`${python_utl}/pdf/merge`,{
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
        console.error("Merge error:", error);
        res.status(500).json({error: error.message});
    }
})

router.post('/convert_word',apiKeyMiddleware,async(req,res)=>{
    try {
        const python_utl="http://127.0.0.1:5000"    
        await ApiKey.updateOne(
          { _id: req.apiKey._id },
          { $inc: { tokens_used: req.tokensToDeduct } }
        );
        
        const response=await fetch(`${python_utl}/pdf/convert_word`,{
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
        console.error("Convert word error:", error);
        res.status(500).json({error: error.message});
    }
})

router.post('/split',apiKeyMiddleware,async(req,res)=>{
    try {
        const python_utl="http://127.0.0.1:5000"    
        await ApiKey.updateOne(
          { _id: req.apiKey._id },
          { $inc: { tokens_used: req.tokensToDeduct } }
        );
        
        const response=await fetch(`${python_utl}/pdf/split`,{
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
        console.error("Split error:", error);
        res.status(500).json({error: error.message});
    }
})

router.post('/watermark',apiKeyMiddleware,async(req,res)=>{
    try {
        const python_utl="http://127.0.0.1:5000"    
        await ApiKey.updateOne(
          { _id: req.apiKey._id },
          { $inc: { tokens_used: req.tokensToDeduct } }
        );
        
        const response=await fetch(`${python_utl}/pdf/watermark`,{
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
        console.error("Watermark error:", error);
        res.status(500).json({error: error.message});
    }
})

module.exports = router;