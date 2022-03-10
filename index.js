const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authorRoute = require("./routes/author");
const postRoute = require("./routes/posts");

const app = express();
dotenv.config();

//mongoose connection
mongoose.connect(process.env.MONGO_URL, () => {
        console.log("Connected to mongoose");
    });

//middleware
app.use(express.json()); //bodyparser

//routers
app.use("/api/users", userRoute);
app.use("/api/author", authorRoute);
app.use("/api/posts", postRoute);


app.listen(3000, ()=>{
    console.log("Backend server is started");
})