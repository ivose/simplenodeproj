const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config/keys');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const user = await User.create({ username, email, password });
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (err) {
        res.status(400).json({ message: 'Error registering user', error: err });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user._id }, config.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'User logged in successfully', token });
    } catch (err) {
        res.status(400).json({ message: 'Error logging in user', error: err });
    }
};

exports.changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.userId;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Current and new passwords are required' });
    }

    try {
        const user = await User.findById(userId);

        if (!user || !(await user.comparePassword(currentPassword))) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (err) {
        res.status(400).json({ message: 'Error changing password', error: err });
    }
};

exports.resetPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const token = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // Expires in 1 hour

        await user.save();

        const resetUrl = `http://${req.headers.host}/api/auth/reset-password/${token}`;
        const message = `To reset your password, please visit the following link: ${resetUrl}`;

        await sendEmail({
            to: user.email,
            subject: 'Password Reset',
            text: message
        });

        res.status(200).json({ message: 'Password reset email sent' });
    } catch (err) {
        res.status(400).json({ message: 'Error resetting password', error: err });
    }
};

exports.updateProfile = async (req, res) => {
    const { username, email } = req.body;
    const userId = req.userId;

    if (!username || !email) {
        return res.status(400).json({ message: 'Username and email are required' });
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.username = username;
        user.email = email;

        await user.save();

        res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (err) {
        res.status(400).json({ message: 'Error updating profile', error: err });
    }
};



