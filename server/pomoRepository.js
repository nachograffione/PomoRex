exports.pomoRepository = pomoRepository;

class pomoRepository {
    constructor() {
        // Connect to db
        const pgp = require('pg-promise')();
        const db = pgp('postgres://postgres:nacho@localhost:5433/pomoRex');
    }
}
