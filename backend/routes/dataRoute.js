const express = require('express');
const router = express.Router();
const mysql = require("mysql2");
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

db.connect((err) => {
  console.log('MySQL connected....');
});

router.get('/', (req, res) => {
  const query = `
    SELECT 
      a.id AS article_id,
      a.title,
      a.client_id,
      a.submitted_at,
      s.status
    FROM articles a
    LEFT JOIN article_status s ON s.article_id = a.id;
  `;
  db.query(query, (err, results) => {
    res.json(results);
  });
});

module.exports = router;