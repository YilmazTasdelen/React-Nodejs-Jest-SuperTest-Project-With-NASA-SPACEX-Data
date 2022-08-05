const { parse } = require('csv-parse');
const fs = require('fs');


const planets = require('./planets.mongo');

// const habitablePlanets = [];

function isHabitablePlanet(planet) {
  return (
    planet['koi_disposition'] === 'CONFIRMED' &&
    planet['koi_insol'] > 0.36 &&
    planet['koi_insol'] < 1.11 &&
    planet['koi_prad'] < 1.6
  );
}

/**
 * const promise = new Promise ((resolve,reject)=>{
 * resolve(42); result will be 42 at promise.then statement
 * });
 *
 * promise.then((result)=>{
 *
 * });
 * alternativelly
 * const result = await promise;
 * console.log(result);
 */
function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream('./data/kepler_data.csv')
      .pipe(
        parse({
          comment: '#',
          columns: true,
        })
      )
      .on('data', async (data) => {
        if (isHabitablePlanet(data)) {
          //habitablePlanets.push(data);
          // await planets.updateOne({
          //   keplerName: data.kepler_name,
          // }, { // if record does not exist insert
          //   keplerName: data.kepler_name,
          // },
          //   {
          //     upsert: true,
          //   });

          await savePlanet(data);
        }
      })
      .on('error', (err) => {
        console.log(err);
        reject(err);
      })
      .on('end', async () => {
        const countPlanetsFound = (await getAllPlanets()).length;
        // console.log(
        //   habitablePlanets.map((planet) => {
        //     return planet['kepler_name'];
        //   })
        // );
        console.log(`${countPlanetsFound} habitable planets found!`);
        resolve();
      });
  });
}

async function savePlanet(planet) {
  try {
    await planets.updateOne({
      keplerName: planet.kepler_name,
    }, { // if record does not exist insert
      keplerName: planet.kepler_name,
    },
      {
        upsert: true,
      });
  } catch (err) {
    console.log(err);
  }

}

async function getAllPlanets() {
  return await planets.find({});
}
module.exports = {
  // planets: habitablePlanets,
  getAllPlanets,
  loadPlanetsData,
};
