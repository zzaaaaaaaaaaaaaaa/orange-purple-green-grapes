'use strict';

const FS = require(`fs`);
const Path = require(`path`);

const DBDir = Path.resolve(__basedir, `./.data/`);
if (!FS.existsSync(DBDir)) {
    FS.mkdirSync(DBDir);
}

const DB = require(`better-sqlite3`)(Path.join(DBDir, `database.db`));
DB.pragma(`journal_mode = WAL`);

module.exports = DB;