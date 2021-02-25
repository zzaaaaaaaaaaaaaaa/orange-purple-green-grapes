'use strict';

const Express = require(`express`);
const Router = Express.Router();

const UManager = require(`../modules/userManager`);
const RManager = require(`../modules/roomManager`);
const cManager = require(`../modules/cafeManager`);

Router.get(`/`, (req, res, next) => {
    try {
        const users = UManager.getList().map((user) => {
            return {
                ...user || {},
                room: RManager.getById(user.RId),
                cafe: cManager.getById(user.CId)
            };
        });

        const render = {
            title: `Lista de membros`,
            users: users
        };
        res.render(`userList`, render);
    }
    catch(err) {
        next(err);
    }
});

module.exports = Router;