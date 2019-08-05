const express = require('express');
const router = express.Router();
const paramsRoutes = require('./params');
const postsRoutes = require('./posts');
const bannersRoutes = require('./banners');
const downloadRoutes = require('./download');

router.use('/params', paramsRoutes);
router.use('/posts', postsRoutes);
router.use('/banners', bannersRoutes);
router.use('/download', downloadRoutes);

module.exports = router;