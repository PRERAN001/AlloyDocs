const express = require("express");
const apiKeyMiddleware=require("../middleware/apiKeyAuth")
const ApiKey = require("../model/user.model.js");    
const router = express.Router();
router.post('/merge',apiKeyMiddleware,async(req,res)=>{
    const python_utl="http://127.0.0.1:5000"
    console.log("api keyyy dfdshkjhsdkljh",req)
    await ApiKey.updateOne(
      { _id: req.apiKey._id },
      { $inc: { tokens_used: req.tokensToDeduct } }
    );


    const response=await fetch(`${python_utl}/pdf/merge`,{
        method:"POSt",
        body:req,
        duplex:"half"
    })
    if(response.status===200){
        const res_frontend=await response.arrayBuffer()
        res.set("Content-Type", "application/pdf");
        res.send(Buffer.from(res_frontend));
    }
})
module.exports = router;