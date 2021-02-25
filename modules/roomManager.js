'use strict';

const DB = require(`./dbConn`);

class RoomManager {
    constructor () {

    }


    /**
     * Deleta todos as salas registradas na base de dados
     * @memberof RoomManager
     */
    wipe () {
        try {
            const qryDelete = DB.prepare(`DELETE FROM Rooms`);
            const deletion = qryDelete.run();
        }
        catch (err) {}
    }

    /**
     * Checa se a tabela de salas existe e a cria
     * @memberof RoomManager
     */
    checkRequirements () {
        const qrySelect = DB.prepare(`SELECT * FROM sqlite_master WHERE type='table' AND name='Rooms'`);
        const selection = qrySelect.get();
        if (!selection) {
            DB.exec(`
                CREATE TABLE IF NOT EXISTS "Rooms" (
                    "RId"  INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                    "RName"  TEXT NOT NULL,
                    "RMax"  INTEGER NOT NULL DEFAULT 10
                );
                /*
                CREATE TABLE IF NOT EXISTS "RoomUsers" (
                    "UId"  INTEGER NOT NULL,
                    "RId"  INTEGER NOT NULL,
                    PRIMARY KEY ("UId", "RId")
                );
                */
            `);
            console.info(`Tabela de salas criada`);
        }
    }

    /**
     * Retorna todas as salas registradas na base de dados
     * @return {Array<Object>} Lista de salas
     * @memberof RoomManager
     */
    getList () {
        const qrySelect = DB.prepare(`
        SELECT Rooms.*, COUNT(Users.RId) AS RCount
        FROM Rooms

        LEFT JOIN Users
        ON Rooms.RId = Users.RId

        GROUP BY Rooms.RId
        `);
        
        const rooms = qrySelect.all();
        return rooms;
    }

    /**
     * Retorna uma sala registrada na base de dados
     * @param {Number} id
     * @return {Object} 
     * @memberof RoomManager
     */
    getById (id) {
        if (isNaN(id)) {
            throw new Error(`ID de sala inválido`);
        }
        const qrySelect = DB.prepare(`
        SELECT Rooms.*, COUNT(Users.RId) AS RCount
        FROM Rooms

        LEFT JOIN Users
        ON Rooms.RId = Users.RId

        WHERE Rooms.RId = ?
        GROUP BY Rooms.RId
        LIMIT 1
        `);

        const room = qrySelect.get(id);
        return room;
    }
    
    /**
     * Retorna uma sala disponível e não lotada, ou nada
     * A sala menos cheia é sempre prioritizada
     * @return {Object} Sala
     * @memberof RoomManager
     */
    getAvailable () {
        const qrySelect = DB.prepare(`
        SELECT Rooms.*, COUNT(Users.RId) AS RCount
        FROM Rooms
        
        LEFT JOIN Users
        ON Rooms.RId = Users.RId
        
        GROUP BY Rooms.RId
        HAVING COUNT(Users.RId) < Rooms.RMax
        ORDER BY RCount ASC, Rooms.RId DESC
        LIMIT 1
        `);
        const selection = qrySelect.get();

        // Não temos mais vagas!
        if (!selection) {
            const error = new Error(`As salas estão lotadas, aguarde novas salas se abrirem`);
            throw error;
        }

        return selection;
    }

    /**
     * Retorna todas os membros que utilizam essa sala
     * @param {Number} id
     * @return {Array<Object>} Lista de salas
     * @memberof RoomManager
     */
    getUsers (id) {
        const qrySelect = DB.prepare(`
        SELECT Users.*
        FROM Users

        WHERE Users.RId = ?
        `);

        const selection = qrySelect.all(id);

        return selection;
    }

    /**
     * Registra uma sala nova na base de dados e retorna a mesma após sua criação
     * @param {Number|String} name
     * @param {Number} capacity
     * @return {Object} Sala
     * @memberof RoomManager
     */
    add (name, capacity) {
        if (isNaN(capacity) || capacity.length < 1) capacity = 10;

        // Cria a sala
        const qryInsert = DB.prepare(`INSERT INTO Rooms (RName, RMax) VALUES (?, ?)`);
        const insertion = qryInsert.run(name, capacity);

        const qrySelect = DB.prepare(`SELECT * FROM Rooms WHERE RId = ?`);
        const selection = qrySelect.get(insertion.lastInsertRowid);

        return selection;
    }

    /**
     * Retorna as salas da segunda etapa
     * Metade de cada sala é mesclada pela metade com a sala vizinha
     * 
     * EXPERIMENTAL
     * @return {Array<Object>} Lista de salas
     * @memberof RoomManager
     */
    simulate () {
        const rooms = this.getList().filter(room => room.RCount > 0).map((room) => {
            return {
                ...room,
                RUsers: this.getUsers(room.RId)
            };
        });

        for (let i = 0; i < rooms.length; i++) {
            const room = rooms[i];

            const evenRow = i % 2 === 0;
            let next = evenRow ? i + 1 : i - 1;

            // Última sala
            if (!rooms[next]) {
                /*
                // Podemos encaixar os poucos membros na sala anterior
                const difference = rooms[i - 1].RUsers.length - room.RUsers.length;
                if (difference > 1) {
                    rooms[i - 1].RUsers = rooms[i - 1].RUsers.concat(room.RUsers.map((user) => {
                        return {
                            ...user,
                            UFixed: true
                        };
                    }));
                    delete rooms[i];
                }
                */
                
                continue;
            }

            room.sibling = rooms[next];

            let usersCopy = [...room.RUsers];
            let usersToNext = usersCopy
                .splice(
                    evenRow
                        ? (-Math.abs(Math.ceil(usersCopy.length / 2)))
                        : (Math.ceil(usersCopy.length))
                );

            let usersNextCopy = [...rooms[next].RUsers];
            let usersNextToPrev = usersNextCopy
                .splice(
                    evenRow
                        ? (-Math.abs(Math.ceil(usersNextCopy.length / 2)))
                        : (Math.ceil(usersNextCopy.length))
                );
            
            // Salas com um membro
            if (rooms[next].RCount < 2 || room.RCount < 2) {
                rooms[next].RUsers =
                    usersNextToPrev
                    .concat(
                        usersToNext
                        .map((user) => {
                            return {
                                ...user,
                                UMixed: true
                            };
                        }));
                rooms[next].sibling = room;
                delete rooms[i];
                continue;
            }
            
            room.RUsers = usersCopy.concat(usersNextToPrev.map((user) => {
                return {
                    ...user,
                    UMixed: true
                };
            }));
            rooms[next].RUsers = usersNextCopy.concat(usersToNext.map((user) => {
                return {
                    ...user,
                    UMixed: true
                };
            }));
        }

        return rooms;
    }

    /**
     * Procura por uma sala na base de dados
     * Ids e nomes são suportados
     * @param {Number|String} term
     * @param {Boolean} exact
     * @return {Array<Object>} Lista de salas 
     * @memberof RoomManager
     */
    search (term, exact) {
        if (isNaN(term)) exact = true;
        
        const qrySelect = DB.prepare(`
        SELECT Rooms.*, COUNT(Users.RId) AS RCount
        FROM Rooms

        LEFT JOIN Users
        ON Rooms.RId = Users.RId

        WHERE
        LOWER(Rooms.RName)
        LIKE $term

        OR

        Rooms.RId
        LIKE $term
        GROUP BY Rooms.RId`).bind({ term: exact ? `${term}`.toLowerCase() : `%${term}%`.toLowerCase() });

        const selection = qrySelect.all();
        return selection;
    }
}

module.exports = new RoomManager();