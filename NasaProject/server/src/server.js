const http = require('http');
const mongoose = require('mongoose');
const app = require('./app');

const { loadPlanetsData } = require('./models/planets.model');

const PORT = process.env.PORT || 8000;
console.log(PORT);

const server = http.createServer(app);

const MONGO_URL = 'mongodb+srv://yilmaz:azx09azx@nasacluster.llxwhwu.mongodb.net/?retryWrites=true&w=majority';

mongoose.connection.once('open', () => {
  console.log('MongoDB connection ready! ');
});

mongoose.connection.on('error', (err) => {
  console.error(err);
});


async function startServer() {
  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    // usefindAndModify: false,
    //useCreateIndex: true,
    useUnifiedTopology: true,
  });
  await loadPlanetsData(); // get the data from begining cause reading it is async. it may be not finish when we get request. we just make sure that we have data when we start server

  server.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
  });
}

startServer();
