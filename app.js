'use strict';

require(`dotenv`).config();
global.__basedir = __dirname;

const BodyParser = require(`body-parser`);
const Express = require(`express`);
const Path = require(`path`);
const DB = require(`./modules/dbConn`);
const UManager = require(`./modules/userManager`);
const RManager = require(`./modules/roomManager`);
const CManager = require(`./modules/cafeManager`);

const Index = require(`./routes/index`);
const User = require(`./routes/user`);
const UserAdd = require(`./routes/userAdd`);
const UserList = require(`./routes/userList`);

const Room = require(`./routes/room`);
const RoomAdd = require(`./routes/roomAdd`);
const RoomList = require(`./routes/roomList`);

const Cafe = require(`./routes/cafe`);
const CafeAdd = require(`./routes/cafeAdd`);
const CafeList = require(`./routes/cafeList`);

const SecondStageList = require(`./routes/secondStageList`);
const Search = require(`./routes/search`);

const App = Express();

let Server = null;

App.set(`ip`, process.env.IP || `localhost`);
App.set(`port`, process.env.PORT || 8080);
App.set(`views`, Path.join(__basedir, `views`));
App.set(`view engine`, `pug`);
App.use(BodyParser.json());
App.use(BodyParser.urlencoded({
    extended: false
}));

// Arquivos estaticos
App.use(Express.static(Path.join(__basedir, `public`)));

// Páginas
App.use(`/`, Index);
App.use(`/listaDeMembros`, UserList);
App.use(`/registrarMembro`, UserAdd);
App.use(`/membro`, User);

App.use(`/listaDeSalas`, RoomList);
App.use(`/registrarSala`, RoomAdd);
App.use(`/sala`, Room);

App.use(`/registrarCafe`, CafeAdd);
App.use(`/listaDeCafes`, CafeList);
App.use(`/cafe`, Cafe);

App.use(`/pesquisa`, Search);
App.use(`/listaSegundaEtapa`, SecondStageList);


// Erro 404
App.use((req, res, next) => {
    const err = new Error(`Não encontrado`);
    err.status = 404;
    next(err);
});

// Erro 500
App.use((err, req, res, next) => {
    res.status(err.status || 500);
    const render = {
        title: `Erro${err.status ? ` ${err.status}` : ``}`,
        message: err.message
    };
    if (err.status !== 404) {
        console.error(`${req.headers[`x-forwarded-for`] || req.connection.remoteAddress} » ${err.code || err.status ? `!${err.code || err.status}\n${err.message}` : `${err.message}`} » ${req.originalUrl}`);
        console.error(err.stack);
    }
    res.render(`error`, render);
});


// Prepara o banco de dados
UManager.checkRequirements();
RManager.checkRequirements();
CManager.checkRequirements();

// Se hosteado no glitch, reseta tudo quando liga
if (Boolean(process.env.GLITCH)) {
    /*
    UManager.wipe();
    RManager.wipe();
    CManager.wipe();
    */
}


// Escuta na porta e ip
Server = App.listen(App.get(`port`), App.get(`ip`), () => {
    console.log(`Endereço: http://${Server.address().address}:${Server.address().port}/\r\nAcesse com seu navegador.`);
});

module.exports = Server;

process.on(`SIGINT`, () => {
    try {
        DB.close();
    }
    catch (err) {}
    process.exit(0);
});
process.on(`uncaughtException`, (err) => {
    console.error(err);
    try {
        DB.close();
    }
    catch (err) {}
    process.exit(-1);
});