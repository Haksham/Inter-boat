const express = require('express');
const router = express.Router();
const mysql = require("mysql2");
const redis = require('../redisClient');
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

router.get('/', async (req, res) => {
  const cacheKey = "all_articles";
  try {
    // 1. Try to get from Redis cache
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    // 2. If not cached, fetch from DB
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
    db.query(query, async (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
      // 3. Cache the result in Redis for 60 seconds
      await redis.set(cacheKey, JSON.stringify(results), 'EX', 60);
      res.json(results);
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.query(
    "select * from users where username = ? and password = ?",
    [username, password],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (results.length === 0) return res.status(401).json({ error: "Invalid credentials" });
      req.session.user = {
        id: results[0].id,
        username: results[0].username,
        role: results[0].role
      };
      res.json({ success: true, role: results[0].role, id: results[0].id  });
    }
  );
});

router.post("/delete-article", async (req, res) => {
  const article_id = req.body.article_id;
  const query = "delete from articles where id = ?";
  db.query(query, [article_id], async (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    await redis.del("all_articles"); // Invalidate cache
    res.json({ success: true });
  });
})

router.post("/host/update-status", async (req, res) => {
  const {article_id,status}=req.body;
  const updated_by = 1;
  const query =`update article_status set status = ?, updated_by = ?, updated_at = CURRENT_TIMESTAMP where article_id = ?`;
  db.query(query,[status, updated_by,article_id], async (err,results)=>{
    if (err) return res.status(500).json({ error: "Database error" });
    await redis.del("all_articles");
    // Optionally, also invalidate the client cache if you know the client_id
    res.json({ success: true });
  })
});

router.post("/createClient", (req, res) => {
  const { username, password } = req.body;
  const role = "client";
  //  check if username exists
  db.query("select id from users where username = ?", [username], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (results.length > 0) {
      return res.status(409).json({ error: "Username already exists" });
    }
    // if not exists, insert new user
    const query = "insert into users (username, password, role) values (?, ?, ?)";
    db.query(query, [username, password, role], (err2, results2) => {
      if (err2) return res.status(500).json({ error: "Database error" });
      res.json({ success: true, id: results2.insertId, role });
    });
  });
});

router.get('/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  res.json(req.session.user);
});

router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    res.clearCookie('session_id'); // Make sure this matches your session key
    res.json({ success: true });
  });
});

module.exports = router;