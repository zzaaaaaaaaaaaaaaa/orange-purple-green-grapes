'use strict';

const Express = require(`express`);
const Router = Express.Router();

const RManager = require(`../modules/roomManager`);

Router.get(`/`, (req, res, next) => {
    try {
        const rooms = RManager.getList().map((room) => {
            return {
                ...room || {},
                users: RManager.getUsers(room.RId)
            };
        });

        const render = {
            title: `Lista de salas`,
            rooms: rooms
        };
        res.render(`roomList`, render);
    }
    catch(err) {
        next(err);
    }
});

module.exports = Router;