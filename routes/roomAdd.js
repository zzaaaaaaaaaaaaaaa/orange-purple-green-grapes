'use strict';

const Express = require(`express`);
const Router = Express.Router();

const RManager = require(`../modules/roomManager`);

Router.get(`/`, (req, res, next) => {
    try {
        const render = {
            title: `Adicionar nova sala`,
        };
        res.render(`roomAdd`, render);
    }
    catch (err) {
        next(err);
    }
});

Router.post(`/`, (req, res, next) => {
    try {
        const { name, capacity } = req.body;

        const room = RManager.add(name, capacity);

        const render = {
            title: `Sala adicionada!`,
            room: room
        };
        res.render(`roomAddOk`, render);
    }
    catch (err) {
        next(err);
    }
});

module.exports = Router;