const express=require("express");
const cors=require("cors");
const dataRoute = require("./routes/dataRoute");
const clientRoute = require("./routes/clientRoute");

const app=express();
const port= process.env.EXPRESS_PORT;
const corsOption={origin: process.env.FRONTEND_URL};

app.use(cors(corsOption));
app.use(express.json()); 
app.use("/",dataRoute);
app.use("/",clientRoute);

app.listen(port);