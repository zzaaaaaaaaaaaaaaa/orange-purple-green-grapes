'use strict';

const Express = require(`express`);
const Router = Express.Router();

const RManager = require(`../modules/roomManager`);

Router.get(`/`, (req, res, next) => {
    try {
        const rooms = RManager.simulate();
        const render = {
            title: `Segunda etapa`,
            rooms: rooms
        };
        res.render(`secondStageList`, render);
    }
    catch(err) {
        next(err);
    }
});

module.exports = Router;