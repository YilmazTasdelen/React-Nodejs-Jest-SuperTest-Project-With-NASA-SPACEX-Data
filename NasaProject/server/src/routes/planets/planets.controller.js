const { getAllPlanets } = require('../../models/planets.model');

function httpGetAllPlanets(req, res) {
  // there is a return statement because we need to make sure when we try the response multiple time we wiil get warning or error like response headers been already set .
  // here we sure now even if we try set headers multiple times its func. return just one time
  //rememeber then wen we set response its locked in !!
  return res.status(200).json(getAllPlanets());
}

module.exports = {
  httpGetAllPlanets,
};
