const {
  getAllLaunches,
  addNewLaunch,
  existLaunchWithId,
  abortLaunchById,
} = require('../../models/launches.model');

function httpgetAllLaunches(req, res) {
  return res.status(200).json(getAllLaunches());
}

function httpAddNewLaunch(req, res) {
  const launch = req.body;

  if (!launch.mission || !launch.rocket || !launch.launchDate
    || !launch.target) {
    return res.status(400).json({
      err: 'Missing required launch property'
    })
  }

  launch.launchDate = new Date(launch.launchDate);
  //if (launch.launchDate.toString() === 'Invalid Date') {
  if (isNaN(launch.launchDate)) { //this is better 
    return res.status(400).json({
      err: 'Invalid launch date',
    });
  }
  addNewLaunch(launch);
  return res.status(201).json(launch);
}




function httpAbroadLaunch(req, res) {
  const launchId = Number(req.params.id);
  // console.log("launchId", launchId);
  if (!existLaunchWithId(launchId)) {
    return res.status(404).json({
      err: 'Launch not found'
    })
  }

  const aborted = abortLaunchById(launchId);
  console.log("aborted", aborted);
  return res.status(200).json(aborted);
}




module.exports = {
  httpgetAllLaunches,
  httpAddNewLaunch,
  httpAbroadLaunch,
};
