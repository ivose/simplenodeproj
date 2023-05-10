const Blog = require('../models/Blog');

exports.createBlog = async (req, res) => {
    const { title, content } = req.body;
    const author = req.userId;

    try {
        const blog = await Blog.create({ title, content, author });
        res.status(201).json({ message: 'Blog created successfully', blog });
    } catch (err) {
        res.status(400).json({ message: 'Error creating blog', error: err });
    }
};

exports.getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().populate('author', 'username');
        res.status(200).json({ message: 'Blogs retrieved successfully', blogs });
    } catch (err) {
        res.status(400).json({ message: 'Error retrieving blogs', error: err });
    }
};


exports.getBlog = async (req, res) => {
    const blogId = req.params.id;

    try {
        const blog = await Blog.findById(blogId);

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        res.status(200).json(blog);
    } catch (err) {
        res.status(400).json({ message: 'Error fetching blog', error: err });
    }
};

exports.updateBlog = async (req, res) => {
    const blogId = req.params.id;
    const userId = req.userId;
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required' });
    }

    try {
        const blog = await Blog.findOne({ _id: blogId, author: userId });

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        blog.title = title;
        blog.content = content;

        await blog.save();

        res.status(200).json({ message: 'Blog updated successfully', blog });
    } catch (err) {
        res.status(400).json({ message: 'Error updating blog', error: err });
    }
};

exports.deleteBlog = async (req, res) => {
    const blogId = req.params.id;
    const userId = req.userId;

    try {
        const blog = await Blog.findOne({ _id: blogId, author: userId });

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        await blog.remove();

        res.status(200).json({ message: 'Blog deleted successfully' });
    } catch (err) {
        res.status(400).json({ message: 'Error deleting blog', error: err });
    }
};

