const express = require('express');
const router = express.Router();

router.get('/users', (req, res) => {
    res.json("users");
});

router.get('/users/:id', (req, res) => {
    let id=req.params.id;
    res.json(`user ${id}`);
});

module.exports = router;