
const expect = require(`chai`).expect;
const should = require(`chai`).should();

const assert = require(`assert`);

const Request = require(`request`);
const Server = require(`./app.js`);

const UManager = require(`./modules/userManager`);
const RManager = require(`./modules/roomManager`);
const CManager = require(`./modules/cafeManager`);
const { userName, userSName, roomName, cafeName } = require(`./tests/helper/nameGen`);

const Tests = {
  cafeName: cafeName(),
  roomName: roomName(),
  userName: userName(),
  userSName: userSName()
};

describe(`Café`, function () {
    it(`registro de novo espaço de café`, () => {
      Request.post({
        url: `http://${Server.address().address}:${Server.address().port}/registrarCafe`,
        form: { name: Tests.cafeName }
      }, (err, res, body) => {
        should.not.exist(err);
        res.statusCode.should.equal(200);
        res.statusCode.should.not.equal(500);
      });
    });
    it(`busca de espaço de café`, () => {
      const cafe = CManager.search(Tests.cafeName, true);
      cafe.should.be.an(`array`).with.lengthOf.at.least(1);
    });
});

describe(`Sala`, function () {
    it(`registro de nova sala`, () => {
      Request.post({
        url: `http://${Server.address().address}:${Server.address().port}/registrarSala`,
        form: { name: Tests.roomName, capacity: 10 }
      }, (err, res, body) => {
        should.not.exist(err);
        res.statusCode.should.equal(200);
        res.statusCode.should.not.equal(500);
      });
    });
    it(`busca de sala`, () => {
      const room = RManager.search(Tests.roomName, true);
      room.should.be.an(`array`).with.lengthOf.at.least(1);
    });
});

describe(`Membro`, function () {
    it(`registro de novo membro`, () => {
      Request.post({
        url: `http://${Server.address().address}:${Server.address().port}/registrarMembro`,
        form: { name: Tests.userName, surname: Tests.userSName }
      }, (err, res, body) => {
        should.not.exist(err);
        res.statusCode.should.equal(200);
        res.statusCode.should.not.equal(500);
      });
    });
    it(`busca de membro`, () => {
      const user = UManager.search(`${Tests.userName} ${Tests.userSName}`, true);
      user.should.be.an(`array`).with.lengthOf.at.least(1);
    });
});