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
  target: 'Kepler-442 b', //not applicable there is no target planet at spaceX data
  customers: ['ZTM', 'NASA'], // payload.customers for each payload
  upcoming: true, //upcoming
  success: true, //success
};

//launches.set(latestFlightNumber, launch);

saveLaunch(launch);

async function loadLaunchData() {
  console.log('Downloading launch data...');
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: 'rocket',
          select: {
            name: 1
          }
        },
        {
          path: 'payloads',
          select: {
            'customers': 1
          }
        }
      ]
    }
  });

  const launchDocs = response.data.docs;
  for (const launchDoc of launchDocs) {
    const payloads = launchDoc['payloads'];
    const customers = payloads.flatMap((payload) => {
      return payload['customers'];
    });

    const launch = {
      flightNumber: launchDoc['flight_number'],
      mission: launchDoc['name'],
      rocket: launchDoc['rocket']['name'],
      launchDate: launchDoc['date_local'],
      upcoming: launchDoc['upcoming'],
      success: launchDoc['success'],
      customers,
    };

    console.log(`${launch.flightNumber} ${launch.mission}`);
  }
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
