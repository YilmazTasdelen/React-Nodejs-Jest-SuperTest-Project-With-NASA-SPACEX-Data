const {
  getAllLaunches,
  addNewLaunch,
  scheduleNewLaunch,
  abortLaunchById,
} = require('../../models/launches.model');

async function httpgetAllLaunches(req, res) {
  const launches = await getAllLaunches();
  return res.status(200).json(launches);
}

async function httpAddNewLaunch(req, res) {
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
  await scheduleNewLaunch(launch);
  return res.status(201).json(launch);
}



async function httpAbroadLaunch(req, res) {
  const launchId = Number(req.params.id);

  const existsLaunch = await existsLaunchWithId(launchId);
  if (!existsLaunch) {
    return res.status(404).json({
      error: 'Launch not found',
    });
  }

  const aborted = await abortLaunchById(launchId);
  if (!aborted) {
    return res.status(400).json({
      error: 'Launch not aborted',
    });
  }

  return res.status(200).json({
    ok: true,
  });
}




module.exports = {
  httpgetAllLaunches,
  httpAddNewLaunch,
  httpAbroadLaunch,
};
