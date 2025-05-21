require('dotenv').config();
const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,//can use 127.0.0.1
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
}).promise();

async function getData() {
  const [rows] = await pool.query("select * from user");
  return rows
}

async function getDataId(id) {
  const [rows] = await pool.query(`select * from user where id=?`,[id]);
  return rows
}

getData().then(data => {
  console.log(data);
})


getDataId(2).then(data => {
  console.log(data);
})