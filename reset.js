'use strict';

const Path = require(`path`);
global.__basedir = Path.resolve(__dirname, `./`);

const UManager = require(`./modules/userManager`);
UManager.checkRequirements();
UManager.wipe();

const RManager = require(`./modules/roomManager`);
RManager.checkRequirements();
RManager.wipe();

const CManager = require(`./modules/cafeManager`);
CManager.checkRequirements();
CManager.wipe();

const { userName, userSName, roomName, cafeName } = require(`./tests/helper/nameGen`);

const roomNumber = Math.ceil(Math.random() * (6 - 4) + 4);
const roomAvgCapacity = 4;
const userNumber = Math.ceil(Math.random() * ((roomAvgCapacity * 6) - (roomAvgCapacity * 1.2)) + (roomAvgCapacity * 1.2));
const cafeNumber = Math.ceil(Math.random() * (roomNumber - roomNumber / 2) + roomNumber / 2);

// Cria salas
for (let i = 0; i < roomNumber; i++) {
    RManager.add(roomName(), Math.ceil(Math.random() * ((roomAvgCapacity * 1.5) - (roomAvgCapacity * 0.9)) + (roomAvgCapacity * 0.9)));
}

// Cria espaços de cafe
for (let i = 0; i < cafeNumber; i++) {
    CManager.add(cafeName());
}

// Cria membros
for (let i = 0; i < userNumber; i++) {
    const room = RManager.getAvailable();
    const cafe = CManager.getAvailable();
    UManager.add(userName(), userSName(), room.RId, cafe.CId);
}