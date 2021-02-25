'use strict';

const DB = require(`./dbConn`);

class UserManager {
    constructor () {

    }


    /**
     * Deleta todos os membros registrados na base de dados
     * @memberof UserManager
     */
    wipe () {
        try {
            const qrySelect = DB.prepare(`DELETE FROM Users`);
            const deletion = qrySelect.run();
        }
        catch (err) {}
    }

    /**
     * Checa se a tabela de membros existe e a cria caso não
     * @memberof UserManager
     */
    checkRequirements () {
        const qrySelect = DB.prepare(`SELECT * FROM sqlite_master WHERE type='table' AND name='Users'`);
        const selection = qrySelect.get();
        if (!selection) {
            DB.exec(`
                CREATE TABLE IF NOT EXISTS "Users" (
                    "UId"  INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                    "UName"  TEXT NOT NULL,
                    "USName"  TEXT NOT NULL,
                    "RId"  INTEGER DEFAULT NULL,
                    "CId"  INTEGER DEFAULT NULL
                );
            `);
            console.info(`Tabela de membros criada`);
        }
    }


    /**
     * Retorna todos os membros registrados na base de dados
     * @return {Array<Object>} Lista de membros
     * @memberof UserManager
     */
    getList () {
        const qry = DB.prepare(`SELECT * FROM Users`);
        const selection = qry.all();
        return selection;
    }

    /**
     * Retorna um membro registrado na base de dados
     * @param {Number} id
     * @return {Object} Membro
     * @memberof UserManager
     */
    getById (id) {
        if (isNaN(id)) {
            const error = new Error(`Membro inválido`);
            throw error;
        }

        const qrySelect = DB.prepare(`SELECT * FROM Users WHERE UId = ?`);
        const selection = qrySelect.get(id);
        return selection;
    }


    /**
     * Registra um membro novo na base de dados e retorna o mesmo após sua criação
     * @param {Number|String} name
     * @param {number|String} surname
     * @param {Number} roomId
     * @param {Number} cafeId
     * @return {Object} Membro
     * @memberof UserManager
     */
    add (name, surname, roomId, cafeId) {
        if (isNaN(roomId)) {
            const error = new Error(`Sala inválida`);
            throw error;
        }

        // Cria o membro
        const qryInsert = DB.prepare(`INSERT INTO Users (UName, USName, RId, CId) VALUES (?, ?, ?, ?)`);
        const insertion = qryInsert.run(name, surname, roomId, cafeId);

        const qrySelect = DB.prepare(`SELECT * FROM Users WHERE UId = ?`);
        const selection = qrySelect.get(insertion.lastInsertRowid);

        return selection;
    }

    /**
     * Procura por um membro na base de dados
     * Ids e nomes são suportados
     * @param {Number|String} term
     * @param {Boolean} exact
     * @return {Array<Object>} Lista de membros
     * @memberof UserManager
     */
    search (term, exact) {
        if (!isNaN(term)) exact = true;
        
        const qrySelect = DB.prepare(`
        SELECT Users.*
        FROM Users

        WHERE
        LOWER(Users.UName || ' ' || Users.USName)
        LIKE $term
        
        OR

        Users.UId
        LIKE $term`).bind({ term: exact ? `${term}`.toLowerCase() : `%${term}%`.toLowerCase() });
        
        const selection = qrySelect.all();
        return selection;
    }
}

module.exports = new UserManager();