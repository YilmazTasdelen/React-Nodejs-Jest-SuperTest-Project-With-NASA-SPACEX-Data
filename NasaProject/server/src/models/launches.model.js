const launches = new Map();

let latestFlightNumber = 100;


const launch = {
  flightNumber: 100,
  mission: 'Kepler Exploration X',
  rocket: 'Explorer IS1',
  launchDate: new Date('December 27, 2030'),
  target: 'Kepler-442 b',
  customer: ['ZTM', 'NASA'],
  upcoming: true,
  success: true,
};

launches.set(latestFlightNumber, launch);

function getAllLaunches() {
  return Array.from(launches.values());
}

function addNewLaunch(launch) {
  latestFlightNumber++;
  launches.set(
    latestFlightNumber,
    Object.assign(launch,
      {
        success: true,
        upcoming: true,
        customer: ['VTM', 'NASA'],
        flightNumber: latestFlightNumber
      }
    ));
}

function existLaunchWithId(launchId) {
  //console.log(launchId, launches.has(parseInt(launchId)));
  return launches.has(launchId);
}

function abortLaunchById(launchId) {
  const aborted = launches.get(launchId);
  aborted.upcoming = false;
  aborted.success = false;
  return aborted;
}

module.exports = {
  getAllLaunches,
  addNewLaunch,
  existLaunchWithId,
  abortLaunchById,
};
