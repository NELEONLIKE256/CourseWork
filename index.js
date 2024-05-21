const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');

require('dotenv').config();

const connectToDb = async () => {
    await mongoose.connect(process.env.MONGODB_URI)

    console.log('MongoDB database connection established successfully');

    const connection = mongoose.connection;
    connection.once('open', () => {
        console.log('MongoDB database connection established successfully');
    });

    connection.on('error', console.error.bind(console, 'connection error:'));
}

(async () => {
    try {
        await connectToDb();
        const app = express();

        app.use(cors());
        app.use(express.json());
        app.use(morgan('combined'));
        app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

        const lostAndFoundRouter = require('./LostAndFoundRoutes');
        app.use('/lostAndFound', lostAndFoundRouter);

        const port = process.env.PORT || 5000;
        app.listen(port, () => {
            console.log(`Server is running on port: ${port}`);
        });
    } catch (error) {
        console.log('Error connecting to MongoDB: ', error.message);
    }
})()
