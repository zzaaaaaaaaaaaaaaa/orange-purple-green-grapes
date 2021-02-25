'use strict';

const Express = require(`express`);
const Router = Express.Router();

const UManager = require(`../modules/userManager`);
const RManager = require(`../modules/roomManager`);
const CManager = require(`../modules/cafeManager`);

Router.get(`/`, (req, res, next) => {
	try {
		const users = UManager.getList();
		const rooms = RManager.getList();
		const cafes = CManager.getList();

		res.render(`index`, {
			title: `Início`,
			users: users,
			rooms: rooms,
			cafes: cafes
		});
	}
	catch (err) {
		next(err);
	}
});

module.exports = Router;