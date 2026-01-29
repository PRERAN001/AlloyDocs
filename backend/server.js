const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const mongoose = require("mongoose");
const pdfroutes=require("./routes/pdf.routes.js")
const imageroutes=require("./routes/image.routes.js")
const audioroutes=require("./routes/audio.routes.js")
const videoroutes=require("./routes/video.routes.js")
const wordroutes=require("./routes/word.routes.js")
const excelroutes=require("./routes/excel.routes.js")
const cors = require("cors");    
const app = express();
// Middleware for parsing form data and JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration - must be before routes
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173',"https://alloy-docs-tms2.vercel.app/",],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
}));

// Handle preflight requests
app.use(cors())

mongoose.connect("mongodb+srv://preran248:preran123@cluster0.gqh6dfj.mongodb.net/?appName=Cluster0").then(() => {
  console.log("Connected to MongoDB");
});
app.get("/", (req, res) => {
  res.send("Hello World!");
});
const userRoutes = require("./routes/user.routes.js");
app.use("/user", userRoutes);
app.use("/pdf", pdfroutes);
app.use("/image", imageroutes);
app.use("/audio", audioroutes);
app.use("/video", videoroutes);
app.use("/word", wordroutes);
app.use("/excel", excelroutes);
app.listen(5001, () => {
  console.log("Server is running on port 5001");
});
