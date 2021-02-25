'use strict';

const Express = require(`express`);
const Router = Express.Router();

const UManager = require(`../modules/userManager`);
const RManager = require(`../modules/roomManager`);
const CManager = require(`../modules/cafeManager`);

Router.get(`/`, (req, res, next) => {
    try {
        const render = {
            title: `Adicionar novo membro`,
            // rooms: [{ name: 'Test room', id: 1 }, { name: 'Sex room', id: 2 }]
        };
        res.render(`userAdd`, render);
    }
    catch (err) {
        next(err);
    }
});

Router.post(`/`, (req, res, next) => {
    try {
        const { name, surname } = req.body;

        const room = RManager.getAvailable();
        const cafe = CManager.getAvailable();
        const user = UManager.add(name, surname, room.RId, cafe.CId);

        const render = {
            title: `Membro adicionado!`,
            user: user,
            room: room,
            cafe: cafe
        };
        res.render(`userAddOk`, render);
    }
    catch (err) {
        next(err);
    }
});

module.exports = Router;