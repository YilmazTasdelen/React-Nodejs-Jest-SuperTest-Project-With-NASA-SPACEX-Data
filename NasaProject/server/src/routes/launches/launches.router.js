const express = require('express');

const {
    httpgetAllLaunches,
    httpAddNewLaunch,
    httpAbroadLaunch,
} = require('./launches.controller');

const launchesRouter = express.Router();

launchesRouter.get('/', httpgetAllLaunches);
launchesRouter.post('/', httpAddNewLaunch);
launchesRouter.delete('/:id', httpAbroadLaunch);

module.exports = launchesRouter;
