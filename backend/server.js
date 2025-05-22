const express=require("express");
const cors=require("cors");
const dataRoute = require("./routes/dataRoute");
const clientRoute = require("./routes/clientRoute");

const app=express();
const port=8000;
const corsOption={origin:"http://localhost:5173"};

app.use(cors(corsOption));
app.use(express.json()); 
app.use("/",dataRoute);
app.use("/",clientRoute);

app.listen(port);