const express = require('express');
const router = express.Router();
const UrlsController = require('../controllers/urls');

router.get('/', UrlsController.showUrls);
router.get('/new', UrlsController.registerNewUrl);
router.get('/:id', UrlsController.editUrl);
router.get('/u/:id', UrlsController.redirectToLongUrl);
router.post('/', UrlsController.createNewShortUrl);
router.post('/:id', UrlsController.updateLongUrl);
router.post('/:id/delete', UrlsController.deleteUrl);

module.exports = router;