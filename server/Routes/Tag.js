const express = require('express');
const router = express.Router();
const Tag = require('../Controller/Tag');
const ProductTag = require('../Controller/ProductTag');
const upload = require('../Config/Cloudinary.config');

router.get('/', Tag.getTags);
router.post('/', upload.single('iconTag'), Tag.createNewTag);

router.get('/getProductByTag/:tagId', ProductTag.getProductsByTag);
router.get('/getTagByProduct/:pid', ProductTag.getTagByProduct);
router.post('/createProductTag/:pid', ProductTag.createProductTag);
router.delete('/delPTag/:pid', ProductTag.deleteProductTag);

module.exports = router;
