'use strict';

const Express = require(`express`);
const Router = Express.Router();

const RManager = require(`../modules/roomManager`);

Router.get(`/:id`, (req, res, next) => {
    try {
        const { id } = req.params;

        const room = RManager.getById(id);
        if (!room){
            const error = new Error(`Sala não encontrada`);
            error.status = 404;
            return next(error);
        }

        room.RUsers = RManager.getUsers(room.RId);

        // const simulation = RManager.simulateSecondStage(room);

        const render = {
            title: `${room.RId} - ${room.RName}`,
            room: room,
            simulation: null
        };
        res.render(`roomShow`, render);
    }
    catch (err) {
        next(err);
    }
});

module.exports = Router;