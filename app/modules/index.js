const express = require('express');

const router = express.Router();

router.get('/', async (req, res) => {
  res.json({ msg: 'Hello' });
});

router.get('/test', async (req, res) => {
  res.render('index');
});
module.exports = router;
