const express = require('express');
const router = express.Router();
const mysql = require("mysql2");
const { requireLogin, requireRole } = require('../middleware/session');
const redis = require('../redisClient');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

router.get('/client/:id/articles', requireLogin, requireRole('client'), async (req, res) => {
  const clientId = req.params.id;
  const cacheKey = `client_articles_${clientId}`;
  try {
    const cached = await redis.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));
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
    db.query(query, [clientId], async (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
      await redis.set(cacheKey, JSON.stringify(results), 'EX', 60);
      res.json(results);
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/client/:id/add-article",requireLogin, requireRole('client'), (req, res) => {
  const { title, content, client_id } = req.body;
  const insertArticleQuery = `
    insert into articles (title, content, client_id, submitted_at)
    values (?, ?, ?, CURRENT_TIMESTAMP);
  `;
  db.query(insertArticleQuery, [title, content, client_id], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    const article_id = results.insertId;

    const insertStatusQuery = `
      insert into article_status (article_id, status, updated_by)
      values (?, 'pending', ?)
    `;
    db.query(insertStatusQuery, [article_id, client_id], async (err2) => {
      if (err2) return res.status(500).json({ error: "Database error" });
      await redis.del(`client_articles_${client_id}`);
      await redis.del("all_articles");
      res.json({ success: true });
    });
  });
});

router.post("/client/:id/edit-article",requireLogin, requireRole('client'), (req, res) => {
  const { article_id, title, content } = req.body;
  const query = `
    update articles 
    set title = ?, content = ? 
    where id = ?;
  `;
  db.query(query, [title, content, article_id], async (err, results) => {
    if (err) {
      console.error("Edit Article Error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    // You need client_id here; you can fetch it or pass it in the request
    const client_id = req.body.client_id;
    if (client_id) {
      await redis.del(`client_articles_${client_id}`);
    }
    await redis.del("all_articles");
    res.json({ success: true });
  });
});

module.exports = router;