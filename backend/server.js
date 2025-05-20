const express=require("express");
const path=require("path");
const cors=require("cors");
const mysql=require("mysql2");
const userRoute = require("./routes/userRoute");

const app=express();
const port=8000;
const corsOption={origin:"http://localhost:5173"};

app.use(cors(corsOption));
app.use("/",userRoute);

app.get("/",(req,res)=>{
    res.json("lol");
});

//res.download
//res.send
//res.sendfile(path.join(__dirname,"index.html"))
//res.render("")


// middleware creation
// const middleware=(req,res,next)=>{
//     console.log(req);
//     next();
// }
// app.use(middleware);

app.listen(port);