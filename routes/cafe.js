'use strict';

const Express = require(`express`);
const Router = Express.Router();

const CManager = require(`../modules/cafeManager`);

Router.get(`/:id`, (req, res, next) => {
    try {
        const { id } = req.params;

        const cafe = CManager.getById(id);
        if (!cafe) {
            const error = new Error(`Espaço de café não encontrado`);
            error.status = 404;
            return next(error);
        }

        cafe.CUsers = CManager.getUsers(cafe.CId);

        const render = {
            title: `${cafe.CId} - ${cafe.CName}`,
            cafe: cafe
        };
        res.render(`cafeShow`, render);
    }
    catch (err) {
        next(err);
    }
});

module.exports = Router;