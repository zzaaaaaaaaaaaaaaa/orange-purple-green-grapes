'use strict';

const Express = require(`express`);
const Router = Express.Router();

const UManager = require(`../modules/userManager`);
const RManager = require(`../modules/roomManager`);
const CManager = require(`../modules/cafeManager`);

Router.get(`/`, (req, res, next) => {
    try {
        const render = {
            title: `Pesquisa`,
        };
        res.render(`searchShow`, render);
    }
    catch (err) {
        next(err);
    }
});

Router.post(`/`, (req, res, next) => {
    try {
        const { term, type } = req.body;

        let results;

        switch (type) {
            case `user`:
                results = UManager.search(term);
                break;
            case `room`:
                results = RManager.search(term);
                break;
            case `cafe`:
                results = CManager.search(term);
                break;
            default:
                throw new Error(`Tipo de pesquisa inválido`);
        }

        const render = {
            title: `Pesquisa`,
            results: results,
            type: type
        };
        res.render(`searchOk`, render);
    }
    catch (err) {
        next(err);
    }
});

module.exports = Router;