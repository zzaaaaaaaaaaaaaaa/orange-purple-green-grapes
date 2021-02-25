'use strict';

const Express = require(`express`);
const Router = Express.Router();

const CManager = require(`../modules/cafeManager`);

Router.get(`/`, (req, res, next) => {
    try {
        const render = {
            title: `Adicionar novo espaço de café`,
        };
        res.render(`cafeAdd`, render);
    }
    catch (err) {
        next(err);
    }
});

Router.post(`/`, (req, res, next) => {
    try {
        const { name } = req.body;

        const cafe = CManager.add(name);

        const render = {
            title: `Espaço de café adicionado!`,
            cafe: cafe
        };
        res.render(`cafeAddOk`, render);
    }
    catch (err) {
        next(err);
    }
});

module.exports = Router;