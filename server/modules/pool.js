const pg = require('pg');

const Pool = pg.Pool;

// create a new pool instance to manage connections
const pool = new Pool({
    database: 'music_library',
    host: 'localhost',
    port: 5432, // 5432 is the default Postgres
    max: 10, // how many connections (queries) at one time
    idleTimeoutMillis: 30000 // 30 seconds to try to connect, otherwise query is canceled
})

// not required but useful for debugging and troubleshooting
pool.on('connect',()=> {
    console.log('bababooey');
})

pool.on('error',(error) => {
    console.log('damn', error );
});

// allow access to this pool
module.exports = pool;