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

module.exports = router;