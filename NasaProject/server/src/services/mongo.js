const mongoose = require('mongoose');

//require('dotenv').config();


const MONGO_URL = 'mongodb+srv://yilmaz:azx09azx@nasacluster.llxwhwu.mongodb.net/?retryWrites=true&w=majority';


mongoose.connection.once('open', () => {
    console.log('MongoDB connection ready!');
});

mongoose.connection.on('error', (err) => {
    console.error(err);
});

async function mongoConnect() {
    await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect() {
    await mongoose.disconnect();
}

module.exports = {
    mongoConnect,
    mongoDisconnect,
}