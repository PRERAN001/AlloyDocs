const express = require("express");
const mongoose = require("mongoose");
const pdfroutes=require("./routes/pdf.routes.js")
const cors = require("cors");    
const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true, // Allow cookies/credentials
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization',"x-api-key"]
}));
mongoose.connect("mongodb://localhost:27017/nothing").then(() => {
  console.log("Connected to MongoDB");
});
app.get("/", (req, res) => {
  res.send("Hello World!");
});
const userRoutes = require("./routes/user.routes.js");
app.use("/user", userRoutes);
app.use("/pdf", pdfroutes);
app.listen(5001, () => {
  console.log("Server is running on port 5001");
});
