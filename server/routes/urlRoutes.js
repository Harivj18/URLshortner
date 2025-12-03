const express = require('express');
const router = express.Router();
const {
  shortenUrl,
  redirectToOriginal,
  getStats,
  getAllLinks,
  deleteLink,
} = require('../controllers/urlController');

router.post('/shorten', shortenUrl);
router.get('/stats/:shortCode', getStats);
router.get('/navigate/:shortCode', redirectToOriginal);
router.get('/listLinks', getAllLinks);
router.delete('/cascade/:id', deleteLink);

module.exports = router;