const { parse } = require('csv-parse');
const fs = require('fs');

const habitablePlanets = [];

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
      .on('data', (data) => {
        if (isHabitablePlanet(data)) {
          habitablePlanets.push(data);
        }
      })
      .on('error', (err) => {
        console.log(err);
        reject(err);
      })
      .on('end', () => {
        // console.log(
        //   habitablePlanets.map((planet) => {
        //     return planet['kepler_name'];
        //   })
        // );
        console.log(`${habitablePlanets.length} habitable planets found!`);
        resolve();
      });
  });
}


function getAllPlanets() {
  return habitablePlanets;
}
module.exports = {
  planets: habitablePlanets,
  getAllPlanets,
  loadPlanetsData,
};
