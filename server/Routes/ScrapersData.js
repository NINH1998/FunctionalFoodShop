const express = require('express');
const router = express.Router();
const scraper = require('../Controller/ScrapersData');

router.post('/', scraper.insertProduct);
router.put('/', scraper.editPRoduct);

module.exports = router;
