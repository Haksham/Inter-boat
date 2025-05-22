const express=require("express");
const cors=require("cors");
const dataRoute = require("./routes/dataRoute");
const clientRoute = require("./routes/clientRoute");
const session = require("express-session");
const mysqlStore = require("express-mysql-session")(session);

const app=express();
const port= process.env.EXPRESS_PORT;
const corsOption={
  origin: process.env.FRONTEND_URL,
  credentials:true,
};
app.use(cors(corsOption));
app.use(express.json()); 

const sessionStore = new mysqlStore({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  createDatabaseTable: true,
  checkExpirationInterval: 900000, // 15 minutes
  expiration: 86400000, // 1 day
  clearExpired: true,
  connectionLimit: 10,
});

app.use(session({
  key: "session_id",
  secret: process.env.SESSION_SECRET,
  store: sessionStore,
  resave:false,
  saveUninitialized:false,
  cookie:{
    maxAge:1000*60*60, // 1 hour
    secure:false,
    httpOnly:true
  }
}));
app.use("/",dataRoute);
app.use("/",clientRoute);


app.listen(port);