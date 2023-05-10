const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', blogController.getAllBlogs);
router.post('/', authMiddleware.verifyToken, blogController.createBlog);
router.get('/:blogId', blogController.getBlog);
router.put('/:blogId', authMiddleware.verifyToken, blogController.updateBlog);
router.delete('/:blogId', authMiddleware.verifyToken, blogController.deleteBlog);

module.exports = router;
