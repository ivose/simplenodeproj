const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blogs');
const config = require('./config/keys');

const app = express();


mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true/*, useCreateIndex: true*/ })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB', err));

app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
