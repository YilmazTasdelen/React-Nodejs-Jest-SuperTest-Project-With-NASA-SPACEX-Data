
const request = require('supertest'); // the library that makes api calls fortest 
const app = require('../../app');
const {
    mongoConnect, mongoDisconnect } = require('../../services/mongo');

describe('Launches API', () => {
    //offical mongo docs doesnt recomend test jest with node-mongo apps 
    // but its still possible
    // just make sure connect mongo before run all the tests    
    beforeAll(async () => {
        await mongoConnect();
    });

    afterAll(async () => {
        await mongoDisconnect();
    });



    describe('Test GET /launches', () => {
        test('It should be respond with 200 success', async () => {
            const response = await request(app)
                .get('/v1/launches')
                .expect(200)
                .expect('Content-Type', /json/);

            //expect(response.statusCode).toBe(200);

        });
    });


    describe('Test POST /launch', () => {
        const completeLaunchData = {
            mission: 'UAA Wnterprise',
            rocket: 'NCC 1701-D',
            target: 'Kepler-1410 b',
            launchDate: 'January 4, 2028'
        };

        const launchDataWithoutDate = {
            mission: 'UAA Wnterprise',
            rocket: 'NCC 1701-D',
            target: 'Kepler-1410 b',
        };

        const launchDataWithInvalidDate = {
            mission: 'USS Enterprise',
            rocket: 'NCC 1701-D',
            target: 'Kepler-1410 b',
            launchDate: 'zoot',
        };

        test('It should respond with 201 created', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(completeLaunchData)
                .expect('Content-Type', /json/)
                .expect(201);

            const requestDate = new Date(completeLaunchData.launchDate).valueOf();
            const responseDate = new Date(response.body.launchDate).valueOf();
            expect(responseDate).toBe(requestDate);

            expect(response.body).toMatchObject(launchDataWithoutDate);
        });
        test('It should catch missing required properties', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(launchDataWithoutDate)
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body).toStrictEqual({ //checks objects typically same like property names and property types
                err: 'Missing required launch property',
            });
        });
        test('It should catch invalid dates', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(launchDataWithInvalidDate)
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body).toStrictEqual({
                err: 'Invalid launch date',
            });
        });
    });
});




