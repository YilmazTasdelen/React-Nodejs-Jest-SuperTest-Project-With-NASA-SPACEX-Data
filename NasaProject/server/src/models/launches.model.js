const launchesDatabase = require('./launches.mongo');
const planets = require('./planets.mongo');
const axios = require('axios');

const DEFAULT_FLIGHT_NUMBER = 100;
const launches = new Map();
const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';
let latestFlightNumber = 100;


const launch = {
  flightNumber: 100, // flight_number at spacex data
  mission: 'Kepler Exploration X', //name  at spacex data
  rocket: 'Explorer IS1', //ROCKET.NAME  at spacex data
  launchDate: new Date('December 27, 2030'),// date_local
  target: 'Kepler-442 b',
  customers: ['ZTM', 'NASA'],
  upcoming: true,
  success: true,
};

//launches.set(latestFlightNumber, launch);

saveLaunch(launch);

async function loadLaunchData() {
  axios.post(SPACEX_API_URL,
    {
      query: {},
      options: {
        populate: [
          {
            path: 'rocket',
            select: {
              name: 1
            }
          }
        ]
      }
    }
  );
}


async function saveLaunch(launch) {
  const planet = await planets.findOne({
    keplerName: launch.target,
  });

  if (!planet) {
    throw new Error('No matching planet found');
  }

  await launchesDatabase.findOneAndUpdate({
    flightNumber: launch.flightNumber,
  }, launch, {
    upsert: true,
  });
}

async function getLatestFlightNumber() {
  const latestLaunch = await launchesDatabase
    .findOne()
    .sort('-flightNumber'); //order by desct with minus

  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }

  return latestLaunch.flightNumber;
}


async function scheduleNewLaunch(launch) {
  const planet = await planets.findOne({
    keplerName: launch.target,
  });

  if (!planet) {
    throw new Error('No matching planet found');
  }

  const newFlightNumber = await getLatestFlightNumber() + 1;

  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ['ZTM', 'NASA'],
    flightNumber: newFlightNumber,
  });

  await saveLaunch(newLaunch);
}

async function getAllLaunches() {
  return await launchesDatabase.find({},
    { '_id': 0, '__v': 0 } // exclude id and version data from query result
  )
}

function addNewLaunch(launch) {
  latestFlightNumber++;
  launches.set(
    latestFlightNumber,
    Object.assign(launch,
      {
        success: true,
        upcoming: true,
        customers: ['VTM', 'NASA'],
        flightNumber: latestFlightNumber
      }
    ));
}

async function existsLaunchWithId(launchId) {
  return await findLaunch({
    flightNumber: launchId,
  });
}
async function abortLaunchById(launchId) {
  const aborted = await launchesDatabase.updateOne({
    flightNumber: launchId,
  }, {
    upcoming: false,
    success: false,
  });

  return aborted.modifiedCount === 1;
}

module.exports = {
  getAllLaunches,
  addNewLaunch,
  scheduleNewLaunch,
  abortLaunchById,
  loadLaunchData,
};
