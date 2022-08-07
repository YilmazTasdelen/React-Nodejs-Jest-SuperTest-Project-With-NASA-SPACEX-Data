const http = require('http');
const app = require('./app');

const { loadPlanetsData } = require('./models/planets.model');
const { mongoConnect } = require('./services/mongo');
const { loadLaunchData } = require('./models/launches.model');

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer() {
  await mongoConnect();
  await loadPlanetsData(); // get the data from begining cause reading it is async. it may be not finish when we get request. we just make sure that we have data when we start server
  await loadLaunchData();
  server.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
  });
}

startServer();
