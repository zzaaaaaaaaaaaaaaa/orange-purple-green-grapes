'use strict';

const Express = require(`express`);
const Router = Express.Router();

const UManager = require(`../modules/userManager`);
const RManager = require(`../modules/roomManager`);
const CManager = require(`../modules/cafeManager`);

Router.get(`/:id`, (req, res, next) => {
    try {
        const { id } = req.params;

        const user = UManager.getById(id);
        if (!user){
            const error = new Error(`Membro não encontrado`);
            error.status = 404;
            return next(error);
        }

        user.URoom = RManager.getById(user.RId);
        user.UCafe = CManager.getById(user.CId);

        const render = {
            title: `${user.UId} - ${user.UName} ${user.USName}`,
            user: user
        };
        res.render(`userShow`, render);
    }
    catch (err) {
        next(err);
    }
});

module.exports = Router;