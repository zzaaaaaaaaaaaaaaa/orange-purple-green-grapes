'use strict';

const DB = require(`./dbConn`);

class CafeManager {
    constructor () {

    }


    /**
     * Deleta todos os espaços de café registrados na base de dados
     * @memberof CafeManager
     */
    wipe () {
        try {
            const qryDelete = DB.prepare(`DELETE FROM Cafes`);
            const deletion = qryDelete.run();
        }
        catch (err) {}
    }

    /**
     * Checa se a tabela de espaços de café existe e a cria caso não
     * @memberof CafeManager
     */
    checkRequirements () {
        const qrySelect = DB.prepare(`SELECT * FROM sqlite_master WHERE type='table' AND name='Cafes'`);
        const selection = qrySelect.get();
        if (!selection) {
            DB.exec(`
                CREATE TABLE IF NOT EXISTS "Cafes" (
                    "CId"  INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                    "CName"  TEXT NOT NULL
                );
            `);
            console.info(`Tabela de espaços de café criada`);
        }
    }

    /**
     * Retorna todos os espaços de café registrados na base de dados
     * @return {Array<Object>} Lista de espaços de café
     * @memberof CafeManager
     */
    getList () {
        const qrySelect = DB.prepare(`
        SELECT Cafes.*, COUNT(Users.CId) AS CCount
        FROM Cafes

        LEFT JOIN Users
        ON Cafes.CId = Users.CId

        GROUP BY Cafes.CId
        `);

        const cafes = qrySelect.all();
        return cafes;
    }

    /**
     * Retorna um espaço de café registrado na base de dados
     * @param {Number} id
     * @return {Object} 
     * @memberof CafeManager
     */
    getById (id) {
        if (isNaN(id)) {
            throw new Error(`ID de espaço de café inválido`);
        }
        const qrySelect = DB.prepare(`
        SELECT Cafes.*, COUNT(Users.CId) AS CCount
        FROM Cafes

        LEFT JOIN Users
        ON Cafes.CId = Users.CId

        WHERE Cafes.CId = ?
        GROUP BY Cafes.CId
        LIMIT 1
        `);

        const room = qrySelect.get(id);
        return room;
    }

    
    /**
     * Retorna uma sala disponível e não lotada, ou nada
     * A sala menos cheia é sempre prioritizada
     * @return {Object} Espaço de café
     * @memberof CafeManager
     */
    getAvailable () {
        const qrySelect = DB.prepare(`
        SELECT Cafes.*, COUNT(Users.CId) AS CCount
        FROM Cafes
        
        LEFT JOIN Users
        ON Cafes.CId = Users.CId
        
        GROUP BY Cafes.CId
        ORDER BY CCount ASC, Cafes.CId DESC
        LIMIT 1
        `);

        const selection = qrySelect.get();

        // Não temos mais vagas!
        if (!selection) {
            const error = new Error(`Nenhum espaço de café encontrado`);
            throw error;
        }

        return selection;
    }

    /**
     * Retorna todos os membros que utilizam esse espaço de café
     * @param {Number} id
     * @return {Array<Object>} Lista de espaços de café
     * @memberof CafeManager
     */
    getUsers (id) {
        const qrySelect = DB.prepare(`
        SELECT Users.*
        FROM Users

        WHERE Users.CId = ?
        `);

        const selection = qrySelect.all(id);

        return selection;
    }

    /**
     * Registra um espaço de café novo na base de dados e retorna o mesmo após sua criação
     * @param {Number|String} name
     * @return {Object} Espaço de café
     * @memberof CafeManager
     */
    add (name) {
        const qryInsert = DB.prepare(`INSERT INTO Cafes (CName) VALUES (?)`);
        const insertion = qryInsert.run(name);

        const qrySelect = DB.prepare(`SELECT * FROM Cafes WHERE CId = ?`);
        const selection = qrySelect.get(insertion.lastInsertRowid);

        return selection;
    }

    /**
     * Procura por um espaço de café na base de dados
     * Ids e nomes são suportados
     * @param {Number|String} term
     * @param {Boolean} exact
     * @return {Array<Object>} Lista de espaços de café
     * @memberof CafeManager
     */
    search (term, exact) {
        if (isNaN(term)) exact = true;
        
        const qrySelect = DB.prepare(`
        SELECT Cafes.*, COUNT(Users.CId) AS CCount
        FROM Cafes

        LEFT JOIN Users
        ON Cafes.CId = Users.CId

        WHERE
        LOWER(Cafes.CName)
        LIKE $term

        OR

        Cafes.CId
        LIKE $term
        GROUP BY Cafes.CId`).bind({ term: exact ? `${term}`.toLowerCase() : `%${term}%`.toLowerCase() });
        
        const selection = qrySelect.all();
        return selection;
    }
}

module.exports = new CafeManager();