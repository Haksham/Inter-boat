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
    select 
      a.id as article_id,
      a.title,
      a.content,
      a.client_id,
      a.submitted_at,
      s.status
    from articles a
    left join article_status s on s.article_id = a.id;
  `;
  db.query(query, (err, results) => {
    res.json(results);
  });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.query(
    "select * from users where username = ? and password = ?",
    [username, password],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (results.length === 0) return res.status(401).json({ error: "Invalid credentials" });
      // You can add JWT or session here for production
      res.json({ success: true, role: results[0].role, id: results[0].id  });
    }
  );
});

router.post("/delete-article",(req,res)=>{
  const article_id = req.body.article_id;
  const query = "delete from articles where id = ?";
  db.query(query, [article_id], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json({ success: true });
  });
})

router.post("/host/update-status", (req, res) => {
  const {article_id,status}=req.body;
  const updated_by = 1;
  const query =`UPDATE article_status SET status = ?, updated_by = ?, updated_at = CURRENT_TIMESTAMP WHERE article_id = ?`;
  db.query(query,[status, updated_by,article_id],(err,results)=>{
    if (err) return res.status(500).json({ error: "Database error" });
    res.json({ success: true });
  })
});

router.post("/createClient", (req, res) => {
  const { username, password } = req.body;
  const role = "client";
  //  check if username exists
  db.query("SELECT id FROM users WHERE username = ?", [username], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (results.length > 0) {
      return res.status(409).json({ error: "Username already exists" });
    }
    // if not exists, insert new user
    const query = "INSERT INTO users (username, password, role) VALUES (?, ?, ?)";
    db.query(query, [username, password, role], (err2, results2) => {
      if (err2) return res.status(500).json({ error: "Database error" });
      res.json({ success: true, id: results2.insertId, role });
    });
  });
});

module.exports = router;