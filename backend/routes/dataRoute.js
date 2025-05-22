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
      a.content,
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



router.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.query(
    "SELECT * FROM users WHERE username = ? AND password = ?",
    [username, password],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (results.length === 0) return res.status(401).json({ error: "Invalid credentials" });
      // You can add JWT or session here for production
      res.json({ success: true, role: results[0].role, id: results[0].id  });
    }
  );
});

router.get('/client/:id/articles', (req, res) => {
  const clientId = req.params.id;
  const query = `
    select 
      a.id as article_id,
      a.title,
      a.content,
      a.client_id,
      a.submitted_at,
      s.status
    from articles a
    left join article_status s on s.article_id = a.id
    where a.client_id = ?;
  `;
  db.query(query, [clientId], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results);
  });
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



router.post("/client/:id/edit-article", (req, res) => {
  const { article_id, title, content } = req.body;
  const query = `
    UPDATE articles 
    SET title = ?, content = ? 
    WHERE id = ?;
  `;
  db.query(query, [title, content, article_id], (err, results) => {
  if (err) {
    console.error("Edit Article Error:", err); // Add this line
    return res.status(500).json({ error: "Database error" });
  }
  res.json({ success: true });
  });
});


router.post("/client/:id/add-article", (req, res) => {
  const { title, content, client_id } = req.body;
  const insertArticleQuery = `
    INSERT INTO articles (title, content, client_id, submitted_at)
    VALUES (?, ?, ?, CURRENT_TIMESTAMP);
  `;
  db.query(insertArticleQuery, [title, content, client_id], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    const article_id = results.insertId;

    const insertStatusQuery = `
      INSERT INTO article_status (article_id, status, updated_by)
      VALUES (?, 'pending', ?)
    `;
    db.query(insertStatusQuery, [article_id, client_id], (err2) => {
      if (err2) return res.status(500).json({ error: "Database error" });
      res.json({ success: true });
    });
  });
});

module.exports = router;