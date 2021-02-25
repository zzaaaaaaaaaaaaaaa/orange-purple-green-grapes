'use strict';

const Express = require(`express`);
const Router = Express.Router();

const CManager = require(`../modules/cafeManager`);

Router.get(`/`, (req, res, next) => {
    try {
        const cafes = CManager.getList().map((cafe) => {
            return {
                ...cafe || {},
                users: CManager.getUsers(cafe.CId)
            };
        });

        const render = {
            title: `Lista de salas`,
            cafes: cafes
        };
        res.render(`cafeList`, render);
    }
    catch(err) {
        next(err);
    }
});

module.exports = Router;